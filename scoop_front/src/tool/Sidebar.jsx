import { useEffect, useState } from "react";
import { ClickContainer } from "../component/ClickContainer";
import "../Main.css"
import { Connector } from "../Connector";
import { FriendsContainer } from "../component/FriendsContainer";

export function Sidebar() {
   const [init, setInit]  = useState(false);

    
    return (
        <div class="scroll">
            <FriendsContainer />
            <ClickContainer name="test" channel="A"></ClickContainer>
            <ClickContainer name="test2" channel="B"></ClickContainer>
        </div>
    );
  }