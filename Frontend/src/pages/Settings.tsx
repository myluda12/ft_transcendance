import avatar1 from "../Assets/Ellipse 213.png";
import DisplayName from "../components/Settings/DisplayName";
import TwoFactor from "../components/Settings/TwoFactor";
import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import Modal from "react-modal";
import Checkbox from "./Checkbox";
import { Usercontext } from "../context/Usercontext";
import Swal from 'sweetalert2'
import { Navigate, useNavigate } from "react-router-dom";
import Botona from "./Botona";


type DataType = {
  isTwoFactor: false;
};

const Settings = ({ state }: { state: boolean }) => {
  const [isChecked, setIsChecked] = useState<boolean>(state);
  const [twoFactorModal, setModal] = useState<boolean>(false);
  const [User, GetUser] = useState("")
  const [avatar, NewAvatar] = useState('');
  const [Username, setUsername] = useState("");
  const [updated, setUpdated] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const handleModal =  useCallback(() => {
    // console.log("sanfrasisco : " + isChecked);
    if (!isChecked) {
      // console.log("wash true or fals : " + twoFactorModal);
      setModal(true);
      setUpdated((prev : boolean) => !prev);
      return;
    }
  }, [isChecked] );

  const navigate = useNavigate();
  // useEffect(() => {

  // }, [updated])

  const handleDisable = async (e: any) => {
    e.preventDefault();
    // console.log("fass fass " + isChecked);
    const url1 = "http://10.12.3.2:5000/auth/login/2fa/disable";
    let response = await axios.post(url1, isChecked,
      {
        withCredentials: true,
      }).then((res) => {
        window.location.reload();
      }).catch(err => {
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: '2FA Already Disabled',
        //   footer: '<Link to={"/"} Why do I have this issue? Probably because Baghi t7esselna</Link>'
        // })
        window.alert("2FA ALRREADY DISABLED");
        window.location.reload();
      });
    // if (!isChecked)
    // {
    //   console.log("clicked here");
    //   await axios.post('http://10.12.3.2:5000/auth/login/2fa/disable',{withCredentials: true})
    //  .then(res => {
    //   window.alert("haheho");
    //   setIsChecked(false);
    //  }).catch(err=> {
    //    window.alert("azbii already disabled ");
    //    console.log("error : " +err);
    //  })
    // }
    // else
    //   window.alert("already disable hehe");

  }
  axios.get('http://10.12.3.2:5000/user/user', { withCredentials: true })
    .then(res => {
      GetUser(res.data.full_name);
      NewAvatar(res.data.avatar);
      setUsername(res.data.username);
      setEnabled(res.data.is_two_fa_enable);
    }).catch(err => {
      // console.log(err)
    })
    if (twoFactorModal)
         return (
          <TwoFactor
            isOpen={twoFactorModal}
            setIsOpen={setModal}
            contentLabel="SCAN QR CODE"
            setTwoFactor={setIsChecked}
          />  );
  return (
    <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide">
      <h1 className="text-[77px] text-[#F2F2F2] text-center font-[700] tracking-wider ">
        Settings
      </h1>
      <section className="flex sm:flex-row-reverse justify-center py-4 gap-x-8 flex-col px-4">
        {/* -------- profile info --------- */}
          {/* ------ left side ----- */}
          <figure className="flex flex-col justify-center items-center gap-y-5">
              <img
                className="h-72 w-72 rounded-full"
                src={avatar}
                alt="avatar"
              />
            <div>
            <h1 className="text-[24px] font-[500] tracking-wider text-[#F2F2F2] capitalize">
                {User}
              </h1>
              <h6 className="text-[#828282] text-[20px] tracking-wider">
                {Username}
              </h6>
            </div>
            </figure>
        {/* ------ top part ------- */}


        <div className="h-full py-10">
          <DisplayName setUser={GetUser} setAvatar={NewAvatar} />
        
        {/* ------ bottom part ------ */}
        <div className="flex gap-x-3">
           
            <Checkbox onClick={handleModal}  name="isTwoFactor" id="two-factor" checked={isChecked}>
              Two Factor Authentication
            </Checkbox>


            

           
            <br />


          <div>
            {/* <button onClick={handleDisable} name="disable">
              Disable Two-Fa-Authentificatios.<br /> "Only Click Here if You Are Already Enabled this Feature"
            </button> */}

            <Botona onClick={handleDisable} name="disable">
              Disable Two-Fa-Authentificatios.
            </Botona>


            
          </div>


        </div>
        </div>
      </section>
    </div>
  );

};

export default Settings;
