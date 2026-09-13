import { useState, useEffect, useCallback } from "react";

/** Simple second-based countdown, used for OTP resend cooldowns. */
export function useCountdown() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(
      () => setSeconds((s) => Math.max(s - 1, 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [seconds]);

  const start = useCallback((s) => setSeconds(s), []);

  return { seconds, start, isActive: seconds > 0 };
}
