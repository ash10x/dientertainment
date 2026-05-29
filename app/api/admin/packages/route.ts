import { db } from "@/lib/db";
import { packages } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(packages).orderBy(asc(packages.serviceSlug), asc(packages.sortOrder));
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch packages." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceSlug, name, price, deposit, description, duration, includes, bestFor, highlight, sortOrder } = body;

    if (!serviceSlug || !name || !price || !includes) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const [row] = await db
      .insert(packages)
      .values({
        serviceSlug,
        name,
        price,
        deposit: deposit || null,
        description: description || null,
        duration: duration || null,
        includes: Array.isArray(includes) ? includes : [],
        bestFor: Array.isArray(bestFor) ? bestFor : null,
        highlight: !!highlight,
        sortOrder: sortOrder ?? 0,
      })
      .returning();

    return Response.json(row, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create package." }, { status: 500 });
  }
}
