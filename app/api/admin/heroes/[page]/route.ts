import { db } from "@/lib/db";
import { pageHeroes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

const ALLOWED = ["home", "about", "work", "contact"];

export async function PUT(request: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!ALLOWED.includes(page)) return Response.json({ error: "Not found." }, { status: 404 });

  try {
    const body = await request.json();
    const values = {
      page,
      eyebrow: body.eyebrow ?? "",
      heading: body.heading ?? "",
      headingAccent: body.headingAccent || null,
      body: body.body || null,
      bodySecondary: body.bodySecondary || null,
      ctaPrimaryLabel: body.ctaPrimaryLabel || null,
      ctaPrimaryHref: body.ctaPrimaryHref || null,
      ctaSecondaryLabel: body.ctaSecondaryLabel || null,
      ctaSecondaryHref: body.ctaSecondaryHref || null,
    };

    const [row] = await db
      .insert(pageHeroes)
      .values(values)
      .onConflictDoUpdate({ target: pageHeroes.page, set: values })
      .returning();

    await logActivity("hero", `Hero updated: "${page}" page — "${row.heading}"`, { page });
    revalidatePath("/", "layout");
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to save hero." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!ALLOWED.includes(page)) return Response.json({ error: "Not found." }, { status: 404 });

  try {
    await db.delete(pageHeroes).where(eq(pageHeroes.page, page));
    await logActivity("hero", `Hero reset to default: "${page}" page`, { page });
    revalidatePath("/", "layout");
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to reset hero." }, { status: 500 });
  }
}
