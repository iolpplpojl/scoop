import { Children, createContext, useActionState, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams,useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

export const Context = createContext(null);

export function Connector({children}){
    const nav = useNavigate();
    const [accessToken, setAccessToken] = useState(null);    
            useEffect(() => {

        console.log("Connecting..." + Math.random());

    },[] )
    const loc = useLocation();
    // /login이 아닐때 페이지 이동마다 로그인 검증
    useEffect(()=>{
        if(loc.pathname !="/login"){
        if(verifyLogin() == true){
            console.log("ConnectWS");
            ConnectWs();
        }
        console.log("navigating..." + Math.random() + loc.pathname);
        }
    },[loc])


    let soc;

    const ConnectWs = () => {
        soc = new WebSocket("wss://192.168.0.82:9999/gateway");
        soc.onopen = () => {
            soc.send(JSON.stringify({
                "test" : "asdf",
                "text" : "Connected"
            }));
        }
    }



    //로그인 검증 함수
    const verifyLogin = () =>
    {
           const temptok = localStorage.getItem("logintoken");  
            const exp = Math.floor(Date.now() / 1000); // 현재시간
            console.log({ exp }); 
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
                                    console.log("엑세스 재발급 완료." + token);
                            }).catch((err) => { 
                                    localStorage.removeItem('logintoken');
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
    return (
        <Context.Provider value={"test"}>
                {children}
        </Context.Provider>
      )
}


function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    console.log(value+"qoffb");
    return value ? value[2] : null;
};