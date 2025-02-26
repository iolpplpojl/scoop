import React, { useEffect, useState } from "react";

function getSubFromLoginToken() {
  const token = localStorage.getItem("logintoken");
  if (!token) {
    console.warn("로그인 토큰이 존재하지 않습니다.");
    return "";
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error("유효하지 않은 토큰 형식입니다.");
    }
    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.sub || "";
  } catch (error) {
    console.error("토큰 파싱 중 오류 발생:", error);
    return "";
  }
}

export function LoginTokenContainer() {
  const [sub, setSub] = useState("");

  useEffect(() => {
    const tokenSub = getSubFromLoginToken();
    setSub(tokenSub);
  }, []);

  return (
    <div className="login-token-container">
      <h3>로그인 토큰 정보</h3>
      {sub ? <p>sub: {sub}</p> : <p>로그인 토큰이 없습니다.</p>}
    </div>
  );
}
