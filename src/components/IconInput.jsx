import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * An Input with a leading icon. For type="date"/"time" inputs, the
 * browser's own picker indicator sits on the right, so we also nudge
 * that in from the edge instead of leaving it flush against the border.
 */
const IconInput = ({ icon, className, type, ...props }) => {
  const Icon = icon;
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
      <Input
        type={type}
        className={cn(
          "pl-9",
          (type === "date" || type === "time") &&
            "[&::-webkit-calendar-picker-indicator]:mr-1 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60",
          className,
        )}
        {...props}
      />
    </div>
  );
};

export default IconInput;
