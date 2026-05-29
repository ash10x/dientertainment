import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch testimonials." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, review, service, featured, sortOrder } = body;

    if (!name || !role || !review || !service) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const [row] = await db
      .insert(testimonials)
      .values({ name, role, review, service, featured: !!featured, sortOrder: sortOrder ?? 0 })
      .returning();

    return Response.json(row, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create testimonial." }, { status: 500 });
  }
}
