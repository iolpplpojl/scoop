import { useState, useRef, useEffect } from "react";

const RightClickContainer = ({ 
    children, 
    userId, 
    loggedInUserId, 
    isFriend, 
    addFriend, 
    deleteFriend 
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);

    // **오른쪽 클릭 이벤트 핸들러**
    function handleContextMenu(event) {
        event.preventDefault();
        if (String(userId) === String(loggedInUserId)) return;
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setShowMenu(true);
    }

    // **메뉴 닫기 핸들러**
    function closeMenu() {
        setShowMenu(false);
    }

    // **외부 클릭 시 메뉴 닫기**
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

    return (
        <div onContextMenu={handleContextMenu} style={{ display: "inline-block", width: "100%" }}>
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
                        boxShadow: "2px 2px 5px rgba(0,0,0,0.2)"
                    }}
                >
                    <button onClick={() => alert("정보보기")}>정보보기</button>
                    {isFriend ? (
                        <>
                            <button onClick={() => alert("1:1 채팅하기")}>1:1 채팅</button>
                            <button onClick={async () => {
                                await deleteFriend(userId, loggedInUserId);
                                closeMenu();
                            }}>
                                친구 삭제
                            </button>
                        </>
                    ) : (
                        <button onClick={() => {
                            addFriend(userId);
                            closeMenu();
                        }}>
                            친구 추가
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default RightClickContainer;
