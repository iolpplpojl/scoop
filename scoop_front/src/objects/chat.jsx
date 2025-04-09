import { useEffect, useState } from "react";
import { getSubFromLoginToken } from "../util/GetSubByLogintoken";
import { addFriend } from "../component/AddFriend";
import { deleteFriend } from "../util/DeleteFriend";
import RightClickContainer from "../component/RightClickContainer";

export function Chat({ name, text, date, userId }) {
    const loggedInUserId = getSubFromLoginToken();
    const [handleContextMenu, setHandleContextMenu] = useState(null);
    const [finaltext,setFinalText] = useState("");



    useEffect(() => {
        // 정규식으로 <@userId> 패턴 찾기
        const regex = /<@([^>]+)>/g;
        const elements = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const beforeText = text.slice(lastIndex, match.index);
            if (beforeText) {
                elements.push(beforeText); // 매치 전 일반 텍스트
            }

            const userId = match[1];
            elements.push(
                <a
                    key={match.index}
                    href={`#`}    
                    style={{ color:'white',backgroundColor: 'slateblue', textDecoration: 'none' }}
                >
                    @{userId}
                </a>
            );

            lastIndex = regex.lastIndex;
        }

        // 남은 텍스트 추가
        const remainingText = text.slice(lastIndex);
        if (remainingText) {
            elements.push(remainingText);
        }

        setFinalText(elements);
    }, [text]);

    return (
        <RightClickContainer
            userId={userId}
            loggedInUserId={loggedInUserId}
            addFriend={addFriend}
            deleteFriend={deleteFriend}
            setHandleContextMenu={setHandleContextMenu}
        >
            <li
                className="chatmessage"
                onContextMenu={(e) => handleContextMenu && handleContextMenu(e, userId)}
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
                    width={50}
                    height={50}
                    alt="Profile"
                />
                <b>{name}</b> : {finaltext} <span>{date}</span>
            </li>
        </RightClickContainer>
    );
}
