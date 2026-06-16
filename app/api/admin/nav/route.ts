import { db } from "@/lib/db";
import { navItems } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const rows = await db.select().from(navItems).orderBy(asc(navItems.sortOrder));
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch nav items." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, href, type, visible, openInNewTab, sortOrder } = body;
    if (!label || !href) {
      return Response.json({ error: "Label and href are required." }, { status: 400 });
    }
    const [row] = await db
      .insert(navItems)
      .values({
        label,
        href,
        type: type ?? "link",
        visible: visible ?? true,
        openInNewTab: openInNewTab ?? false,
        sortOrder: sortOrder ?? 0,
      })
      .returning();
    await logActivity("nav", `Nav item created: "${label}" (${type ?? "link"}) → ${href}`, { id: row.id });
    revalidatePath("/", "layout");
    return Response.json(row, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed to create." }, { status: 500 });
  }
}
