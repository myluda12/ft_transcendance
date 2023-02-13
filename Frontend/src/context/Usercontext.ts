import axios from "axios";
import React from "react";


interface Userproperties
{

    id: string;
    full_name: string;
    username: string;
    avatar: string;
    is_two_fa_enable: boolean;
    two_fa_code: string;
    email: string;
    status: any;
    win: number;
    lose: number;
    score: number;
    achievements: string[]
    friends: any[];
}
  const getuserdata = async ()=>
  {
    var ret : Userproperties | "{}" = "{}"
    await axios.get("http://10.12.3.2:5000/user/user", {withCredentials: true})
    .then((res)=>{
        const data : Userproperties | null = res.data
        localStorage.setItem("user", JSON.stringify(data))
        ret = res.data;
    }).catch((err) => {
        ret = "{}"
    })
    return ret;
  }

export const Usercontext = React.createContext<Promise<Userproperties | "{}" >>(getuserdata());