import { useState, useRef, useEffect } from "react";

const RightClickContainer = ({
  userId,
  loggedInUserId,
  addFriend,
  deleteFriend,
  children,
  setHandleContextMenu,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isFriend, setIsFriend] = useState(null);
  const menuRef = useRef(null);
  const REST = process.env.REACT_APP_RESTURL;

  // 우클릭 이벤트 핸들러
  async function handleContextMenu(event, id) {
    if (String(id) === String(loggedInUserId)) return;

    event.preventDefault();
    setSelectedUserId(id);
    setMenuPosition({ x: event.pageX, y: event.pageY });

    try {
      const res = await fetch(
        `https://${REST}/api/isfriend?userId=${id}&myId=${loggedInUserId}`
      );
      const data = await res.json();
      setIsFriend(data && (data.state === true || data.state === 1));
    } catch (err) {
      console.error("친구 상태 확인 실패", err);
      setIsFriend(false);
    }

    setShowMenu(true);
  }

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 우클릭 핸들러 외부로 전달
  useEffect(() => {
    if (setHandleContextMenu) {
      setHandleContextMenu(() => handleContextMenu);
    }
  }, [setHandleContextMenu]);

  function closeMenu() {
    setShowMenu(false);
    setSelectedUserId(null);
    setIsFriend(null);
  }

  // ✅ 1:1 채팅 함수 분리
  const handleDirectMessage = async () => {
    try {
      const url = `https://${REST}/api/dm?id=${loggedInUserId}&to=${selectedUserId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: null, // ✅ @RequestParam은 body 필요 없음
      });
  
      if (!res.ok) {
        throw new Error(`서버 응답 에러: ${res.status}`);
      }
  
      const data = await res.json();
      const chatroomId = data.chatroomId || data;
  
      if (!chatroomId) {
        alert("채팅방 ID를 찾을 수 없습니다.");
        return;
      }
  
      window.location.href = `/channel/@me/${chatroomId}`;
    } catch (err) {
      console.error("❌ 채팅방 이동 실패:", err);
      alert("1:1 채팅을 시작할 수 없습니다.");
    } finally {
      closeMenu();
    }
  };

  return (
    <div style={{ display: "inline-block", width: "100%" }}>
      {children}

      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: menuPosition.y,
            left: menuPosition.x,
            background: "#fff",
            border: "1px solid #ccc",
            padding: "5px",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            zIndex: 999,
          }}
        >
          <button onClick={() => alert("정보보기")}>정보보기</button>
          <button onClick={handleDirectMessage}>1:1 채팅</button>
          {isFriend ? (
            <>

              <button
                onClick={async () => {
                  await deleteFriend(selectedUserId, loggedInUserId);
                  closeMenu();
                }}
              >
                친구 삭제
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                addFriend(selectedUserId);
                closeMenu();
              }}
            >
              친구 추가
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RightClickContainer;
