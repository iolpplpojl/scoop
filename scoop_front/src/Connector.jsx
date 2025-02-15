    import { Children, createContext, useActionState, useContext, useEffect, useReducer, useRef, useState } from "react";
    import { useNavigate, useSearchParams,useLocation } from "react-router-dom";
    import {jwtDecode} from "jwt-decode";
    import axios from "axios";

    export const Context = createContext(null);

    export function Connector({children}){
        const nav = useNavigate();
        const [messageQueue, setMessageQueue] = useState(null);
        const [accessToken, setAccessToken] = useState({});    
        const [wsConnected, setWsConnected] = useState(false);
        
        const [subChannel, setSubChannel] = useState({});
        const socRef = useRef();
        
        useEffect(() => {
        },[] )
        const loc = useLocation();
        // /login이 아닐때 페이지 이동마다 로그인 검증
        useEffect(()=>{
            if(loc.pathname !="/login"){
                verifyLogin();
                console.log("navigating..." + Math.random() + loc.pathname);
            }
        },[loc])

        useEffect( () => {
            console.log(subChannel);
        },[subChannel])
        useEffect(() => { 
            if(wsConnected !== true){
                ConnectWs();
            }
        }, [accessToken])

        const ConnectWs = () => {
            console.log(accessToken + "토큰");
            if(wsConnected !== true && accessToken !== undefined){
                socRef.current = new WebSocket("wss://192.168.0.82:9999/gateway");
            socRef.current.onopen = () => {
                console.log(accessToken);
                console.log(socRef.current.readyState);
                setWsConnected(true);
                socRef.current.send(JSON.stringify({
                    "type" : "ENTER_APP",
                    "writer" : "admin", // accessToken의 변수가 들어갈 자리
                    "text" : "Connected",
                }));
            }

            socRef.current.onmessage = (msg) => {
                const message = msg
                console.log(JSON.parse(msg.data));
                setMessageQueue(
                    [message]

                )
                socRef.current.send(JSON.stringify({
                    "type" : "RECEIVED",
                    "writer" : "admin",
                }))
            }   
            socRef.current.onclose = () => {
                console.log("discon");
                setWsConnected(false);
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
                                axios("https://192.168.0.82:9999/api/RefreshAccess", {
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
                        decoded = jwtDecode(temptok );               
                        if(decoded.exp < exp)
                        {        
                            getAcc();
                            return;
                        }
                        const doVerify = () => {
                            //axios로 로그인 요청, const trylogin = true일때 실행 X, response not ok면 다시 trylogin = false;, ok면 JWT 생성하고 메인으로 이동
                                axios("https://192.168.0.82:9999/api/VerifyAccess", {
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
                socRef.current.send(JSON.stringify({
                    "type" : "ENTER_CHANNEL",
                    "channel_id" : id,
                    "writer" : "admin",
                }))        
            }
            const sendMessage = (Message, id) => {
                socRef.current.send(JSON.stringify({
                    "type" : "SEND_MESSAGE",
                    "channel_id" : id,
                    "writer" : "admin",
                    "text" : Message
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

         const setReceived = (id) => {
            return
         };
        return (
            <Context.Provider value={{sendMessage,sendRegister,Sub,unSub,setReceived}}>
                    {children}
            </Context.Provider>
        )
    }


    function getCookie(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        console.log(value+"qoffb");
        return value ? value[2] : null;
    };