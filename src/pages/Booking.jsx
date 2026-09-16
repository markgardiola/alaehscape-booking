import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Users,
  Baby,
  Images,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import BookingSteps from "@/components/BookingSteps";
import BookingCalendar from "@/components/BookingCalendar";
import RoomPreviewDialog from "@/components/RoomPreviewDialog";
import IconInput from "@/components/IconInput";
import { API_URL } from "../../config";

const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / oneDay);
  return diff > 0 ? diff : 0;
};

const Booking = () => {
  const { resortId } = useParams();
  const navigate = useNavigate();
  const [resort, setResort] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [previewRoom, setPreviewRoom] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
  });

  const fetchBookedDates = () => {
    axios
      .get(`${API_URL}/api/resorts/${resortId}/booked-dates`)
      .then((res) => setBookedRanges(res.data))
      .catch((err) =>
        console.error("Error fetching resort availability:", err),
      );
  };

  useEffect(() => {
    fetchBookedDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resortId]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/resorts/${resortId}`)
      .then((response) => setResort(response.data))
      .catch((error) => console.error("Error fetching resort details:", error));

    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (email) {
      setForm((prevForm) => ({ ...prevForm, email }));

      axios
        .get(`${API_URL}/api/get_user_info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const { username, phone, address } = res.data.user;
          setForm((prevForm) => ({
            ...prevForm,
            fullName: username || "",
            mobile: phone || "",
            address: address || "",
          }));
        })
        .catch((err) =>
          console.error("Error fetching user info from DB:", err),
        );
    }
  }, [resortId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nights = nightsBetween(form.checkIn, form.checkOut);
  const pricePerNight = resort ? Number(resort.price_per_night) : 0;
  const totalPrice = nights > 0 ? pricePerNight * nights : 0;
  const datesInvalid = form.checkIn && form.checkOut && nights === 0;

  const handleBooking = (e) => {
    e.preventDefault();

    if (datesInvalid) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }
    if (nights === 0) {
      toast.error("Please select valid check-in and check-out dates.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");

    axios
      .post(
        `${API_URL}/api/book`,
        {
          resortId: resort.id,
          fullName: form.fullName,
          email: form.email,
          mobile: form.mobile,
          address: form.address,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          adults: form.adults,
          children: form.children,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // needed for req.userId
          },
        },
      )
      .then((res) => {
        const bookingId = res.data.bookingId;
        localStorage.setItem("bookingId", bookingId);

        toast.success("Booking request submitted!");
        navigate("/payment");
      })
      .catch((err) => {
        console.error("Booking failed:", err);
        toast.error(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
        if (err.response?.status === 409) {
          // Someone else grabbed these dates between page load and submit --
          // refresh the calendar and make them pick again rather than let
          // them resubmit the same now-invalid dates.
          fetchBookedDates();
          setForm((prev) => ({ ...prev, checkIn: "", checkOut: "" }));
        }
      })
      .finally(() => setSubmitting(false));
  };

  if (!resort)
    return (
      <div className="pt-32 pb-16 text-center text-ink/60">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-sand-light px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <BookingSteps current={2} />

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
          <h1 className="text-center font-display text-3xl font-semibold text-ink">
            {resort.name}
          </h1>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              {resort.images?.length > 0 ? (
                <Carousel className="rounded-xl">
                  <CarouselContent>
                    {resort.images.map((img) => (
                      <CarouselItem key={img.id}>
                        <img
                          src={img.image_url}
                          alt="Resort"
                          className="block h-64 w-full rounded-xl object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <img
                  src={resort.image}
                  alt="Resort"
                  className="h-64 w-full rounded-xl object-cover"
                />
              )}
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                Description
              </h3>
              <p className="mt-1 text-sm text-ink/70">{resort.description}</p>

              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                Amenities
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {resort.amenities?.map((item, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-sand px-3 py-1 text-xs text-ink/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleBooking}
            className="mt-8 border-t border-ink/10 pt-8"
          >
            <h2 className="mb-5 font-display text-xl font-semibold text-ink">
              Book Your Stay
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-ink/80">
                  Full Name
                </label>
                <div className="mt-1.5">
                  <IconInput
                    icon={User}
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink/80">
                  Email Address
                </label>
                <div className="mt-1.5">
                  <IconInput
                    icon={Mail}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink/80">
                  Mobile Number
                </label>
                <div className="mt-1.5">
                  <IconInput
                    icon={Phone}
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink/80">
                  Address
                </label>
                <div className="mt-1.5">
                  <IconInput
                    icon={MapPin}
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {resort.rooms && resort.rooms.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-ink/80">
                  Rooms Included in Your Stay
                </label>
                <p className="mt-1 text-xs text-ink/50">
                  This is a private resort -- your whole stay includes every
                  room below.
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {resort.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between rounded-xl border border-ink/10 bg-sand-light px-4 py-2.5"
                    >
                      <span className="font-medium text-ink">{room.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setPreviewRoom(room)}
                      >
                        <Images className="size-3.5" />
                        View Room
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="text-sm font-medium text-ink/80">
                Check-in / Check-out Dates
              </label>
              <div className="mt-1.5">
                <BookingCalendar
                  bookedRanges={bookedRanges}
                  checkIn={form.checkIn}
                  checkOut={form.checkOut}
                  onChange={({ checkIn, checkOut }) =>
                    setForm((prev) => ({ ...prev, checkIn, checkOut }))
                  }
                />
              </div>
              {form.checkIn && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/70">
                  <CalendarDays className="size-4 text-lagoon-dark" />
                  {form.checkIn}
                  {form.checkOut
                    ? ` → ${form.checkOut}`
                    : " → select check-out"}
                </p>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-ink/80">
                  Adults
                </label>
                <div className="mt-1.5">
                  <IconInput
                    icon={Users}
                    type="number"
                    name="adults"
                    value={form.adults}
                    min="1"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-ink/80">
                  Children
                </label>
                <div className="mt-1.5">
                  <IconInput
                    icon={Baby}
                    type="number"
                    name="children"
                    value={form.children}
                    min="0"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {nights > 0 && (
              <div className="mt-5 rounded-xl bg-sand-light px-4 py-3">
                <div className="flex items-center justify-between text-sm text-ink/70">
                  <span>
                    ₱{pricePerNight.toLocaleString()} × {nights} night
                    {nights > 1 ? "s" : ""}
                  </span>
                  <span className="font-display text-lg font-semibold text-lagoon-dark">
                    ₱{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Confirm Booking"}
            </Button>
          </form>
        </div>
      </div>

      <RoomPreviewDialog
        room={previewRoom}
        open={!!previewRoom}
        onOpenChange={(open) => !open && setPreviewRoom(null)}
      />
    </div>
  );
};

export default Booking;
