"use client";

import type { MeetingConfirmation, MeetingType } from "@/types/meeting";
import { MEETING_TYPE_LABELS } from "@/types/meeting";

interface Props {
  confirmation: MeetingConfirmation;
  timezone: string;
}

function buildGoogleCalendarUrl(c: MeetingConfirmation, tz: string): string {
  const start = new Date(c.meetingDate)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(".000Z", "Z");
  const end = new Date(c.meetingEndDate)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(".000Z", "Z");
  const title = encodeURIComponent(
    `${MEETING_TYPE_LABELS[c.meetingType as MeetingType] ?? c.meetingType} — diEntertainment`
  );
  const details = encodeURIComponent(
    `Booking reference: ${c.bookingRef}${c.meetingUrl ? `\nJoin: ${c.meetingUrl}` : ""}`
  );
  const location = encodeURIComponent(c.meetingUrl ?? "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&ctz=${encodeURIComponent(tz)}`;
}

function buildOutlookUrl(c: MeetingConfirmation): string {
  const start = new Date(c.meetingDate).toISOString().slice(0, 19);
  const end = new Date(c.meetingEndDate).toISOString().slice(0, 19);
  const subject = encodeURIComponent(
    `${MEETING_TYPE_LABELS[c.meetingType as MeetingType] ?? c.meetingType} — diEntertainment`
  );
  const body = encodeURIComponent(
    `Booking reference: ${c.bookingRef}${c.meetingUrl ? `\nJoin: ${c.meetingUrl}` : ""}`
  );
  const location = encodeURIComponent(c.meetingUrl ?? "");
  return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${start}&enddt=${end}&body=${body}&location=${location}`;
}

export default function ConfirmationStep({ confirmation, timezone }: Props) {
  const start = new Date(confirmation.meetingDate);
  const formattedDate = start.toLocaleDateString("en-US", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = start.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const typeLabel =
    MEETING_TYPE_LABELS[confirmation.meetingType as MeetingType] ??
    confirmation.meetingType;

  return (
    <div className="space-y-8">
      {/* Checkmark */}
      <div>
        <div
          className="font-display text-red leading-none mb-4"
          style={{ fontSize: "clamp(48px, 5vw, 64px)" }}
        >
          ✓
        </div>
        <h3
          className="font-display uppercase text-brand-white"
          style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}
        >
          Meeting Confirmed.
        </h3>
        <p className="text-brand-white/40 text-sm mt-2">
          A confirmation email has been sent to you.
        </p>
      </div>

      {/* Meeting details */}
      <div className="border border-red/25 bg-red/5 p-6 space-y-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Reference</div>
            <div className="text-red font-medium">{confirmation.bookingRef}</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Meeting Type</div>
            <div className="text-brand-white">{typeLabel}</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Date</div>
            <div className="text-brand-white">{formattedDate}</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Time</div>
            <div className="text-brand-white">{formattedTime}</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Duration</div>
            <div className="text-brand-white">{confirmation.durationMinutes} minutes</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Timezone</div>
            <div className="text-brand-white text-xs">{timezone}</div>
          </div>
        </div>

        {confirmation.meetingUrl && (
          <div className="pt-3 border-t border-red/15">
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Meeting Link</div>
            <a
              href={confirmation.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red text-sm hover:underline break-all"
            >
              {confirmation.meetingUrl}
            </a>
          </div>
        )}
      </div>

      {/* Calendar buttons */}
      <div className="flex flex-wrap gap-3">
        <a
          href={buildGoogleCalendarUrl(confirmation, timezone)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 border border-white/15 text-white/70 text-[11px] tracking-[0.2em] uppercase hover:border-white/40 hover:text-white transition-all duration-200 rounded-xs"
        >
          Add to Google Calendar
        </a>
        <a
          href={buildOutlookUrl(confirmation)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 border border-white/15 text-white/70 text-[11px] tracking-[0.2em] uppercase hover:border-white/40 hover:text-white transition-all duration-200 rounded-xs"
        >
          Add to Outlook
        </a>
        <a
          href={`/api/meetings/${confirmation.id}/ics`}
          className="flex items-center gap-2 px-5 py-3 border border-white/15 text-white/70 text-[11px] tracking-[0.2em] uppercase hover:border-white/40 hover:text-white transition-all duration-200 rounded-xs"
          download
        >
          Download .ics
        </a>
      </div>

      {/* Back home */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-red text-[11px] tracking-[0.25em] uppercase hover:gap-4 transition-all duration-300"
      >
        Back to Home <span>→</span>
      </a>
    </div>
  );
}
