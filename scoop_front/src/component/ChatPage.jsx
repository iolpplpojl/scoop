import { useContext, useEffect, useInsertionEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Context, useWebSocket } from "../Connector";


export function ChatPage(props){
    const {id} = useParams();
    const {sendMessage,sendRegister,Sub,setReceived,messageQueue} = useContext(Context);

    const [msg, setMsg] = useState("");
    const sendHandle = () => {
        sendMessage(msg, id);
        setMsg("");
    }

    function setChat() {
        console.log("메세징");
        let temp = document.querySelector("#chatset");
        temp.innerHTML = "";
        if(messageQueue[id] !== undefined){
            console.log(messageQueue[id]);
            messageQueue[id].slice().reverse().forEach(element => {
                console.log(element);

                let elem = document.createElement("li");
                elem.innerHTML = `<b>${element['writer']}</b> : ${element['message']}`
                temp.appendChild(elem);
            });
            let top = document.querySelector(".OutputChat ul");
            top.scrollTop = top.scrollHeight;

        }
    }
    useEffect(() => {
        setChat();
    },[messageQueue]);
    useEffect(() => {
        sendRegister(id);
        //Sub(id);
        setReceived(id);
        setChat();
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
            <ul id="chatset">
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