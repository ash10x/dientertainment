import { db } from "@/lib/db";
import { siteStats } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { page, statValue, statLabel, sortOrder } = body;

    const [row] = await db
      .update(siteStats)
      .set({ page, statValue, statLabel, sortOrder: sortOrder ?? 0 })
      .where(eq(siteStats.id, Number(id)))
      .returning();

    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    await logActivity("stat", `Stat updated: "${row.statValue} ${row.statLabel}" on page "${row.page}"`, { id: row.id });
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update stat." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(siteStats).where(eq(siteStats.id, Number(id))).returning();
    await logActivity("stat", `Stat deleted: "${deleted?.statLabel ?? id}"`, { id: Number(id) });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete stat." }, { status: 500 });
  }
}
