import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import DetailRow from "@/components/DetailRow";
import PaymentReceipt from "@/components/PaymentReceipt";
import { API_URL } from "../../config";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const ViewMyBooking = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBooking(res.data))
      .catch((err) => console.error("Error fetching booking:", err));
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="pt-32 pb-16 text-center text-ink/60">
        Loading your booking...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-light px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back to My Bookings
        </Button>

        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="font-display text-2xl font-semibold text-ink">
              Booking Details
            </h1>
            <StatusBadge status={booking.status} />
          </div>

          <DetailRow label="Booking ID" value={booking.id} />
          <DetailRow label="Name" value={booking.full_name} />
          <DetailRow label="Resort" value={booking.resort_name} />
          <DetailRow label="Email" value={booking.email} />
          <DetailRow label="Mobile" value={booking.mobile} />
          <DetailRow label="Address" value={booking.address} />
          <DetailRow label="Check-In" value={formatDate(booking.check_in)} />
          <DetailRow label="Check-Out" value={formatDate(booking.check_out)} />
          <DetailRow label="Adults" value={booking.adults} />
          <DetailRow label="Children" value={booking.children} />
          {booking.total_price && (
            <DetailRow
              label="Total Paid"
              value={`₱${Number(booking.total_price).toLocaleString()}`}
            />
          )}
          {booking.payment_method && (
            <DetailRow
              label="Payment Method"
              value={booking.payment_method === "paypal" ? "PayPal" : "GCash"}
            />
          )}
          {booking.cancellation_reason && (
            <DetailRow
              label="Your Cancellation Reason"
              value={booking.cancellation_reason}
            />
          )}
          {booking.refund_decision_note && (
            <DetailRow
              label="Admin Note"
              value={booking.refund_decision_note}
            />
          )}
          {booking.refunded_at && (
            <DetailRow
              label="Refunded On"
              value={formatDate(booking.refunded_at)}
            />
          )}

          <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="font-medium text-ink/60">Receipt</span>
            <PaymentReceipt booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMyBooking;
