import React, { useState } from "react";
import { Room } from "./Room";
import io from 'socket.io-client';
import { Currentsocket } from "../../../context/ChatUserContext";




export const Rooms = (props: any) => {
   



    
    return (
        <div className="rooms">
            <div className="container">
                {props.rooms.map((room: any) => (
                    <Room room={room} key={room.id}/>
                ))}
            </div>
        </div>
    );
}