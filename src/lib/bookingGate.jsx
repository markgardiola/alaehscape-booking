import React from "react";
import { toast } from "react-toastify";

/**
 * Shared "Book Now" gate used anywhere a resort can be booked from
 * (resort details, destination area pages, etc). Sends logged-in users
 * straight to the booking form; prompts everyone else to sign in first.
 */
export const goToBooking = (resortId) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "user") {
    window.location.href = `/booking/${resortId}`;
    return;
  }

  toast.warning(
    ({ closeToast }) => (
      <div>
        <p className="mb-2 text-center">
          Please log in to proceed with booking.
        </p>
        <div className="flex justify-center">
          <button
            className="rounded-full bg-lagoon px-4 py-1.5 text-sm font-medium text-sand-light hover:bg-lagoon-dark"
            onClick={() => {
              window.location.href = "/signIn";
              closeToast();
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: 5000,
      closeOnClick: false,
      closeButton: true,
    },
  );
};
