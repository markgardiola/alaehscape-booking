import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MapPin, Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { API_URL } from "../../../config";

const ResortDetails = () => {
  const { id } = useParams();
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <div className="text-center text-ink/60">Loading...</div>;
  if (error) return <div className="text-center text-seal">{error}</div>;
  if (!resort)
    return <div className="text-center text-ink/60">Resort not found.</div>;

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <Link to="/adminDashboard/resorts">
        <Button variant="outline" size="sm" className="mb-6 gap-1.5">
          <ArrowLeft className="size-4" />
          Back to Listings
        </Button>
      </Link>

      <h1 className="font-display text-2xl font-semibold text-ink">
        {resort.name}
      </h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
        <MapPin className="size-4 text-lagoon-dark" />
        {resort.location}
      </p>
      <p className="mt-3 text-base leading-relaxed text-ink/75">
        {resort.description}
      </p>

      {resort.images && resort.images.length > 0 ? (
        <Carousel className="mt-6 rounded-2xl">
          <CarouselContent>
            {resort.images.map((img) => (
              <CarouselItem key={img.id}>
                <img
                  src={img.image_url}
                  alt={resort.name}
                  className="block h-[420px] w-full rounded-2xl object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        resort.image && (
          <img
            src={resort.image}
            alt={resort.name}
            className="mt-6 h-[420px] w-full rounded-2xl object-cover"
          />
        )
      )}

      <h2 className="mt-8 font-display text-lg font-semibold text-ink">
        Room Options & Pricing
      </h2>
      {resort.rooms && resort.rooms.length > 0 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {resort.rooms.map((room, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-ink/10 bg-white px-4 py-3"
            >
              <span className="font-medium text-ink">{room.name}</span>
              <span className="font-display text-lagoon-dark">
                ₱{room.price}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-ink/50">No rooms listed.</p>
      )}

      <h2 className="mt-8 font-display text-lg font-semibold text-ink">
        Amenities
      </h2>
      {resort.amenities && resort.amenities.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {resort.amenities.map((amenity, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3.5 py-1.5 text-sm text-ink/80"
            >
              <Check className="size-3.5 text-lagoon-dark" />
              {amenity}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-ink/50">No amenities listed.</p>
      )}
    </div>
  );
};

export default ResortDetails;
