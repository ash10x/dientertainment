// lib/services/meeting.service.ts
import { db } from "@/lib/db";
import { meetings, contactSubmissions, bookingStatusHistory } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { addMinutes } from "date-fns";
import { getMeetingPlatformProvider } from "./meeting-platform/index";
import type { CreateMeetingInput, UpdateMeetingInput } from "@/lib/validators/meeting";
import type { MeetingConfirmation, MeetingProvider, MeetingType } from "@/types/meeting";

function generateBookingRef(): string {
  const now = new Date();
  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `DI-${datePart}-${rand}`;
}

// NOTE: NeonDB HTTP driver does not support transactions; multi-write atomicity not available in serverless.
export async function createMeeting(
  input: CreateMeetingInput
): Promise<MeetingConfirmation> {
  const start = new Date(input.meetingDate);
  const end = addMinutes(start, input.durationMinutes);
  const bookingRef = generateBookingRef();

  const platform = getMeetingPlatformProvider();
  const link = await platform.generateLink({
    title: `Meeting ${bookingRef}`,
    start,
    end,
  });

  const [row] = await db
    .insert(meetings)
    .values({
      submissionId: input.submissionId,
      bookingRef,
      meetingDate: start,
      meetingEndDate: end,
      timezone: input.timezone,
      durationMinutes: input.durationMinutes,
      meetingType: input.meetingType,
      status: "scheduled",
      meetingUrl: link.url ?? null,
      meetingPlatformId: link.id,
      meetingProvider: link.provider as MeetingProvider,
    })
    .returning();

  await db
    .update(contactSubmissions)
    .set({ bookingStatus: "scheduled" })
    .where(eq(contactSubmissions.id, input.submissionId));

  await db.insert(bookingStatusHistory).values({
    submissionId: input.submissionId,
    fromStatus: "pending-scheduling",
    toStatus: "scheduled",
    changedBy: "system",
  });

  return {
    id: row.id,
    bookingRef: row.bookingRef,
    meetingDate: row.meetingDate.toISOString(),
    meetingEndDate: row.meetingEndDate.toISOString(),
    timezone: row.timezone,
    durationMinutes: row.durationMinutes,
    meetingType: row.meetingType as MeetingType,
    meetingUrl: row.meetingUrl,
    meetingProvider: row.meetingProvider as MeetingProvider,
  };
}

export async function getMeetingById(
  id: number
): Promise<typeof meetings.$inferSelect | null> {
  const [row] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, id))
    .limit(1);
  return row ?? null;
}

export async function updateMeeting(
  id: number,
  updates: UpdateMeetingInput
): Promise<void> {
  await db
    .update(meetings)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(meetings.id, id));
}

// NOTE: NeonDB HTTP driver does not support transactions; multi-write atomicity not available in serverless.
export async function cancelMeeting(
  id: number,
  reason?: string
): Promise<void> {
  const [row] = await db
    .select({ submissionId: meetings.submissionId, status: meetings.status })
    .from(meetings)
    .where(eq(meetings.id, id))
    .limit(1);

  if (!row) return;

  await db
    .update(meetings)
    .set({ status: "cancelled", cancelReason: reason ?? null, updatedAt: new Date() })
    .where(eq(meetings.id, id));

  await db
    .update(contactSubmissions)
    .set({ bookingStatus: "cancelled" })
    .where(eq(contactSubmissions.id, row.submissionId));

  await db.insert(bookingStatusHistory).values({
    submissionId: row.submissionId,
    fromStatus: row.status,
    toStatus: "cancelled",
    changedBy: "admin",
    notes: reason,
  });
}
