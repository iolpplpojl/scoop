import { useContext, useEffect, useInsertionEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Context, useWebSocket } from "../Connector";
import { Chat } from "../objects/chat";


export function ChatPage(props){
    const {id} = useParams();
    const {sendMessage,sendRegister,Sub,setReceived,messageQueue} = useContext(Context);
    const [chats,setChats] = useState([]);
    const [msg, setMsg] = useState("");

    const sendHandle = () => {
        sendMessage(msg, id);
        setMsg("");
    }

    function setChat() {
        console.log("메세징");
        setChats([]);
        if(messageQueue[id] !== undefined){
            if (messageQueue[id] !== undefined) {
                setChats(messageQueue[id].slice().reverse());
            }
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
                {chats.map((ele, idx) => (
                    <Chat key={idx} name={ele['writer']} text={ele['message']}></Chat>
                ))}
            </ul>
         </div>
         <div class="InputChat">
            <input value={msg} onChange={handleMsgInput}         onKeyDown={(e) => activeEnter(e)}           ></input> <button onClick={sendHandle}>SEND</button>
         </div> 
        </div>
    )
}