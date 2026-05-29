import { db } from "@/lib/db";
import { workProjects } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { slug, title, client, category, year, outcome, bg, accentColor, textLight, sortOrder } = body;

    const [row] = await db
      .update(workProjects)
      .set({ slug, title, client, category, year, outcome, bg, accentColor, textLight: !!textLight, sortOrder: sortOrder ?? 0 })
      .where(eq(workProjects.id, Number(id)))
      .returning();

    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(workProjects).where(eq(workProjects.id, Number(id)));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
