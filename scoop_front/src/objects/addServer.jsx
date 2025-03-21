import { Link, useLocation } from "react-router-dom";

export function AddServer(props){
    const location = useLocation();
    const pathSegments = location.pathname.split('/'); // 현재 경로를 분할
    function handle(){
        alert("서버 추가 이벤트");
    }
    return(
        <li  className="serverpop" onClick={handle}>
            <img src="https://img.icons8.com/ios7/512/plus.png" width={85}height={85} ></img>
        </li>            
    )
}