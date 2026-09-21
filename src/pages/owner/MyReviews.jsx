import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import StarRating from "@/components/StarRating";
import Pagination from "@/components/Pagination";
import { API_URL } from "../../../config";

const PER_PAGE = 6;

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/owner/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error fetching reviews:", err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexOfLast = currentPage * PER_PAGE;
  const paginated = reviews.slice(indexOfLast - PER_PAGE, indexOfLast);
  const totalPages = Math.ceil(reviews.length / PER_PAGE);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        My Reviews
      </h1>
      {reviews.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <StarRating value={average} size="sm" />
          <span className="text-sm text-ink/60">
            {average.toFixed(1)} average · {reviews.length} review
            {reviews.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-ink/60">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-ink/60">No reviews yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {paginated.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">{r.resort_name}</span>
                <StarRating value={r.rating} size="sm" />
              </div>
              {r.comment && (
                <p className="mt-2 text-sm italic leading-relaxed text-ink/70">
                  "{r.comment}"
                </p>
              )}
              <p className="mt-3 text-xs text-ink/50">
                {r.username} · {r.created_at_display}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default MyReviews;
