import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { slug, number, title, description, tags, active, sortOrder } = body;

    const [row] = await db
      .update(services)
      .set({
        slug,
        number,
        title,
        description,
        tags: Array.isArray(tags) ? tags : [],
        active: !!active,
        sortOrder: sortOrder ?? 0,
      })
      .where(eq(services.id, Number(id)))
      .returning();

    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update service." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(services).where(eq(services.id, Number(id)));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete service." }, { status: 500 });
  }
}
