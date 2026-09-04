import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Details", "Booking Info", "Payment"];

const BookingSteps = ({ current }) => {
  return (
    <ol className="mb-10 flex items-center justify-center">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <li key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  isDone && "bg-lagoon text-sand-light",
                  isActive && "bg-ink text-sand-light",
                  !isDone && !isActive && "bg-sand text-ink/50",
                )}
              >
                {isDone ? <Check className="size-4" /> : stepNum}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isActive ? "text-ink" : "text-ink/50",
                )}
              >
                {label}
              </span>
            </div>
            {stepNum < steps.length && (
              <div className="mx-3 h-px w-6 bg-ink/15 sm:mx-4 sm:w-10" />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default BookingSteps;
