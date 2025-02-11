import { Link } from "react-router-dom";



 
export function ClickContainer(props){
    return(
        <div class="ClickCont">
            <Link to={`channel/${props.channel}`}>{props.name}</Link>
        </div>
    )
}