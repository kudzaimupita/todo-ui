import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const authenticated = !localStorage.getItem("token");

  return authenticated ? children : <Navigate to="/" />;
};

export default PublicRoute;
