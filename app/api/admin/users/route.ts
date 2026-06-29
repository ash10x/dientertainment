import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { hashPassword, verifyAdminRequest } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

export async function GET() {
  try {
    const rows = await db
      .select({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, role: adminUsers.role, createdAt: adminUsers.createdAt })
      .from(adminUsers)
      .orderBy(asc(adminUsers.createdAt));
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await verifyAdminRequest()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return Response.json({ error: "Name, email and password are required." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const [row] = await db
      .insert(adminUsers)
      .values({ name, email: email.toLowerCase().trim(), passwordHash, role: role ?? "admin" })
      .returning({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, role: adminUsers.role, createdAt: adminUsers.createdAt });

    await logActivity("user", `Admin user created: ${row.name} <${row.email}> (${row.role})`, { id: row.id });
    return Response.json(row, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error && e.message.includes("unique") ? "Email already exists." : "Failed to create user.";
    return Response.json({ error: msg }, { status: 500 });
  }
}
