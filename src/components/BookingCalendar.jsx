import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad = (n) => String(n).padStart(2, "0");
const dateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// Booking dates from the API/inputs are "YYYY-MM-DD" (or "YYYY-MM-DDT...Z"
// from Postgres) -- treated purely as date-only strings throughout, never
// parsed into a real Date/timezone, to avoid off-by-one-day bugs.
const isoDateOnly = (str) => str.slice(0, 10);

const addDaysISO = (isoStr, days) => {
  const [y, m, d] = isoStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
};

/**
 * @param {Array<{check_in: string, check_out: string}>} bookedRanges
 * @param {string} checkIn - "YYYY-MM-DD" or ""
 * @param {string} checkOut - "YYYY-MM-DD" or ""
 * @param {(next: { checkIn: string, checkOut: string }) => void} onChange
 */
const BookingCalendar = ({
  bookedRanges = [],
  checkIn,
  checkOut,
  onChange,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11

  const todayKey = dateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  // Every individual booked date, as a Set of "YYYY-MM-DD" strings. A
  // range's check_out day itself is NOT included -- that's the day the
  // previous guest leaves, so it's free for a new check-in.
  const bookedSet = useMemo(() => {
    const set = new Set();
    bookedRanges.forEach(({ check_in, check_out }) => {
      let cur = isoDateOnly(check_in);
      const end = isoDateOnly(check_out);
      while (cur < end) {
        set.add(cur);
        cur = addDaysISO(cur, 1);
      }
    });
    return set;
  }, [bookedRanges]);

  // Would picking `endKey` as check-out (with the existing check-in)
  // pass through any date that's already booked?
  const rangeHasBookedDate = (startKey, endKey) => {
    let cur = startKey;
    while (cur < endKey) {
      if (bookedSet.has(cur)) return true;
      cur = addDaysISO(cur, 1);
    }
    return false;
  };

  const handleDayClick = (key) => {
    if (key < todayKey || bookedSet.has(key)) return;

    const selectingCheckIn = !checkIn || (checkIn && checkOut);

    if (selectingCheckIn) {
      onChange({ checkIn: key, checkOut: "" });
      return;
    }

    // We have a check-in but no check-out yet.
    if (key <= checkIn) {
      onChange({ checkIn: key, checkOut: "" });
      return;
    }

    if (rangeHasBookedDate(checkIn, key)) {
      // Can't span an already-booked date -- restart from this date instead.
      onChange({ checkIn: key, checkOut: "" });
      return;
    }

    onChange({ checkIn, checkOut: key });
  };

  const goToPrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goToNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isPrevDisabled =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={isPrevDisabled}
          className="rounded-full p-1.5 text-ink/60 hover:bg-sand disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="font-display text-sm font-semibold text-ink">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-full p-1.5 text-ink/60 hover:bg-sand"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink/40">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`blank-${idx}`} />;

          const key = dateKey(viewYear, viewMonth, day);
          const isPast = key < todayKey;
          const isBooked = bookedSet.has(key);
          const isDisabled = isPast || isBooked;
          const isCheckIn = key === checkIn;
          const isCheckOut = key === checkOut;
          const isInRange =
            checkIn && checkOut && key > checkIn && key < checkOut;

          return (
            <button
              key={key}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDayClick(key)}
              title={
                isBooked ? "Not available, please pick another date" : undefined
              }
              className={cn(
                "flex h-9 items-center justify-center rounded-lg text-sm transition-colors",
                isPast && "text-ink/25",
                isBooked && "bg-seal/10 text-seal line-through",
                !isDisabled &&
                  !isCheckIn &&
                  !isCheckOut &&
                  !isInRange &&
                  "text-ink/80 hover:bg-lagoon/10",
                isInRange && "bg-lagoon/15 text-lagoon-dark",
                (isCheckIn || isCheckOut) &&
                  "bg-lagoon text-white font-semibold",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-ink/10 pt-3 text-xs text-ink/60">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-lagoon" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-seal/30" /> Already booked
        </span>
      </div>
      {bookedSet.size > 0 && (
        <p className="mt-2 text-xs text-seal">
          Dates shown in red are already booked -- please pick another date.
        </p>
      )}
    </div>
  );
};

export default BookingCalendar;
