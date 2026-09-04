import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Users, Hotel, CalendarCheck, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { API_URL } from "../../../config";

const statCards = [
  {
    key: "users",
    label: "Users",
    icon: Users,
    to: "/adminDashboard/users",
    accent: "bg-lagoon/10 text-lagoon-dark",
  },
  {
    key: "resorts",
    label: "Beach Resorts",
    icon: Hotel,
    to: "/adminDashboard/resorts",
    accent: "bg-ink/10 text-ink",
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: CalendarCheck,
    to: "/adminDashboard/bookings",
    accent: "bg-seal/10 text-seal",
  },
];

const Dashboard = () => {
  const [totals, setTotals] = useState({ users: 0, resorts: 0, bookings: 0 });

  useEffect(() => {
    axios
      .get(`${API_URL}/api/total_users`)
      .then((res) => setTotals((t) => ({ ...t, users: res.data.totalUsers })))
      .catch((error) => console.error("Error fetching total users:", error));

    axios
      .get(`${API_URL}/api/total_resorts`)
      .then((res) =>
        setTotals((t) => ({ ...t, resorts: res.data.totalResorts })),
      )
      .catch((error) => console.error("Error fetching total resorts:", error));

    axios
      .get(`${API_URL}/api/total_bookings`)
      .then((res) =>
        setTotals((t) => ({ ...t, bookings: res.data.totalBookings })),
      )
      .catch((error) => console.error("Error fetching total bookings:", error));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Admin Overview
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {statCards.map(({ key, label, icon, to, accent }) => {
          const Icon = icon;
          return (
            <Link key={key} to={to}>
              <Card className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className={cn("rounded-xl p-2.5", accent)}>
                    <Icon className="size-6" />
                  </div>
                  <ChevronRight className="size-4 text-ink/30" />
                </div>
                <p className="mt-4 text-sm font-medium text-ink/60">{label}</p>
                <p className="mt-1 font-display text-3xl font-semibold text-ink">
                  {totals[key]}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
