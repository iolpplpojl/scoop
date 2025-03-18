import React, { useState, useEffect } from "react";
import { getSubFromLoginToken } from "../util/GetSubByLogintoken"; 

export function RequestFriends() {
  const REST = process.env.REACT_APP_RESTURL;
  const [friendsData, setFriendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingActions, setPendingActions] = useState({});

  // ❌ 버튼 없이 자동 실행
  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = () => {
    setFriendsData(null);
    const sub = getSubFromLoginToken();
    if (!sub) {
      setError("토큰 정보가 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);
    const url = `https://${REST}/api/requestfriends`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sub }),
    })
      .then((res) => res.ok ? res.json() : Promise.reject(`서버 응답 에러: ${res.status}`))
      .then((data) => {
        setFriendsData(data.length > 0 ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 가져오기 실패:", err);
        setError(err);
        setLoading(false);
      });
  };

  const handleFriendAction = (identifyCode, state) => {
    const sub = getSubFromLoginToken();
    if (!sub) {
      setError("토큰 정보가 없습니다.");
      return;
    }

    if (pendingActions[identifyCode]) return;

    setPendingActions((prev) => ({ ...prev, [identifyCode]: true }));

    const url = `https://${REST}/api/updatefriend`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sub, identifyCode, state }),
    })
      .then((res) => res.ok ? res.json() : Promise.reject(`서버 응답 에러: ${res.status}`))
      .then(() => {
        setTimeout(fetchFriendsData, 300);
      })
      .catch((err) => {
        console.error("친구 요청 처리 실패:", err);
        setError(err);
      })
      .finally(() => {
        setTimeout(() => {
          setPendingActions((prev) => ({ ...prev, [identifyCode]: false }));
        }, 500);
      });
  };

  return (
    <div className="friends-container">
      <h3>친구요청 목록</h3>

      {loading && <p>데이터 로딩 중...</p>}
      {error && <p>에러 발생: {error}</p>}

      {friendsData !== null && (
        <ul>
          {Array.from(
            new Map(friendsData.map((friend) => [friend.identifyCode, friend])).values()
          ).map((friend) => (
            <li key={friend.identifyCode}>
              <strong>식별코드:</strong> {friend.identifyCode} | 
              <strong>아이디:</strong> {friend.id} | 
              <strong>닉네임:</strong> {friend.nickname}
              
              <button 
                onClick={() => handleFriendAction(friend.identifyCode, 1)} 
                disabled={pendingActions[friend.identifyCode]}
              >
                {pendingActions[friend.identifyCode] ? "처리 중..." : "수락"}
              </button>
        
              <button 
                onClick={() => handleFriendAction(friend.identifyCode, -1)} 
                disabled={pendingActions[friend.identifyCode]}
              >
                {pendingActions[friend.identifyCode] ? "처리 중..." : "거절"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RequestFriends;
