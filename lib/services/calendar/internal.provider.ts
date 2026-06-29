// lib/services/calendar/internal.provider.ts
import type { CalendarProvider, CalendarEvent } from "./types";
import { db } from "@/lib/db";
import { meetings } from "@/lib/schema";
import { and, gte, lte } from "drizzle-orm";
import { randomBytes } from "crypto";

export class InternalCalendarProvider implements CalendarProvider {
  readonly name = "internal";

  async isConnected(): Promise<boolean> {
    return true;
  }

  async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
    const rows = await db
      .select()
      .from(meetings)
      .where(
        and(
          gte(meetings.meetingDate, start),
          lte(meetings.meetingDate, end)
        )
      );
    return rows.map((m) => ({
      id: String(m.id),
      title: `Meeting #${m.bookingRef}`,
      start: new Date(m.meetingDate),
      end: new Date(m.meetingEndDate),
    }));
  }

  async createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
    // The internal provider doesn't need to create external events —
    // the meetings table IS the calendar. Return a synthetic event object.
    return { ...event, id: randomBytes(8).toString("base64url").slice(0, 10) };
  }

  async deleteEvent(_eventId: string): Promise<void> {
    // No-op: deletion is handled by the meetings table directly
  }
}
