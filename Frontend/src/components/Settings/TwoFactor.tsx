import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import twofa from "./twofa";
import twofa2 from "./twofa2";
import Modal from "./Modal";
import QRCOde from 'qrcode.react'
import styled from "styled-components";
import { toast } from "react-toastify";

import { Props as Interface } from "./interface";
interface Props extends Interface {
  setTwoFactor: React.Dispatch<React.SetStateAction<boolean>>;
}

const TwoFactor: FC<Props> = ({ isOpen, setIsOpen, contentLabel, setTwoFactor }) => {
  const [twoFactorModal, setModal] = useState<boolean>(false);
  const [openmodel, setopenmodel1] = useState(false);
  const [toggled, settoggled] = useState(false);
  const [isenable, isenable1] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [trigger, setTrigger] = useState(false);
  const [updated, setUpdate] = useState(false);

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // console.log("submit");
  }
  let imageBolb: any;

  // const GetQRCode = async () => {
  //   return (<>
  //     <img src="" alt="qr" />
  //   </>)
  // }
  // const [image, setImage] = useState("");
  // axios.get('http://10.12.3.2:5000/auth/login/2fa/enable', {withCredentials: true})
  // .then((res)=>
  // {
    
  //   setImage(res.data);
  // })
  useEffect(() => {
    // if (isOpen) {
    //   axios.get("http://10.12.3.2:5000/auth/login/2fa/enable", { withCredentials: true }).then((res) => {
    //     console.log("backend pingged");
    //   })
    // }
    
    setUpdate(!updated);
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} contentLabel={contentLabel}>
      <Style onSubmit={HandleSubmit}>
        <div className="w-[1012px] h-fit rounded-[20px] px-[61px] py-[72px] bg-[#262626] relative">
          <div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center gap-[22px]">
                <img id="qr-code"
                  src="http://10.12.3.2:5000/auth/login/2fa/enable"
                  alt="2fa"
                  height={300}
                  width={300}
                />
                <h1 className="text-[28px] font-[600] text-[#F2F2F2] tracking-wider">
                  Scan your QrCode
                </h1>
                {/* <div className="w-[304px] h-[230px] rounded-[23px] bg-white">
                  <label>Code: </label>
                  <input
                    value={code}
                    type="text"
                    placeholder="Enter Your Code"
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button type="submit">Enable</button>
                </div> */}
              </div>
            </div>
            {/* -------- 3 -------- */}
            {/* <div className="flex justify-center">
          <button className="w-fit bg-[#A44F4F] px-[81px] py-[14px] text-[#202020] text-[24px] font-[500] rounded-[10px]">
            Disable 2FA
          </button>
        </div> */}
          </div>
          <div className="absolute top-0 translate-y-[-50%]">
            <button className="w-fit bg-[#B7ABFF] px-[30px] py-[5px] text-[#202020] text-[24px] font-[500] rounded-[10px]">
              Two Factor Authentication
            </button>
            <br />
            <button className="flex">
              Disable Two-fa, Only Click if You are Already Enabled This Feature
            </button>
          </div>
        </div>
      </Style>
    </Modal>
  );
};

export default TwoFactor;
const Style = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-inline: auto;
  gap: 10px;
  .qr-code {
    width: 300px;
    height: 300px;
    margin: 0 auto 10px;
    background-color: var(--background-200);
    border-radius: 5px;
  }
`;

