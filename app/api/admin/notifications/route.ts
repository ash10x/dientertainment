import { db } from "@/lib/db";
import { activityLogs } from "@/lib/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET() {
  try {
    const [unread, recent] = await Promise.all([
      db.select({ id: activityLogs.id }).from(activityLogs).where(eq(activityLogs.read, false)),
      db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.read, false))
        .orderBy(desc(activityLogs.createdAt))
        .limit(20),
    ]);

    return Response.json({ count: unread.length, items: recent });
  } catch {
    return Response.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}
