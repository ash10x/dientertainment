// lib/services/availability.service.ts
import { db } from "@/lib/db";
import { availabilityRules, blackoutDates, meetings } from "@/lib/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { addMinutes, format, isBefore, startOfDay, endOfDay } from "date-fns";
import type { AvailableSlot } from "@/types/meeting";

const BUSINESS_TIMEZONE = "America/New_York";
const MIN_NOTICE_HOURS = 24;
const MAX_BOOKING_DAYS = 60;
const SLOT_STEP_MINUTES = 15; // granularity

export interface AvailabilityOptions {
  date: string;           // "YYYY-MM-DD"
  durationMinutes: number;
  timezone: string;       // user's display timezone
}

export async function getAvailableSlots(
  opts: AvailabilityOptions
): Promise<AvailableSlot[]> {
  const { date, durationMinutes, timezone } = opts;

  // Validate date is not too far out
  const requestedDate = new Date(`${date}T00:00:00.000Z`);
  const now = new Date();
  const maxDate = addMinutes(now, MAX_BOOKING_DAYS * 24 * 60);
  if (requestedDate > maxDate) return [];

  // Determine the day of week in the BUSINESS timezone
  const zonedDate = toZonedTime(fromZonedTime(`${date}T00:00:00`, BUSINESS_TIMEZONE), BUSINESS_TIMEZONE);
  const dayOfWeek = zonedDate.getDay(); // 0=Sun, 6=Sat

  // Check if this date is blacked out
  const [blackout] = await db
    .select()
    .from(blackoutDates)
    .where(eq(blackoutDates.date, date))
    .limit(1);
  if (blackout) return [];

  // Get the availability rule for this day
  const [rule] = await db
    .select()
    .from(availabilityRules)
    .where(
      and(
        eq(availabilityRules.dayOfWeek, dayOfWeek),
        eq(availabilityRules.isActive, true)
      )
    )
    .limit(1);
  if (!rule) return [];

  // Build slot boundaries in business timezone
  const dayStart = fromZonedTime(`${date}T${rule.startTime}:00`, BUSINESS_TIMEZONE);
  const dayEnd = fromZonedTime(`${date}T${rule.endTime}:00`, BUSINESS_TIMEZONE);
  const breakStart = rule.breakStart
    ? fromZonedTime(`${date}T${rule.breakStart}:00`, BUSINESS_TIMEZONE)
    : null;
  const breakEnd = rule.breakEnd
    ? fromZonedTime(`${date}T${rule.breakEnd}:00`, BUSINESS_TIMEZONE)
    : null;

  // Fetch existing meetings that overlap with this day
  const existingMeetings = await db
    .select({ start: meetings.meetingDate, end: meetings.meetingEndDate })
    .from(meetings)
    .where(
      and(
        gte(meetings.meetingDate, startOfDay(dayStart)),
        lte(meetings.meetingDate, endOfDay(dayEnd)),
        eq(meetings.status, "scheduled")
      )
    );

  // Generate candidate slots
  const slots: AvailableSlot[] = [];
  let cursor = new Date(dayStart);
  const minStart = addMinutes(now, MIN_NOTICE_HOURS * 60);

  while (true) {
    const slotEnd = addMinutes(cursor, durationMinutes);
    if (slotEnd > dayEnd) break;

    const isBeforeMinNotice = isBefore(cursor, minStart);
    const inBreak =
      breakStart && breakEnd
        ? cursor < breakEnd && slotEnd > breakStart
        : false;
    const conflictsWithMeeting = existingMeetings.some(
      (m) => cursor < new Date(m.end) && slotEnd > new Date(m.start)
    );

    if (!isBeforeMinNotice && !inBreak && !conflictsWithMeeting) {
      const startLocal = format(
        toZonedTime(cursor, timezone),
        "h:mm a"
      );
      const endLocal = format(
        toZonedTime(slotEnd, timezone),
        "h:mm a"
      );
      slots.push({
        start: cursor.toISOString(),
        end: slotEnd.toISOString(),
        startLocal,
        endLocal,
      });
    }

    cursor = addMinutes(cursor, SLOT_STEP_MINUTES);
  }

  return slots;
}
