import React from "react";
import avatar1 from "../../Assets/Ellipse 213.png";
import avatar2 from "../../Assets/Ellipse 214.png";
import avatar3 from "../../Assets/Ellipse 215.png";
import avatar4 from "../../Assets/Ellipse 216.png";
import fireIcon from "../../Assets/fire.png";

const fakeData = [
  {
    img: avatar1,
    title: "Pomaline Yemare",
    subTitle: "@Poma3",
    pts: "1987 pts",
  },
  {
    img: avatar2,
    title: "Pomaline Sunny",
    subTitle: "@Poma1",
    pts: "1987 pts",
  },
  {
    img: avatar3,
    title: "Leinard Studio",
    subTitle: "@Leinard",
    pts: "1987 pts",
  },
  {
    img: avatar4,
    title: "Okoro Pleple",
    subTitle: "@Omope",
    pts: "1987 pts",
  },
];

const Achievments = () => {
  return (
    <div className="w-[297px] h-[371px] bg-[#262626] px-[32px] py-[19px] rounded-[20px]">
      <h1 className="text-[24px] mb-[12px] font-[600] text-white tracking-wider">
        Leaderboard
      </h1>
      <div className="flex flex-col gap-[1rem]">
        {fakeData?.map((el) => (
          <div className="flex items-center justify-between">
            {/* ----- left side ---- */}
            <div className="flex items-center gap-[14px]">
              <div>
                <img
                  className="w-[60px] h-[60px] object-contain"
                  src={el?.img}
                  alt={el?.title}
                />
              </div>
              <div className="truncate">
                <h1 className="text-[14px] text-[#F2F2F2] font-[500]">
                  {el?.title}
                </h1>
                <h6 className="text-[13px] text-[#828282]">
                  {el?.subTitle}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievments;
