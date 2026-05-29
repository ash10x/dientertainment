import { db } from "@/lib/db";
import { contactSubmissions, activityLogs } from "@/lib/schema";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      socialHandle,
      companyName,
      service,
      budget,
      packageName,
      packagePrice,
      packageDeposit,
      message,
    } = body;

    if (!fullName || !email || !phone || !service || !message) {
      return Response.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    await db.insert(contactSubmissions).values({
      fullName,
      email,
      phone,
      socialHandle: socialHandle || null,
      companyName: companyName || null,
      service,
      budget: budget || null,
      packageName: packageName || null,
      packagePrice: packagePrice || null,
      packageDeposit: packageDeposit || null,
      message,
    });

    // Log activity
    const description = packageName
      ? `Booking request from ${fullName} for ${packageName}`
      : `Contact inquiry from ${fullName} (${service})`;
    await db.insert(activityLogs).values({
      type: packageName ? "booking" : "contact",
      description,
      meta: JSON.stringify({ email, service, packageName: packageName || null }),
      ip: request.headers.get("x-forwarded-for") ?? null,
    });

    // Send email notification (non-blocking — don't fail the response if email errors)
    sendContactNotification({
      fullName, email, phone,
      socialHandle: socialHandle || null,
      companyName: companyName || null,
      service, budget: budget || null,
      packageName: packageName || null,
      packagePrice: packagePrice || null,
      packageDeposit: packageDeposit || null,
      message,
    }).catch(() => {});

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Submission failed." }, { status: 500 });
  }
}
