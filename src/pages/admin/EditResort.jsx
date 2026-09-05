import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

      formData.append(
        "existingImages",
        JSON.stringify(existingImages.map((img) => img.image_url)),
      );
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

  if (loading) return <div className="text-center text-ink/60">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <Link to="/adminDashboard/resorts">
        <Button variant="outline" size="sm" className="mb-6 gap-1.5">
          <ArrowLeft className="size-4" />
          Back to Listings
        </Button>
      </Link>

      <h1 className="font-display text-2xl font-semibold text-ink">
        Edit Resort
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mt-6 flex flex-col gap-5"
      >
        <div>
          <label className="text-sm font-medium text-ink/80">Name</label>
          <Input
            type="text"
            name="name"
            value={resortData.name}
            onChange={handleChange}
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Location</label>
          <Input
            type="text"
            name="location"
            value={resortData.location}
            onChange={handleChange}
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Description</label>
          <textarea
            name="description"
            rows={4}
            value={resortData.description}
            onChange={handleChange}
            className="border-input mt-1.5 flex w-full min-w-0 rounded-md border bg-white px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">
            Resort Images
          </label>

          {existingImages.length > 0 && (
            <div className="mt-2">
              <p className="mb-1.5 text-xs text-ink/50">
                Current gallery (click × to remove):
              </p>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.image_url}
                      alt="Resort"
                      className="h-24 w-32 rounded-lg object-cover shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-seal text-white shadow"
                      title="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="border-input mt-2 flex w-full rounded-md border bg-white text-sm text-ink/60 file:mr-3 file:rounded-md file:border-0 file:bg-sand file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
          />

          {newImagePreviews.length > 0 && (
            <div className="mt-2">
              <p className="mb-1.5 text-xs text-ink/50">New images to add:</p>
              <div className="flex flex-wrap gap-2">
                {newImagePreviews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`New preview ${index}`}
                      className="h-24 w-32 rounded-lg object-cover shadow"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-seal text-white shadow"
                      title="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-ink/10 pt-5">
          <h2 className="font-display text-lg font-semibold text-ink">
            Room Options & Pricing
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {resortData.rooms.map((room, i) => (
              <div className="flex gap-2" key={i}>
                <Input
                  type="text"
                  placeholder="Room name"
                  value={room.name}
                  onChange={(e) => handleRoomChange(i, "name", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={room.price}
                  onChange={(e) => handleRoomChange(i, "price", e.target.value)}
                  className="w-32"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-seal hover:bg-seal/10 hover:text-seal"
                  onClick={() => removeRoom(i)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 gap-1.5"
            onClick={addRoom}
          >
            <Plus className="size-4" />
            Add Room
          </Button>
        </div>

        <div className="border-t border-ink/10 pt-5">
          <h2 className="font-display text-lg font-semibold text-ink">
            Amenities
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {resortData.amenities.map((amenity, i) => (
              <div className="flex gap-2" key={i}>
                <Input
                  type="text"
                  value={amenity}
                  onChange={(e) => handleAmenityChange(i, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-seal hover:bg-seal/10 hover:text-seal"
                  onClick={() => removeAmenity(i)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 gap-1.5"
            onClick={addAmenity}
          >
            <Plus className="size-4" />
            Add Amenity
          </Button>
        </div>

        <div className="flex justify-end border-t border-ink/10 pt-5">
          <Button type="submit" size="lg">
            Update Resort
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditResort;
