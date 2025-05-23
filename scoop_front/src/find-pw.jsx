import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function FindPw() {
    const [id,setId] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const REST = process.env.REACT_APP_RESTURL;
    

    const handleSubmit = (e) => {
        e.preventDefault(); 
        doFindPw(); 
    };
    function doFindPw() {
        console.log(email);
        axios.post(`https://${REST}/api/find-password`, 
            { email: email }, // 객체 그대로 전달
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then((res) => {
            console.log(res);
            alert("이메일로 비밀번호 재설정 주소를 보냈습니다");
            navigate("/login");
        })
        .catch((err) => {
            console.error("❌ 비밀번호 찾기 오류:", err.response);
            alert("error");
        });
    }

    return (
        <div id='Signup'>
        <div className="signup-container">
            <h2>비밀번호 찾기</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email"  id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <button type="submit" className="submit-btn">비밀번호 찾기</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
}
