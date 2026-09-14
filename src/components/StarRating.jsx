import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

/**
 * Read-only star display when no onChange is passed (e.g. showing a
 * review's rating, or a resort's average). Interactive star picker when
 * onChange is passed (e.g. the "leave a review" form).
 */
const StarRating = ({ value = 0, onChange, size = "md", className }) => {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === "function";
  const display = interactive && hovered ? hovered : Math.round(value);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className="disabled:cursor-default"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= display
                ? "fill-lagoon text-lagoon"
                : "fill-transparent text-ink/20",
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
