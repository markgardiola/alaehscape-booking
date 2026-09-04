import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminSideBar from "../../components/AdminSideBar";
import AdminTopBar from "../../components/AdminTopBar";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  // Default: collapsed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!token) {
    return <Navigate to="/signIn" replace />;
  }

  return (
    <div className="min-h-screen bg-sand-light">
      <AdminSideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-16",
        )}
      >
        <AdminTopBar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
