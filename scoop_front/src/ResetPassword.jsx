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
}