import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import OwnerSideBar from "../../components/OwnerSideBar";
import OwnerTopBar from "../../components/OwnerTopBar";

const OwnerPortalLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/owner/login" replace />;
  }

  return (
    <div className="min-h-screen bg-sand-light">
      <OwnerSideBar />
      <div className="ml-64">
        <OwnerTopBar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OwnerPortalLayout;
