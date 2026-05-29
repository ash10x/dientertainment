import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { sendContactReply } from "@/lib/email";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { adminUsers } from "@/lib/schema";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { subject, message } = await request.json();

    if (!subject?.trim() || !message?.trim()) {
      return Response.json({ error: "Subject and message are required." }, { status: 400 });
    }

    const [submission] = await db
      .select({ id: contactSubmissions.id, email: contactSubmissions.email, fullName: contactSubmissions.fullName })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, Number(id)));

    if (!submission) {
      return Response.json({ error: "Submission not found." }, { status: 404 });
    }

    const [admin] = await db
      .select({ name: adminUsers.name })
      .from(adminUsers)
      .where(eq(adminUsers.id, payload.userId));

    await sendContactReply({
      to: submission.email,
      toName: submission.fullName,
      subject: subject.trim(),
      message: message.trim(),
      adminName: admin?.name ?? "Admin",
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to send reply." }, { status: 500 });
  }
}
