import { Link, useLocation } from "react-router-dom";



 
export function ClickContainer(props){
    const location = useLocation();
    const pathSegments = location.pathname.split('/'); // 현재 경로를 분할
    return(
        <div class="ClickCont">
            <Link to={`/channel/${pathSegments[2]}/${props.channel}`}>{props.name}</Link>
        </div>
    )
}