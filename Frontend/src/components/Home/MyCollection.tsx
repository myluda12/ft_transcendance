import React, { useContext } from "react";
import { Link } from "react-router-dom";
import collection from "../../Assets/collection.png";
import collection2 from "../../Assets/collection2.png";
import collection3 from "../../Assets/collection3.png";
import { game_socket_context } from "../../sockets";

const fakeDataa = [
  { img: collection, title: "Get Knuckled!!", link: "/game/1", mode: 1 },
  { img: collection2, title: "Gotta Go Fast!!", link: "/game/2", mode: 2 },
  { img: collection3, title: "Left In the Shadow", link: "/game/3", mode: 3},
];


const MyCollection = () => {

  const game_socket = useContext(game_socket_context);

  function ButtonisPressed(game_mode: number)
  {
    game_socket.emit("player_join_queue", { mode: game_mode , state: 1});
  }
  
  return (
    <div className="flex-wrap">
      <h1 className="text-[21px] text-white font-[600] mb-[15px]">
        My collection
      </h1>
      <div className="flex gap-5  flex-row">
        {fakeDataa?.map((el) => (
          
          <Link to={el?.link} onClick={() => {
            //alert()
            ButtonisPressed(el?.mode);
          }} className="lg:w-9/12 md:w-9/12  h-[272px] flex flex-col items-center bg-[#262626] rounded-[10px]">
            <img
              className="w-[174px] h-[182px] object-contain mt-[4px]"
              src={el?.img}
              alt={el?.title}
            />
            <h1 className="mt-[23.83px] text-[#ECEBF6] font-[500] tracking-wider">{el?.title}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyCollection;
