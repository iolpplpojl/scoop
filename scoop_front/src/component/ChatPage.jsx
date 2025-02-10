import { useContext } from "react";
import { useParams } from "react-router-dom"
import { Context, useWebSocket } from "../Connector";


export function ChatPage(props){
    const {id} = useParams();
    const val = useContext(Context);
    return(
        <div class="Channel">
        <div class="OutputChat">
            <ul>
                <li>This is a Sample. a </li>
                <li>This is a Sample. a </li>
                <li>{id} is channel number;</li>
                <li>{val} z</li>
            </ul>
         </div>
         <div class="InputChat">
            <input></input> <button>SEND</button>
         </div> 
        </div>
    )
}