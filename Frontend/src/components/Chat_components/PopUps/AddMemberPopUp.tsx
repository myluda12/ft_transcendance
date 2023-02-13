import React, { useState } from "react";
import { ChatData, Currentsocket } from "../../../context/ChatUserContext";



export const AddMemberPopUp = (props: any)  => {
    const [name, setName] = useState('');


    const handleSubmit = (event: any) => { 
        event.preventDefault();
        if (name == '')
        {
            // console.log('ERRROR ASSI');
            return ;    
        }
        setName('');
        const sentpayload = {
            username: name,
            roomid: ChatData.activeRoomId,
        }
        Currentsocket.emit('invite', sentpayload);
        // 👇️ clear all input values in the form
        event.target.reset();
        props.hidepopup();
    };

    return (
        <div className="addroompopup PopUp">
            <form onSubmit={handleSubmit} className="container">
                <h1> Add Members </h1>
                <input type="text" name="" id="" placeholder="username" onChange={(e) => setName(e.target.value)}/>
                <button type="submit">Submit</button>
            </form>
        <div className="overlay" onClick={props.hidepopup}></div>
        </div>
    );
}