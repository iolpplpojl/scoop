import { useState } from "react";
import FriendButtonContainer from "../component/FriendButtonContainer";
import DMList from "../component/DmList";

const Me = () => {
  const [activeComponent, setActiveComponent] = useState("friends");

  return (
    <>
      <div className="scroll">
        <button onClick={() => setActiveComponent("friends")}>친구</button>
        <button onClick={() => setActiveComponent("other1")}>다른 기능1</button>
      </div>

      {activeComponent === "friends" && <FriendButtonContainer />}
      {activeComponent === "other1" && <DMList />}
    </>
  );
};

export default Me;
