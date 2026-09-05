import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Hotel,
  ClipboardList,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    to: "/adminDashboard",
    end: true,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { to: "/adminDashboard/users", label: "User Management", icon: Users },
  { to: "/adminDashboard/resorts", label: "Resort Listings", icon: Hotel },
  {
    to: "/adminDashboard/bookings",
    label: "Booking Requests",
    icon: ClipboardList,
  },
  {
    to: "/adminDashboard/feedbacks",
    label: "Customer Feedback",
    icon: MessageSquareText,
  },
];

const AdminSideBar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-ink">
      <div className="flex items-center gap-2.5 p-4">
        <img
          src="/images/logo.png"
          alt=""
          className="h-9 w-9 shrink-0 rounded-full"
        />
        <span className="font-display text-lg font-semibold text-sand-light">
          Ala·Eh·scape
        </span>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ to, end, label, icon }) => {
          const Icon = icon;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-lagoon text-sand-light"
                    : "text-sand-light/60 hover:bg-white/5 hover:text-sand-light",
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSideBar;
