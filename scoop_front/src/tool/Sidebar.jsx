import { useEffect, useState } from "react";
import { ClickContainer } from "../component/ClickContainer";
import "../Main.css"
import { Connector } from "../Connector";

export function Sidebar() {
   const [init, setInit]  = useState(false);

    
    return (
        <div class="scroll">
            <ClickContainer name="test" channel="A"></ClickContainer>
            <ClickContainer name="test2" channel="B"></ClickContainer>
        </div>
    );
  }
  
  