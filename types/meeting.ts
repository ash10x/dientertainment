// types/meeting.ts
export type BookingStatus =
  | "pending"
  | "pending-scheduling"
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";

export type MeetingType =
  | "discovery-call"
  | "consultation"
  | "strategy-session"
  | "project-discussion"
  | "website-review"
  | "follow-up";

export type MeetingStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";

export type MeetingProvider =
  | "google-meet"
  | "zoom"
  | "teams"
  | "ringcentral"
  | "custom";

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  "discovery-call": "Discovery Call",
  consultation: "Consultation",
  "strategy-session": "Strategy Session",
  "project-discussion": "Project Discussion",
  "website-review": "Website Review",
  "follow-up": "Follow-up Meeting",
};

export const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
};

export const DURATION_OPTIONS = [15, 30, 45, 60] as const;
export type DurationMinutes = (typeof DURATION_OPTIONS)[number];

export interface AvailableSlot {
  start: string;     // ISO UTC string, e.g. "2024-01-15T14:00:00.000Z"
  end: string;       // ISO UTC string
  startLocal: string; // display string in user's timezone, e.g. "9:00 AM"
  endLocal: string;
}

export interface MeetingConfirmation {
  id: number;
  bookingRef: string;
  meetingDate: string;  // ISO UTC
  meetingEndDate: string; // ISO UTC
  timezone: string;
  durationMinutes: number;
  meetingType: MeetingType;
  meetingUrl: string | null;
  meetingProvider: MeetingProvider;
}
