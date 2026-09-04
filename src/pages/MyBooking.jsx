import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Users,
  Baby,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { API_URL } from "../../config";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchBookings = () => {
    axios
      .get(`${API_URL}/api/bookings/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching bookings:", err));
  };

  const deleteBooking = async (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b23b2e",
      cancelButtonColor: "#6b6259",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/api/bookings/${bookingId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fetchBookings();
          toast.success("Booking deleted.");
        } catch (err) {
          console.error("Error deleting booking:", err);
          toast.error("Failed to delete booking.");
        }
      }
    });
  };

  const updateBookingStatus = (bookingId, status) => {
    axios
      .put(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        toast.success(`Booking ${status}`);
        fetchBookings();
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        toast.error("Failed to update booking status");
      });
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking,
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className="min-h-screen bg-sand-light px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center font-display text-3xl font-semibold text-ink">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="mt-10 text-center text-ink/60">No bookings found.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {currentBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {booking.resort_name}
                    </h3>
                    <p className="text-xs text-ink/50">
                      Booked on{" "}
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4 text-lagoon-dark" />
                    {formatDate(booking.check_in)} →{" "}
                    {formatDate(booking.check_out)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-lagoon-dark" />
                    {booking.adults} adult{booking.adults > 1 ? "s" : ""}
                  </span>
                  {booking.children > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Baby className="size-4 text-lagoon-dark" />
                      {booking.children} child
                      {booking.children > 1 ? "ren" : ""}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/viewMyBooking/${booking.id}`)}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={
                      booking.status === "Cancelled" ||
                      booking.status === "Confirmed"
                    }
                    onClick={() => {
                      Swal.fire({
                        title: "Cancel this booking?",
                        text: "This will mark the booking as Cancelled.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#b23b2e",
                        cancelButtonColor: "#6b6259",
                        confirmButtonText: "Yes, cancel it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          updateBookingStatus(booking.id, "Cancelled");
                        }
                      });
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-seal hover:bg-seal/10 hover:text-seal"
                    onClick={() => deleteBooking(booking.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full p-2 text-ink/60 transition-colors hover:bg-sand disabled:pointer-events-none disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "size-8 rounded-full text-sm transition-colors",
                  currentPage === i + 1
                    ? "bg-lagoon text-sand-light"
                    : "text-ink/60 hover:bg-sand",
                )}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-full p-2 text-ink/60 transition-colors hover:bg-sand disabled:pointer-events-none disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
