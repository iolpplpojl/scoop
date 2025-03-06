import React, { useState } from "react";

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

export function FriendsContainer() {
  const [friendsData, setFriendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFriendsData = () => {
    const sub = getSubFromLoginToken();
    if (!sub) {
      setError("토큰 정보가 없습니다.");
      return;
    }
  
    console.log("sub 값:", sub);  // sub 값 확인
  
    setLoading(true);
    setError(null);
    const url = `https://192.168.0.89:9999/api/getfriends`;
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sub }), // JSON으로 sub 값을 전송
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 응답 에러: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setFriendsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 가져오기 실패:", err);
        setError(err.message);
        setLoading(false);
      });
  };
  
  

  return (
    <div className="friends-container">
      <h3>친구 목록</h3>
      <button onClick={fetchFriendsData}>친구 목록 가져오기</button>
      {loading && <p>데이터 로딩 중...</p>}
      {error && <p>에러 발생: {error}</p>}
      {friendsData && (
        <pre>{JSON.stringify(friendsData, null, 2)}</pre>
      )}
    </div>
  );
}
