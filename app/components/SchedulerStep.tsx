"use client";

import { useState, useEffect } from "react";
import CalendarPicker from "./CalendarPicker";
import TimeSlotGrid from "./TimeSlotGrid";
import type { AvailableSlot, MeetingType, DurationMinutes, MeetingConfirmation } from "@/types/meeting";
import { MEETING_TYPE_LABELS, DURATION_OPTIONS } from "@/types/meeting";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "America/Sao_Paulo", label: "Brazil Time (BRT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern (AEST)" },
];

const inputClass =
  "w-full bg-transparent border-b border-white/14 focus:border-red text-brand-white text-sm py-3 outline-none appearance-none transition-colors duration-200";
const labelClass =
  "block text-brand-white/35 text-[9px] tracking-[0.3em] uppercase mb-2";

interface Props {
  submissionId: number;
  bookingRef: string;
  clientName: string;
  packageName?: string;
  onConfirmed: (confirmation: MeetingConfirmation) => void;
}

export default function SchedulerStep({
  submissionId,
  bookingRef,
  clientName,
  packageName,
  onConfirmed,
}: Props) {
  const [meetingType, setMeetingType] = useState<MeetingType>("discovery-call");
  const [duration, setDuration] = useState<DurationMinutes>(30);
  const [timezone, setTimezone] = useState<string>(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "America/New_York";
    }
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch slots when date or duration changes
  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSlot(null);
    setSlotsLoading(true);
    setError("");

    fetch(
      `/api/availability?date=${selectedDate}&duration=${duration}&timezone=${encodeURIComponent(timezone)}`
    )
      .then((r) => r.json())
      .then((data: { slots?: AvailableSlot[]; error?: string }) => {
        setSlots(data.slots ?? []);
      })
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, duration, timezone]);

  async function handleSchedule() {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          meetingDate: selectedSlot.start,
          durationMinutes: duration,
          meetingType,
          timezone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.meeting) {
        onConfirmed(data.meeting as MeetingConfirmation);
      } else {
        setError(data.error ?? "Failed to schedule meeting. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-red text-[9px] tracking-[0.35em] uppercase mb-1">
          Step 2 of 2
        </div>
        <h3
          className="font-display uppercase text-brand-white"
          style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}
        >
          Schedule Your Call
        </h3>
        <p className="text-brand-white/40 text-sm mt-2">
          Hi {clientName} — your booking{packageName ? ` for ${packageName}` : ""} was received.{" "}
          <span className="text-red">Ref: {bookingRef}</span>
        </p>
      </div>

      {/* Meeting type */}
      <div>
        <label className={labelClass}>Meeting Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(MEETING_TYPE_LABELS) as MeetingType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMeetingType(type)}
              className={[
                "px-3 py-2.5 text-[10px] tracking-wide rounded border text-left transition-all duration-150",
                meetingType === type
                  ? "bg-red/15 border-red text-red"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white",
              ].join(" ")}
            >
              {MEETING_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className={labelClass}>Duration</label>
        <div className="flex gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={[
                "px-4 py-2 text-xs rounded border transition-all duration-150",
                duration === d
                  ? "bg-red border-red text-white"
                  : "border-white/12 text-white/50 hover:border-white/35 hover:text-white",
              ].join(" ")}
            >
              {d}m
            </button>
          ))}
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label htmlFor="tz-select" className={labelClass}>Your Timezone</label>
        <div className="relative">
          <select
            id="tz-select"
            value={timezone}
            onChange={(e) => {
              setTimezone(e.target.value);
              setSelectedDate(null);
            }}
            className={`${inputClass} cursor-pointer`}
            style={{ color: "#F5F5F5" }}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-[#111]">
                {tz.label}
              </option>
            ))}
          </select>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red text-[10px] pointer-events-none">▾</span>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <label className={labelClass}>Pick a Date</label>
        <CalendarPicker
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <label className={labelClass}>
            Available Times —{" "}
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </label>
          <TimeSlotGrid
            slots={slots}
            selected={selectedSlot}
            loading={slotsLoading}
            onSelect={setSelectedSlot}
          />
        </div>
      )}

      {error && <p className="text-red text-xs tracking-wide">{error}</p>}

      {/* CTA */}
      <button
        type="button"
        disabled={!selectedSlot || submitting}
        onClick={handleSchedule}
        className="flex items-center gap-3 bg-red text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 rounded-xs hover:bg-[#FF001F] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(229,0,25,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        {submitting ? (
          <>
            <span className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Scheduling...
          </>
        ) : (
          <>Confirm Meeting <span className="text-sm">→</span></>
        )}
      </button>

      <p className="text-white/20 text-xs">
        You can reschedule or cancel by contacting us with your reference number.
      </p>
    </div>
  );
}
