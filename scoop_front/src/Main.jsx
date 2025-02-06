import { useEffect, useState } from "react";
import { ClickContainer } from "./component/ClickContainer";
import "./Main.css"
import { Outlet } from 'react-router-dom';
import { Sidebar } from "./tool/Sidebar";
import { useWebSocket } from "./Connector";

function Main() {
   const [init, setInit]  = useState(false);
  const isLoggedin = useWebSocket();
    return (
      <div className="App">
        <Sidebar></Sidebar>
        <Outlet/>
      </div>
    );
  }
  
  export default Main;
  