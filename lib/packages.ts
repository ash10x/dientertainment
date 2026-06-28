import { db } from "./db";
import { packages } from "./schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Package } from "@/types/package";

function computeAnnualPrice(price: string): string {
  const num = parseFloat(price.replace(/[^0-9.]/g, ""));
  if (isNaN(num) || num === 0) return price;
  return `$${Math.floor(num * 10).toLocaleString()}`;
}

function toPackage(row: typeof packages.$inferSelect): Package {
  return {
    id: row.id,
    slug: String(row.id),
    name: row.name,
    tagline: row.description,
    description: row.description,
    monthlyPrice: row.price,
    annualPrice: computeAnnualPrice(row.price),
    features: row.includes,
    category: row.serviceSlug,
    deposit: row.deposit ?? null,
    duration: row.duration ?? null,
    bestFor: row.bestFor ?? null,
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
