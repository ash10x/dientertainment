import { db } from "@/lib/db";
import { siteStats } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(siteStats).orderBy(asc(siteStats.page), asc(siteStats.sortOrder));
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page, statValue, statLabel, sortOrder } = body;

    if (!page || !statValue || !statLabel) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const [row] = await db
      .insert(siteStats)
      .values({ page, statValue, statLabel, sortOrder: sortOrder ?? 0 })
      .returning();

    return Response.json(row, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create stat." }, { status: 500 });
  }
}
