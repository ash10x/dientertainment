import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const rows = await db.select().from(siteSettings);
    return Response.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  } catch {
    return Response.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!await verifyAdminRequest()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ error: "Invalid payload." }, { status: 400 });
    }

    const entries = Object.entries(body as Record<string, string>)
      .filter(([, v]) => typeof v === "string")
      .map(([key, value]) => ({ key, value }));

    if (entries.length === 0) {
      return Response.json({ error: "No settings provided." }, { status: 400 });
    }

    await db
      .insert(siteSettings)
      .values(entries)
      .onConflictDoUpdate({ target: siteSettings.key, set: { value: sql`excluded.value` } });

    await logActivity("setting", `Site settings updated: ${entries.map((e) => e.key).join(", ")}`, { keys: entries.map((e) => e.key) });
    revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to save settings.";
    return Response.json({ error: msg }, { status: 500 });
  }
}
