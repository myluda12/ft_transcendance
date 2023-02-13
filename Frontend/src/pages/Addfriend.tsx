import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import fireIcon from "../Assets/fire.png";
import cn from "classnames";



const AddFriend = () =>
{
 
    const[Friends, setFriends] = useState (Array<any>);
    const [Username, setUsername] = useState("");
    const [avatar, setAvatar] = useState('');
    const navigate = useNavigate();
    const handleredirect = (username: string) =>
  {
    navigate("/profile/" + username);
  }
    useEffect(() => {
        axios.get('http://10.12.3.2:5000/user/friends', {withCredentials: true})
        .then((res) => {
            setFriends(res.data);
        }).catch((err) =>
        {
            window.alert("Unable To Fetch Your Friends");
        })
    })
    return (
      <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide">
      <h1 className="text-[77px] text-[#F2F2F2] text-center font-[700] tracking-wider "> FRIENDS</h1>
      <div className="min-h[calc(100vh-200px)] w-full flex flex-col overflow-scroll  scrollbar-hide gap-y-2 px-2">
          
          
          
          <div className="flex flex-col gap-[1rem]">   
  

{/* 
            {Friends.map((item, index) => (
              <div className="flex items-center justify-between" onClick={() => {handleredirect(item.username)}}>
                <div className="flex items-center gap-[21px]">
                  <div>
                    <img className="w-[60px] h-[60px] object-contain" src={item.avatar} alt={item.full_name} />
                  </div>
                  <div>
                    <h1 className="text-[15px] text-[#F2F2F2] font-[500] tracking-wider">{item.full_name}</h1>
                    <h6 className="text-[14px] text-[#828282] tracking-wider">{item.username}</h6>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-[14px]">
                    <img src={fireIcon} alt="fire icon" />
                    <h6 className="text-[13px] tracking-wider text-[#F2F2F2]">{item.status}</h6>
                  </div>
                </div>
              </div>
            ))} */}

    {Friends.map((friend, index) => (
            <div onClick={() => { handleredirect(friend.username) }} className="flex flex-row justify-between items-center w-full h-[100px] bg-[#262626] rounded-xl shadow-md p-4">
              <div className="flex flex-row items-center">
                <img src={friend.avatar
                } alt="profile" className="rounded-full w-[80px] h-[80px]  object-cover" />
                <div className="flex flex-col ml-4">
                  <h1 className="text-[#FFFFFF] font-bold text-lg">{friend.full_name}</h1>
                  
                </div>
              </div>
              <div className="flex sm:flex-row flex-col items-center gap-y-2">
                <h1 className={cn("font-[400] text-md", {
                  "text-green-400": friend.status === "ON",
                  "text-red-400": friend.status === "OFF",
                  "text-yellow-400": friend.status === "INGAME"
                })}>{
                  friend.status === "ON" ? "Online" : friend.status === "OFF" ? "Offline" : "In Game"
                }</h1>
              </div>
            </div>
))}



              </div>
          </div>
        </div>
      );
}
export default AddFriend;