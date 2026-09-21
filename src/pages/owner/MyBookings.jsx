import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Users, Baby } from "lucide-react";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { API_URL } from "../../../config";

const PER_PAGE = 8;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/owner/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching bookings:", err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexOfLast = currentPage * PER_PAGE;
  const paginated = bookings.slice(indexOfLast - PER_PAGE, indexOfLast);
  const totalPages = Math.ceil(bookings.length / PER_PAGE);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        My Bookings
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Live bookings across all your resorts.
      </p>

      {loading ? (
        <p className="mt-6 text-ink/60">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="mt-6 text-ink/60">No bookings yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {paginated.map((b) => (
            <Card key={b.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">
                    {b.guest_name} · {b.resort_name}
                  </p>
                  {b.stay_type_name && (
                    <p className="text-sm text-ink/60">{b.stay_type_name}</p>
                  )}
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-ink/60">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-lagoon-dark" />
                  {b.check_in_display} → {b.check_out_display}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4 text-lagoon-dark" />
                  {b.adults} adult{b.adults > 1 ? "s" : ""}
                </span>
                {b.children > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Baby className="size-4 text-lagoon-dark" />
                    {b.children} child{b.children > 1 ? "ren" : ""}
                  </span>
                )}
                <span className="font-medium text-lagoon-dark">
                  ₱{Number(b.total_price).toLocaleString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default MyBookings;
