import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, ClipboardList, Wallet, HandCoins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { API_URL } from "../../../config";

const peso = (n) => `₱${Number(n || 0).toLocaleString()}`;

const Overview = () => {
  const [resorts, setResorts] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API_URL}/api/owner/resorts`, { headers }),
      axios.get(`${API_URL}/api/owner/revenue?days=30`, { headers }),
    ])
      .then(([resortsRes, revenueRes]) => {
        setResorts(resortsRes.data);
        setRevenue(revenueRes.data);
      })
      .catch((err) => console.error("Error fetching overview:", err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="text-ink/60">Loading...</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Overview
      </h1>

      {revenue && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="inline-flex size-9 items-center justify-center rounded-full bg-lagoon/10 text-lagoon-dark">
              <ClipboardList className="size-5" />
            </div>
            <p className="mt-3 text-sm text-ink/60">Bookings (30d)</p>
            <p className="mt-0.5 font-display text-2xl font-semibold text-ink">
              {revenue.summary.bookings}
            </p>
          </Card>
          <Card className="p-5">
            <div className="inline-flex size-9 items-center justify-center rounded-full bg-lagoon/10 text-lagoon-dark">
              <Wallet className="size-5" />
            </div>
            <p className="mt-3 text-sm text-ink/60">Gross Revenue (30d)</p>
            <p className="mt-0.5 font-display text-2xl font-semibold text-ink">
              {peso(revenue.summary.grossRevenue)}
            </p>
          </Card>
          <Card className="p-5">
            <div className="inline-flex size-9 items-center justify-center rounded-full bg-sand text-ink">
              <HandCoins className="size-5" />
            </div>
            <p className="mt-3 text-sm text-ink/60">Your Payout (30d)</p>
            <p className="mt-0.5 font-display text-2xl font-semibold text-ink">
              {peso(revenue.summary.netPayout)}
            </p>
          </Card>
        </div>
      )}

      <Card className="p-5">
        <h2 className="font-display text-lg font-semibold text-ink">
          Your Resorts
        </h2>
        {resorts.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">
            No resorts linked to your account yet.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {resorts.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-xl border border-ink/10 bg-sand-light p-3"
              >
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.name}
                    className="size-14 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-ink">{r.name}</p>
                  <p className="flex items-center gap-1 text-sm text-ink/60">
                    <MapPin className="size-3.5" />
                    {r.barangay || r.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/owner/bookings"
          className="text-sm font-medium text-lagoon-dark hover:underline"
        >
          View all bookings →
        </Link>
        <Link
          to="/owner/reviews"
          className="text-sm font-medium text-lagoon-dark hover:underline"
        >
          View all reviews →
        </Link>
        <Link
          to="/owner/revenue"
          className="text-sm font-medium text-lagoon-dark hover:underline"
        >
          Full revenue report →
        </Link>
      </div>
    </div>
  );
};

export default Overview;
