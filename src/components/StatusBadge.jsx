import React from "react";
import { cn } from "@/lib/utils";

const styles = {
  Confirmed: "bg-lagoon/15 text-lagoon-dark",
  Cancelled: "bg-seal/10 text-seal",
  Pending: "bg-sand text-ink/60",
};

const StatusBadge = ({ status }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
      styles[status] || styles.Pending,
    )}
  >
    {status}
  </span>
);

export default StatusBadge;
