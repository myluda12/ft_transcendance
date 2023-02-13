import React, { useState } from "react";
import { ChatData, Currentsocket } from "../../../context/ChatUserContext";

export const RolePopUp = (props: any) => {
    const [role, setRole] = useState('MEMBER');
    const [username, setUserName] = useState('');

    const handleSubmit = (event: any) =>{

        const sentpayload={
            roomid : ChatData.activeRoomId,
            username: username,
            role: role,
        }

        Currentsocket.emit('updaterole', sentpayload);
        event.preventDefault();
        props.hidepopup();
    }
    return (
        <div className="rolePopUp PopUp">
            <form onSubmit={handleSubmit} className="container">
                <h1>Update Role</h1>
                <input type="text" name="" id="" placeholder="Username" onChange={(e) => setUserName(e.target.value)} />
                <div className="access role">
                    <div className="selection"> <p>as Member</p> <input type="radio" value="MEMBER" name="ACCESS" onClick={() => setRole('MEMBER')} defaultChecked /> </div>
                    <div className="selection"> <p>as Admin</p> <input type="radio" value="ADMIN" name="ACCESS" onClick={() => setRole('ADMIN')} /> </div>
                </div>
                <button type="submit">Yes</button>
            </form>
            <div className="overlay" onClick={props.hidepopup}></div>
        </div>
    );
}