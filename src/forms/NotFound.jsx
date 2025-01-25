// src/components/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button className="btn2" style={{width:'150px'}}onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default NotFound;