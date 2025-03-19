import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import "./Main.css"
axios.defaults.withCredentials = true;

export function Login(props){
    const REST = process.env.REACT_APP_RESTURL;

    const nav = useNavigate();
    const [id,setId] = useState("");
    const [pwd,setPwd] = useState("");
    const [errorMessage,setErrorMessage] =useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        doLogin();
    }
    
    function doLogin(){
    //axios로 로그인 요청, const trylogin = true일때 실행 X, response not ok면 다시 trylogin = false;, ok면 JWT 생성하고 메인으로 이동
        console.log(REST);
        console.log(id);
        console.log(pwd);
        console.log("doLogin");
        axios(`https://${REST}/api/login`, {
            method : "post",
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
            setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
        });
        
    }
    
    return(
        <div id='Signup'>
        <div className="signup-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="id">이메일</label>
                    <input id="id" required  value = {id} onChange={(e) => setId(e.target.value)}></input>  
                    </div>
                <div className="input-group">
                    <label htmlFor="password">비밀번호</label>
                    <input id="pwd" required value ={pwd} onChange={(e) => setPwd(e.target.value)}></input> 
                    <Link to="/find-password" className="link-btn">비밀번호 찾기</Link>
                    </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="submit-btn">로그인</button>
            </form>
            <div className="under-bar">
            <p>계정이 없으신가요?<Link to="/register" className="link-btn">회원가입</Link></p>
            
            
            </div>
        </div>
        </div>
    )
}   


