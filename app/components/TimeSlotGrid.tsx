"use client";

import type { AvailableSlot } from "@/types/meeting";

interface Props {
  slots: AvailableSlot[];
  selected: AvailableSlot | null;
  loading: boolean;
  onSelect: (slot: AvailableSlot) => void;
}

export default function TimeSlotGrid({ slots, selected, loading, onSelect }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-white/35 text-sm py-4 text-center">
        No available times for this date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected = selected?.start === slot.start;
        return (
          <button
            key={slot.start}
            type="button"
            onClick={() => onSelect(slot)}
            className={[
              "px-2 py-2.5 text-[11px] tracking-wide rounded border transition-all duration-150",
              isSelected
                ? "bg-red border-red text-white font-medium"
                : "border-white/12 text-white/60 hover:border-red/50 hover:text-white hover:bg-red/8",
            ].join(" ")}
            aria-pressed={isSelected}
          >
            {slot.startLocal}
          </button>
        );
      })}
    </div>
  );
}
