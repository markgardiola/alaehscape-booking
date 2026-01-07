import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../../config";

const AddResort = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");

  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  // -----------------------------
  // Handle image selection (multiple)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // -----------------------------
  // Add amenity
  const handleAddAmenity = () => {
    if (!amenityInput.trim()) return;
    setAmenities([...amenities, amenityInput.trim()]);
    setAmenityInput("");
  };

  // -----------------------------
  // Add room
  const handleAddRoom = () => {
    if (!roomName || !roomPrice) return;
    setRooms([...rooms, { name: roomName, price: roomPrice }]);
    setRoomName("");
    setRoomPrice("");
  };

  // -----------------------------
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !location || !description || rooms.length === 0 || images.length === 0) {
      setError("Please fill all required fields and add at least one image and one room.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("description", description);

      // Append all images
      images.forEach(img => formData.append("images", img));

      formData.append("rooms", JSON.stringify(rooms));
      formData.append("amenities", JSON.stringify(amenities));

      const response = await axios.post(`${API_URL}/api/add_resort`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Resort added successfully!");
      navigate("/adminDashboard/resorts");
    } catch (err) {
      console.error(err);
      setError("Error adding resort. Please try again.");
    }
  };

  return (
    <div className="container">
      <Link to="/adminDashboard/resorts" className="btn btn-outline-success mb-4">
        ← Back to Listings
      </Link>

      <h2 className="mb-4">Add New Resort</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Resort Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Resort Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Images */}
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Resort Images</label>
          <input
            type="file"
            id="images"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            required
          />
          {imagePreviews.length > 0 && (
            <div className="mt-2 d-flex gap-2 flex-wrap">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  style={{ maxWidth: "150px", borderRadius: "8px" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="mb-3">
          <label className="form-label">Add Amenities</label>
          <div className="d-flex gap-2 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Amenity (e.g. Pool, WiFi)"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
            />
            <button type="button" className="btn btn-primary" onClick={handleAddAmenity}>
              Add
            </button>
          </div>
          {amenities.length > 0 && (
            <ul className="list-group">
              {amenities.map((amenity, index) => (
                <li key={index} className="list-group-item">{amenity}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Rooms */}
        <div className="mb-3">
          <label className="form-label">Add Rooms</label>
          <div className="d-flex gap-2 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Room Price"
              value={roomPrice}
              onChange={(e) => setRoomPrice(e.target.value)}
            />
            <button type="button" className="btn btn-primary" onClick={handleAddRoom}>
              Add
            </button>
          </div>
          {rooms.length > 0 && (
            <ul className="list-group">
              {rooms.map((room, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  {room.name} - ₱{room.price}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="btn btn-success">Save Resort</button>
      </form>
    </div>
  );
};

export default AddResort;
