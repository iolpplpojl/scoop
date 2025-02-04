import { useParams } from "react-router-dom"



export function ChatPage(props){
    const {id} = useParams();
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
            <input></input> <button>SEND</button>
         </div> 
        </div>
    )
}