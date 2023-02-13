import React, { useState } from "react";
import { AddRoomPopUp } from "../PopUps/AddRoomPopUp";


export const CreateRoom = () => {
    const [createRoomPopUp, setPopUp] = useState(false)

    const showpopup = () => {
        setPopUp(true);
    };

    const hidepopup = () => {
        setPopUp(false);
    };

    return (
        <div className="createroom">
            <img
                src="add.png"
                alt="Create Room"
                onClick={showpopup}>
            </img>
            {createRoomPopUp && <AddRoomPopUp hidepopup={hidepopup}/>}
        </div>
    );
}