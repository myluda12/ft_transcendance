import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { login } from "../reducers/UserSlice";
const Verify_2fa = () => {
  const { userId } = useParams();

  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length < 6) {
      setError("Invalid Code");
      //    window.alert(error);
      window.alert(error);
      return;
    }

    axios
      .post(`http://10.12.3.2:5000/auth/login/2fa/${code}/${userId}`, {}, {
        withCredentials: true,
      })
      .then((res) => {
          axios
            .get("http://10.12.3.2:5000/user/me", { withCredentials: true })
            .then((response) => {
              dispatch(login(response.data));
            });
        window.alert("You have Succesufully Signed in, Welcome back!");
        // navigate("/");
      })
      .catch((err) => {
        // window.alert("error : " + err.response.status);
        // console.log("Error : " + err);
        //window.alert(err);
        setError(err);
      });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="code"> Code: </label>
        <input
          type="text"
          value={code}
          placeholder="Enter Received Code"
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
        <button type="submit">
          <span>Confirm </span>
        </button>
      </form>
    </div>
  );
};
export default Verify_2fa;
