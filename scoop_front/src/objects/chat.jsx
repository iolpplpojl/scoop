import { useState, useRef, useEffect } from "react";
import { getSubFromLoginToken } from "../util/GetSubByLogintoken";
import { addFriend } from "../component/AddFriend";
import { deleteFriend } from "../util/DeleteFriend";

export function Chat(props) {
    const REST = process.env.REACT_APP_RESTURL;
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isFriend, setIsFriend] = useState(null); // 친구 여부
    const menuRef = useRef(null);

    const userId = props.userId; // 채팅창 유저의 identifyCode
    const loggedInUserId = getSubFromLoginToken(); // 로그인한 사용자의 identifyCode

    // 친구 여부 확인 API 호출 (자기 자신이면 요청 안 보냄)
    useEffect(() => {
        if (!userId || !loggedInUserId || String(userId) === String(loggedInUserId)) return;
        fetch(`https://${REST}/api/isfriend?userId=${userId}&myId=${loggedInUserId}`)
            .then(response => response.json())
            .then(data => {
                if (data && (data.state === true || data.state === 1)) {
                    setIsFriend(true);
                } else {
                    setIsFriend(false);
                }
            })
            .catch(() => setIsFriend(false));
    }, [userId, loggedInUserId]);

    function handleContextMenu(event) {
        event.preventDefault();
        if (String(userId) === String(loggedInUserId)) return;
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setShowMenu(true);
    }

    function closeMenu() {
        setShowMenu(false);
    }

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
        <>
            <li onContextMenu={handleContextMenu} className="chatmessage">
                <img src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png" width={50} height={50} alt="Profile" />
                <b>{props.name}</b> : {props.text} <span>{props.date}</span>
            </li>

            {showMenu && (
                <div ref={menuRef} style={{ position: "absolute", top: menuPosition.y, left: menuPosition.x }}>
                    <button onClick={() => alert("정보보기")}>정보보기</button>
                    {isFriend ? (
                        <>
                            <button onClick={() => alert("1:1 채팅하기")}>1:1 채팅</button>
                            <button onClick={async () => {
                                await deleteFriend(props.userId, loggedInUserId);
                                setIsFriend(false); // 친구 상태 갱신
                            }}>
                                친구 삭제
                            </button>

                        </>
                    ) : (
                        <button onClick={() => addFriend(props.userId)}>친구 추가</button>
                    )}
                </div>
            )}
        </>
    );
}
