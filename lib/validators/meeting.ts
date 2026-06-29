import { z } from "zod";
import type { MeetingType, MeetingStatus } from "@/types/meeting";

const MEETING_TYPES: MeetingType[] = [
  "discovery-call",
  "consultation",
  "strategy-session",
  "project-discussion",
  "website-review",
  "follow-up",
];

const MEETING_STATUSES: MeetingStatus[] = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no-show",
];

export const createMeetingSchema = z.object({
  submissionId: z.number().int().positive(),
  meetingDate: z.string().datetime({ message: "Invalid meeting date" }),
  durationMinutes: z.number().int().refine(
    (n) => [15, 30, 45, 60].includes(n),
    { message: "Duration must be 15, 30, 45, or 60 minutes" }
  ),
  meetingType: z.enum(MEETING_TYPES as [MeetingType, ...MeetingType[]]),
  timezone: z.string().trim().min(1).max(100),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;

export const updateMeetingSchema = z.object({
  status: z.enum(MEETING_STATUSES as [MeetingStatus, ...MeetingStatus[]]).optional(),
  meetingUrl: z.string().url().nullable().optional(),
  assignedTo: z.string().trim().max(200).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  cancelReason: z.string().trim().max(1000).nullable().optional(),
});

export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;
