import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminSideBar from "../../components/AdminSideBar";
import AdminTopBar from "../../components/AdminTopBar";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signIn" replace />;
  }

  return (
    <div className="min-h-screen bg-sand-light">
      <AdminSideBar />
      <div className="ml-64">
        <AdminTopBar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
