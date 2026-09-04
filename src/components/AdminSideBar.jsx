import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Hotel,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
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
];

const AdminSideBar = ({ isOpen, setIsOpen }) => {
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-ink transition-[width] duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 p-4",
          !isOpen && "justify-center",
        )}
      >
        <img
          src="/images/logo.png"
          alt=""
          className="h-9 w-9 shrink-0 rounded-full"
        />
        {isOpen && (
          <span className="font-display text-lg font-semibold text-sand-light">
            Ala·Eh·scape
          </span>
        )}
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
                  !isOpen && "justify-center px-0",
                )
              }
              title={!isOpen ? label : undefined}
            >
              <Icon className="size-5 shrink-0" />
              {isOpen && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="m-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-sand-light/60 transition-colors hover:bg-white/5 hover:text-sand-light"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
      </button>
    </aside>
  );
};

export default AdminSideBar;
