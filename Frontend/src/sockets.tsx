import React  from "react";
import io, { Socket } from "socket.io-client";


export const main_Socket = io("http://10.12.3.2:3080" + "/", {withCredentials: true});
export const main_socket_context = React.createContext<Socket>(main_Socket);


 export const game_socket = io("http://10.12.3.2:4000", {withCredentials: true});
export const game_socket_context = React.createContext<Socket>(game_socket);