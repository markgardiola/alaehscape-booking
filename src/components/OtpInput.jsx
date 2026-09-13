import React, { useRef, useEffect } from "react";

/**
 * Segmented 6-digit OTP input: auto-focus, auto-advance per digit,
 * backspace navigates back, and pasting a full code distributes it
 * across all boxes at once.
 */
const OtpInput = ({ value, onChange, length = 6, disabled = false }) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const digits = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  const setDigits = (newDigits) => onChange(newDigits.join(""));

  const handleChange = (index, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const chars = raw.split("");
    const newDigits = [...digits];
    let cursor = index;
    for (const ch of chars) {
      if (cursor >= length) break;
      newDigits[cursor] = ch;
      cursor++;
    }
    setDigits(newDigits);
    inputsRef.current[Math.min(cursor, length - 1)]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];
      if (digits[index]) {
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    const newDigits = pasted
      .split("")
      .concat(Array(length).fill(""))
      .slice(0, length);
    setDigits(newDigits);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="h-12 w-10 rounded-lg border border-ink/15 bg-white text-center font-display text-xl font-semibold text-ink shadow-xs outline-none transition-colors focus-visible:border-lagoon focus-visible:ring-2 focus-visible:ring-lagoon/30 disabled:opacity-50 sm:h-14 sm:w-12"
        />
      ))}
    </div>
  );
};

export default OtpInput;
