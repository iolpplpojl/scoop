import { useEffect } from "react";


export function Connector(){

    useEffect(()=>{
        console.log("Conneting..." + Math.random());
    },[])
}