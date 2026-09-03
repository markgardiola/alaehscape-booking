import React from "react";

/**
 * Shared split-card layout for the auth pages (SignIn / SignUp / AdminSignIn).
 * Left panel carries the brand (wave watermark) instead of a stock photo;
 * right panel is the form itself, passed in as children.
 */
const AuthShell = ({
  variant = "teal",
  eyebrow,
  title,
  subtitle,
  children,
}) => {
  const panelBg = variant === "ink" ? "bg-ink" : "bg-lagoon";

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-light px-4 pt-28 pb-12 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-xl sm:grid-cols-2">
        {/* Brand panel */}
        <div
          className={`relative hidden flex-col justify-center overflow-hidden p-10 sm:flex ${panelBg}`}
        >
          <img
            src="/images/logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-14 h-80 w-80 opacity-15 mix-blend-multiply select-none"
          />
          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sand-light/70">
              {eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-sand-light">
              {title}
            </h2>
            <p className="mt-4 text-base text-sand-light/80">{subtitle}</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
