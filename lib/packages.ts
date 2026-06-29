import { db } from "./db";
import { packages } from "./schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Package } from "@/types/package";

function toPackage(row: typeof packages.$inferSelect): Package {
  return {
    id: row.id,
    slug: String(row.id),
    name: row.name,
    tagline: row.tagline ?? null,
    description: row.description ?? null,
    price: row.price,
    deposit: row.deposit ?? null,
    duration: row.duration ?? null,
    features: row.includes,
    deliverables: row.deliverables ?? null,
    addOns: row.addOns ?? null,
    processSteps: row.processSteps ?? null,
    bestFor: row.bestFor ?? null,
    heroVideoUrl: row.heroVideoUrl ?? null,
    demoVideoUrls: row.demoVideoUrls ?? null,
    aiTeamRoles: row.aiTeamRoles ?? null,
    outcomeStats: row.outcomeStats ?? null,
    category: row.serviceSlug,
    highlight: row.highlight,
    sortOrder: row.sortOrder,
  };
}

export async function getPackageBySlug(slug: string): Promise<Package> {
  const id = parseInt(slug, 10);
  if (isNaN(id)) notFound();

  const [row] = await db.select().from(packages).where(eq(packages.id, id));
  if (!row) notFound();

  return toPackage(row);
}

export async function getAllPackageSlugs(): Promise<string[]> {
  const rows = await db
    .select({ id: packages.id })
    .from(packages)
    .orderBy(asc(packages.sortOrder));
  return rows.map((r) => String(r.id));
}
