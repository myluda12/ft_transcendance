import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Addfriend from "./pages/Addfriend";
import SketchPong from "./components/My_sketch";
import Spectator from "./components/spectator_mod";
import Login from "./pages/login";
import Nofriendpage from "./pages/errornotfound";

import Verify_2fa from "./pages/verify_2fa";
import "./index";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUser, IUserState, login } from "./reducers/UserSlice";
import { ChatPage } from "./pages/ChatPage";
import { io, Socket } from "socket.io-client";
import { GameState } from "./components/Ball";
import { game_socket_context, main_socket_context } from "./sockets";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Spect from "./components/spectator";


interface props
{
  socket_ids : Array<string>;
  user_id : string;
  username: string;
  user_status : string;
}

interface UserStatus {
  ON: 'ON',
  OFF: 'OFF',
  INGAME: 'INGAME',
  INQUEUE: 'INQUEUE'
};

interface Achievement {
  GREAT_WIRATE: 'GREAT_WIRATE',
  LEGEND_WIRATE: 'LEGEND_WIRATE',
  DECENT_WIRATE: 'DECENT_WIRATE',
  GREAT_LOSER: 'GREAT_LOSER',
  FIVE_WIN_STREAK: 'FIVE_WIN_STREAK',
  TEN_WIN_STREAK: 'TEN_WIN_STREAK',
  GREAT_AVATAR: 'GREAT_AVATAR',
  COMMUNICATOR: 'COMMUNICATOR'
};

interface user_info {
  id: string
  full_name: string
  username: string
  avatar: string
  avatar_key: string | null
  is_two_fa_enable: boolean
  two_fa_code: string | null
  email: string
  //status: UserStatus
  win: number
  lose: number
  score: number
  win_streak: number
 // achievements: Achievement[]
}

function Game_invite(props: {data : user_info}) {
  
  const userinho = useRef(null as null | user_info);
  const gameSocket = useContext(game_socket_context);
  userinho.current = props.data;
  const navigate = useNavigate();
  
  const socket = useRef(null as null | Socket);
  const gameState = useRef(null as null | GameState);
  //console.log("amalk");
  const accept = (e : any)=>{
    gameSocket.emit("invite_queue", { mode: 4, state: 2});
    navigate("/game/4");
    toast.dismiss();
  }

  function Decline () {
    //console.log("WA QAWAAAADA HADI1");

    socket.current = io("http://10.12.3.2:4000", {
      withCredentials: true,
    }).on("connect", () => {

      socket.current?.on("queue_status", (data: GameState) => {
        gameState.current = data;
      });
      socket.current?.emit("invite_queue", { mode: 4, state: 0});
     //console.log("sir gah thawa layrhm bak")
    });


  };
  return (
    <div className='w-full h-full'>
        <div className='avatar w-1/6 justify-center items-center mx-auto text-white'>
          <img className='rounded-full' src={props.data.avatar}/>
        </div>
        <div className='data text-center text-white'>
            <div className=' name'>
              {props.data.username}
            </div>
            <div className='msg text-center'>
              Challenged you to A Duel !
            </div>
        </div>
        <div className='buttons text-center '>
          <button className='px-5  mx-6 bg-green-600 rounded-full text-black'  onClick={(e)=>{accept(e)}}>Accept</button> 
          <button  className='px-5 bg-red-600 rounded-full text-black' onClick={(e)=>{Decline()}}>Decline</button> 
        </div>
    </div>
  )
}

const game_link = (data : user_info) => (
  <div className="justify-center align-center ">
        <Game_invite data={data}/>
  </div>
);


function App() {
  const main_socket = useContext(main_socket_context);
  
  const [state, setState] = useState<any>({});
  const socket = useRef(null as null | Socket);
  const gameState = useRef(null as null | GameState);
  
  const userData: IUserState = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (!userData.isLoggedIn) {
      axios
        .get("http://10.12.3.2:5000/user/me", { withCredentials: true })
        .then((response) => {
          dispatch(login(response.data));
        });
    }

    main_socket.on("game_invite", (data: user_info) => {
         const notify = () =>{ 
               toast(game_link(data), {
              onClose: () => {

                //console.log("WA QAWAAAADA HADI1");
                
              socket.current = io("http://10.12.3.2:4000", {
                withCredentials: true,
              }).on("connect", () => {

                socket.current?.on("queue_status", (data: GameState) => {
                  gameState.current = data;
                });
                socket.current?.emit("invite_queue", { mode: 4, state: 0});
               // console.log("sir gah thawa layrhm bak")
              });
              }
               });

           }
         notify();       
     })
  }, []);

  useEffect(() => {
    axios
      .get("http://10.12.3.2:5000/user/user", { withCredentials: true })
      .then((response) => {
        setState(response.data);
      });
  }, []);
  //console.log("ayoub zab : " + state.is_two_fa_enable);
  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route element={<RequireAuth />}>
            <Route path="/chat" element={<ChatPage/>} />
            <Route path='/game/*' element={<SketchPong/>} />
            <Route path="/" element={<Dashboard />}>
            <Route path='/watch/*' element={<Spectator/>} />
            <Route path='/spect' element={<Spect/>} />
            <Route index element={<Home />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route
              path="/settings"
              element={<Settings state={state.is_two_fa_enable} />}
            />
            <Route path="/friends" element={<Addfriend />} />

          </Route>
        </Route>
        <Route element={<NotRequireAuth />}>
        <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />}>
            <Route path="/verify_2fa/:userId" element={<Verify_2fa />} />
          </Route>
          <Route path="/errornotfound" element={<Nofriendpage />} />
        </Route>
        <Route path="*" element={<Navigate to="/errornotfound" replace />} />
      </Routes>
    </>
  );
}


export default App;

function RequireAuth() {
  const userData: IUserState = useSelector((state: any) => state.user);
  let location = useLocation();

  if (userData.isLoading) return <div>Loading...</div>;

  if (!userData.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

function NotRequireAuth() {
  const userData: IUserState = useSelector((state: any) => state.user);
  let location = useLocation();

  if (userData.isLoading) return <div>Loading...</div>;

  if (userData.isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
