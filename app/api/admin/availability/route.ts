// app/api/admin/availability/route.ts
import { db } from "@/lib/db";
import { availabilityRules, blackoutDates } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  const [rules, blackouts] = await Promise.all([
    db.select().from(availabilityRules).orderBy(availabilityRules.dayOfWeek),
    db.select().from(blackoutDates).orderBy(blackoutDates.date),
  ]);
  return Response.json({ rules, blackouts });
}

const ruleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  breakStart: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  breakEnd: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  isActive: z.boolean(),
});

export async function PUT(request: Request) {
  const body = await request.json() as Record<string, unknown>;

  const { action } = body;

  if (action === "update-rule") {
    const { id, ...rest } = body;
    const parsed = ruleSchema.safeParse(rest);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }
    await db.update(availabilityRules).set(parsed.data).where(eq(availabilityRules.id, id as number));
    return Response.json({ success: true });
  }

  if (action === "add-blackout") {
    const { date, reason } = body;
    if (!/^\d{4}-\d{2}-\d{2}$/.test((date as string) ?? "")) {
      return Response.json({ error: "Invalid date format." }, { status: 400 });
    }
    await db.insert(blackoutDates).values({ date: date as string, reason: (reason as string) || null });
    return Response.json({ success: true });
  }

  if (action === "remove-blackout") {
    const { id } = body;
    await db.delete(blackoutDates).where(eq(blackoutDates.id, id as number));
    return Response.json({ success: true });
  }

  return Response.json({ error: "Unknown action." }, { status: 400 });
}
