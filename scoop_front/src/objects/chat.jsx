


export function Chat(props){
    function handleClick() {
        alert(props.name);
    }
    return(
        <li onClick={handleClick} className="chatmessage">
            <img src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png" width={50}height={50} ></img>
            <b>{props.name}</b> : {props.text}
        </li>
    )
}