import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";

axios.defaults.withCredentials = true;


export function Login(props){
    const nav = useNavigate();
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
        axios("https://211.212.129.132:9999/api/login", {
            method : "get",
            params : {
                id: id,
                pwd : pwd
            },
            credentials: "include", // 💡 HTTP-Only 쿠키 포함 요청
            withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청

        }).then((res) => {
                console.log(res);
                const token = res.headers['authorization'].split(' ')[1];
                console.log(token);
                nav("/");
        }).catch((err) => {
            
            console.log(err.response);
            alert("아이디가 안됨! ");
        });
        
    }
    function reGisterform(){
        nav("/register");
    }
    return(
        <div className="Channel">
        <div className="OutputChat">
            <form onSubmit={handleSubmit}>
                <input id="id" required  value = {id} onChange={(e) => setId(e.target.value)}></input> ID <p></p>
                <input id="pwd" required value ={pwd} onChange={(e) => setPwd(e.target.value)}></input> PWD <p></p>
                <button type="submit"> go </button>
            </form>
            <button type="button" onClick={reGisterform}> 회원가입 </button>
        </div>
        </div>
    )
}   


