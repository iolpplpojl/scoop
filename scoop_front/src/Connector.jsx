import { Children, createContext, useContext, useEffect } from "react";

const WebSocketContext = createContext(null);

export function Connector({children}){
    useEffect(()=>{
        console.log("Conneting..." + Math.random());
    },[])
    return (
        <WebSocketContext.Provider value="context test">
                {children}
        </WebSocketContext.Provider>
      )
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}