import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role = "admin", redirectTo }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== role) {
    return (
      <Navigate
        to={redirectTo || (role === "owner" ? "/owner/login" : "/adminSignIn")}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
