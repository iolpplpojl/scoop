import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function FindPw() {
    const [id,setId] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const REST = process.env.REACT_APP_RESTURL; // API 주소 (환경 변수)
    
    // 폼 제출 시 실행
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 동작 방지
        doFindPw(); // POST 요청 실행
    };
    function doFindPw(){
        console.log(email);
        axios(`https://${REST}/api/find-password`,{
            method:"POST",
            data: JSON.stringify({
                id:id,
                email: email
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            console.log(res);
            alert("이메일로 비밀번호 재설정 주소를 보냈습니다");
            navigate("/login");
        }).catch((err) => {
            console.log(err.response);
            alert("error");
        });
    }

    return (
        <div id='Signup'>
        <div className="signup-container">
            <h2>비밀번호 찾기</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="id">아이디</label>
                    <input id="id" required  value = {id} onChange={(e) => setId(e.target.value)}></input>  
                </div>
                <div className="input-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email"  id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <button type="submit">비밀번호 찾기</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
}
