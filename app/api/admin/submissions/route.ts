import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch submissions." }, { status: 500 });
  }
}
