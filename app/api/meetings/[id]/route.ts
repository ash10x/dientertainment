import { updateMeetingSchema } from "@/lib/validators/meeting";
import { updateMeeting, cancelMeeting } from "@/lib/services/meeting.service";
import { db } from "@/lib/db";
import { meetings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid meeting ID." }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateMeetingSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const [exists] = await db
    .select({ id: meetings.id })
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1);

  if (!exists) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  await updateMeeting(meetingId, parsed.data);
  return Response.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid meeting ID." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason.trim() : undefined;

  await cancelMeeting(meetingId, reason);
  return Response.json({ success: true });
}
