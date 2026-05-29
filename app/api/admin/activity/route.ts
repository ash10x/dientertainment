import { db } from "@/lib/db";
import { activityLogs } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? "100"), 500);

    const rows = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);

    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch activity logs." }, { status: 500 });
  }
}

