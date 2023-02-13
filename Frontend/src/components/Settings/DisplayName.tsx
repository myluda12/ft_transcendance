import axios from "axios";
import React, { useState } from "react";

const DisplayName = (props : any) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzOTIxIiwiaWF0IjoxNjczNDgxMDkzLCJleHAiOjE2NzM1Njc0OTN9.dyBDDlnX81D8Hmb6Sj7znPq3j8D62cx2RCYmW47satw"
    const [newUsername, SetNewUsername] = useState('');
    const url3 = "http://10.12.3.2:5000/user/edit_full_name/"
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>
    {
      e.preventDefault();
      // console.log(url3 + newUsername);
         let response = await axios.post(url3 + newUsername,{ newUsername },
          {
           withCredentials: true,
           
         }).then((response) =>{
          props.setUser(newUsername);
          //SetNewUsername(newUsername);
          // console.log(props);
         }).catch((err) =>
         {
          window.alert("Error While Updating Your Name ");
         });
        
    }
    const HandleFile = (event: any | null) =>{
      const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file",file);
        axios.post('http://10.12.3.2:5000/user/upload/',formData,{
          headers:{
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }).then((response)=>{

          props.setAvatar(formData);
        }).catch((err) =>{
          window.alert("Error While Uploading Your File");
        });
    }
  
  return (
    <form onSubmit={handleSubmit}>
    <div className="w-[1012px] h-[208px] rounded-[20px] px-[61px] py-[72px] bg-[#262626] relative">
      <div className="flex justify-between">
      <label>
        New Username:
        <input type="text" value={newUsername} onChange={e => SetNewUsername(e.target.value)} />
      </label>
        <button type="submit" className="w-fit bg-[#4FA48F] px-[81px] py-[14px] text-[#202020] text-[24px] font-[500] rounded-[10px]">
          Save
        </button>
      </div>
      <div className="absolute top-0 translate-y-[-50%]">
        <button className="w-fit bg-[#B7ABFF] px-[30px] py-[5px] text-[#202020] text-[24px] font-[500] rounded-[10px]">
          Display name
        </button>
      </div>
      <div>
        <label>
          Upload new Avatar:
          <input type="file" onChange={HandleFile}></input>
        </label>
      </div>
    </div>
    </form>
  );
};

export default DisplayName;
