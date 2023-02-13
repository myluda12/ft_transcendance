
import React, { useEffect } from "react";
import { ChatData } from "../../../context/ChatUserContext";


export const Message = (props: any) => {
    let sender = props.message.sender;
    let messagecontent = props.message.messagecontent;
    let profile = props.message.profile;
    let owner = (sender == ChatData.userName) ? 'owner' : '';
    let classname = 'message ' + owner;


    if (ChatData.blockedusers.indexOf(sender) > -1){
        messagecontent = 'HIDDEN CONTENT';
        sender = 'HIDDEN';
        profile = 'blocked.png'
    }
    

    useEffect(() =>{
        
        
    }, [])

    return (
        <div className= {classname}>
            <div className="messageinfo">
                <img src={profile} alt="" />
                <p>{sender}</p>
            </div>
            <div className="messagecontent">
                <p> {messagecontent} </p>
            </div>
        </div>





    );
}