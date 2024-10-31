import React from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function AfterRegister() {

  const navigate=useNavigate()

  return (
    
    <div className="div-box">
      <div>
        <p>You have been registered successfully!</p>
      </div>
      <div className="can-signIn">
        <p>You can sign in now</p>
        <button
          type="btn"
          className="btn2"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Sign-in");
          }}
        >
          Sign in 
        </button>
      </div>
    </div>
  );
}
