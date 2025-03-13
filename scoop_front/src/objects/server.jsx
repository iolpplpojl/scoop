import { Link, useLocation } from "react-router-dom";



export function Server(props){
    const location = useLocation();
    const pathSegments = location.pathname.split('/'); // 현재 경로를 분할
    const image1 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH6kvtX1b922cEAcqF1ADVF-io_4ZPHLVKow&s";
    const image2 = "https://cdn-icons-png.flaticon.com/512/6522/6522516.png"

    
    return(
        <li  className="serverpop">
                        <Link to={`/channel/${props.server}`}>
                            <img src={props.server == "@me" ? image1 : image2} width={85}height={85} ></img>
                        </Link>
        </li>    
        
    )
}