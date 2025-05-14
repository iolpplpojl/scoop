import React, { useState, useEffect, useContext } from "react";
import { getSubFromLoginToken } from "../util/GetSubByLogintoken"; // 로그인 토큰에서 sub값 추출 기능
import { Context } from "../Connector";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export function FriendsContainer() {
  const REST = process.env.REACT_APP_RESTURL;

  const [friendsData, setFriendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {accessToken, onLineFriend} = useContext(Context);
  const nav = useNavigate();
  const loc = useLocation();
  useEffect(() => {
    fetchFriendsData();
  }, []);

  useEffect(() =>{
    console.log(friendsData);

  }, [friendsData]);

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

  const handleChat = (friend) => {
    console.log("chat");
    axios(`https://${REST}/api/dm`, {
      method : "post",
      params : {
          id: accessToken.sub,
          to: friend
      },
      withCredentials: true  // 쿠키 및 인증 헤더를 포함하여 요청
  }).then((res) => { 
          console.log(res);
          nav(`channel/@me/${res.data}`)
          return;
  }).catch((err) => { 
          console.log(err);
          return;
  });
  }
  return (
    <div className="friends-container">
      <h3>친구 목록</h3>

      {loading && <p>데이터 로딩 중...</p>}
      {error && <p>에러 발생: {error}</p>}

      {friendsData !== null && (
        friendsData.length > 0 ? (
          <ul className="friend-list">
            {friendsData.map((friend, index) => (
              <li className="friend-item" key={index}>
                <div className="friend-info">
                  <strong>아이디:</strong> {friend.identifyCode} <br></br>
                  <strong>닉네임:</strong> {friend.nickname} 
                  {onLineFriend.includes(friend.identifyCode) && (
                    <span className="online-tag">접속중!</span>
                  )}
                </div>
                <button
                  className="tab-btn"
                  onClick={() => handleChat(friend.identifyCode)}
                >
                  채팅
                </button>
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


export default FriendsContainer;
