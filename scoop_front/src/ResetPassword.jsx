import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get("token"); // URL에서 token 가져오기
    const REST = process.env.REACT_APP_RESTURL; // API 주소

    useEffect(() => {
        if (!token) {
            setMessage("유효한 토큰이 없습니다.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await axios.post(`https://${REST}/api/reset-password`, {
                token,
                newPassword: password,
            });

            alert("비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.");
            navigate("/login");
        } catch (err) {
            console.error(err.response);
            setMessage("비밀번호 변경에 실패했습니다.");
        }
    };

    return (
        <div className="reset-password-container">
            <h2>비밀번호 재설정</h2>
            {message && <p className="error-message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>새 비밀번호</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>비밀번호 확인</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit">비밀번호 변경</button>
            </form>
        </div>
    );
}
