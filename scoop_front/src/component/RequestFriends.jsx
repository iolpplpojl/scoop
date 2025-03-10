import React, { useState, useEffect } from "react";

function getSubFromLoginToken() {
  const token = localStorage.getItem("logintoken");
  if (!token) {
    console.warn("로그인 토큰이 존재하지 않습니다.");
    return "";
  }

  try {
    const parts = token.split(".");
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

export function RequestFriends() {
  const REST = process.env.REACT_APP_RESTURL;
  const [friendsData, setFriendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingActions, setPendingActions] = useState({});

  const fetchFriendsData = () => {
    setFriendsData(null);  // ✅ 기존 데이터 초기화 (중복 방지)
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
      headers: {
        "Content-Type": "application/json",
      },
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

  useEffect(() => {
    fetchFriendsData();
  }, []);

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
      <button onClick={fetchFriendsData}>친구요청 목록 가져오기</button>

      {loading && <p>데이터 로딩 중...</p>}
      {error && <p>에러 발생: {error}</p>}

      {friendsData !== null && (
        <ul>
        {Array.from(
          new Map(friendsData.map((friend) => [friend.identifyCode, friend])).values()
        ).map((friend) => (
          <li key={friend.identifyCode}>
            <strong>식별코드:</strong> {friend.identifyCode} |{" "}
            <strong>아이디:</strong> {friend.id} |{" "}
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
