import { useEffect, useInsertionEffect, useState } from "react";
import { ClickContainer } from "../component/ClickContainer";
import "../Main.css";
import { AddChannel } from "./AddChannel";


export function Sidebar(props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [channel, setChannel] = useState([]);
  useEffect(()=>{
    if(props.seed){
      console.log(props.server)
      props.server.forEach(element => {
        console.log(element);
      });
    }
  },[props.seed])


  return (
    <div>
    <div className="scroll">
      {props.server? 
      props.server.map(element => (
          <ClickContainer name={element.name} channel={element.id}></ClickContainer>
      )) : null}
      <button onClick={()=> setIsPopupOpen(!isPopupOpen)}>add</button>
      {isPopupOpen? <AddChannel server={props.id} getServer={props.getServer} isPopupOpen={setIsPopupOpen}></AddChannel> : null}
    </div>
    </div>
  );
}
