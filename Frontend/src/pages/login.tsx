import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Logo42 from "./42.png"
import logo from "../logo.png"
import pingpong1 from "../pingpong1.png"

import "./login.css"

// const Login = () => {
//     const [logged, setLogged] = useState(false);
// 	const navigate = useNavigate();
 
//     const handlelogin = () =>{
//         window.location.replace("http://10.12.3.2:5000/auth/login");
//         setLogged(true);
//         if(logged)
//             console.log("ALEADY LOGGED IN ");
//         else
//             console.log("FIRST TIME HUH");
// 	}
//     return(
//         <div className="Login" >
//         <h1 className="LoginHeading">BGHITI T9SSR SIR LUM6P</h1>
//         <div className='Buttonin'>
//                <img className='imgs'  src={imaage} alt="pof" width={"19vw"} height={"19vh"}/>
//             <button onClick={handlelogin} className='input_submit' type='submit' >Continue with Intra </button>
//         </div>
//     </div>
//     )
// }

// export default Login
export default function Login() {
    const [logged, setLogged] = useState(false);
	const navigate = useNavigate();
 
    const handlelogin = () =>{
        window.location.replace("http://10.12.3.2:5000/auth/login");
        setLogged(true);
        // if(logged)
        //     console.log("ALEADY LOGGED IN ");
        // else
        //     console.log("FIRST TIME HUH");
    }
    return (
      <section className="bg-[url('ayoub1.png')] bg-no-repeat bg-cover bg-fixed overflow-hidden scrollbar-hide overflow-y-scroll" >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen w-full ">
          <a href="#" className="flex items-center mb-6 text-2xl  font-semibold text-yellow-500 flex-col">
              <img className="h-full" src={logo} alt="logo"/>
  
          </a>
          <div className=" rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 ">
          <section className="flex flex-col py-32 px-16 gap-y-8 shadow-lg shadow-black border  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60  border-gray-900/20 rounded-xl ">
             <a href="#" className="flex items-center mb-6 text-2xl  font-semibold text-yellow-500 flex-col">
                  <img className=" h-1/6 w-2/6" src={pingpong1} alt="logo"/>
  
             </a>
              <header className="flex items-center flex-col gap-y-2">
                <h1 className="text-3xl text-white font-bold">Sign in to <span className="text-yellow-500"> Pong </span></h1>
                <p className="text-gray-100">
                  Login to play Pong with your friends
                </p>
              </header>
              <button
                onClick={handlelogin}
                type="button"
                className="flex items-center justify-center gap-x-4  py-4 rounded-xl bg-[#26A68E]
                hover:scale-105 hover:bg-[#005f31] transition duration-300 ease-in-out"
              >
                <img
                  src={Logo42}
                  width={42}
                  height={42}
                  alt="42 logo"
                />
                <p className="pb-0.5 font-semibold text-black text-lg sm:w-1/3" >
                  Sign in with 42
                </p>
              </button>
            </section>
          </div>
      </div>
    </section>
    );
  }