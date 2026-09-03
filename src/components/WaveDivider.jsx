import React from "react";

/**
 * A thin, hand-drawn-style wave line used to separate page sections.
 * Deliberately quiet -- the bold wave motif lives in the hero; this is
 * just a recurring signature, not a second focal point.
 */
const WaveDivider = ({ className = "", color = "#1b1b18" }) => (
  <svg
    viewBox="0 0 1200 40"
    preserveAspectRatio="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M0 20 C 50 2, 100 2, 150 20 S 250 38, 300 20 S 400 2, 450 20 S 550 38, 600 20 S 700 2, 750 20 S 850 38, 900 20 S 1000 2, 1050 20 S 1150 38, 1200 20"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default WaveDivider;
