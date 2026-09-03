import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Carousel } from "react-bootstrap";
import { API_URL } from "../../config";

const ViewDetails = () => {
  const { id } = useParams();
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResort = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/resorts/${id}`);
        setResort(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch resort details.");
        setLoading(false);
      }
    };

    fetchResort();
  }, [id]);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (error) return <div className="container py-5 text-danger">{error}</div>;
  if (!resort) return <div className="container py-5">Resort not found.</div>;

  return (
    <div className="container mt-5 py-5 d-flex justify-content-center">
      <div className="border border-2 border-success rounded-4 p-4 pb-5 w-75">
        <div className="mb-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
        <h2 className="fw-bold text-success">{resort.name}</h2>
        <p className="fs-5 text-muted mb-2">
          <strong>Location:</strong> {resort.location}
        </p>
        <p className="fs-5 mb-4 text-wrap text-break">{resort.description}</p>

        {resort.images && resort.images.length > 0 ? (
          <Carousel
            className="mb-4 rounded-3 shadow-lg overflow-hidden"
            interval={4000}
          >
            {resort.images.map((img) => (
              <Carousel.Item key={img.id}>
                <img
                  src={img.image_url}
                  alt={resort.name}
                  className="d-block w-100"
                  style={{ height: "480px", objectFit: "cover" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          resort.image && (
            <div className="mb-4">
              <img
                src={resort.image}
                alt={resort.name}
                className="img-fluid rounded-3 shadow-lg"
                style={{ height: "480px", objectFit: "cover", width: "100%" }}
              />
            </div>
          )
        )}

        <h5 className="fw-semibold text-success">Room Options & Pricing:</h5>
        {resort.rooms && resort.rooms.length > 0 ? (
          <ul className="list-group list-group-flush mb-4">
            {resort.rooms.map((room, i) => (
              <li className="list-group-item" key={i}>
                <strong>{room.name}:</strong> ₱{room.price}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No rooms listed.</p>
        )}

        <h5 className="fw-semibold text-success">Amenities:</h5>
        {resort.amenities && resort.amenities.length > 0 ? (
          <table className="table table-bordered">
            <tbody>
              {resort.amenities.map((amenity, i) => (
                <tr key={i}>
                  <td className="d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    {amenity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No amenities listed.</p>
        )}
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-success"
            onClick={() => {
              const token = localStorage.getItem("token");
              const role = localStorage.getItem("role");

              if (token && role === "user") {
                window.location.href = `/booking/${resort.id}`;
              } else {
                toast.warning(
                  ({ closeToast }) => (
                    <div>
                      <p className="mb-2 text-center">
                        Please log in to proceed with booking.
                      </p>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-sm btn-success"
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
              }
            }}
          >
            Book Now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
