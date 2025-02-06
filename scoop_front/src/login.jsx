import { useContext, useState } from "react";
import { useParams } from "react-router-dom"



export function Login(props){
    const [id,setId] = useState("");
    const [pwd,setPwd] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        doLogin();
    }
    
    function doLogin(){
    //axios로 로그인 요청, const trylogin = true일때 실행 X, response not ok면 다시 trylogin = false;, ok면 JWT 생성하고 메인으로 이동
       console.log(id);
       console.log(pwd);
        console.log("doLogin");
    }
    return(
        <div class="Channel">
        <div class="OutputChat">
            <form onSubmit={handleSubmit}>
                <input id="id" required  value = {id} onChange={(e) => setId(e.target.value)}></input> ID <p></p>
                <input id="pwd" required value ={pwd} onChange={(e) => setPwd(e.target.value)}></input> PWD <p></p>
                <button type="submit"> go </button>
            </form>
        </div>
        </div>
    )
}   
