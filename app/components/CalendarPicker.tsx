"use client";

import { useState } from "react";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isBefore, isAfter } from "date-fns";

interface Props {
  selectedDate: string | null; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
  disabledWeekdays?: number[]; // 0=Sun, 6=Sat — default [0,6]
  minDate?: Date;
  maxDate?: Date;
}

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarPicker({
  selectedDate,
  onSelect,
  disabledWeekdays = [0, 6],
  minDate,
  maxDate,
}: Props) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  const effectiveMin = minDate ?? today;
  const effectiveMax = maxDate ?? addDays(today, 60);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let cursor = new Date(gridStart);
  while (cursor <= gridEnd) {
    days.push(new Date(cursor));
    cursor = addDays(cursor, 1);
  }

  function isDisabled(date: Date): boolean {
    if (!isSameMonth(date, viewDate)) return true;
    if (disabledWeekdays.includes(date.getDay())) return true;
    if (isBefore(date, new Date(effectiveMin.getFullYear(), effectiveMin.getMonth(), effectiveMin.getDate()))) return true;
    if (isAfter(date, effectiveMax)) return true;
    return false;
  }

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewDate(subMonths(viewDate, 1))}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded transition-colors"
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="text-xs tracking-[0.2em] uppercase text-brand-white/70">
          {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded transition-colors"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] text-white/25 tracking-widest py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((date, i) => {
          const isOtherMonth = !isSameMonth(date, viewDate);
          const disabled = isDisabled(date);
          const dateStr = toDateStr(date);
          const isSelected = selectedDate === dateStr;
          const isToday = isSameDay(date, today);

          if (isOtherMonth) {
            return <div key={i} className="h-9" />;
          }

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(dateStr)}
              className={[
                "h-9 w-full text-sm rounded transition-all duration-150",
                isSelected
                  ? "bg-red text-white font-semibold"
                  : disabled
                  ? "text-white/15 cursor-not-allowed"
                  : isToday
                  ? "text-red border border-red/40 hover:bg-red/15"
                  : "text-white/70 hover:bg-white/8 hover:text-white",
              ].join(" ")}
              aria-label={date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              aria-pressed={isSelected}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
