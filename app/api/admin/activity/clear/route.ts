import { db } from "@/lib/db";
import { activityLogs } from "@/lib/schema";
import { lt } from "drizzle-orm";

export async function DELETE() {
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await db.delete(activityLogs).where(lt(activityLogs.createdAt, cutoff));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to clear logs." }, { status: 500 });
  }
}
