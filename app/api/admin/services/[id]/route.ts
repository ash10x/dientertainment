import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

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
    await logActivity("service", `Service updated: "${row.title}"`, { id: row.id, slug: row.slug });
    revalidatePath("/", "layout");
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update service." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(services).where(eq(services.id, Number(id))).returning();
    await logActivity("service", `Service deleted: "${deleted?.title ?? id}"`, { id: Number(id) });
    revalidatePath("/", "layout");
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete service." }, { status: 500 });
  }
}
