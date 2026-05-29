import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, password, role } = body;

    const updates: Record<string, unknown> = { name, email: email.toLowerCase().trim(), role };
    if (password) updates.passwordHash = await hashPassword(password);

    const [row] = await db
      .update(adminUsers)
      .set(updates)
      .where(eq(adminUsers.id, Number(id)))
      .returning({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, role: adminUsers.role, createdAt: adminUsers.createdAt });

    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(adminUsers).where(eq(adminUsers.id, Number(id)));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
