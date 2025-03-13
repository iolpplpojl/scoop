import { useState } from "react";
import { ClickContainer } from "../component/ClickContainer";
import "../Main.css";
import { FriendsContainer } from "../component/FriendsContainer";
import { RequestFriends } from "../component/RequestFriends";
import AddFriend from "../component/AddFriend";
import { useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const pathSegments = location.pathname.split('/'); // 현재 경로를 분할
  if(pathSegments[2] !== undefined && pathSegments[2] !== "@me"){
    return (
      <div className="scroll">
        <FriendsContainer />
        <button onClick={() => setIsPopupOpen(true)}>친구 추가</button>
        {isPopupOpen && <AddFriend onClose={() => setIsPopupOpen(false)} />}
        <RequestFriends />
        <ClickContainer name="test" channel="1"></ClickContainer>
        <ClickContainer name="test2" channel="2"></ClickContainer>
      </div>
    );
  }
}
