import React from "react";
import fireEmoji from "../../Assets/fire-emoji.png";

const LastGames = () => {
    
  return (
    <div className="w-[674px] h-[377px] relative">
      <textarea
        className="w-[674px] min-h-[488px] max-h-[488px] px-[1.5rem] py-[1rem] rounded-[20px] bg-black text-white text-[14px] tracking-wider"
        name="myGames"
        id="myGames"
      ></textarea>
      <h1 className="absolute top-0 translate-y-[-50%] translate-x-[25%] flex items-center gap-[.5rem] w-fit bg-[#B7ABFF] text-[#202020] text-[24px] font-[600] tracking-wider px-[28px] py-[5px] rounded-[10px]">
        Last Games :
      </h1>
    </div>
  );
};

export default LastGames;
