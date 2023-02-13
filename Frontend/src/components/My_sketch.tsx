import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import axios from 'axios';

import P5Wrapper from 'react-p5';
import p5 from 'p5';
import { Paddle } from "./Lobby"
import { GameState } from "./Ball"
import { ReactP5Wrapper } from "react-p5-wrapper";
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { stat } from "fs";
import  Spectator  from './spectator_mod';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BackGround from '../pages/background.jpg'
import Sidebar from './../pages/Sidebar'
import avatar1 from "./../Assets/question.jpg";
import Botona from "../pages/Botona";

  
  // await axios.get( process.env.REACT_APP_BACKEND_URL+ "/chat/myChannels", 
  // {withCredentials: true} 
  // ).then((res)=>{
  //   var myChannels : Array<string> = [];
  //   for (let index = 0; index < res.data.length; index++) {
  //     myChannels.push(res.data[index].channelId);
  //   }
  //   myChannels.push(userLogin);
  //   // mychannels.pushback(userlogin)
  //   socket.emit('joinRoom', myChannels)
  // }).catch((err)=>{
  // })
  //}



const SketchPong = () => {

  const socket = useRef(null as null | Socket);
  const gameState = useRef(null as null | GameState);
  const [state, setState] = useState("waiting");
  const [Cpt, setCpt] = useState(0);
  const [user_one, setUserone] = useState("");
  const [user_two, setUsertwo] = useState("");

  const [user_one_score, setUserone_score] = useState(0);
  const [user_two_score, setUsertwo_score] = useState(0);

  const [user_one_name, setUserone_name] = useState("");
  const [user_two_name, setUsertwo_name] = useState("");

  const navigate = useNavigate();
  const [my_width, setWidth] = useState(window.innerWidth);
  const [m_height, setHeight] = useState(window.innerHeight);

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

  function buttonPressed() {
    if (socket.current != null)
      socket.current.emit("Game_Stopped");
    setState("Ended");
    navigate("/");
  }

  function buttonPressed_2() {
    navigate("/")
    //setState("Ended");
  }

  useEffect(() => {


    socket.current = io("http://10.12.3.2:4000", {
      withCredentials: true,
    }).on("connect", () => {

    if (socket.current != null)
    {
        socket.current.on('gameCount', (data) => {
        hh = data;
        setLayhfdk(+ data);
        
      });      


      
    }
   
    setCpt(Cpt + 1);
   
    
    if (layhfdk === 0 && gameState.current?.state !== "ended")
    {
      const game_mode : number =  + (window.location.pathname.split("/")[2]);
      if (game_mode !== 4)
        socket.current?.emit("player_join_queue", { mode: game_mode, state: 0});
      else 
        socket.current?.emit("invite_queue", { mode: game_mode, state: 3});
    }
      
      else if (state == "spect")
      {

        socket.current?.emit("spectJoined");
        if (socket.current != null)
          socket.current.on('gameCount', (data) => {
            hh = data;
            setLayhfdk(+ data);
            
          });
          
      }

      if (socket.current != null)
      socket.current.on('It_ended', (data) => {

        let val_e = data;
        const game_mod : number =  + (window.location.pathname.split("/")[2]);
     
        socket.current?.emit("GameEnded",{ mode: game_mod });
        
      });

      socket.current?.on("queue_status", (data: GameState) => {

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



  const setup = (p5: p5Types,canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth / 2, (window.innerWidth / 4)).parent(canvasParentRef)

    p5.background(122);
    const game_mode : number =  + (window.location.pathname.split("/")[2]);
    
    socket.current?.emit("game_mode", { mode: game_mode });

  }

  function User_avatar_one() {
    if (gameState.current != null && gameState.current.users.length === 2)
      setUserone(gameState.current.players_avatar[0]);
    else
      setUserone(avatar1);
    const imageLink = user_one;
  
    return (
      
        <img className="rounded-full" src={imageLink} alt="description of image" />
      
    );
  }

  function User_avatar_two() {
    if (gameState.current != null && gameState.current.users.length === 2) 
      setUsertwo(gameState.current.players_avatar[1]);
    else
      setUsertwo(avatar1);
    
    const imageLink = user_two;
  
    return (
        <img className="rounded-full" src={imageLink} alt="description of image" />
    );
  }

  function Show_users_props() {
    if (gameState.current != null && gameState.current.users.length === 2)
    {
      setUserone_score(gameState.current.scores[0]);
      setUsertwo_score(gameState.current.scores[1]);

      setUserone_name(gameState.current.players_names[0]);
      setUsertwo_name(gameState.current.players_names[1]);
    }
    else
    {
      setUserone_score(0);
      setUsertwo_score(0);

      setUserone_name("Player 1");
      setUsertwo_name("Player 2");
    }

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



  function draw(p5: p5Types) {
    
    function getWindowSize() {
      const { innerWidth, innerHeight } = window;
      return { innerWidth, innerHeight };
    }
    if (gameState.current != null) {
     
      const game_mode : number =  + (window.location.pathname.split("/")[2]);
      // if (gameState.current.state === "endGame")
      // {
      //   if (gameState.current.scores[0] === gameState.current.score_limit)
      //   {
          
      //     socket.current?.emit("GameEnded",{ mode: game_mode });
      //   }
      //   else if (gameState.current.scores[1] === gameState.current.score_limit)
      //   {
      //     socket.current?.emit("GameEnded",{ mode: game_mode });
      //   }
      // }

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
      
    }

    p5.resizeCanvas(window.innerWidth /2 , window.innerWidth/4);
    p5.background(122);

    

    if (gameState.current != null) 
    {
     

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
            if (gameState.current.players.indexOf(socket.current.id) == -1) {
              // this is in case it's a spectator he can only watch without interfering in the game because his id couldn't be find 
              // in the players id array 
              p5.text("Waiting for players to start the game",
                (width) / 4,
                width / 16
              );
            }
            else {
              // in here both the players recieve text in the middle
              // the one who scored is displaying the waiting text while the other one the click enter
              // when he does click enter the ball gets respawned in the middle with the scores updated and the ball moving again
              // thus creating a new partido if you would call it that 

              p5.text(
                socket.current.id === gameState.current.lastscored
                  ? "Waiting for oponent to start the game"
                  : "Click enter to start the game ",
                (width) / 4,
                width / 16
              );
            }
          }
        }

      };

      const draw_Game_ended = (p5: p5Types) => {
        if (gameState.current != null && socket.current != null) {
            

          let width = getWindowSize().innerWidth;
          let height = getWindowSize().innerHeight;
          
            p5.fill(0);
            p5.textSize(((relativeWidth) / 35));
            p5.textAlign(p5.CENTER);
            const scores = gameState.current.scores;
            const scoresSum = scores[0] + scores[1];
              setState("Ended");
              // this is in case it's a spectator he can only watch without interfering in the game because his id couldn't be find 
              // in the players id array 
              p5.text("Game Ended Winner is "+gameState.current.winner_name,
                (width) / 4,
                width / 16
              );
            
          
        }

      };

      const draw_Game_declined = (p5: p5Types) => {
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
              p5.text("User "+gameState.current.users_names[1]+" declined your game Request",
                (width) / 4,
                width / 16
              );
            
          
        }

      };

      
      if (socket.current != null) {


        const handlePlayerOneInput = (p5: p5Types) => {
          // this is where we check for the first player's input and how he moves the paddles using W and S 
          // whenever he uses a key we emit an event called playerInput that will later on be received from the backend
          // when the backend recieved the emit he will update the paddles properties(x,y) wether lesser or higher 
          //when the properties gets updated since wr using the same socket of the player he can retrieve the new x,y of paddles
          //then we can clear the whole ground we playing on and design the paddls on it's new x and y 
          //since this update gets called infinitly it will look like it's moving based on your needs 
          const game_mode : number =  + (window.location.pathname.split("/")[2]);
         // console.log("hh2");
          if (socket.current != null && gameState.current != null) {
            //console.log("hh");
            if (gameState.current.state === "matched")
            {
              let width = getWindowSize().innerWidth;
              p5.fill(0);
              p5.textSize(((relativeWidth) / 35));
              p5.textAlign(p5.CENTER);

              p5.text(
                   "Click enter to start the game ",
                (width) / 4,
                width / 16
              );
              if (p5.keyIsDown(13))
               socket.current.emit("player_pressed_key", { input: "ENTER",mode: game_mode });
            }
             
            if (p5.keyIsDown(13) && socket.current.id !== gameState.current.lastscored) {
              socket.current.emit("player_pressed_key", { input: "ENTER",mode: game_mode });
            }
            if (p5.keyIsDown(87)) {
              socket.current.emit("player_pressed_key", { input: "UP",mode: game_mode });
            }

            if (p5.keyIsDown(83)) {
              socket.current.emit("player_pressed_key", { input: "DOWN",mode: game_mode });
            }
          }
        }
        const handlePlayerTwoInput = (p5: p5Types) => {
          const game_mode : number =  + (window.location.pathname.split("/")[2]);
          if (socket.current != null && gameState.current != null) {
            if (p5.keyIsDown(13) && socket.current.id !== gameState.current.lastscored) {
              socket.current.emit("player_pressed_key", { input: "ENTER",mode: game_mode });
            }
            if (p5.keyIsDown(87)) {
              socket.current.emit("player_pressed_key", { input: "UP",mode: game_mode});
            }
            if (p5.keyIsDown(83)) {
              socket.current.emit("player_pressed_key", { input: "DOWN",mode: game_mode });
            }
          }

        }
        // 
        // ok in here like we know every player got a socket and every socket got an Id for ex adc24a4cad2c4adc mix of numbers and letters 
        // but how can we know which one of them is player1 and which one is player 2
        // in here we use the indexOf method that can help us find the first occurence that is equal to the one we search for
        // you can say we store these sockets id in an array arr = ["Sdcsdcs51s0", "sdc5s5d2cs12"];
        // when we call arr.indexOf("Sdcsdcs51s0") which is the first one it will print out 0 
        //when we receive 1 or 0 or we call their own paddle updating functions
        //console.log("Index is "+(socket.current?.id));
        // if (gameState.current.players.indexOf(socket.current?.id) === 0)
        // { 
        //   console.log("ana");  
        if (gameState.current.state === "decline")
        {
          navigate("/")
          socket.current.disconnect();
          
        }
        else if (gameState.current.state === "ended")
        {

           draw_Game_ended(p5);
        }
         
        else
        {
          drawClickToStartText(p5);
          p5.fill(0);
          
        //player_names(p5);
          
          //the p5.rect method allows us to create a rectangle using the properties in the arguments x,y,width,heigh
          p5.rect(gameState.current.fr_paddle_x * scalingRatio, gameState.current.fr_paddle_y * scalingRatio, gameState.current.paddle_width * scalingRatio, gameState.current.paddle_height * scalingRatio);
    
          p5.rect(gameState.current.sec_paddle_x * scalingRatio, gameState.current.sec_paddle_y * scalingRatio, gameState.current.paddle_width * scalingRatio, gameState.current.paddle_height * scalingRatio);
          //the p5.circle method allows us to create a circle using the properties in the arguments x,y,Raduis
          p5.circle(gameState.current.ball_x * scalingRatio, gameState.current.ball_y * scalingRatio, gameState.current.ball_radius * scalingRatio);
    
            handlePlayerOneInput(p5);          
        }

        //}
        // if (gameState.current.players.indexOf(socket.current.id) === 1)
        // {
        //   console.log("nta"); 
        //   handlePlayerTwoInput(p5);
        // }
        
      }

    }
  }
  //};
  return <>

    

              
      <div className="flex h-screen  w-full scrollbar-hide overflow-y-scroll">
      {/* <div className="w-14 flex h-full flex-col items-center justify-between bg-black lg:hidden md:hidden">
        <div className="m-3 w-10 h-10 bg-black">
          <img src='logo.svg' alt="emmm" />
        </div>
        <div className="flex flex-col m-3 w-10">
          <img className="py-3 w-9" src='dashboard.svg' alt="emmm" />
          <img className="py-3 w-9" src='settings.svg' alt="emmm" />
          <img className="py-3 w-9" src='addfriends.svg' alt="emmm" />
          <img className="py-3 w-9" src='Chats.svg' alt="emmm" />
          <img className="py-3 w-9" src='profile.svg' alt="emmm" />
        </div>
        <div className="mb-3">
          <img className="py-3 w-9" src='logout.svg' alt="emmm" />
        </div>
      </div>  */}
     
          <Sidebar />

        <div className="sm:flex-wrap flex flex-grow py-6 w-2/6 bg-[#1a1b26] align-start items-center  justify-start align-center flex-col scrollbar-hide overflow-y-scroll">
          <div className="flex text-white font-sans text-6xl my-6 w-full justify-center align-middle items-center tracking-wider"> Game 
          </div>
        <div className="flex flex-col justify-center items-center w-5/6 h-5/6">
            <Show_users_props/>
            <Sketch setup={setup} draw={draw} />
            <>{ state !== "Ended" ?
              
            
                 <Botona onClick={() => {
                //alert()
                buttonPressed();
              }}
              >
                Quit Game
              </Botona>
              
              :
              <Botona onClick={() => {
                //alert()
                buttonPressed_2();
              }}
              >
                Go back to menu
              </Botona>
              

          }
          </>
          </div>

                   
          </div>
        </div>
    )        



    

  </>
  return <Sketch setup={setup} draw={draw} />;
};


export default SketchPong;