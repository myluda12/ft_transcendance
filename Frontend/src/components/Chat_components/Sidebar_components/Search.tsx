import React, { useState } from "react";


export const Search = () => {
    const [roomName, setRoomName] = useState("" );

    const handleSearch = () => {

    }

    const handleKey = (e: React.KeyboardEvent) => {
        // if (e.code === 'Enter' && roomName)
        //     console.log(roomName);
    }
    return (
        <div className="search">
            <div className="searchform">
                <input type="text" placeholder="Search" onKeyDown={handleKey} onChange={ e => {setRoomName(e.target.value);}}/>
            </div>
        </div>
    );
}