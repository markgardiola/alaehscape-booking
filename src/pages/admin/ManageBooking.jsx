import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import AdminPagination from "@/components/Pagination";
import { API_URL } from "../../../config";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const navigate = useNavigate();

  const fetchBookings = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching bookings:", err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = (bookingId, status) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${API_URL}/api/bookings/${bookingId}/status`,
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

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking,
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Manage Bookings
      </h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3 font-medium">Booking ID</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Resort</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-ink/50">
                  No bookings found.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking) => (
                <tr
                  key={booking.booking_id}
                  className="border-b border-ink/5 last:border-0"
                >
                  <td className="px-4 py-3">{booking.booking_id}</td>
                  <td className="px-4 py-3">{booking.username}</td>
                  <td className="px-4 py-3">{booking.resort_name}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {formatDate(booking.check_in)} to{" "}
                    {formatDate(booking.check_out)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/adminDashboard/bookingDetails/${booking.booking_id}`,
                          )
                        }
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={booking.status === "Confirmed"}
                        onClick={() => {
                          Swal.fire({
                            title: "Approve this booking?",
                            text: "This will mark the booking as Confirmed.",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#3e9c93",
                            cancelButtonColor: "#6b6259",
                            confirmButtonText: "Yes, approve it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              updateBookingStatus(
                                booking.booking_id,
                                "Confirmed",
                              );
                            }
                          });
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-seal hover:bg-seal/10 hover:text-seal"
                        disabled={booking.status === "Cancelled"}
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
                              updateBookingStatus(
                                booking.booking_id,
                                "Cancelled",
                              );
                            }
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ManageBooking;
