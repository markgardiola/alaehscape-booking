import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Star,
  Wallet,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/owner", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/owner/bookings", label: "My Bookings", icon: ClipboardList },
  { to: "/owner/reviews", label: "My Reviews", icon: Star },
  { to: "/owner/revenue", label: "Revenue Report", icon: Wallet },
  { to: "/owner/settings", label: "Settings", icon: Settings },
];

const OwnerSideBar = () => (
  <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-ink">
    <div className="flex items-center gap-2.5 p-4">
      <img
        src="/images/logo.png"
        alt=""
        className="h-9 w-9 shrink-0 rounded-full"
      />
      <span className="font-display text-lg font-semibold text-sand-light">
        ALAI-eh
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
            <span className="flex-1">{label}</span>
          </NavLink>
        );
      })}
    </nav>
  </aside>
);

export default OwnerSideBar;
