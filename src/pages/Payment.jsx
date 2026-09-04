import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingSteps from "@/components/BookingSteps";
import { API_URL } from "../../config";

const Payment = () => {
  const [receipt, setReceipt] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const gcashNumber = "0917-123-4567";
  const QrCode = "/images/QR_code.png";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setReceipt(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receipt) {
      toast.error("Please upload a receipt.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const bookingId = localStorage.getItem("bookingId");

      const formData = new FormData();
      formData.append("receipt", receipt);
      formData.append("bookingId", bookingId);

      await axios.post(`${API_URL}/api/upload_receipt`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Receipt uploaded successfully!");
      localStorage.removeItem("bookingId");
      navigate("/");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload receipt. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-sand-light px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-lg">
        <BookingSteps current={3} />

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-center font-display text-2xl font-semibold text-ink">
            GCash Payment
          </h1>
          <p className="mt-2 text-center text-sm text-ink/60">
            Account Number:{" "}
            <span className="font-medium text-ink">{gcashNumber}</span>
          </p>

          <div className="mt-4 flex justify-center">
            <img
              src={QrCode}
              alt="GCash QR Code"
              className="w-full max-w-[220px] rounded-xl border border-ink/10"
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="text-sm font-medium text-ink/80">
              Upload your payment receipt
            </label>

            <label
              htmlFor="receipt"
              className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-ink/25 bg-sand-light px-4 py-6 text-sm text-ink/60 transition-colors hover:border-lagoon hover:text-ink"
            >
              <Upload className="size-4" />
              {receipt ? receipt.name : "Choose an image file"}
            </label>
            <input
              id="receipt"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview && (
              <div className="mt-4">
                <p className="mb-1.5 text-sm text-ink/60">Receipt Preview:</p>
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Receipt Preview"
                    className="max-w-[260px] rounded-xl border border-ink/10"
                  />
                </div>
              </div>
            )}

            <Button type="submit" size="lg" className="mt-6 w-full">
              Submit Receipt
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
