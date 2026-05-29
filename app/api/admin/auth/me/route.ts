import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (!token) {
    return Response.json({ user: null }, { status: 200 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return Response.json({ user: null }, { status: 200 });
  }

  const [row] = await db
    .select({ name: adminUsers.name, email: adminUsers.email, role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.id, payload.userId));

  if (!row) {
    return Response.json({ user: null }, { status: 200 });
  }

  return Response.json({ user: row });
}
