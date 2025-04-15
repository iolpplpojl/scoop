import { useContext, useEffect, useState } from "react";
import { Server } from "../objects/server";
import { AddServer } from "../objects/addServer";
import { Sidebar } from "../tool/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../Connector";
import { FriendsContainer } from "./FriendsContainer";
import Me from "../objects/Me";

export function ServerContainer() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isServerSelected,setIsServerSeleceted] = useState(false);
    const {server} = useParams();
    const {getServerByChannel,serverQueue,wsConnected,getServerByUser,roomQueue,accessToken} = useContext(Context);
    const [seed, setSeed] = useState("");
    const nav = useNavigate();

    useEffect(()=>{
      if(wsConnected){
        if(!server){
          nav("channel/@me");
        }
        if(server != "@me"){
          getServerByChannel(server);
          console.log(server + "asdf1234567");
        }
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
                {roomQueue? 
                roomQueue.map(element => (
                  <Server server={element.serverID}></Server>
                )) : null}
                <AddServer reset={getServerByUser} token={accessToken}></AddServer>
            </ul>
        </div>
      </div>
            { (server && server != "@me")? <Sidebar server={serverQueue[server]} seed={seed} wsConnected={wsConnected} id={server} getServer={getServerByChannel}></Sidebar> 
            :  <Me></Me>}
      </div>  

    );
  }
  