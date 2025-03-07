import { useState } from "react";
import { ClickContainer } from "../component/ClickContainer";
import "../Main.css";
import { FriendsContainer } from "../component/FriendsContainer";
import AddFriend from "../component/AddFriend";

export function Sidebar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="scroll">
      <FriendsContainer />
      <ClickContainer name="test" channel="A"></ClickContainer>
      <ClickContainer name="test2" channel="B"></ClickContainer>

      <button onClick={() => setIsPopupOpen(true)}>친구 추가</button>
      {isPopupOpen && <AddFriend onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
}
