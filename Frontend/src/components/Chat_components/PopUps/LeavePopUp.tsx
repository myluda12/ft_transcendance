import React from "react";
import { ChatData, Currentsocket } from "../../../context/ChatUserContext";

export const LeavePopUp = (props: any) => {

    const handlesubmit = () => {

        const sentpayload = {
            roomid: ChatData.activeRoomId
        }
        Currentsocket.emit('leave', sentpayload);


       

        props.hidepopup();
    }
    return (
        <div className="leavepopup PopUp">
            <div className="container">
                <h1>Do you want to leave the room?</h1>
                <button onClick={handlesubmit}>Yes</button>
            </div>
        <div className="overlay" onClick={props.hidepopup}></div>
        </div>
    );
}