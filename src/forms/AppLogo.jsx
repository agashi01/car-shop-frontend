import React from "react";
import Logo from "../Logo.jsx";
import { useNavigate, Outlet } from "react-router-dom";

export default function AppLogo() {
  const navigate = useNavigate()
  return (
    <>
      <div className="onclick-logo" onClick={() => navigate("/")}>
        <Logo />
      </div>
      <Outlet />
    </>
  )

}
