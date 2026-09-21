import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { API_URL } from "../../../config";

const RANGE_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const peso = (n) => `₱${Number(n || 0).toLocaleString()}`;

const RevenueReport = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/owner/revenue?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching revenue report:", err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  if (loading && !data) return <p className="text-ink/60">Loading...</p>;
  if (!data) return <p className="text-ink/60">Failed to load revenue report.</p>;

  const { summary, byResort, revenueOverTime, bookings, commissionRate } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Revenue Report
        </h1>
        <div className="flex gap-1.5 rounded-full bg-white p-1 shadow-sm">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                days === opt.value
                  ? "bg-lagoon text-white"
                  : "text-ink/60 hover:bg-sand"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-ink/60">
        Only bookings that were actually confirmed and paid count as
        revenue here -- cancelled or refunded stays are excluded.
        ALAI-eh's current commission rate is <strong>{commissionRate}%</strong>.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-ink/60">Confirmed Bookings</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {summary.bookings}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink/60">Gross Revenue</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {peso(summary.grossRevenue)}
          </p>
        </Card>
        <Card className="p-5 bg-lagoon/10">
          <p className="text-sm text-ink/70">Your Payout</p>
          <p className="mt-1 font-display text-2xl font-semibold text-lagoon-dark">
            {peso(summary.netPayout)}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            after {peso(summary.alaiehCommission)} platform commission
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-display text-lg font-semibold text-ink">
          Revenue Over Time
        </h2>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b1b1810" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₱${v}`} />
              <Tooltip formatter={(v) => peso(v)} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3e9c93"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {byResort.length > 1 && (
        <Card className="p-5">
          <h2 className="font-display text-lg font-semibold text-ink">
            By Resort
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {byResort.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg bg-sand-light px-3 py-2 text-sm"
              >
                <span className="text-ink">{r.name}</span>
                <span className="text-right">
                  <span className="font-medium text-lagoon-dark">
                    {peso(r.netPayout)}
                  </span>
                  <span className="ml-2 text-ink/50">
                    {r.bookings} bookings
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="font-display text-lg font-semibold text-ink">
          Counted Bookings ({days}d)
        </h2>
        {bookings.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">
            No confirmed bookings in this range.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg bg-sand-light px-3 py-2 text-sm"
              >
                <span className="text-ink">
                  {b.guest_name} · {b.resort_name}
                </span>
                <span className="text-right">
                  <span className="font-medium text-lagoon-dark">
                    {peso(b.total_price)}
                  </span>
                  <span className="ml-2 text-ink/50">
                    {b.created_at_display}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RevenueReport;
