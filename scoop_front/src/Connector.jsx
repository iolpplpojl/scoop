import { Children, createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const WebSocketContext = createContext(null);
const isLoggedin = false;

export function Connector({children}){
    const [isConn,setIsConn] = useState(false);
    if(!isConn){
        Connect();
    }
    useEffect(()=>{
        console.log("Conneting..." + Math.random());
    },[])
    return (
        <WebSocketContext.Provider value={isLoggedin}>
                {children}
        </WebSocketContext.Provider>
      )
}
function Connect(){
 // websocket 연결
}
export function CheckLogin()
{
 // 페이지마다 로그인 체크 후 false면  /login nav
    const nav = useNavigate();
    const login = isLoggedin;
    console.log(login + " == Login");
}

export function useWebSocket() {

    return useContext(WebSocketContext);
}