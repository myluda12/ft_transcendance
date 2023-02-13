import React, { createContext, useState } from "react";
import io, { Socket } from "socket.io-client";


export interface INotification{
    status: string;
    statuscontent: string
}

export interface IMessage {
    sender: string;
    content: string;
    id: string;
}

export interface IRoom {
    messages: IMessage[];
    roomname: string;
    joinedusers: string[];
    lastmessage: IMessage;
    access: String;
}

export interface IChatData {
    id : string;
    profile: string;
    userName: string;
    fullName: string;
    rooms: IRoom[];
    notification: INotification;
    activeRoomId: string;
    activeRoomName: string;
    activeRoomType: string;
    activeRoomRole: string;
    activeRoomMessages: any[];
    connectedUsers: string[];
    blockedusers: string[];
    socket: any;

}

export const ChatData: IChatData = {
    id: '',
    profile: '',
    userName: '',
    fullName: '',
    rooms: [],
    notification: {status: '', statuscontent: ''},
    activeRoomId: '',
    activeRoomName: '',
    activeRoomType: '',
    activeRoomRole: '',
    activeRoomMessages: [],
    connectedUsers: [],
    blockedusers: [],
    socket: {},
};


export let Currentsocket = io("http://10.12.3.2:4000/chat", {
    withCredentials: true,
    })
    // .on('connection', (recvpayload: any) => {
    //     let p = recvpayload;
    //     ChatData.userName = p.payload.username;
    //     ChatData.id = p.payload.id;
    //     ChatData.fullName = p.payload.fullname;
    //     ChatData.profile = p.payload.profile;
    //     console.log('wa si zaaaabi');
    // });

//export const ChatUserContext = createContext(ChatData);

// export const ChatUserContextProvider = ({children}) => {

//     const [Currentsocket, setCurrentScoket] = useState();

// }


// var socketOptions = {
//     withCredentials: true,
//  };
    // export const SocketValue = io("http://10.12.3.2:4000/chat" , socketOptions);// io("http://10.12.3.2:4000/" + "/chat", socketOptions);
   // export const SocketContext = React.createContext<Socket>(SocketValue);