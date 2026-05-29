import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, Number(id)));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete submission." }, { status: 500 });
  }
}
