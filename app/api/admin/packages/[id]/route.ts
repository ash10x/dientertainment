import { db } from "@/lib/db";
import { packages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { serviceSlug, name, tagline, price, deposit, description, duration, includes, deliverables, addOns, processSteps, bestFor, heroVideoUrl, demoVideoUrls, aiTeamRoles, outcomeStats, highlight, sortOrder } = body;

    const [row] = await db
      .update(packages)
      .set({
        serviceSlug,
        name,
        tagline: tagline || null,
        price,
        deposit: deposit || null,
        description: description || null,
        duration: duration || null,
        includes: Array.isArray(includes) ? includes : [],
        deliverables: Array.isArray(deliverables) && deliverables.length > 0 ? deliverables : null,
        addOns: Array.isArray(addOns) && addOns.length > 0 ? addOns : null,
        processSteps: Array.isArray(processSteps) && processSteps.length > 0 ? processSteps : null,
        bestFor: Array.isArray(bestFor) && bestFor.length > 0 ? bestFor : null,
        heroVideoUrl: heroVideoUrl || null,
        demoVideoUrls: Array.isArray(demoVideoUrls) && demoVideoUrls.length > 0 ? demoVideoUrls : null,
        aiTeamRoles: Array.isArray(aiTeamRoles) && aiTeamRoles.length > 0 ? aiTeamRoles : null,
        outcomeStats: Array.isArray(outcomeStats) && outcomeStats.length > 0 ? outcomeStats : null,
        highlight: !!highlight,
        sortOrder: sortOrder ?? 0,
      })
      .where(eq(packages.id, Number(id)))
      .returning();

    if (!row) return Response.json({ error: "Not found." }, { status: 404 });
    await logActivity("package", `Package updated: "${row.name}" (${row.serviceSlug})`, { id: row.id });
    revalidatePath("/", "layout");
    return Response.json(row);
  } catch {
    return Response.json({ error: "Failed to update package." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(packages).where(eq(packages.id, Number(id))).returning();
    await logActivity("package", `Package deleted: "${deleted?.name ?? id}"`, { id: Number(id) });
    revalidatePath("/", "layout");
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete package." }, { status: 500 });
  }
}
