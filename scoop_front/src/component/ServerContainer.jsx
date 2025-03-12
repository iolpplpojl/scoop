import { useState } from "react";
import { Server } from "../objects/server";
import { AddServer } from "../objects/addServer";

export function ServerContainer() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
  
    return (
      <div className="scroll serverlist">
        <div>
            <ul className="server">
                <Server server="1"></Server>
                <Server server="2"></Server>
                <AddServer></AddServer>
            </ul>
        </div>
      </div>
    );
  }
  