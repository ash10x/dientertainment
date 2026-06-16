import { db } from "@/lib/db";
import { navItems } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { label, href, type, visible, openInNewTab, sortOrder } = body;
    const [row] = await db
      .update(navItems)
      .set({ label, href, type, visible, openInNewTab, sortOrder })
      .where(eq(navItems.id, Number(id)))
      .returning();
    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json(row);
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed to update." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(navItems).where(eq(navItems.id, Number(id)));
    return Response.json({ ok: true });
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed to delete." }, { status: 500 });
  }
}
