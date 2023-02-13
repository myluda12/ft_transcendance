import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import settings from "./settings.svg";
import addfr from "./addfriends.svg";
import chats from "./Chats.svg";
import profile from "./profile.svg";
import logout from "./logout.svg";
import dashboarb from "./dashboard.svg";
import logo from "./logo.svg";



const Dashboard = () => {
  return (
    <div className="flex h-screen  w-full scrollbar-hide overflow-y-scroll ">

     


     
          <Sidebar />
      
      {/* ------- OUTLET ---------- */}
      <div className=" sm:flex-wrap flex flex-grow py-6 w-2/6 bg-[#1a1b26] align-center items-start  justify-start flex-col scrollbar-hide overflow-y-scroll">
        {/* <div className=" bg-cyan-600 my-5 sm:hidden lg:hidden ">
          <AiOutlineAlignLeft/>
        </div> */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;