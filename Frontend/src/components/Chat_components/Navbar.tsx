import React from "react";
import { useNavigate } from "react-router-dom";
import { ChatData } from "../../context/ChatUserContext";


export const Navbar = () => {
    const navigate = useNavigate();
    // const navigate = useNavigate();

    const handleexit = () => {

        ChatData.id =  '';
        ChatData.profile =  '';
        ChatData.userName =  '';
        ChatData.fullName =  '';
        ChatData.activeRoomId =  '';
        ChatData.activeRoomName =  '';
        ChatData.activeRoomType =  '';
        ChatData.activeRoomRole =  '';
        navigate("/")



    }

    return (
        <div className="navbar">
           <div className="container" onClick={() => handleexit() }>
            <img src="BackHome.png" alt="" />
           </div>
        </div>
    );
}