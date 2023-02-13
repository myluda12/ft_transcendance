import React, { useState } from "react";
import { Currentsocket } from "../../context/ChatUserContext";

import { CreateRoom } from "./Sidebar_components/CreateRoom";
import { Rooms } from "./Sidebar_components/Rooms";
import { Search } from "./Sidebar_components/Search";




export const SideBar = () => {
    const [rooms, setRooms] = useState<any>([]);

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    Currentsocket.on('roomcreate', (payload: any) => {
        setRooms([payload.payload.room, ...rooms]);
    })
    .on('roomsupdate', async (payload: any) => {
        await timeout(300);
        setRooms(payload.payload.rooms)
    })
    .on('requestroomsupdate', () => {
        Currentsocket.emit('updaterooms');
    })

    return (
        <div className="sidebar">
            <CreateRoom/>
            {/* <Search/> */}
            <Rooms rooms={rooms}/>
        </div>
    );
}