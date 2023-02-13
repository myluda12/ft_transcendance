import { render } from "@testing-library/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import { StringLiteral } from "typescript";
import avatar1 from "../../Assets/Ellipse 213.png";
import fireIcon from "../../Assets/fire.png";
import { Usercontext } from "../../context/Usercontext"
//import IoMdPersonAdd from 
import { IoMdPersonAdd } from 'react-icons/io'
import { ImBlocked } from 'react-icons/im'
import { CgUnblock } from 'react-icons/cg'
import { game_socket_context, main_socket_context } from "../../sockets";

interface user_info_whistory {

  user1_name: string;
  user2_name: string;

  user1_score: number;
  user2_score: number;

  user1_avatar: string;
  user2_avatar: string;
  //achievements: Achievement[]
}

const ProfileUp = () => {

  const [me, itsme] = useState(true);
  const main_socket = useContext(main_socket_context);
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [fullname, getFullname] = useState("");
  const [isLogged, setisLogged] = useState("");
  const[erro, setErro] = useState("");
  const game_socket = useContext(game_socket_context);
  const [len, setLen] = useState(0);

  const [mee, itsmee] = useState("");
  const [check, Setcheck] = useState("");
  let shkon = window.location.pathname.split("/", 3)[2];
  let url: string;

  const location = useLocation();

  function ButtonisPressed() {
    main_socket.emit("invite_game", { player1: User })
    game_socket.emit("invite_queue", { mode: 4, state: 1, player: User.id });
    navigate("/game/4");
  }

  if (shkon) {
    url = "http://10.12.3.2:5000/user/user/" + shkon;
  }
  else {
    url = "http://10.12.3.2:5000/user/user"
  }

 
  const handle_add = () => {
    if (!shkon)
      return ;
    let res = axios.post('http://10.12.3.2:5000/user/add_friend/' + shkon, { shkon }, { withCredentials: true }).then((res: any) => {
      navigate("/profile/" + shkon);
    }).catch(() => {
      // window.alert(err);
    })
  }
  const handle_remove = () => {
    if (!shkon)
      return ;
    let res = axios.post('http://10.12.3.2:5000/user/remove_friend/' + shkon, { shkon }, { withCredentials: true }).then((res: any) => {
      navigate("/profile/" + shkon);
    }).catch(() => {
      // window.alert(err);
    })
  }
  const handle_block = () => {
    if (!shkon)
      return ;
    let res = axios.post('http://10.12.3.2:5000/user/block_friend/' + shkon, { shkon }, { withCredentials: true }).then((res: any) => {
      navigate("/profile/" + shkon);
    }).catch(() => {
      // window.alert(err);
    })
  }

  const handle_unblock = () => {
    if (!shkon)
      return ;
    let res = axios.post('http://10.12.3.2:5000/user/unblock_friend/' + shkon, { shkon }, { withCredentials: true }).then((res: any) => {

      navigate("/profile/" + shkon);
    }).catch(() => {
      window.alert("You cant Unblock Someone Who Blocked You ");
    })
  }


  const [userme, setUserme] = useState("");
  const fetchMe = async () => {
    axios.get("http://10.12.3.2:5000/user/user", { withCredentials: true }).then(async (res: { data: { username: string; }; }) => {
      if (shkon)//ayarjhou
      {
        if (shkon == res.data.username) {
          setUserme(res.data.username);
          itsme(false);
        }
        else {
          itsme(true);
        }
      }
      else {
        setUserme(res.data.username);
        //  axios.get("http://10.12.3.2:5000/user/get_history/" + userme, { withCredentials: true }).then((res) => {
        //   setHist(res.data);

        // }).catch((err) => {
        //  // setHist([]);
        // });
        itsme(false)
      }
    }).catch(() => {
      // console.log(err)
    })

    if (userme || shkon) {
    if (me == false) {
      axios.get("http://10.12.3.2:5000/user/get_history/" + userme, { withCredentials: true }).then((res: { data: any; }) => {
        setHist(res.data);
      }).catch(() => {
        // setHist([]);
      });
    }
    else {
      axios.get("http://10.12.3.2:5000/user/get_history/" + shkon, { withCredentials: true }).then((res: { data: any; }) => {
        setHist(res.data);

      }).catch(() => {
        //setHist([]);
      })
    }
  }

  }
  const [User, SetUser] = useState<any>({});
  useEffect(() => {
    setHist([]);
    axios.get(url, { withCredentials: true })
      .then((response: { data: { username: any; full_name: any; status: any; }; }) => {
        itsmee(response.data.username);
        //const meFactor = response.data.username === shkon ? false : true;
        //itsme(meFactor);
        SetUser(response.data);
        setUsername(response.data.username);
        getFullname(response.data.full_name);
        setisLogged(response.data.status);
      }).catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Friend not found',
          footer: '<Link to={"/"} Why do I have this issue? Probably because Baghi t7esselna</Link>'
        })
        navigate("/errornotfound");
      });
    fetchMe();
    if (shkon) {
    let response = axios.get('http://10.12.3.2:5000/user/status_friend/' + shkon, { withCredentials: true })
    .then((res: { data: { status: any; }; }) => {
      Setcheck(res.data.status);
    }).catch(() => {
    });
  }

    axios.get(url, { withCredentials: true })
      .then((response: { data: any; }) => {
        // console.log("nigga" + response.status)
        SetUser(response.data);
      }).catch(()  => {
        // console.log("nigga" + error.response.status)
        navigate("/errornotfound");
      });
  
     


  }, [location])


  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}

