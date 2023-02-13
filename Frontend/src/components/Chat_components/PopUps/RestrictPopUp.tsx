import React, { useState } from "react";
import { ChatData, Currentsocket } from "../../../context/ChatUserContext";

enum RESTRICTION {
    BAN = 'BAN',
    KICK = 'KICK',
    MUTE = 'MUTE',
}

enum MUTEDURATION {
    FIFTEENSEC = 30000,
    FIVEMIN = 300000,
    ONEHOUR = 3600000,
}

export const RestrictPopUp = (props: any) => {


    const [restriction, setRestriction] = useState(RESTRICTION.BAN);
    const [username, setUserName] = useState('');
    const [duration, setduration] = useState(MUTEDURATION.FIFTEENSEC);


    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (!username)
            return ;
        const sentpayload = {
            roomid: ChatData.activeRoomId,
            username: username,
            restriction: restriction,
            duration: duration,
        }

        Currentsocket.emit('updaterestriction', sentpayload);
        props.hidepopup();
    }

    return (
        <div className="RestrictuserPopUp PopUp">
            <form onSubmit={handleSubmit} className="container">
                <h1> Restrict Member </h1>
                <input type="text" name="" id="" placeholder="username" onChange={(e) => setUserName(e.target.value)}/>
                <div className="access ">
                    <div className="selection"> <p>BAN?</p> <input type="radio" value="BAN" name="Restriction" onClick={() => setRestriction(RESTRICTION.BAN)} defaultChecked /> </div>
                    <div className="selection"> <p>KICK?</p> <input type="radio" value="KICK" name="Restriction" onClick={() => setRestriction(RESTRICTION.KICK)} /> </div>
                    <div className="selection"> <p>MUTE?</p> <input type="radio" value="MUTE" name="Restriction" onClick={() => setRestriction(RESTRICTION.MUTE)} /> </div>
                </div>

                {(restriction == RESTRICTION.MUTE) &&  
                <div className="access ">
                    <h1> Mute  duration :</h1>
                    <div className="selection"> <p>15 Seconds</p> <input type="radio" value="15 sec" name="Duration" onClick={() => setduration(MUTEDURATION.FIFTEENSEC)} defaultChecked /> </div>
                    <div className="selection"> <p>5 Minutes</p> <input type="radio" value="5 min" name="Duration" onClick={() => setduration(MUTEDURATION.FIVEMIN)} /> </div>
                    <div className="selection"> <p>1 Hour</p> <input type="radio" value="1 hour" name="Duration" onClick={() => setduration(MUTEDURATION.ONEHOUR)} /> </div>
                </div>}
                <button type="submit">Yes</button>
            </form>
            <div className="overlay" onClick={props.hidepopup}></div>
        </div>
    );
}