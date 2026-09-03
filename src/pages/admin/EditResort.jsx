import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../../config";

const EditResort = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resortData, setResortData] = useState({
    name: "",
    location: "",
    description: "",
    rooms: [],
    amenities: [],
  });

  // Existing gallery images already saved for this resort: [{ id, image_url }, ...]
  const [existingImages, setExistingImages] = useState([]);
  // Newly picked files not yet uploaded, plus their local preview URLs
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResort = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/resorts/${id}`);
        const data = res.data;

        setResortData({
          name: data.name,
          location: data.location,
          description: data.description,
          rooms: data.rooms || [],
          amenities: data.amenities || [],
        });
        setExistingImages(data.images || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load resort details.");
        setLoading(false);
      }
    };

    fetchResort();
  }, [id]);

  const handleChange = (e) => {
    setResortData({ ...resortData, [e.target.name]: e.target.value });
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...resortData.rooms];
    updatedRooms[index][field] = value;
    setResortData({ ...resortData, rooms: updatedRooms });
  };

  const handleAmenityChange = (index, value) => {
    const updatedAmenities = [...resortData.amenities];
    updatedAmenities[index] = value;
    setResortData({ ...resortData, amenities: updatedAmenities });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    e.target.value = ""; // allow picking the same file again after removing it
  };

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addRoom = () => {
    setResortData({
      ...resortData,
      rooms: [...resortData.rooms, { name: "", price: "" }],
    });
  };

  const removeRoom = (index) => {
    const updatedRooms = [...resortData.rooms];
    updatedRooms.splice(index, 1);
    setResortData({ ...resortData, rooms: updatedRooms });
  };

  const addAmenity = () => {
    setResortData({ ...resortData, amenities: [...resortData.amenities, ""] });
  };

  const removeAmenity = (index) => {
    const updatedAmenities = [...resortData.amenities];
    updatedAmenities.splice(index, 1);
    setResortData({ ...resortData, amenities: updatedAmenities });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error("Please keep or add at least one image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", resortData.name);
      formData.append("location", resortData.location);
      formData.append("description", resortData.description);
      formData.append("rooms", JSON.stringify(resortData.rooms));
      formData.append("amenities", JSON.stringify(resortData.amenities));

      // URLs of existing gallery images the admin kept (didn't remove)
      formData.append(
        "existingImages",
        JSON.stringify(existingImages.map((img) => img.image_url)),
      );
      // Newly added files
      newImages.forEach((file) => formData.append("images", file));

      await axios.put(`${API_URL}/api/resorts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Resort updated successfully!");
      navigate("/adminDashboard/resorts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update resort.");
    }
  };

  if (loading) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container pb-5">
      <Link
        to="/adminDashboard/resorts"
        className="btn btn-outline-success mb-4"
      >
        ← Back to Listings
      </Link>

      <h2 className="mb-4">Edit Resort</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={resortData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={resortData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={resortData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Resort Images</label>

          {existingImages.length > 0 && (
            <div className="mb-2">
              <p className="mb-1 text-muted small">
                Current gallery (click × to remove):
              </p>
              <div className="d-flex gap-2 flex-wrap">
                {existingImages.map((img) => (
                  <div key={img.id} className="position-relative">
                    <img
                      src={img.image_url}
                      alt="Resort"
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      className="rounded shadow-sm"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                      style={{
                        transform: "translate(40%, -40%)",
                        padding: "0 6px",
                      }}
                      onClick={() => removeExistingImage(img.id)}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            name="images"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          {newImagePreviews.length > 0 && (
            <div className="mt-2">
              <p className="mb-1 text-muted small">New images to add:</p>
              <div className="d-flex gap-2 flex-wrap">
                {newImagePreviews.map((src, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={src}
                      alt={`New preview ${index}`}
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      className="rounded shadow"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                      style={{
                        transform: "translate(40%, -40%)",
                        padding: "0 6px",
                      }}
                      onClick={() => removeNewImage(index)}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <hr />
        <h5>Room Options & Pricing</h5>
        {resortData.rooms.map((room, i) => (
          <div className="row mb-2" key={i}>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Room name"
                value={room.name}
                onChange={(e) => handleRoomChange(i, "name", e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={room.price}
                onChange={(e) => handleRoomChange(i, "price", e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeRoom(i)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary mb-4"
          onClick={addRoom}
        >
          Add Room
        </button>

        <hr />
        <h5>Amenities</h5>
        {resortData.amenities.map((amenity, i) => (
          <div className="d-flex mb-2" key={i}>
            <input
              type="text"
              className="form-control me-2"
              value={amenity}
              onChange={(e) => handleAmenityChange(i, e.target.value)}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeAmenity(i)}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={addAmenity}
          >
            Add Amenity
          </button>
          <button type="submit" className="btn btn-success">
            Update Resort
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResort;
