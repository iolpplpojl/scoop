import { useState } from "react";
import FriendsContainer from "./FriendsContainer";
import AddFriend from "./AddFriend";
import RequestFriends from "./RequestFriends";

const FriendButtonContainer = () => {
  const [activeTab, setActiveTab] = useState("friends"); // 기본값: 친구 목록

  return (
    <div>
      {/* 탭 버튼 */}
      <div>
        <button className="tab-btn" onClick={() => setActiveTab("friends")}>
          친구 목록
        </button>
        <button className="tab-btn" onClick={() => setActiveTab("add")}>
          친구 추가
        </button>
        <button className="tab-btn" onClick={() => setActiveTab("requests")}>
          요청 목록
        </button>
      </div>


      {/* 선택된 탭에 따라 렌더링 */}
      <div>
        {activeTab === "friends" && <FriendsContainer />}
        {activeTab === "add" && <AddFriend />}
        {activeTab === "requests" && <RequestFriends />}
      </div>
    </div>
  );
};

export default FriendButtonContainer;
