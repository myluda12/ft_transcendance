import React, { useEffect, useState } from "react";
import { ChatData } from "../../../context/ChatUserContext";
import { Message } from "./Message";


export const Messages = (props: any) => {
    let n: number = 0;
    // const [messages, setMessages] = useState([
    //     {sender: 'fibo', messagecontent: 'wash al3shir hani', profile: 'hgrissen.jpeg'},
    //     {sender: 'nizar', messagecontent: 'hmd o nta ?', profile: 'hgrissen.jpeg'},
    //     {sender: 'fibo', messagecontent: 'bikhir ', profile: 'hgrissen.jpeg'},
    //     {sender: 'nizar', messagecontent: 'dik chat maghadish issali wla kifash??', profile: 'hgrissen.jpeg'},
    //     {sender: 'fibo', messagecontent: 'wa ghir sma7lia a dak zamel', profile: 'hgrissen.jpeg'},
    //     {sender: 'nizar', messagecontent: 'shuf 3rfti ash ghadi dir', profile: 'hgrissen.jpeg'},
    //     {sender: 'nizar', messagecontent: 'ana mab9itsh m3akum fhad lprojet', profile: 'hgrissen.jpeg'},
    // ]);

    // ChatData.setMessage = setMessages;
    // ChatData.activeRoomMessages = messages;
    useEffect(() => {
        let win = document.getElementById('MessagesId')
        win?.scrollTo(0, win?.scrollHeight as any) ;
    }, [props.messages])
    return (
        <div className="messages" id="MessagesId">
            {props.messages.map((message: any) => (
                <Message message={message} key={n++}/>
            ))}
        </div>
    );
}