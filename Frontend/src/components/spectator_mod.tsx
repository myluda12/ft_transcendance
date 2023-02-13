import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";

import P5Wrapper from 'react-p5';
import p5 from 'p5';
import { Paddle } from "./Lobby"
import { GameState } from "./Ball"
import { ReactP5Wrapper } from "react-p5-wrapper";
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { stat } from "fs";
import './../index.css';
import './../App.css';
import BackGround from '../pages/background.jpg'
import Sidebar from "./../pages/Sidebar";
import Botona from "../pages/Botona";
interface live_games {
    count: number;
}

const Spectator = () => {

  const socket = useRef(null as null | Socket);
  const my_live_games = useRef(null as null | live_games);
  const [state, setState] = useState("waiting");
  const [Cpt, setCpt] = useState(0);

   const gameState = useRef(null as null | GameState);


   const [user_one, setUserone] = useState("");
   const [user_two, setUsertwo] = useState("");
 
   const [user_one_score, setUserone_score] = useState(0);
   const [user_two_score, setUsertwo_score] = useState(0);
 
   const [user_one_name, setUserone_name] = useState("");
   const [user_two_name, setUsertwo_name] = useState("");

  const [my_width, setWidth] = useState(window.innerWidth);
  const [m_height, setHeight] = useState(window.innerHeight);
  const navigate = useNavigate();

  const [spect_game, setSpect_Game] = useState(0);

  const getWindowSizee = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }




  let ok = 0;
  let hh = 0;
  let yarb = 0;
  const [layhfdk, setLayhfdk] = useState(0);
  let button_cpt = 0;
  let buttons: p5.Element[] = [];

  let aspectRatio: number = 0;

  let absoluteWidth: number = 0;
  let relativeWidth: number = 0;

  let absoluteHeight: number = 0;
  let relativeHeight: number = 0;

  let scalingRatio: number = 0;

  function buttonPressed(nbr: number) {
    button_cpt = 1;
    //console.log("nbr " + nbr);

    
    //socket.current?.disconnect();
    //socket.current?.connect();
    setCpt(+nbr);
    // if (socket.current != null)
    //   socket.current.emit("spectJoin", { value: nbr });
    setState("started watching");
    //hh = c;
    //buttons.splice(0, c);
    //
  }

  function buttonPressed_2() {
    //setState("Ended");
    navigate("/")
  }

  useEffect(() => {
    socket.current = io("http://10.12.3.2:4000").on("connect", () => {

      
      socket.current?.on("gameCount", (data) => {
        //console.log("dkhelt ta hna " + data);
        //my_live_games.current = data;
        setLayhfdk(+data);
        //console.log("Hahwa my cpt " +window.location.pathname.split("/")[2]);
        //console.log("nadi " + layhfdk);
      });

      socket.current?.on("spect_game_ended", (data: any) => {
        setSpect_Game(+1);
      });   

      // if (Cpt === 0)
      // {
      //   console.log("wselt a 3chiri");
      //  socket.current?.emit("spectJoin", { value: window.location.pathname.split("/")[2] });
      //   setCpt(+1); 
      // }
      // console.log("wselt a 3chiri mra tanya "+Cpt);


      const pageName = window.location.pathname.split("/")[1];
      const room = window.location.pathname.split("/")[2];
      if (pageName === "watch")
      {
        if (room)
        {
          socket.current?.emit("spectJoin", { value: room });
        }
      }

        socket.current?.on("queue_status", (data: GameState) => {
          //console.log("dkhlet hna tani "+layhfdk);
          if (state == "waiting") {

          }
          gameState.current = data;
        });        



      return () => {
        socket.current?.removeAllListeners();
        socket.current?.close();
      }
    });
  }, [state, layhfdk]);

  const setup = (p5: p5Types, canvasParentRef: Element) => 
  {
    p5.createCanvas(window.innerWidth / 2, (window.innerWidth / 4)).parent(canvasParentRef)  
    p5.background(122);
  }

  function User_avatar_one() {
    if (gameState.current != null)
      setUserone(gameState.current.players_avatar[0]);
    
     //console.log("heres my image"+ user_one);
    const imageLink = user_one;
  
    return (
      
      <img className="rounded-full" src={imageLink} alt="description of image" />
      
    );
  }

  function User_avatar_two() {
    if (gameState.current != null)
      setUsertwo(gameState.current.players_avatar[1]);
    
     //console.log("heres my image"+ user_one);
    const imageLink = user_two;
  
    return (
      <img className="rounded-full" src={imageLink} alt="description of image" />
    );
  }

  function Show_users_props() {
    if (gameState.current != null)
    {
      setUserone_score(gameState.current.scores[0]);
      setUsertwo_score(gameState.current.scores[1]);

      setUserone_name(gameState.current.players_names[0]);
      setUsertwo_name(gameState.current.players_names[1]);


    }
      
    
     //console.log("heres my image"+ user_one);
    const user_fr_score = user_one_score;
    const user_sec_score = user_two_score;

    const user_fr_name = user_one_name;
    const user_sec_name = user_two_name;
  
    return (
      <div className="flex flex-row justify-between items-center bg-transparent py-1 my-4 w-3/4 bg-[#262626] hover:bg-black hover:text-red-600 h-[110px] rounded-full ">
      <div className=" w-2/12  justify-around h-5/6 hidden md:flex ">
        <User_avatar_one />
      </div>
      <div className="flex w-2/12 sm:text-sm lg:text-2xl bg-[#1F9889] text-black items-center justify-center my-9 hover:text-black bg-mine-490 hover:bg-white rounded-lg ">
      {user_fr_name}
      </div>
      <div className="flex  w-2/12 lg:text-3xl sm:text-base text-yellow-600 items-center hover:text-red-600 justify-center">
      {user_fr_score} - {user_sec_score}
      </div>
      <div className="flex  w-2/12 sm:text-sm lg:text-2xl bg-[#1F9889] text-black items-center justify-center my-9 hover:text-black bg-mine-490 hover:bg-white rounded-lg">
      {user_sec_name}
      </div>
      <div className="md:flex  hidden align-end w-2/12  h-5/6 ">
        <User_avatar_two />
      </div>
      </div>
    );
  }


  function draw(p5: p5Types)
    {
        socket.current?.emit("spectJoined");


        const draw_Game_ended = (p5: p5Types) => {
          if (gameState.current != null && socket.current != null) {
              
  
            let width = getWindowSize().innerWidth;
            let height = getWindowSize().innerHeight;
            
              p5.fill(0);
              p5.textSize(((relativeWidth) / 35));
              p5.textAlign(p5.CENTER);
              const scores = gameState.current.scores;
              const scoresSum = scores[0] + scores[1];
              
                // this is in case it's a spectator he can only watch without interfering in the game because his id couldn't be find 
                // in the players id array 
                p5.text("Game Ended Winner is "+gameState.current.winner_name,
                  (width) / 4,
                  width / 16
                );
              
            
          }
  
        };


        const draw_Game_waiting = (p5: p5Types) => {
          if (gameState.current != null && socket.current != null) {
              
  
            let width = getWindowSize().innerWidth;
            let height = getWindowSize().innerHeight;
            
              p5.fill(0);
              p5.textSize(((relativeWidth) / 35));
              p5.textAlign(p5.CENTER);
              const scores = gameState.current.scores;
              const scoresSum = scores[0] + scores[1];
              
                // this is in case it's a spectator he can only watch without interfering in the game because his id couldn't be find 
                // in the players id array 
                p5.text("Waiting for players to continue the game ",
                  (width) / 4,
                  width / 16
                );
              
            
          }
  
        };

        //console.log("nadi " + layhfdk); 
        p5.resizeCanvas(window.innerWidth /2 , window.innerWidth/4);
        p5.background(122);

        function getWindowSize() {
            const { innerWidth, innerHeight } = window;
            return { innerWidth, innerHeight };
          }
      
          function get_window_height() {
            return getWindowSize().innerHeight;
          }
          if (gameState.current != null) {

            setUserone(gameState.current.players_avatar[0]);
            setUsertwo(gameState.current.players_avatar[1]);
      
            setUserone_score(gameState.current.scores[0]);
            setUsertwo_score(gameState.current.scores[1]);
      
            setUserone_name(gameState.current.players_names[0]);
            setUsertwo_name(gameState.current.players_names[1]);

            aspectRatio = gameState.current.aspectRatio;
      
            absoluteWidth = gameState.current.width;
            relativeWidth = getWindowSize().innerWidth / 2;
      
      
            absoluteHeight = absoluteWidth / aspectRatio;
            relativeHeight = (relativeWidth / aspectRatio);
      
            scalingRatio = relativeWidth / absoluteWidth;
           // console.log("MY section width is  " + relativeWidth + " my section height is " + relativeHeight);
          }
          p5.resizeCanvas(window.innerWidth /2 , window.innerWidth/4);
          p5.background(122);
    
          // setState("Play");
          if (gameState.current != null) {
            const drawClickToStartText = (p5: p5Types) => {
              if (gameState.current != null && socket.current != null) {
      
      
                let width = getWindowSize().innerWidth;
                let height = getWindowSize().innerHeight;
                if (gameState.current.state === "scored") {
                  p5.fill(0);
                  p5.textSize(((relativeWidth) / 35));
                  p5.textAlign(p5.CENTER);
                  const scores = gameState.current.scores;
                  const scoresSum = scores[0] + scores[1];
                 
                    // this is in case it's a spectator he can only watch without interfering in the game because his id couldn't be find 
                    // in the players id array 
                    p5.text("Waiting for players to start the game",
                      (width) / 4,
                      width / 16
                    );
                  
                }
              }
      
            };
      /*
      
    <div className="lg:w-5/12 lg:h-3/12 w-5/12 flex flex-col">
      <div
        className=" h-3/12 px-[1.5rem] scrollbar-hide overflow-hidden overflow-y-scroll py-[1rem] rounded-[20px] flex flex-col  bg-[#262626] text-white text-[24px] mb-[12px] font-[600]"
        // name="myGames"
        // id="myGames"
      >

            <div className=" bg-[#1F9889] flex flex-row  rounded-full  text-base my-5 items-center hover:bg-[#C66AE1] text-center">
                <div className="h-5/6 w-6/12 flex  flex-row text-white text-base text-center">
                    <img className="rounded-full w-4/12" src="./sel-fcht.jpeg"></img>
                    <div className="">Sel-fcht</div>
                </div> 
                    <div className="h-3/6 w-1/12  flex flex-center text-base justify-center items-center text-white bg-black my-3 rounded-xl"> 2  1 </div>
                
                <div className="h-5/6 w-6/12 flex justify-end flex-row text-white text-base text-center">
                    <div className="">Sel-fcht</div>
                    <img className="rounded-full w-4/12" src="./sel-fcht.jpeg"></img>
                </div> 
            </div>

               
            </div>
        </div>  

      */
            const drawScore = (p5: p5Types) => {
              // this method will allow us to draw the score line of both players
              // we start of by filling the whole screen black 
              // we allign the text in the center and we can rectrieve the score of each players using the gamestate that is constantly
              //retrieving data from the backend of our code and then we display it
              // how to create as many buttons as i want based on a number 
      
              p5.fill(0);
              p5.textSize((getWindowSize().innerHeight * 20) / getWindowSize().innerHeight);
              p5.textAlign(p5.CENTER);
              //p5.resizeCanvas(getWindowSize().innerWidth, getWindowSize().innerHeight);
              //console.log(relativeHeight);
              if (gameState.current != null) {
                p5.text(
                  gameState.current.scores[0],
                  (getWindowSize().innerWidth / 32) * 7,
                  getWindowSize().innerWidth / 8
                );
                p5.text(
                  gameState.current.scores[1],
                  (getWindowSize().innerWidth / 32) * 9,
                  getWindowSize().innerWidth / 8
                );
                if (gameState.current.state == "endGame") {
                  p5.text("Player 1 Won the game",
                    (getWindowSize().innerWidth) / 4,
                    getWindowSize().innerWidth / 16
                  );
                }
      
              }
      
            };
            //p5.clear();
      
      
            // if (gameState.current.state == "endGame")
            //   console.log("hana habibi");
            //console.log("Asbhan lah " + gameState.current.state);
            // p5.resizeCanvas(getWindowSize().innerWidth   , relativeHeight);
            // p5.background(122);
            if (gameState.current.state === "scored")
              draw_Game_waiting(p5)
            else if ( gameState.current.winner === "")
            {
              drawClickToStartText(p5);
              p5.fill(0);
              //drawScore(p5);
            //console.log("Heres my aspect ratio " + aspectRatio);
            // i want to use href with buttons inside of a loop that will redirect me to a certain page with a certain  index
            //the p5.rect method allows us to create a rectangle using the properties in the arguments x,y,width,heigh
             p5.rect(gameState.current.fr_paddle_x * scalingRatio, gameState.current.fr_paddle_y * scalingRatio, gameState.current.paddle_width * scalingRatio, gameState.current.paddle_height * scalingRatio);
      
              p5.rect(gameState.current.sec_paddle_x * scalingRatio, gameState.current.sec_paddle_y * scalingRatio, gameState.current.paddle_width * scalingRatio, gameState.current.paddle_height * scalingRatio);
            //the p5.circle method allows us to create a circle using the properties in the arguments x,y,Raduis
              p5.circle(gameState.current.ball_x * scalingRatio, gameState.current.ball_y * scalingRatio, gameState.current.ball_radius * scalingRatio);
            }
            else 
              draw_Game_ended(p5)
          
            }
    }
  
  //};
  return <div className="flex flex-row h-full w-full ">
              
<div className="flex flex-col items-center justify-center  w-5/6  bg-mine-520">
  <div className="flex text-white font-sans text-6xl my-6"> Game </div>
  <div className="flex flex-col justify-center items-center w-5/6 h-4/6">
    <Show_users_props/>
    <Sketch setup={setup} draw={draw} />
    
     <Botona onClick={() => {
                //alert()
                buttonPressed_2();
              }}
              >
                Go back to menu
              </Botona>
              
    
  </div>

           
  </div>
</div>;
};


export default Spectator;
