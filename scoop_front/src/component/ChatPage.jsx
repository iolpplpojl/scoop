import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Context, useWebSocket } from "../Connector";


export function ChatPage(props){
    const {id} = useParams();
    const {sendMessage,sendRegister,Sub,setReceived} = useContext(Context);

    const [msg, setMsg] = useState("");
    const sendHandle = () => {
        sendMessage(msg, id);
        setMsg("");
    }

    useEffect(() => {
        sendRegister(id);
        //Sub(id);
        setReceived(id);
        console.log(id + "로 이동함");
    },[id]);


    const activeEnter = (e) => {
        if(e.key === "Enter"){
            sendHandle();
        }
    }
    const handleMsgInput = (event) => {
        setMsg(event.target.value);
    }
    return(
        <div class="Channel">
        <div class="OutputChat">
            <ul>
                <li>This is a Sample. a </li>
                <li>This is a Sample. a </li>
                <li>{id} is channel number;</li>
            </ul>
         </div>
         <div class="InputChat">
            <input value={msg} onChange={handleMsgInput}         onKeyDown={(e) => activeEnter(e)}           ></input> <button onClick={sendHandle}>SEND</button>
         </div> 
        </div>
    )
}