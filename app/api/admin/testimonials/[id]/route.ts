import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, role, review, service, featured, sortOrder } = body;

    const [row] = await db
      .update(testimonials)
      .set({ name, role, review, service, featured: !!featured, sortOrder: sortOrder ?? 0 })
      .where(eq(testimonials.id, Number(id)))
      .returning();

    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    await logActivity("testimonial", `Testimonial updated: ${row.name}`, { id: row.id });
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update testimonial." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(testimonials).where(eq(testimonials.id, Number(id))).returning();
    await logActivity("testimonial", `Testimonial deleted: ${deleted?.name ?? id}`, { id: Number(id) });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete testimonial." }, { status: 500 });
  }
}
