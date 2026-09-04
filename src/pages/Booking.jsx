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
  BedDouble,
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
import IconInput from "@/components/IconInput";
import { cn } from "@/lib/utils";
import { API_URL } from "../../config";

const fieldClass =
  "border-input flex h-10 w-full min-w-0 rounded-md border bg-white pl-9 pr-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

const Booking = () => {
  const { resortId } = useParams();
  const navigate = useNavigate();
  const [resort, setResort] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    selectedRoom: "",
  });

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

  const handleBooking = (e) => {
    e.preventDefault();

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
        toast.error("Something went wrong. Please try again.");
      });
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

            <div className="mt-4">
              <label className="text-sm font-medium text-ink/80">
                Select Room
              </label>
              <div className="relative mt-1.5">
                <BedDouble className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
                <select
                  name="selectedRoom"
                  value={form.selectedRoom}
                  onChange={handleChange}
                  required
                  className={cn(fieldClass)}
                >
                  <option value="">-- Choose a room --</option>
                  {resort.rooms?.map((room, idx) => (
                    <option key={idx} value={room.id}>
                      {room.name} - ₱{room.price}/night
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-ink/80">
                  Check-in Date
                </label>
                <div className="mt-1.5">
                  <IconInput
                    icon={CalendarDays}
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-ink/80">
                  Check-out Date
                </label>
                <div className="mt-1.5">
                  <IconInput
                    icon={CalendarDays}
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
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

            <Button type="submit" size="lg" className="mt-6 w-full">
              Confirm Booking
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
