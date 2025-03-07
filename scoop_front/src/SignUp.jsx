import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate 추가
//import './Signup.css';
import axios from 'axios';
const SignUp = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // ✅ useNavigate() 사용

    const handleSubmit = async (e) => {
        e.preventDefault();
            axios('https://192.168.0.82:9999/api/register', {
                method: 'POST',
                data: JSON.stringify({
                    id: id,
                    pwd: password,
                    email: email,
                    nickname: nickname,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                console.log(res);
                alert("done");
                navigate("/login");
            }).catch((err) => {
                console.log(err.response);
                alert("error");
            });
        }
        
/** 
            const data = await response.json();
            if (data.status === 'error') {
                setErrorMessage(data.error);
            } else {
                alert('회원가입 성공');
                navigate('/login'); 
            }
        } catch (error) {
            setErrorMessage('회원가입 실패');
        }
            
    };
    */
    
    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="id">아이디</label>
                    <input type="text" id="id" value={id} onChange={(e) => setId(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="submit-btn">회원가입</button>
            </form>
        </div>
    );
};

export default SignUp;
