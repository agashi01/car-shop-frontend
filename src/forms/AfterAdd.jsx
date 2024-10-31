import React from "react";
import { useNavigate } from "react-router-dom";


// eslint-disable-next-line react/prop-types
export default function AfterAdd() {

  const navigate = useNavigate()

  return (
    <div className="div-box">
      <div>
        <p>Your car has been created and published!</p>
      </div>
      <div>
        <p>You Can Go Home</p>
        <button
          type="btn"
          className="btn2"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
}
