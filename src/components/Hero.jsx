import React from "react";

/**
 * Homepage hero. Opens on the brand itself -- the logo's teal + the wave
 * mark, oversized as a watermark -- instead of a stock beach-photo slider.
 */
const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-lagoon pt-32 pb-28 sm:pt-40 sm:pb-36">
      {/* Oversized wave mark, decorative watermark */}
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-[140%] w-auto -translate-y-1/2 opacity-15 mix-blend-multiply select-none sm:-right-16"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sand-light/80">
          Sto. Tomas City, Batangas, Philippines
        </p>
        <h1 className="mt-4 max-w-xl font-display text-6xl font-semibold leading-[1.05] text-sand-light sm:text-7xl">
          Resort stays, booked simply.
        </h1>
        <p className="mt-5 max-w-md text-lg text-sand-light/85 sm:text-xl">
          Find and reserve a resort around Sto. Tomas City, Batangas — real
          rooms, real availability, no back-and-forth.
        </p>
      </div>
    </section>
  );
};

export default Hero;
