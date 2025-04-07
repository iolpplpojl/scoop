import { useState } from 'react'
import './AddChannel.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export function AddChannel(props){
    const [id, setId] = useState("");
    const REST = process.env.REACT_APP_RESTURL;
    const nav = useNavigate();

    function handle(){
        console.log("chat");
        axios(`https://${REST}/api/addChatrooms`, {
            method : "post",
            params : {
                server_id: props.server,
                name: id
            },
            withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청
        }).then((res) => { 
                console.log(res);
                props.getServer(props.server);
                props.isPopupOpen(false);
                nav(`channel/${props.server}/${res.data}`)

                return;
        }).catch((err) => { 
                console.log(err);
                return;
        });
          
        console.log(id + props.server);
    }
    return(
        <div className="AddChannel">
            <div>
                서버명 : <input value={id} onChange={(e) => setId(e.target.value)}></input>
            </div>
                <button onClick={() => handle()} disabled={id===""? true : false}>만들기</button>
        </div>

    )
}