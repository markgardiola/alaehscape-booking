import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleAddAmenity = () => {
    if (!amenityInput.trim()) return;
    setAmenities([...amenities, amenityInput.trim()]);
    setAmenityInput("");
  };

  const handleRemoveAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleAddRoom = () => {
    if (!roomName || !roomPrice) return;
    setRooms([...rooms, { name: roomName, price: roomPrice }]);
    setRoomName("");
    setRoomPrice("");
  };

  const handleRemoveRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !location ||
      !description ||
      rooms.length === 0 ||
      images.length === 0
    ) {
      setError(
        "Please fill all required fields and add at least one image and one room.",
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("description", description);

      images.forEach((img) => formData.append("images", img));

      formData.append("rooms", JSON.stringify(rooms));
      formData.append("amenities", JSON.stringify(amenities));

      await axios.post(`${API_URL}/api/add_resort`, formData, {
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
    <div className="mx-auto max-w-2xl">
      <Link to="/adminDashboard/resorts">
        <Button variant="outline" size="sm" className="mb-6 gap-1.5">
          <ArrowLeft className="size-4" />
          Back to Listings
        </Button>
      </Link>

      <h1 className="font-display text-2xl font-semibold text-ink">
        Add New Resort
      </h1>

      {error && (
        <div className="mt-4 rounded-lg bg-seal/10 px-4 py-3 text-sm text-seal">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mt-6 flex flex-col gap-5"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink/80">
            Resort Name
          </label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="location" className="text-sm font-medium text-ink/80">
            Location
          </label>
          <Input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-medium text-ink/80"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="border-input mt-1.5 flex w-full min-w-0 rounded-md border bg-white px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>

        <div>
          <label htmlFor="images" className="text-sm font-medium text-ink/80">
            Resort Images
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            required
            className="border-input mt-1.5 flex w-full rounded-md border bg-white text-sm text-ink/60 file:mr-3 file:rounded-md file:border-0 file:bg-sand file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-24 w-32 rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Amenities</label>
          <div className="mt-1.5 flex gap-2">
            <Input
              type="text"
              placeholder="Amenity (e.g. Pool, WiFi)"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddAmenity}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-sm text-ink/80"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="text-ink/40 hover:text-seal"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Rooms</label>
          <div className="mt-1.5 flex gap-2">
            <Input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={roomPrice}
              onChange={(e) => setRoomPrice(e.target.value)}
              className="w-32"
            />
            <Button type="button" variant="secondary" onClick={handleAddRoom}>
              <Plus className="size-4" />
            </Button>
          </div>
          {rooms.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-ink/10 bg-sand-light px-4 py-2.5"
                >
                  <span className="text-sm text-ink">
                    {room.name} - ₱{room.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRoom(index)}
                    className="text-ink/40 hover:text-seal"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" size="lg" className="mt-2">
          Save Resort
        </Button>
      </form>
    </div>
  );
};

export default AddResort;
