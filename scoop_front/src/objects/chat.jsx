import { useState, useEffect } from "react";
import { getSubFromLoginToken } from "../util/GetSubByLogintoken";
import { addFriend } from "../component/AddFriend";
import { deleteFriend } from "../util/DeleteFriend";
import RightClickContainer from "../component/RightClickContainer";

export function Chat({ name, text, date, userId }) {
    const REST = process.env.REACT_APP_RESTURL;
    const [isFriend, setIsFriend] = useState(null);
    const loggedInUserId = getSubFromLoginToken();

    useEffect(() => {
        if (!userId || !loggedInUserId || userId === loggedInUserId) return;
        fetch(`https://${REST}/api/isfriend?userId=${userId}&myId=${loggedInUserId}`)
            .then(response => response.json())
            .then(data => setIsFriend(data && (data.state === true || data.state === 1)))
            .catch(() => setIsFriend(false));
    }, [userId, loggedInUserId]);

    return (
        <RightClickContainer 
            userId={userId} 
            loggedInUserId={loggedInUserId} 
            isFriend={isFriend} 
            addFriend={addFriend} 
            deleteFriend={deleteFriend}
        >
            <li className="chatmessage">
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
