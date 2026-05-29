import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase().trim()));

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return Response.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    return new Response(
      JSON.stringify({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `admin-token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
        },
      }
    );
  } catch {
    return Response.json({ error: "Login failed." }, { status: 500 });
  }
}
