import { db } from "@/lib/db";
import { workProjects } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const rows = await db.select().from(workProjects).orderBy(asc(workProjects.sortOrder));
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, client, category, year, outcome, bg, accentColor, textLight, sortOrder, previewUrl } = body;

    if (!slug || !title || !client || !category || !year || !outcome || !bg || !accentColor) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const [row] = await db
      .insert(workProjects)
      .values({ slug, title, client, category, year, outcome, bg, accentColor, textLight: !!textLight, sortOrder: sortOrder ?? 0, previewUrl: previewUrl || null })
      .returning();

    await logActivity("work", `Work project created: "${title}" (${client})`, { id: row.id, slug, category });
    revalidatePath("/", "layout");
    return Response.json(row, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create project.";
    return Response.json({ error: msg }, { status: 500 });
  }
}
