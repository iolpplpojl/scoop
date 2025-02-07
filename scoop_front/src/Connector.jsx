import { Children, createContext, useActionState, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams,useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

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
    useEffect(()=>{
        if(loc.pathname !="/login"){
        verifyLogin();
        console.log("navigating..." + Math.random() + loc.pathname);
        }
    },[loc])

    const verifyLogin = () =>
    {
        
        const temptok = localStorage.getItem("logintoken");         
        if(temptok == null){
            console.log("토큰이 업삼" + token)
            nav("/login");
            return;
        }
        /**if(temptok === null)   
        {
            setToken(null);
            localStorage.removeItem("logintoken");
            nav("/login");
            return;
        }**/
        if(temptok){
            const decoded = jwtDecode(temptok);
            console.log(decoded);

            console.log(temptok + "\n" + token + "\n검증...");
            setToken(temptok);
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

