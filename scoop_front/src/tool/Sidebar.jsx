import { useEffect, useState } from "react";
import { ClickContainer } from "../component/ClickContainer";
import "../Main.css"
import { Connector } from "../Connector";

export function Sidebar() {
   const [init, setInit]  = useState(false);

    
    return (
        <div class="scroll">
            <ClickContainer name="test" channel="channel/11234213331232"></ClickContainer>
            <ClickContainer name="test2" channel="channel/sdsad"></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/sdsad  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/sdsad  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/sdsad  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
            <ClickContainer name="test3" channel="channel/12321412  "></ClickContainer>
        </div>
    );
  }
  
  