import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Generic version of BookingSteps -- same visual language, but takes
 * arbitrary step labels instead of the fixed booking-flow ones.
 *
 * Just circles + connectors in the row (no inline text labels) since this
 * renders inside AuthShell's narrower right-hand column -- with 4 steps,
 * full labels next to each circle overflowed the panel and got clipped by
 * its rounded corners. The current step's label shows as one line below
 * instead, which fits regardless of step count or container width.
 */
const StepIndicator = ({ steps, current }) => {
  return (
    <div className="mb-8">
      <ol className="flex items-center justify-center">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < current;
          const isActive = stepNum === current;
          return (
            <li key={label} className="flex items-center">
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
              {stepNum < steps.length && (
                <div className="mx-2 h-px w-6 bg-ink/15 sm:w-10" />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-sm font-medium text-ink/60">
        Step {current} of {steps.length}: {steps[current - 1]}
      </p>
    </div>
  );
};

export default StepIndicator;
