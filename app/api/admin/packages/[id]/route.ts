import { db } from "@/lib/db";
import { packages } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { serviceSlug, name, price, deposit, description, duration, includes, bestFor, highlight, sortOrder } = body;

    const [row] = await db
      .update(packages)
      .set({
        serviceSlug,
        name,
        price,
        deposit: deposit || null,
        description: description || null,
        duration: duration || null,
        includes: Array.isArray(includes) ? includes : [],
        bestFor: Array.isArray(bestFor) && bestFor.length > 0 ? bestFor : null,
        highlight: !!highlight,
        sortOrder: sortOrder ?? 0,
      })
      .where(eq(packages.id, Number(id)))
      .returning();

    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update package." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(packages).where(eq(packages.id, Number(id)));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete package." }, { status: 500 });
  }
}
