import React, { useState } from "react";
import { getSubFromLoginToken } from "../util/GetSubByLogintoken"; //로그인 토큰에서 sub값 추출 기능

export function FriendsContainer() {
  const REST = process.env.REACT_APP_RESTURL;

  const [friendsData, setFriendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFriendsData = () => {
    const sub = getSubFromLoginToken();
    if (!sub) {
      setError("토큰 정보가 없습니다.");
      return;
    }
  
    console.log("sub 값:", sub);

    setLoading(true);
    setError(null);
    const url = `https://${REST}/api/getfriends`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sub }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 응답 에러: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setFriendsData(data.length > 0 ? data : []);
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

      {friendsData !== null && (
        friendsData.length > 0 ? (
          <ul>
            {friendsData.map((friend, index) => (
              <li key={index}>
                <strong>식별코드:</strong> {friend.identifyCode} | 
                <strong>아이디:</strong> {friend.id} | 
                <strong>닉네임:</strong> {friend.nickname}
              </li>
            ))}
          </ul>
        ) : (
          <p>친구가 없습니다.</p>
        )
      )}
    </div>
  );
}
