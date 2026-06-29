import { db } from "@/lib/db";
import { meetings, contactSubmissions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateICS } from "@/lib/services/ics.service";
import { MEETING_TYPE_LABELS } from "@/types/meeting";
import type { MeetingType } from "@/types/meeting";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid meeting ID." }, { status: 400 });
  }

  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1);

  if (!meeting) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  const [submission] = await db
    .select({ fullName: contactSubmissions.fullName, email: contactSubmissions.email })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, meeting.submissionId))
    .limit(1);

  const typeLabel =
    MEETING_TYPE_LABELS[meeting.meetingType as MeetingType] ?? meeting.meetingType;

  const ics = generateICS({
    uid: meeting.bookingRef,
    title: `${typeLabel} — diEntertainment`,
    description: `Your ${typeLabel} is scheduled. Booking reference: ${meeting.bookingRef}${
      meeting.meetingUrl ? `\nJoin: ${meeting.meetingUrl}` : ""
    }`,
    location: meeting.meetingUrl ?? "Link will be shared before the meeting",
    start: new Date(meeting.meetingDate),
    end: new Date(meeting.meetingEndDate),
    organizerEmail: process.env.SMTP_USER ?? "info@dientertainment.com",
    organizerName: "diEntertainment",
    attendeeEmail: submission?.email ?? "",
    attendeeName: submission?.fullName ?? "Guest",
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="meeting-${meeting.bookingRef}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
