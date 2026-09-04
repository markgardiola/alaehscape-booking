import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import { API_URL } from "../../config";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-ink/5 py-2.5 text-sm last:border-0">
    <span className="font-medium text-ink/60">{label}</span>
    <span className="text-right text-ink">{value}</span>
  </div>
);

const ViewMyBooking = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

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

          <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="font-medium text-ink/60">Receipt</span>
            {booking.receipt ? (
              <button
                onClick={() => setShowReceipt(true)}
                className="overflow-hidden rounded-lg border border-ink/10 transition-opacity hover:opacity-80"
              >
                <img
                  src={booking.receipt}
                  alt="Receipt"
                  className="h-16 w-16 object-cover"
                />
              </button>
            ) : (
              <span className="text-ink/40">No receipt uploaded</span>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proof of Payment</DialogTitle>
          </DialogHeader>
          <img
            src={booking.receipt}
            alt="Receipt"
            className="max-h-[70vh] w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewMyBooking;
