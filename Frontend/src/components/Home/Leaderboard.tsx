import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar1 from "../../Assets/Ellipse 213.png";
import avatar2 from "../../Assets/Ellipse 214.png";
import avatar3 from "../../Assets/Ellipse 215.png";
import avatar4 from "../../Assets/Ellipse 216.png";
import fireIcon from "../../Assets/fire.png";

const Leaderboard = () => {
  const [Leaderboard, setLeaderboard] = useState(Array<any>)

  const navigate = useNavigate();
  const handleredirect = (username: string) =>
  {
    navigate("/profile/" + username);
  }

  useEffect(() => {
    axios.get('http://10.12.3.2:5000/user/leaderboard', {withCredentials: true})
    .then((response) =>{
      setLeaderboard(response.data)
    })
  },[])
  return (
    <div className="w-[433px] h-[371px] bg-[#262626] px-[32px] py-[19px] rounded-[20px] overflow-y-scroll scrollbar-hide overflow-hidden">
      <h1 className="text-[24px] mb-[12px] font-[600] text-white tracking-wider">
        Leaderboard
      </h1>
      <div className="flex flex-col gap-[1rem]">
        {Leaderboard.map((item, index) => (
          <div className="flex items-center justify-between" onClick={() => {handleredirect(item.username)}}>
            {/* ----- left side ---- */}
            <div className="flex items-center gap-[21px]">
              <div>
                <img className="w-[60px] h-[60px] object-contain" src={item.avatar} alt={item.full_name} />
              </div>
              <div>
                <h1 className="text-[15px] text-[#F2F2F2] font-[500] tracking-wider">{item.full_name}</h1>
                <h6 className="text-[14px] text-[#828282] tracking-wider">{item.username}</h6>
              </div>
            </div>
            {/* ---- right side ---- */}
            <div>
              <div className="flex items-center gap-[14px]">
                <img src={fireIcon} alt="fire icon" />
                <h6 className="text-[13px] tracking-wider text-[#F2F2F2]">{item.score}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
