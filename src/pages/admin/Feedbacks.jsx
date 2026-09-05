import React, { useState } from "react";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import Pagination from "@/components/Pagination";

const feedbacks = [
  {
    name: "John Doe",
    date: "2025-04-16",
    comment: "Great experience! Booking was smooth and fast.",
  },
  {
    name: "Jane Smith",
    date: "2025-04-15",
    comment: "Clean beach and friendly staff. Highly recommend!",
  },
  {
    name: "Carlos Reyes",
    date: "2025-04-14",
    comment: "The resort was okay but the food could be better.",
  },
  {
    name: "Maria Gonzales",
    date: "2025-04-13",
    comment: "Perfect getaway! I'll definitely book again.",
  },
  {
    name: "Alex Tan",
    date: "2025-04-12",
    comment: "Affordable and peaceful. Loved it.",
  },
  {
    name: "Liza Aquino",
    date: "2025-04-11",
    comment: "A bit crowded during the weekend, but overall nice.",
  },
];

const CustomerFeedback = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 3;

  const indexOfLast = currentPage * feedbacksPerPage;
  const indexOfFirst = indexOfLast - feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Customer Feedback
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {currentFeedbacks.map((fb, i) => (
          <Card key={i} className="p-5">
            <Quote className="size-5 text-lagoon-dark/50" />
            <p className="mt-3 text-sm italic leading-relaxed text-ink/75">
              "{fb.comment}"
            </p>
            <div className="mt-4 border-t border-ink/10 pt-3">
              <p className="text-sm font-semibold text-ink">{fb.name}</p>
              <p className="text-xs text-ink/50">
                {new Date(fb.date).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CustomerFeedback;
