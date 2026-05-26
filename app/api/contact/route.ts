import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";

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

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Submission failed." }, { status: 500 });
  }
}
