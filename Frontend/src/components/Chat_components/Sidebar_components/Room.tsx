import React, { useState } from "react";
import { ChatData, Currentsocket } from "../../../context/ChatUserContext";
import { JoinPopUp } from "../PopUps/JoinPopUp";
interface IRoomInfo {
    profile: string;
    roomname: string;
    lastmessage: string;
}

export const Room = (props: any) => {
    const [joined, setJoined] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [opened, setOpened] = useState(false);

    const roominfo = {
        profile: '',//props.room.profile,
        roomname: props.room.name,
        lastmessage: props.room.lastmessage,
        lastmessagedate: '',
        id: props.room.id,
        type: props.room.type,
        joined: props.room.joined,
        password: '',
    }

    switch (roominfo.type) {
        case "PROTECTED":
            roominfo.profile = 'https://ui-avatars.com/api/?name=' + roominfo.roomname + '&background=EB6144&color=EB6144&font-size=0.5'
            break;
        case "PRIVATE":
            roominfo.profile = 'https://ui-avatars.com/api/?name=' + roominfo.roomname + '&background=3E72EB&color=3E72EB&font-size=0.5'
            break;
        case "PUBLIC":
            roominfo.profile = 'https://ui-avatars.com/api/?name=' + roominfo.roomname + '&background=A2EB26&color=A2EB26&font-size=0.5'
            break;
        default:
            roominfo.profile = props.room.profile;
            break;
    }


    
    const handleOpenRoom = () => {
        if (!roominfo.joined)
            setShowJoin(true);
        else if (ChatData.activeRoomId != roominfo.id){
            Currentsocket.emit('enterroom', roominfo);
            // Currentsocket. //join("some room");
        }
        else {
            // retirve messages
        }
    }

    const hidepopup = () => { setShowJoin(false); }

    return (
        <>
            <div className="room" key={roominfo.id} onClick={handleOpenRoom}>
                <img src={roominfo.profile} alt="" />
                <div className="roominfo">
                    <span>{roominfo.roomname}</span>
                    <p>{roominfo.lastmessage}</p>
                </div>
            </div>
            {showJoin && <JoinPopUp hidepopup={hidepopup} room={roominfo}/>}
        </>
    );
}
//