import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  Hotel,
  ClipboardList,
  MessageSquareText,
  BadgeAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_URL } from "../../config";

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
    to: "/adminDashboard/refund-requests",
    label: "Refund Requests",
    icon: BadgeAlert,
    badgeKey: "refundRequests",
  },
  {
    to: "/adminDashboard/feedbacks",
    label: "Customer Feedback",
    icon: MessageSquareText,
  },
];

const POLL_INTERVAL_MS = 30000;

const AdminSideBar = () => {
  const [refundRequestCount, setRefundRequestCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCount = () => {
      axios
        .get(`${API_URL}/api/bookings/refund-requests/count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setRefundRequestCount(res.data.count))
        .catch((err) =>
          console.error("Error fetching refund request count:", err),
        );
    };

    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [token]);

  const badgeCounts = { refundRequests: refundRequestCount };

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
        {navItems.map(({ to, end, label, icon, badgeKey }) => {
          const Icon = icon;
          const badgeCount = badgeKey ? badgeCounts[badgeKey] : 0;
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
              {badgeCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-seal text-[11px] font-semibold text-white">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSideBar;
