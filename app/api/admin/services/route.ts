import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch services." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, number, title, description, tags, active, sortOrder } = body;

    if (!slug || !number || !title || !description) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const [row] = await db
      .insert(services)
      .values({
        slug,
        number,
        title,
        description,
        tags: Array.isArray(tags) ? tags : [],
        active: active ?? true,
        sortOrder: sortOrder ?? 0,
      })
      .returning();

    return Response.json(row, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create service." }, { status: 500 });
  }
}
