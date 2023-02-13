import { current } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { ChatData, Currentsocket } from "../../context/ChatUserContext";

import { ChatHeader } from "./Chat_window/ChatHeader";
import { Input } from "./Chat_window/Input";
import { Messages } from "./Chat_window/Messages";





export const Chat = () => {
    const [messages, setMessages] = useState<any>([]);


    const [isactivate, setIsActivate] = useState(false);
    let activate = false;




    const addMessage = (message: any) => { setMessages([...messages, message]); };
    

    Currentsocket.on('messagerecieve', (payload: any) => {
        //let newmesg = { sender: ChatData.userName, messagecontent: message, profile: ChatData.profile };
        addMessage(payload);
    })

    Currentsocket.on('roomenter', (payload: any) => {

        ChatData.activeRoomId = payload.room.id;
        ChatData.activeRoomName = payload.room.name;
        ChatData.activeRoomType = payload.room.type; 
        ChatData.activeRoomRole = payload.room.role;
        setMessages(payload.messages);
        setIsActivate(true);
        activate = true;
       // setMessages([...messages, message]);
    });

    Currentsocket.on('chatclear', () => {
        ChatData.activeRoomId = '';
        ChatData.activeRoomName = '';
        ChatData.activeRoomType = ''; 
        ChatData.activeRoomRole = '';
        setMessages([]);
        setIsActivate(false);
        activate = false;
    })

   


    return (
        <div className="chat">
                    <ChatHeader />
                    <Messages messages={messages}/>
            {isactivate && 
                    <>
                    <Input addMessage={addMessage}/>
                    </>
            }
        </div>
    );
}







{/* <div className="chatbar">
<div className="roominfo">
    <img src="https://api.multiavatar.com/BinBond.png" alt="room profile" />
    <span>Room Name</span>
</div>
<div className="roomactions">
    <img src="add.png" alt="add user" />
    <img src="add.png" alt="restrict user" />
    <img src="add.png" alt="leave user" />
</div>
</div> */}