import React, { useState } from "react";
import { Receipt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Shows whatever "proof of payment" exists for a booking: the uploaded
 * screenshot for GCash, or a generated receipt view for PayPal (which has
 * no image, just a transaction record).
 */
const PaymentReceipt = ({ booking }) => {
  const [open, setOpen] = useState(false);

  if (booking.payment_method === "gcash" && booking.receipt) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="overflow-hidden rounded-lg border border-ink/10 transition-opacity hover:opacity-80"
        >
          <img
            src={booking.receipt}
            alt="Receipt"
            className="h-16 w-16 object-cover"
          />
        </button>
        <Dialog open={open} onOpenChange={setOpen}>
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
      </>
    );
  }

  if (booking.payment_method === "paypal" && booking.paypal_capture_id) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-ink/10 px-3 py-1.5 text-sm text-lagoon-dark transition-colors hover:bg-sand"
        >
          <Receipt className="size-4" />
          View Receipt
        </button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>PayPal Receipt</DialogTitle>
            </DialogHeader>
            <div className="rounded-xl bg-sand-light p-5">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <span className="font-display text-lg font-semibold text-ink">
                  Ala·Eh·scape
                </span>
                <span className="text-xs text-ink/50">
                  Booking #{booking.id}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink/60">Resort</span>
                  <span className="text-ink">{booking.resort_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Amount paid</span>
                  <span className="font-medium text-ink">
                    ₱{Number(booking.total_price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Payment method</span>
                  <span className="text-ink">PayPal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Transaction ID</span>
                  <span className="text-ink">{booking.paypal_capture_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Date</span>
                  <span className="text-ink">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <span className="text-ink/40">No receipt available</span>;
};

export default PaymentReceipt;
