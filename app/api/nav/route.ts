import { db } from "@/lib/db";
import { navItems } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(navItems)
      .where(eq(navItems.visible, true))
      .orderBy(asc(navItems.sortOrder));
    return Response.json(rows);
  } catch {
    return Response.json([], { status: 200 });
  }
}
