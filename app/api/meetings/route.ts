import { createMeetingSchema } from "@/lib/validators/meeting";
import { createMeeting } from "@/lib/services/meeting.service";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendMeetingConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const parsed = createMeetingSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const input = parsed.data;

    // Verify the submission exists
    const [submission] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, input.submissionId))
      .limit(1);

    if (!submission) {
      return Response.json({ error: "Booking not found." }, { status: 404 });
    }

    // Check submission doesn't already have a scheduled meeting
    if (submission.bookingStatus === "scheduled" || submission.bookingStatus === "confirmed") {
      return Response.json(
        { error: "A meeting has already been scheduled for this booking." },
        { status: 409 }
      );
    }

    const confirmation = await createMeeting(input);

    await logActivity(
      "meeting",
      `Meeting scheduled: ${confirmation.bookingRef} for ${submission.fullName}`,
      { meetingId: confirmation.id, bookingRef: confirmation.bookingRef },
      ip
    );

    // Send confirmation email (non-blocking)
    sendMeetingConfirmation({
      to: submission.email,
      toName: submission.fullName,
      bookingRef: confirmation.bookingRef,
      meetingDate: confirmation.meetingDate,
      meetingEndDate: confirmation.meetingEndDate,
      timezone: confirmation.timezone,
      meetingType: confirmation.meetingType,
      durationMinutes: confirmation.durationMinutes,
      meetingUrl: confirmation.meetingUrl,
      meetingId: confirmation.id,
    }).catch(() => {});

    return Response.json({ success: true, meeting: confirmation }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to schedule meeting." }, { status: 500 });
  }
}
