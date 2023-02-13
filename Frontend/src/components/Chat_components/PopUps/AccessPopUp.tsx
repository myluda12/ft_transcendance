import React, { useState } from "react";
import { ChatData, Currentsocket } from "../../../context/ChatUserContext";
enum ACCESS {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    PROTECTED = 'PROTECTED',
    DM = 'DM'
}
export const AccessPopUp = (props: any) => {
    const [newaccess, setNewAccess] = useState('PUBLIC');
    const [showPassField, setShowPassField] = useState(false);
    const [password, setPassword] = useState('');


    const handleAccess = (accesstype: string) => {
        accesstype == ACCESS.PROTECTED ? setShowPassField(true) : setShowPassField(false);
        setNewAccess(accesstype);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (password == '' && newaccess == ACCESS.PROTECTED)
        {
           //console.log('ERRROR ASSI');
        }
        else{
            const sentpayload = {
                roomid: ChatData.activeRoomId,
                access: newaccess,
                password: password,
            }
            Currentsocket.emit('updateaccess', sentpayload);
            props.hidepopup();
        }
    }
    return (
        <div className="notificationPopUp PopUp">
            <form onSubmit={handleSubmit} className="container">
                <h1> Update Access Type</h1>
                <div className="access ">
                    <div className="selection"> <p>Public</p> <input type="radio" value="PUBLIC" name="ACCESS" onClick={() => handleAccess(ACCESS.PUBLIC)} defaultChecked /> </div>
                    <div className="selection"> <p>Private</p> <input type="radio" value="PRIVATE" name="ACCESS" onClick={() => handleAccess(ACCESS.PRIVATE)} /> </div>
                    <div className="selection"> <p>Protected</p> <input type="radio" value="PROTECTED" name="ACCESS" onClick={() => handleAccess(ACCESS.PROTECTED)} /> </div>
                </div>
                <div className="password">
                    {showPassField && <input type="text" name="" id="" placeholder="Room password" onChange={(e) => setPassword(e.target.value)} />}
                </div>
                <button type="submit">Submit</button>
            </form>
            <div className="overlay" onClick={props.hidepopup}></div>
        </div>
    );
}