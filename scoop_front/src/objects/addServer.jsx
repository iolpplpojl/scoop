import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./addServer.css"
import axios from "axios";

export function AddServer(props){
    const REST = process.env.REACT_APP_RESTURL;

    const [open,setOpen] = useState(false);
    const [name,setName] = useState("");
    const location = useLocation();
    const pathSegments = location.pathname.split('/'); // 현재 경로를 분할
    function handle(){
        setOpen(!open);
    }
    function make(){

        console.log("chat");
        axios(`https://${REST}/api/addServer`, {
                method : "post",
                params : {
                    name: name
                },
                withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청
            }).then((res) => { 
        
                    setOpen(false);
                    alert(name);                   
                    props.reset(1);
                    props.isPopupOpen(false);
    
                    return;
            }).catch((err) => { 
                    console.log(err);
                    return;
            });
              
    }
    return(
        <li  className="serverpop">
            <img src="https://img.icons8.com/ios7/512/plus.png" onClick={handle} width={85}height={85} ></img>
            {open? <div id="add">
                        <div id="addPanel">
                            <div>
                                <h1>서버 만들기!</h1>
                            </div>

                            <div>
                                이름 : <p></p>
                                <input value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>

                            <div>
                                <button onClick={make}>만들기</button>
                            </div>
                        </div>
                    </div> : null}
        </li>            
        
        
    )
}