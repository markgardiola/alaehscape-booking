import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n) => String(n).padStart(2, "0");
const dateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// All datetime math here is done as plain zero-padded "YYYY-MM-DD HH:MM:SS"
// strings, using Date.UTC purely as an internal clock calculator (built
// and read back with UTC methods only, never serialized or mixed with
// local time) -- this sidesteps timezone bugs entirely rather than risking
// another one, since these strings never round-trip through JSON/Date
// serialization the way the earlier calendar bug did.
const addDaysISO = (isoDateStr, days) => {
  const [y, m, d] = isoDateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
};

const combineDateTime = (dateStr, timeStr) => `${dateStr} ${timeStr}:00`;

const addHoursToDateTime = (dateTimeStr, hours) => {
  const [datePart, timePart] = dateTimeStr.split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm, ss] = timePart.split(":").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
  dt.setUTCHours(dt.getUTCHours() + hours);
  const yy = dt.getUTCFullYear();
  const mo = pad(dt.getUTCMonth() + 1);
  const dd = pad(dt.getUTCDate());
  const h2 = pad(dt.getUTCHours());
  const m2 = pad(dt.getUTCMinutes());
  const s2 = pad(dt.getUTCSeconds());
  return `${yy}-${mo}-${dd} ${h2}:${m2}:${s2}`;
};

// Cleaning/turnover gap the resort needs between one guest leaving and the
// next arriving. Matches the 2-hour buffer enforced server-side.
const BUFFER_HOURS = 2;

/**
 * @param {Array<{check_in: string, check_out: string}>} bookedBookings - other active bookings for this resort, as "YYYY-MM-DD HH:MM:SS" strings
 * @param {{check_in_time: string, check_out_time: string, spans_next_day: boolean}|null} stayType - the currently selected stay type
 * @param {string} value - selected start date "YYYY-MM-DD" or ""
 * @param {(date: string) => void} onChange
 */
const StayTypeCalendar = ({ bookedBookings = [], stayType, value, onChange }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11

  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // For the given start date, would this stay type's computed check-in/out
  // window fall within BUFFER_HOURS of any other active booking?
  const isBlocked = useMemo(() => {
    return (startDateKey) => {
      if (!stayType) return false;

      const candidateCheckIn = combineDateTime(startDateKey, stayType.check_in_time);
      const checkoutDateKey = stayType.spans_next_day
        ? addDaysISO(startDateKey, 1)
        : startDateKey;
      const candidateCheckOut = combineDateTime(checkoutDateKey, stayType.check_out_time);
      const candidateCheckOutBuffered = addHoursToDateTime(candidateCheckOut, BUFFER_HOURS);

      return bookedBookings.some((booking) => {
        const existingCheckOutBuffered = addHoursToDateTime(booking.check_out, BUFFER_HOURS);
        return (
          existingCheckOutBuffered > candidateCheckIn &&
          candidateCheckOutBuffered > booking.check_in
        );
      });
    };
  }, [bookedBookings, stayType]);

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
          const blocked = !isPast && isBlocked(key);
          const isDisabled = isPast || blocked || !stayType;
          const isSelected = key === value;

          return (
            <button
              key={key}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(key)}
              title={blocked ? "Not available, please pick another date" : undefined}
              className={cn(
                "flex h-9 items-center justify-center rounded-lg text-sm transition-colors",
                isPast && "text-ink/25",
                blocked && "bg-seal/10 text-seal line-through",
                !isDisabled && !isSelected && "text-ink/80 hover:bg-lagoon/10",
                isSelected && "bg-lagoon text-white font-semibold",
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
      {!stayType ? (
        <p className="mt-2 text-xs text-ink/50">
          Please select a stay type above to see availability.
        </p>
      ) : (
        <p className="mt-2 text-xs text-seal">
          Dates shown in red are already booked (including cleaning time) --
          please pick another date.
        </p>
      )}
    </div>
  );
};

export default StayTypeCalendar;
