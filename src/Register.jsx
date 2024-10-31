import React from "react";

export default function Register() {
  return (
    <div className=" box">
      <div className="prezantimi">
        <label htmlFor="emri">
          <input type="text" id="emri" placeholder="Enter your name"></input>
        </label>
        <label htmlFor="mbiemri">
          <input type="text" id="mbiemri" placeholder="Enter your surname"></input>
        </label>
      </div>
      <label htmlFor="email">
        <input type="text" id="email" placeholder="Enter your email"></input>
      </label>
      <label htmlFor="password">
        <input type="text" id="" placeholder="Enter your pasasword"></input>
      </label>
      <button>Register</button>
      <div className="account">
        <p className="text">already have an account ?</p>
        <button>Sign in</button>
      </div>
    </div>
  );
}
