import { Children, createContext, useActionState, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams,useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const WebSocketContext = createContext(null);
const isLoggedin = false;

export function Connector({children}){
    const [isConn,setIsConn] = useState(false);
    const nav = useNavigate();
    const [token, setToken] = useState();

    if(!isConn){
        Connect();
    }
    useEffect(() => {

        console.log("Connecting..." + Math.random());

    },[] )
    const loc = useLocation();
    // /login이 아닐때 페이지 이동마다 로그인 검증
    useEffect(()=>{
        if(loc.pathname !="/login"){
        verifyLogin();
        console.log("navigating..." + Math.random() + loc.pathname);
        }
    },[loc])

    //로그인 검증 함수
    const verifyLogin = () =>
    {
        const temptok = localStorage.getItem("logintoken");  
        const tempreftok  = localStorage.getItem("reftoken");

        // localstorage에 토큰 가져오기
        if(tempreftok == null){ //없으면 return
            console.log("리프토큰이 업삼")
            localStorage.removeItem("logintoken");

            nav("/login");
            return;
        }
        else{ //있으면
            const exp = Math.floor(Date.now() / 1000); // 현재시간
            console.log({ exp }); 
            const decodedref = jwtDecode(tempreftok);
            if(exp > decodedref.exp){
                console.log("유효기간 끝남 레프");
                localStorage.removeItem("reftoken");
                localStorage.removeItem("logintoken");
                nav("/login");
                return;
            }
            let decoded;

            const getAcc = () => {
                console.log("유효기간 끝남");
                localStorage.removeItem("logintoken");
                if(tempreftok != null){
                    const doLogin = () => {
                        //axios로 로그인 요청, const trylogin = true일때 실행 X, response not ok면 다시 trylogin = false;, ok면 JWT 생성하고 메인으로 이동
                            axios("http://192.168.0.82:9999/api/RefreshAccess", {
                                method : "get",
                                params : {
                                    key: tempreftok,
                                    id : decodedref.sub
                                },
                                withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청
                    
                            }).then((res) => {  

                                    console.log(res);
                                    const token = res.headers['authorization'].split(' ')[1];
                                    localStorage.setItem('logintoken', token);
                                    console.log("엑세스 재발급 완료." + token);
                            }).catch((err) => { 

                                    alert('로그인에 오류가 발생했습니다, 다시 로그인.')
                                    localStorage.removeItem('reftoken');
                                    localStorage.removeItem('logintoken');
                                    nav("/login");
                                    return;
                                
                                console.log(err.response);
                            });
                        }
                        doLogin();
                }
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
                            axios("http://192.168.0.82:9999/api/VerifyAccess", {
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


            
            console.log(decodedref);
            console.log(decoded);
            //axios("주소", 토큰)     : 백엔드 유효 검증
            return; 
        }
    };
    return (
        <WebSocketContext.Provider value={isLoggedin}>
                {children}
        </WebSocketContext.Provider>
      )
}
function Connect(){
 // websocket 연결
}


export function useWebSocket() {

    return useContext(WebSocketContext);
}

