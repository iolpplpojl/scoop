import { useState } from "react";
import FriendButtonContainer from "../component/FriendButtonContainer";
import DMList from "../component/DmList";

const Me = () => {
  const [activeComponent, setActiveComponent] = useState("friends");

  return (
    <>
      <div className="scroll">
        <button
          className={`tab-btn ${activeComponent === "friends" ? "active" : ""}`}
          onClick={() => setActiveComponent("friends")}
        >
          친구
        </button>
        <button
          className={`tab-btn ${activeComponent === "other1" ? "active" : ""}`}
          onClick={() => setActiveComponent("other1")}
        >
          내 DM 목록
        </button>
      </div>

      {activeComponent === "friends" && <FriendButtonContainer />}
      {activeComponent === "other1" && <DMList />}
    </>
  );
};

export default Me;
