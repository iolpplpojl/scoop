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
            const res = await fetch(`https://${REST}/api/isfriend?userId=${id}&myId=${loggedInUserId}`);
            const data = await res.json();
            setIsFriend(data && (data.state === true || data.state === 1));
        } catch (err) {
            console.error("친구 상태 확인 실패", err);
            setIsFriend(false);
        }

        setShowMenu(true);
    }

    // 함수 전달
    useEffect(() => {
        if (setHandleContextMenu) {
            setHandleContextMenu(() => handleContextMenu);
        }
    }, [setHandleContextMenu]);

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

    function closeMenu() {
        setShowMenu(false);
        setSelectedUserId(null);
        setIsFriend(null);
    }

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
                    }}
                >
                    <button onClick={() => alert("정보보기")}>정보보기</button>
                    {isFriend ? (
                        <>
                            <button onClick={() => alert("1:1 채팅하기")}>1:1 채팅</button>
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
