// app/api/contact/route.ts
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { logActivity } from "@/lib/logger";
import { sendContactNotification, sendBookingConfirmation } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { bookingSchema } from "@/lib/validators/booking";
import { eq, and, gte } from "drizzle-orm";

function generateSubmissionRef(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `DI-${datePart}-${rand}`;
}

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
    const raw = await request.json();

    // Honeypot: "website" field must be absent or empty
    if (raw.website && String(raw.website).trim().length > 0) {
      // Silently succeed to not tip off bots
      return Response.json({ success: true }, { status: 201 });
    }

    const parsed = bookingSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Duplicate check: same email within the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const [duplicate] = await db
      .select({ id: contactSubmissions.id })
      .from(contactSubmissions)
      .where(
        and(
          eq(contactSubmissions.email, data.email),
          gte(contactSubmissions.createdAt, fiveMinutesAgo)
        )
      )
      .limit(1);

    if (duplicate) {
      return Response.json(
        { error: "A submission from this email was recently received. Please wait a few minutes before submitting again." },
        { status: 429 }
      );
    }

    const submissionRef = generateSubmissionRef();

    const [row] = await db
      .insert(contactSubmissions)
      .values({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        socialHandle: data.socialHandle ?? null,
        companyName: data.companyName ?? null,
        service: data.service,
        budget: data.budget ?? null,
        packageName: data.packageName ?? null,
        packagePrice: data.packagePrice ?? null,
        packageDeposit: data.packageDeposit ?? null,
        message: data.message,
        submissionRef,
        bookingStatus: "pending-scheduling",
        timezone: data.timezone ?? null,
        referralSource: data.referralSource ?? null,
      })
      .returning({ id: contactSubmissions.id, submissionRef: contactSubmissions.submissionRef });

    const description = data.packageName
      ? `Booking request from ${data.fullName} for ${data.packageName}`
      : `Contact inquiry from ${data.fullName} (${data.service})`;

    await logActivity(
      data.packageName ? "booking" : "contact",
      description,
      { email: data.email, service: data.service, packageName: data.packageName ?? null },
      ip
    );

    // Admin notification (non-blocking)
    sendContactNotification({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      socialHandle: data.socialHandle ?? null,
      companyName: data.companyName ?? null,
      service: data.service,
      budget: data.budget ?? null,
      packageName: data.packageName ?? null,
      packagePrice: data.packagePrice ?? null,
      packageDeposit: data.packageDeposit ?? null,
      message: data.message,
    }).catch(() => {});

    // Booking confirmation email to client (non-blocking)
    sendBookingConfirmation({
      to: data.email,
      toName: data.fullName,
      bookingRef: submissionRef ?? "",
      packageName: data.packageName ?? null,
      service: data.service,
    }).catch(() => {});

    return Response.json(
      {
        success: true,
        submissionId: row.id,
        bookingRef: row.submissionRef,
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: "Submission failed." }, { status: 500 });
  }
}
