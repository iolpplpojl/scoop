import React, { useState } from "react";

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

const AddFriend = ({ onClose, initialFriendCode }) => {
  const [friendCode, setFriendCode] = useState(initialFriendCode || "");
  const [error, setError] = useState("");
  const REST = process.env.REACT_APP_RESTURL;

  const handleChange = (e) => {
    setFriendCode(e.target.value);
    setError("");
  };

  const handleSubmit = (friendCodeToSend) => {
    const sub = getSubFromLoginToken();
    if (!sub) {
      setError("로그인 정보가 없습니다.");
      return;
    }

    const url = `https://${REST}/api/addfriend`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sub, friendCode: friendCodeToSend || friendCode }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 응답 에러: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message || "친구 추가 성공!");
        onClose();
      })
      .catch((err) => {
        console.error("❌ 요청 오류:", err);
        setError(err.message || "오류가 발생했습니다.");
      });
  };

  return (
    <div>
      <h2>친구의 이메일을 입력하세요.</h2>
      <input
        type="text"
        value={friendCode}
        onChange={handleChange}
        placeholder="친구 이메일"
      />
      {error && <p>{error}</p>}
      <div>
        <button onClick={onClose}>취소</button>
        <button onClick={() => handleSubmit()}>확인</button>
      </div>
    </div>
  );
};

export const addFriend = (userId) => {
  const sub = getSubFromLoginToken();
  if (!sub) {
    alert("로그인 정보가 없습니다.");
    return;
  }

  const REST = process.env.REACT_APP_RESTURL;
  const url = `https://${REST}/api/addfriend`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sub, friendCode: userId }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`서버 응답 에러: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      alert(data.message || "친구 추가 성공!");
    })
    .catch((err) => {
      console.error("❌ 요청 오류:", err);
      alert(err.message || "오류가 발생했습니다.");
    });
};

export default AddFriend;
