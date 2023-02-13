import React, { useEffect, useState } from "react";
import { Currentsocket } from "../../../context/ChatUserContext";

enum ACCESS {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    PROTECTED = 'PROTECTED',
    DM = 'DM'
}



export const AddRoomPopUp = (props: any) => {

    const [name, setName] = useState('');
    const [access, setAccess] = useState('PUBLIC');
    const [showPassField, setShowPassField] = useState(false);
    const [password, setPassword] = useState('');

    const handleAccess = (accesstype: string) => {
        accesstype == ACCESS.PROTECTED ? setShowPassField(true) : setShowPassField(false);
        setAccess(accesstype);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (name == '' || (password == '' && access == ACCESS.PROTECTED)) {
           
            return;
        }


        Currentsocket.emit('createroom', { name: name, access: access, password: password });
        setName('');

        // 👇️ clear all input values in the form
        event.target.reset();
        props.hidepopup();
    };

    return (
        <div className="addroompopup PopUp">
            <form onSubmit={handleSubmit} className="container">
                <h1>Create New Room</h1>
                <input type="text" name="" id="" placeholder="Room name" onChange={(e) => setName(e.target.value)} />
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