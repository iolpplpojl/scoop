import { useEffect, useState } from "react";
import { getSubFromLoginToken } from "../util/GetSubByLogintoken";

const DMList = () => {
  const [dmRooms, setDmRooms] = useState([]);
  const sub = getSubFromLoginToken();
  const REST = process.env.REACT_APP_RESTURL;

  useEffect(() => {
    const fetchDMList = async () => {
      if (!sub) {
        console.warn("사용자 sub가 없습니다.");
        return;
      }

      try {
        const response = await fetch(`https://${REST}/api/dmlist?sub=${sub}`);
        const data = await response.json();
        setDmRooms(data);
      } catch (err) {
        console.error("DM 리스트 가져오기 실패:", err);
      }
    };

    fetchDMList();
  }, [sub]);

  return (
    <div>
      <h2>내 DM 목록</h2>
      <ul>
        {dmRooms.map((room) => (
          <li key={room.chatroomid} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <img
              src={room.image}
              alt={`${room.nickname} 프로필`}
              width="40"
              height="40"
              style={{ borderRadius: "50%", marginRight: "10px" }}
            />
            <div>
              <strong>{room.nickname}</strong> 님<br />
              채팅방 ID: {room.chatroomid}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DMList;
