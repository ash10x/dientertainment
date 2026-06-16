import { db } from "@/lib/db";
import { activityLogs } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    await db.update(activityLogs).set({ read: true }).where(eq(activityLogs.read, false));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to mark notifications as read." }, { status: 500 });
  }
}
