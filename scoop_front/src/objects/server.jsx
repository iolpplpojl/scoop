import { Link, useLocation } from "react-router-dom";



export function Server(props){
    const location = useLocation();
    const pathSegments = location.pathname.split('/'); // 현재 경로를 분할
    return(
        <li  className="serverpop">
                        <Link to={`/channel/${props.server}`}>
                            <img src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png" width={85}height={85} ></img>
                        </Link>

        </li>    
        
    )
}