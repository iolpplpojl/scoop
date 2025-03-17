export async function deleteFriend(userId, loggedInUserId) {
    const REST = process.env.REACT_APP_RESTURL;
    if (!userId || !loggedInUserId) {
        console.error("유효하지 않은 사용자 ID");
        return;
    }

    try {
        const response = await fetch(`https://${REST}/api/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                myId: loggedInUserId
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("친구 삭제 완료" + (data.message));
        } else {
            alert("친구 삭제 실패: " + (data.message || "알 수 없는 오류"));
        }
    } catch (error) {
        console.error("친구 삭제 중 오류 발생:", error);
        alert("친구 삭제 중 오류 발생");
    }
}