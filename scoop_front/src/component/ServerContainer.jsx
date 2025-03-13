import { useState } from "react";
import { Server } from "../objects/server";
import { AddServer } from "../objects/addServer";
import { Sidebar } from "../tool/Sidebar";

export function ServerContainer() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isServerSelected,setIsServerSeleceted] = useState(false);
  
    return (
      <div className="scroll serverlist">
        <div>
            <ul className="server">
                <Server server="@me"></Server>
                <Server server="1"></Server>
                <Server server="2"></Server>
                <AddServer></AddServer>
            </ul>
        </div>
      </div>
      
    );
  }
  