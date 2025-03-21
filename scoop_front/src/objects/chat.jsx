import { useState } from "react";
import { getSubFromLoginToken } from "../util/GetSubByLogintoken";
import { addFriend } from "../component/AddFriend";
import { deleteFriend } from "../util/DeleteFriend";
import RightClickContainer from "../component/RightClickContainer";

export function Chat({ name, text, date, userId }) {
    const loggedInUserId = getSubFromLoginToken();
    const [handleContextMenu, setHandleContextMenu] = useState(null);

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
                <b>{name}</b> : {text} <span>{date}</span>
            </li>
        </RightClickContainer>
    );
}
