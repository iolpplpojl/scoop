import { useContext, useEffect, useState } from "react";
import { Server } from "../objects/server";
import { AddServer } from "../objects/addServer";
import { Sidebar } from "../tool/Sidebar";
import { useParams } from "react-router-dom";
import { Context } from "../Connector";

export function ServerContainer() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isServerSelected,setIsServerSeleceted] = useState(false);
    const {server} = useParams();
    const {getServerByChannel,serverQueue,wsConnected} = useContext(Context);
    const [seed, setSeed] = useState("");
    
    useEffect(()=>{
      if(wsConnected){
        getServerByChannel(server);
        console.log(server + "asdf1234567");
      }
    },[server,wsConnected])

    useEffect(()=>{
      if(wsConnected){
        console.log("seed asdf 서버")
        setSeed(server);
      }
    },[serverQueue])
    return (
      <div className="App"> 
      <div className="scroll serverlist">
        <div>
            <ul className="server">
                <Server server="@me"></Server>
                <Server server="1"></Server>
                <Server server="2"></Server>
                <Server server="3"></Server>
                <AddServer></AddServer>
            </ul>
        </div>
      </div>
            { (server && server != "@me")? <Sidebar server={serverQueue[server]} seed={seed} wsConnected={wsConnected}></Sidebar> :  null }

      </div>

    );
  }
  