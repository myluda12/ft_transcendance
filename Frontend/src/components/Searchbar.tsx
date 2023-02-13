import React ,{useState} from 'react'
import {AiOutlineHome} from 'react-icons/ai'
import "./styles.css"
import {AiOutlineSearch} from 'react-icons/ai'
import "./Sb.css"
import { Navigate ,useNavigate} from 'react-router-dom'



const Searchbar = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const handleredirect = () =>
  {
    navigate("/profile/" + value);
  }
  return (
    <form  onSubmit={handleredirect}>
    <div className='searchbar'>
      <div className="searchInputs">
        <input type="text" value={value} placeholder="Enter the Intra login" onChange={e=>setValue(e.target.value)}/>
        <div className='searchicon'>
          <AiOutlineSearch/>
        </div>
      </div>
    </div>
    </form>
  )
}

export default Searchbar