import { useState } from "react";
import FriendButtonContainer from "../component/FriendButtonContainer";

const Me = () => {
  const [activeComponent, setActiveComponent] = useState("friends"); 

  return (
    <>
      <div className="scroll">
        <button onClick={() => setActiveComponent("friends")}>친구</button>
        <button onClick={() => setActiveComponent("other1")}>다른 기능 1</button>
      </div>

      {/* 친구 버튼을 눌렀을 때만 FriendButtonContainer가 따로 렌더링 */}
      {activeComponent === "friends" && <FriendButtonContainer />}
    </>
  );
};

export default Me;
