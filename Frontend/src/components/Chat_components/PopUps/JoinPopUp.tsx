import React, { useEffect, useState } from "react";
import { Currentsocket } from "../../../context/ChatUserContext";




export const JoinPopUp = (props: any) => {
    const [showPassField, setShowPassField] = useState(false);
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    let roomPassword = '';
    let roomAccess = '';
    useEffect(() => {
       
        setName(props.room.roomname);
        if (props.room.type == 'PROTECTED')
            setShowPassField(true);
    }, [])

    const handleSubmit = () => {
        if (props.room.access == 'PROTECTED' && password == '') {
            return;
        }
        props.room.password = password;
        Currentsocket.emit('joinroom', props.room);
        props.hidepopup();
    }

    return (
        <div className="joinpopup PopUp">
            <div className="container">
                <h1>Do you want to join {name}?</h1>
                {showPassField && <input type="text" name="" id="" placeholder="Room password" onChange={(e) => setPassword(e.target.value)} />}
                <button onClick={handleSubmit} >Join</button>
            </div>
            <div className="overlay" onClick={props.hidepopup}></div>
        </div>
    );
}

// type="submit"

// onSubmit={handleSubmit}