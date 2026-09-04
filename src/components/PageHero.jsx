import React from "react";

/**
 * Compact teal hero band for interior "marketing" pages (About, etc.) --
 * a smaller version of the homepage Hero, reusing the same wave-watermark
 * treatment for visual consistency.
 */
const PageHero = ({ eyebrow, title }) => {
  return (
    <section className="relative overflow-hidden bg-lagoon pt-28 pb-16">
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 opacity-15 mix-blend-multiply select-none sm:h-80 sm:w-80"
      />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        {eyebrow && (
          <p className="text-md font-medium uppercase tracking-[0.3em] text-sand-light/80">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl font-semibold text-sand-light sm:text-6xl">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default PageHero;
