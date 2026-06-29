// app/api/admin/meetings/[id]/route.ts
import { db } from "@/lib/db";
import { meetings, contactSubmissions, bookingStatusHistory } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { updateMeetingSchema } from "@/lib/validators/meeting";
import { cancelMeeting } from "@/lib/services/meeting.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid ID." }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateMeetingSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1);

  if (!existing) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  await db
    .update(meetings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(meetings.id, meetingId));

  // Track status change
  if (parsed.data.status && parsed.data.status !== existing.status) {
    await db.insert(bookingStatusHistory).values({
      submissionId: existing.submissionId,
      fromStatus: existing.status,
      toStatus: parsed.data.status,
      changedBy: "admin",
      notes: parsed.data.notes ?? parsed.data.cancelReason,
    });

    await db
      .update(contactSubmissions)
      .set({ bookingStatus: parsed.data.status })
      .where(eq(contactSubmissions.id, existing.submissionId));
  }

  await logActivity(
    "meeting",
    `Meeting ${existing.bookingRef} updated by admin`,
    { meetingId, changes: parsed.data }
  );

  return Response.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid ID." }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1);

  if (!existing) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  await cancelMeeting(meetingId, "Admin deleted meeting");

  return Response.json({ success: true });
}
