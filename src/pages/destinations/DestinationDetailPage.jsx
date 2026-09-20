import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DestinationDetail from "@/components/DestinationDetail";
import { API_URL } from "../../../config";

const DestinationDetailPage = () => {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setDestination(null);
    setNotFound(false);

    axios
      .get(`${API_URL}/api/destinations/${slug}`)
      .then((res) => setDestination(res.data))
      .catch((err) => {
        console.error("Error fetching destination:", err);
        setNotFound(true);
      });
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Destination not found
        </h1>
        <p className="mt-2 text-ink/60">
          This area doesn't exist yet, or the link may be out of date.
        </p>
      </div>
    );
  }

  if (!destination) return null;

  return (
    <DestinationDetail
      title={`${destination.name}, Sto. Tomas City`}
      barangay={destination.name}
      description={destination.description}
    />
  );
};

export default DestinationDetailPage;
