import React from "react";
import MyCollection from "../components/Home/MyCollection";
import { FiSearch } from "react-icons/fi";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import Leaderboard from "../components/Home/Leaderboard";
import MyGames from "../components/Home/MyGames";
import Achievments from "../components/Home/Achievments";
import Searchbar from "../components/Searchbar";

const Home = () => {
  return (
    <div className="flex flex-col sm:flex-wrap w-full justify-center items-center">
    {/* ------- top section ------- */}
    <div className="flex">
      {/* ------- search input -------- */}
      <div className="flex justify-center items-center">
        <span className="px-[30px] rounded-l-[10px] flex justify-center items-center cursor-pointer w-full">
          <Searchbar />
        </span>
      </div>
    </div>
    <div className="flex items-center gap-x-10 justify-center mt-8 flex-wrap gap-6 w-8/12">
      <MyCollection />
      <Leaderboard />
    </div>
    <div className="flex items-center justify-center gap-[44px] mt-[36px] flex-wrap w-full">
      <MyGames />
     
    </div>
  </div>
  );
};

export default Home;
