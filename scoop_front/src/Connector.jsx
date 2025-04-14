    import { Children, createContext, useActionState, useContext, useEffect, useReducer, useRef, useState } from "react";
    import { useNavigate, useSearchParams,useLocation } from "react-router-dom";
    import {jwtDecode} from "jwt-decode";
    import axios from "axios";

    export const Context = createContext(null);

    export function Connector({children}){
        const REST = process.env.REACT_APP_RESTURL;
        const nav = useNavigate();
        const [messageQueue, setMessageQueue] = useState({});
        const [serverQueue, setServerQueue] = useState({});
        const [roomQueue, setRoomQueue] = useState([]);
        const [accessToken, setAccessToken] = useState({});    
        const [wsConnected, setWsConnected] = useState(false);
        const [subChannel, setSubChannel] = useState({});
        const [onLineFriend, setOnLineFriend] = useState([]);
        const [userName,setUserName] = useState("");
        const socRef = useRef();
        
        useEffect(() => {
        },[] )
        const loc = useLocation();
        // /login이 아닐때 페이지 이동마다 로그인 검증
        useEffect(()=>{
            if(!(loc.pathname =="/login" || loc.pathname == "/register" || loc.pathname == "/find-password")){
                verifyLogin();
                console.log("navigating..." + Math.random() + loc.pathname);
            }
        },[loc])

        useEffect(()=>{

                console.log(onLineFriend);
            
        },[onLineFriend])
        useEffect(()=>{
            console.log(messageQueue);
        },[messageQueue])
        useEffect(()=>{
            console.log(roomQueue);
        },[roomQueue])
        useEffect( () => {
            console.log(subChannel);
        },[subChannel])
        useEffect(() => { 
            console.log(JSON.stringify(accessToken)+2);
            if(wsConnected !== true){
                ConnectWs();
            }
        }, [accessToken])

        //서버
        function getServerByUser(id){
            if(socRef.current){
                axios(`https://${REST}/api/getServers`, {
                    method : "post",
                    params : {
                        id: id,
                    },
                    withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청
                }).then((res) => { 
                        console.log(res);
                        setRoomQueue(res.data
                        );
                        return;
                }).catch((err) => { 
                        console.log(err);
                        return;
                });
            }
            return;
        }
        const ConnectWs = () => {
            console.log(accessToken + "토큰");
            console.log(JSON.stringify(accessToken));
            console.log(accessToken.name);
            if(wsConnected !== true && JSON.stringify(accessToken) !== "{}")
            {
                socRef.current = new WebSocket(`wss://${REST}/gateway`);

                socRef.current.onopen = () => {
                console.log(accessToken);
                console.log(socRef.current.readyState);
                setWsConnected(true);
                getServerByUser(1);
                socRef.current.send(JSON.stringify({
                    "type" : "ENTER_APP",
                    "writer" : accessToken.sub, // accessToken의 변수가 들어갈 자리
                    "text" : "Connected",
                    
                }));
            }
            function onMessage(msg){
                setMessageQueue((prev) => 
                    {
                        console.log(msg);
                        const data = JSON.parse(msg);
                        let channel = data.chatroomID;
                        let writer = data.userName;
                        let message = data.text;
                        console.log(msg.userName + 'zz' + writer + channel  + message);
                        if(prev[channel])
                        {
                            console.log("메세지 채널 큐 있음" + channel)
                            return { ...prev,
                                [channel] : [ ...prev[channel], data]
                            }   
                        }
                        else{
                            return { ...prev,
                                    [channel] : [data]
                            }
                        }
                        //return {[message.data["channel"]] : message.data};
                       
                    }
                );
            }

            function onFriend(msg){
                setOnLineFriend((prev) => 
                    {
                        const data = JSON.parse(msg);
                        console.log(data);
                        let id = data.id;
                        if(data.in === true)
                        {
                            return [...prev,data.id]
                        }
                        else{
                            return prev.filter(item => item !== data.id);
                        }
                        //return {[message.data["channel"]] : message.data};
                       
                    }
                );
            }
            socRef.current.onmessage = (msg) => {
                const message = msg
                try{
                    console.log(JSON.parse(msg.data).type);
                    switch(JSON.parse(msg.data).type){
                        case "MESSAGE":
                            onMessage(message.data);
                            break;  
                        case "FRIENDINOUT":
                            onFriend(message.data);
                            console.log('친구 이벤트');
                            break;
                    }
                }
                catch{
                    console.log(msg);
                }
            
        
                socRef.current.send(JSON.stringify({
                    "type" : "RECEIVED",
                    "writer" : accessToken.name,
                }))
            }   
            socRef.current.onclose = () => {
                console.log("discon");
                setWsConnected(false);
                socRef.current.send(JSON.stringify({
                    "type" : "EXIT_APP",
                    "writer" : accessToken.sub, // accessToken의 변수가 들어갈 자리
                    "text" : "Connected",
                    
                }));
                socRef.current = null;
                
            }
            }
        }

        //로그인 검증 함수
        const verifyLogin = () =>
        {
            const temptok = localStorage.getItem("logintoken");  
            if(temptok != undefined){
                    setAccessToken(jwtDecode(temptok));
            }
                const exp = Math.floor(Date.now() / 1000); // 현재시간
                let decoded;

                const getAcc = () => {
                    console.log("유효기간 끝남");
                    localStorage.removeItem("logintoken");
                        const doLogin = () => {
                            //axios로 로그인 요청, const trylogin = true일때 실행 X, response not ok면 다시 trylogin = false;, ok면 JWT 생성하고 메인으로 이동
                                axios(`https://${REST}/api/RefreshAccess`, {
                                    method : "get",
                                    params : {},
                                    withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청      
                                }).then((res) => {  
                                        console.log(res);
                                        const token = res.headers['authorization'].split(' ')[1];
                                        localStorage.setItem('logintoken', token);
                                        setAccessToken(jwtDecode(token));
                                        console.log("엑세스 재발급 완료." + token);
                                }).catch((err) => { 
                                        localStorage.removeItem('logintoken');
                                        console.log("재시작");  
                                        if(socRef?.current){
                                            if(socRef.current.readyState === WebSocket.OPEN){
                                                socRef.current.close();
                                            }
                                        }
                                        nav("/login");
                                        return;
                                    
                                    console.log(err.response);
                                });
                            }
                            doLogin();
                    }
                

                if(temptok != null){
                        decoded = jwtDecode(temptok);               
                        if(decoded.exp < exp)
                        {        
                            getAcc();
                            return;
                        }
                        const doVerify = () => {
                            //axios로 로그인 요청, const trylogin = true일때 실행 X, response not ok면 다시 trylogin = false;, ok면 JWT 생성하고 메인으로 이동
                                axios(`https://${REST}/api/VerifyAccess`, {
                                    method : "get",
                                    params : {
                                        key: temptok,
                                    },
                                    withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청
                        
                                }).then((res) => { 
                                        console.log("유효한 토큰입니다.");
                                }).catch((err) => { 
                                        console.log("가짜 토큰입니다.");
                                        localStorage.removeItem('logintoken');
                                        getAcc();
                                        return;
                                });
                            }
                            doVerify();
                }
                else{
                    getAcc();
                    return;
                }
                //axios("주소", 토큰)     : 백엔드 유효 검증
                return true; 
            }
            
            const sendRegister = (id) => {
                if(socRef.current){
                    socRef.current.send(JSON.stringify({
                        "type" : "ENTER_CHANNEL",
                        "channel_id" : id,
                        "writer" : accessToken.name,
                    }))
                    axios(`https://${REST}/api/getmessage`, {
                        method : "post",
                        params : {
                            id: id,
                        },
                        withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청
                    }).then((res) => { 
                            console.log(res);
                            setMessageQueue((prev) => 
                                {
                                    let data = res.data;
                                    return { ...prev,
                                            [id] : res.data
                                    }
                                    
                                    //return {[message.data["channel"]] : message.data};

                                }
                            );
                            return;
                    }).catch((err) => { 
                            console.log(err);
                            return;
                    });
                }
            }
            const sendMessage = (Message, id) => {
                console.log(accessToken.sub);
                socRef.current.send(JSON.stringify({
                    "type" : "SEND_MESSAGE",
                    "channel_id" : id,
                    "writer" : accessToken.name,
                    "text" : Message,
                    "userId" : accessToken.sub
                }))            
            }
                                    // 채널 , 유저 
        const Sub = (channel) => {
            console.log("섭")
            const user = accessToken.sub;
            setSubChannel(temp => ({ // 기존 채널 => 
                    ...temp, // 기존채널 배열
                    [channel] : temp[channel]?.includes(user)
                    ? temp[channel] 
                    : [...(temp[channel] || []), {user:user, textQueue:"text"}]
                })
            )

        }
        const unSub = (channel) => {
            const user = accessToken.sub;
            setSubChannel(prev => ({
                ...prev,
                [channel]: prev[channel]?.filter(cb => cb !== user) || [],
            }));
        };
        const getServerByChannel = (id) => { // 서버 구독
            if(socRef.current){
                axios(`https://${REST}/api/getchatrooms`, {
                    method : "post",
                    params : {
                        id: id,
                    },
                    withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청
                }).then((res) => { 
                        console.log(res);
                        setServerQueue((prev) => 
                            {
                                let data = res.data;
                                return { ...prev,
                                        [id] : res.data
                                }
                                //return {[message.data["channel"]] : message.data};
                            }
                        );
                        return;
                }).catch((err) => { 
                        console.log(err);
                        return;
                });
            }
            return;
        }
         const setReceived = (id) => {
            return
         };
        return (
            <Context.Provider value={{sendMessage,getServerByChannel,serverQueue,sendRegister,Sub,unSub,setReceived,messageQueue,wsConnected,accessToken,onLineFriend, getServerByUser,roomQueue}}>
                    {children}
            </Context.Provider>
        )
    }


    function getCookie(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        console.log(value+"qoffb");
        return value ? value[2] : null;
    };