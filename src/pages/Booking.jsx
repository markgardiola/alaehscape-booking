import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Carousel } from "react-bootstrap";
import { API_URL } from "../../config";

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
        localStorage.setItem("bookingId", bookingId); // ✅ Store booking ID

        toast.success("Booking request submitted!");
        navigate("/payment");
      })
      .catch((err) => {
        console.error("Booking failed:", err);
        toast.error("Something went wrong. Please try again.");
      });
  };

  if (!resort) return <div>Loading...</div>;

  return (
    <div className="container mt-5 mb-3 p-5">
      <div className="p-4 border border-2 border-success rounded-4 shadow-sm">
        <div className="mb-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
        <h2 className="mb-4 text-center">{resort.name}</h2>

        <div className="row mb-4 d-flex align-items-center">
          <div className="col-lg-6 mb-3">
            {resort.images?.length > 0 ? (
              <Carousel className="rounded overflow-hidden">
                {resort.images.map((img) => (
                  <Carousel.Item key={img.id}>
                    <img
                      src={img.image_url}
                      className="d-block w-100"
                      alt="Resort"
                      style={{ height: "300px", objectFit: "cover" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <img
                src={resort.image}
                className="img-fluid rounded"
                alt="Resort"
              />
            )}
          </div>

          <div className="col-lg-6">
            <h5 className="fw-semibold">Description</h5>
            <p className="text-muted">{resort.description}</p>

            <h5 className="fw-semibold">Amenities</h5>
            <ul className="list-group list-group-flush">
              {resort.amenities?.map((item, idx) => (
                <li className="list-group-item" key={idx}>
                  ✅ {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={handleBooking} className="pt-3">
          <h4 className="mb-3">Book Your Stay</h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Select Room</label>
            <select
              className="form-select"
              name="selectedRoom"
              value={form.selectedRoom}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose a room --</option>
              {resort.rooms?.map((room, idx) => (
                <option key={idx} value={room.id}>
                  {room.name} - ₱{room.price}/night
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Check-in Date</label>
              <input
                type="date"
                className="form-control"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Check-out Date</label>
              <input
                type="date"
                className="form-control"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Adults</label>
              <input
                type="number"
                className="form-control"
                name="adults"
                value={form.adults}
                min="1"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Children</label>
              <input
                type="number"
                className="form-control"
                name="children"
                value={form.children}
                min="0"
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100 mt-3">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
