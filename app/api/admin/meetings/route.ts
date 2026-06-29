// app/api/admin/meetings/route.ts
import { db } from "@/lib/db";
import { meetings, contactSubmissions } from "@/lib/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const offset = (page - 1) * limit;
  const status = url.searchParams.get("status") ?? "";

  const conditions = [];
  if (status && status !== "all") {
    conditions.push(eq(meetings.status, status));
  }

  const rows = await db
    .select({
      meeting: meetings,
      clientName: contactSubmissions.fullName,
      clientEmail: contactSubmissions.email,
      packageName: contactSubmissions.packageName,
    })
    .from(meetings)
    .leftJoin(contactSubmissions, eq(meetings.submissionId, contactSubmissions.id))
    .where(
      conditions.length > 0
        ? and(...conditions)
        : undefined
    )
    .orderBy(desc(meetings.meetingDate))
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(meetings)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  // Stats
  const [stats] = await db
    .select({
      scheduled: sql<number>`count(*) filter (where status = 'scheduled')`,
      confirmed: sql<number>`count(*) filter (where status = 'confirmed')`,
      completed: sql<number>`count(*) filter (where status = 'completed')`,
      cancelled: sql<number>`count(*) filter (where status = 'cancelled')`,
      noShow: sql<number>`count(*) filter (where status = 'no-show')`,
    })
    .from(meetings);

  return Response.json({
    meetings: rows,
    total: Number(total),
    page,
    limit,
    stats: {
      scheduled: Number(stats?.scheduled ?? 0),
      confirmed: Number(stats?.confirmed ?? 0),
      completed: Number(stats?.completed ?? 0),
      cancelled: Number(stats?.cancelled ?? 0),
      noShow: Number(stats?.noShow ?? 0),
    },
  });
}
