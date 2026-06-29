import { db } from "@/lib/db";
import { packages } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

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
    const { serviceSlug, name, tagline, price, deposit, description, duration, includes, deliverables, addOns, processSteps, bestFor, heroVideoUrl, demoVideoUrls, aiTeamRoles, outcomeStats, highlight, sortOrder } = body;

    if (!serviceSlug || !name || !price || !includes) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const [row] = await db
      .insert(packages)
      .values({
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
      .returning();

    await logActivity("package", `Package created: "${name}" (${serviceSlug}) — ${price}`, { id: row.id, serviceSlug });
    revalidatePath("/", "layout");
    return Response.json(row, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create package." }, { status: 500 });
  }
}
