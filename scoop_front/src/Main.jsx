import { useEffect, useState } from "react";
import { ClickContainer } from "./component/ClickContainer";
import "./Main.css"
import { Outlet } from 'react-router-dom';
import { Sidebar } from "./tool/Sidebar";
import { useWebSocket } from "./Connector";
import { Chat } from "./objects/chat";
import { ServerContainer } from "./component/ServerContainer";

function Main() {
   const [init, setInit]  = useState(false);
    return (
      <div className="App">
        <ServerContainer></ServerContainer>
        <Outlet/>
      </div>
    );
  }
  
  export default Main;
  