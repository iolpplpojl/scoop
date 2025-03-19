import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function FindId() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const REST = process.env.REACT_APP_RESTURL; // API 주소 (환경 변수)
    
    // 폼 제출 시 실행
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 동작 방지
        doFindId(); // POST 요청 실행
    };
    function doFindId(){
        console.log(email);
        axios(`https://${REST}/api/find-id`,{
            method:"POST",
            data: JSON.stringify({
                email: email,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            console.log(res);
            alert("이메일로 회원님의 아이디를 전송했습니다");
            navigate("/login");
        }).catch((err) => {
            console.log(err.response);
            alert("error");
        });
    }

    return (
        <div id='Signup'>
        <div className="signup-container">
            <h2>아이디 찾기</h2>
            <form onSubmit={handleSubmit}>
                 <div className="input-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email"  id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <button type="submit" className="submit-btn">이메일 전송</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
}
