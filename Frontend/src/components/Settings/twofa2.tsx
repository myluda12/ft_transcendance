import React, {useEffect, useState } from "react";
import axios from "axios";
import * as FaIcons from 'react-icons/fa';
import { BiErrorCircle } from "react-icons/bi";
interface props{
    closemodel : React.Dispatch<React.SetStateAction<boolean>>
    ssucces :boolean
  }
  
const twofa2 = ({closemodel, ssucces}:props) => {
  const handlecode = (event:any) =>{
      closemodel(false)
      event.preventDefault();
  }
  return (

    <div className='faBackground'>
        <div className='facontainer'>
        <div className='Tp'>
            {ssucces == true &&(

              <FaIcons.FaLockOpen className='tfaicon'/>)
            }
            {ssucces == false &&(
              <BiErrorCircle className='tfaicon'/>)
            }
          
            {ssucces == false &&(
              <h1 className='tfamsg'> ERROR : WRONG KEY</h1>)
            }
              {ssucces == true &&(
              <h1 className='tfamsg'> SUCCESS : UNLOCK 2FA</h1>)
            }
          </div>
          <div className='footer'>
            <button className='continueButton' onClick={handlecode}>Close </button>
            </div>
        </div>
    </div>
  )
}

export default twofa2;