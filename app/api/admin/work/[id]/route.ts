import { db } from "@/lib/db";
import { workProjects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { slug, title, client, category, year, outcome, bg, accentColor, textLight, sortOrder, previewUrl } = body;

    const [row] = await db
      .update(workProjects)
      .set({ slug, title, client, category, year, outcome, bg, accentColor, textLight: !!textLight, sortOrder: sortOrder ?? 0, previewUrl: previewUrl || null })
      .where(eq(workProjects.id, Number(id)))
      .returning();

    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    await logActivity("work", `Work project updated: "${row.title}"`, { id: row.id });
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(workProjects).where(eq(workProjects.id, Number(id))).returning();
    await logActivity("work", `Work project deleted: "${deleted?.title ?? id}"`, { id: Number(id) });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