const help = async () => {
 
  //await timeout(500);
  const user  = (location.pathname  == '/profile') ?  userme : shkon
  if (location.pathname == "/profile" && user) {
    // console.log("userme : " + userme);
    axios.get("http://10.12.3.2:5000/user/get_history/" + user, { withCredentials: true })
    .then((res: { data: any; }) => {
      setHist(res.data);
    })
    .catch((err: any) => {
        setErro(err);
    })
  }

}

  help();

  

  const [nameHistory, setNameHistory] = useState("");
  const [avatarHistory, setAvatarHistory] = useState('');
  const [score1, setScore1] = useState(0);

  const [nameHistory2, setNameHistory2] = useState("");
  const [avatarHistory2, setAvatarHistory2] = useState('');

  const [score2, setScore2] = useState(0);
  // axios.get("http://10.12.3.2:5000/user/get_history/" + shkon).then((res) => {
  //   setNameHistory(res.data.username1);
  //   setNameHistory2(res.data.username2);
  //   setScore1(res.data.score1);
  //   setScore2(res.data.score2);
  //   setAvatarHistory(res.data.avatar1);
  //   setAvatarHistory2(res.data.avatar1);


  // })
  const [hist, setHist] = useState([]);


  return (
    <>
      <div className="flex items-center  justify-center flex-row gap-[120px] ">
        {/* {{itsme} && } */}
        <div>

          {me && check == "not_friend" && (
            <div>
              <div>
                <button className="w-[200px] h-[50px] bg-[#1F9889] text-white text-[20px] justify-start font-[600] rounded-[20px] mt-[20px]  " onClick={handle_add}>
                  Add Friend
                </button>
              </div>
              <div>
                <button className="w-[200px] h-[50px] bg-red-700 text-white text-[20px] justify-start font-[600] rounded-[20px] mt-[20px] " onClick={handle_block}>
                  Block
                </button>

              </div>
            </div>
          )
          }
          {me && check == "friend" && (
            <div>
              <div>
                <button className="w-[200px] h-[50px] bg-red-700 text-white text-[20px]  font-[600] rounded-[20px] mt-[20px] " onClick={handle_block}>
                  Block
                </button>
              </div>
              <div>
                <button className="w-[200px] h-[50px] bg-yellow-400 text-white text-[20px]   font-[600] rounded-[20px] mt-[20px] " onClick={handle_remove}>
                  Remove
                </button>
              </div>
              <div>
                <>
                  {isLogged == "ON" ?
                    <button onClick={ButtonisPressed} type="button" className="w-[200px] h-[50px] bg-slate-600 text-white text-[20px]   font-[600] rounded-[20px] mt-[20px]">
                      Invite To A Game
                    </button> : <></>
                  }
                </>
              </div>
            </div>
          )

          }
          {me && check == "blocked" && (
            <button className="w-[200px] h-[50px] bg-blue-600 text-white text-[20px]  font-[600] rounded-[20px] mt-[20px] " onClick={handle_unblock}>
              Unblock
            </button>
          )
          }



        </div>
      </div>

      <div className="flex flex-col items-center py-6 justify-center  gap-[40px]">

        <figure>
          <img
            className="w-[140px] h-[140px] rounded-full"
            src={User.avatar}
            alt="avatar"
          />
        </figure>
        <header>
          <h1 className="text-[24px] font-[500] tracking-wider text-[#F2F2F2]">
            {fullname}
          </h1>
          <h6 className="text-[#828282] text-[20px] tracking-wider text-center">@{Username}</h6>
        </header>
        <div className="h-fit px-[27px] py-[21px] flex items-center gap-[40px] bg-[#262626] rounded-[20px] justify-between">
          <h1 className="text-[24px] text-white">
            Current <span className="text-[#ECCC6B]">Score</span> :
          </h1>
          <div className="flex items-center gap-[1rem]">
            <img className="w-9 h-9" src={fireIcon} alt="fire" />
            <h1 className="text-[22px] text-white">
              {User.score} <span className="text-[#ECCC6B]">PTS</span>
            </h1>
          </div>
        </div>
      </div>



      <div className="w-full justify-center flex">

        <div className="lg:w-5/12 lg:h-3/12 w-5/12 flex flex-col py-10">

          <div
            className=" h-3/12 px-[1.5rem] scrollbar-hide overflow-hidden overflow-y-scroll py-[1rem] rounded-[20px] flex flex-col  bg-[#262626] text-white text-[24px] mb-[12px] font-[600]">
            <>
              {hist.map((item: any) => (
                <>
                  <div className=" bg-[#1F9889] flex flex-row  rounded-full  text-base my-5 items-center hover:bg-[#C66AE1] text-center">

                    <div className="h-5/6 w-6/12 flex  flex-row text-white text-base text-center">
                      <img className="rounded-full w-4/12" src={item?.avatar1}></img>
                      <div className="">{item?.username1}</div>
                    </div>

                    <div className="h-3/6 w-1/12  flex flex-center text-base justify-center items-center text-white bg-black my-3 rounded-xl"> {item?.score1} - {item?.score2}</div>

                    <div className="h-5/6 w-6/12 flex justify-end flex-row text-white text-base text-center">
                      <div className="">{item?.username2}</div>
                      <img className="rounded-full w-4/12" src={item?.avatar2}></img>
                    </div>
                  </div>

                </>
              ))
              }

            </>
          </div>
        </div>
      </div>
    </>


  );
};

export default ProfileUp;
