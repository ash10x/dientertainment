import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { eq } from "drizzle-orm";

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
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update testimonial." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(testimonials).where(eq(testimonials.id, Number(id)));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete testimonial." }, { status: 500 });
  }
}
