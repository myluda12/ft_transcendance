import React, { useEffect, useState } from "react";
import logo from "../Assets/logo.png";
import sideBarImg from "../Assets/Rectangle 363.png";
import { RxDashboard } from "react-icons/rx";
import { TbFileSettings } from "react-icons/tb";
import { HiUserCircle, HiChatAlt2 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { BiHeart } from "react-icons/bi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../reducers/UserSlice";


import settings from "./settings.svg";
import addfr from "./addfriends.svg";
import chats from "./Chats.svg";
import profile from "./profile.svg";
import logoutt from "./logout.svg";
import dashboarb from "./dashboard.svg";
import logoo from "./logo.svg";





const Sidebar = () => {
  const navigate = useNavigate();
  const [off, setoff] = useState(false);
  const [User, SetUser] = useState<any>({});
  const dispatch = useDispatch();

  const handle_logout = () => {
    setoff(true);
    let res = axios
      .post(
       'http://10.12.3.2:5000/user/logout',
        { off },
        { withCredentials: true }
      )
      .then((response) => {
        window.alert("You have logged out !see You later");
        navigate("/login");
        dispatch(logout());

      });
  };

  return (
    <>
    <div className="w-14 flex h-full flex-col items-center justify-between bg-black lg:hidden md:hidden">
        <div className="m-3 w-10 h-10 bg-black">
          <img src={logoo} alt="emmm" />
        </div>
        <div className="flex flex-col m-3 w-10">
          <img className="py-3 w-9" src={dashboarb} alt="emmm" />
          <img className="py-3 w-9" src={settings} alt="emmm" />
          <img className="py-3 w-9" src={addfr} alt="emmm" />
          <img className="py-3 w-9" src={chats} alt="emmm" />
          <img className="py-3 w-9" src={profile} alt="emmm" />
        </div>
        <div className="mb-3">
          <img className="py-3 w-9" src={logoutt} alt="emmm" />
        </div>
      </div> 

     <div className="w-1/6  lg:flex md:flex hidden overflow-y-scroll bg-black scrollbar-hide justify-center items-center">
      {/* <div className="flex flex-grow items-center justify-center bg-black w-1/6  text-white"></div> */}
    <div className="flex flex-col items-center  whitespace-nowrap text-white">
      {/* -------- logo --------- */}
      <div>
        <img src={logo} alt="logo" />
      </div>
      {/* ---------- nav list -------- */}
      <div className="mt-[108px]">
        <ul className="flex flex-col gap-[43px]">
          <li
            onClick={() => navigate("/")}
            className="flex items-center gap-[14px] cursor-pointer"
          >
            <span className="text-[24px]">
              <RxDashboard />
            </span>
            <span className="text-[18px]">Dashboard</span>
          </li>
          <li
            onClick={() => navigate("/settings")}
            className="flex items-center gap-[14px] cursor-pointer"
          >
            <span className="text-[24px]">
              <TbFileSettings />
            </span>
            <span className="text-[18px]">Settings</span>
          </li>
          <li
            onClick={() => navigate("/chat")}
            className="flex items-center gap-[14px] cursor-pointer"
          >
            <span className="text-[24px]">
              <HiChatAlt2 />
            </span>
            <span className="text-[18px]">Chat</span>
          </li>
          <li
            onClick={() => navigate("/friends")}
            className="flex items-center gap-[14px] cursor-pointer"
          >
            <span className="text-[24px]">
              <BiHeart />
            </span>
            <span className="text-[18px]">friends</span>
          </li>
          <li
            onClick={() => navigate("/profile")}
            className="flex items-center gap-[14px] cursor-pointer"
          >
            <span className="text-[24px]">
              <HiUserCircle />
            </span>
            <span className="text-[18px]">Profile</span>
          </li>
        </ul>
      </div>

      {/* ------ ad section ------ */}
      <div className="mt-[140px]">
        <img
          className="w-[171px] h-[171px] object-contain rounded-[10px]"
          src={sideBarImg}
          alt="ad"
        />
      </div>

      {/* ------- logout button ------- */}
      <div className="mt-[63px]">
        <button
          className="flex items-center text-[#EB5757] font-[500] gap-[1rem]"
          onClick={handle_logout}
        >
          <RiLogoutCircleRLine /> LOGOUT
        </button>
      </div>
    </div>
  </div>

    </>
  );
};

export default Sidebar;
