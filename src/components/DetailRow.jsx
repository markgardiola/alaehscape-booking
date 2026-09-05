import React from "react";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-ink/5 py-2.5 text-sm last:border-0">
    <span className="font-medium text-ink/60">{label}</span>
    <span className="text-right text-ink">{value}</span>
  </div>
);

export default DetailRow;
