import { db } from "./db";
import { workProjects, testimonials, siteStats, packages, siteSettings } from "./schema";
import { eq, asc } from "drizzle-orm";

export type PackageRow = typeof packages.$inferSelect;

export async function getWorkProjects() {
  return db
    .select()
    .from(workProjects)
    .orderBy(asc(workProjects.sortOrder));
}

export async function getWorkProjectsByCategory(category: string) {
  return db
    .select()
    .from(workProjects)
    .where(eq(workProjects.category, category))
    .orderBy(asc(workProjects.sortOrder));
}

export async function getTestimonials() {
  return db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder));
}

export async function getFeaturedTestimonial() {
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.featured, true))
    .orderBy(asc(testimonials.sortOrder));
  return rows[0] ?? null;
}

export async function getStatsByPage(page: string) {
  return db
    .select()
    .from(siteStats)
    .where(eq(siteStats.page, page))
    .orderBy(asc(siteStats.sortOrder));
}

const SETTING_DEFAULTS: Record<string, string> = {
  phone: "+12345678900",
  phone_display: "+1 (234) 567-8900",
  email: "hello@dientertainment.com",
  social_instagram: "#",
  social_twitter: "#",
  social_linkedin: "#",
  social_youtube: "#",
  social_tiktok: "#",
};

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(siteSettings);
    return { ...SETTING_DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
  } catch {
    return SETTING_DEFAULTS;
  }
}

export async function getPackagesByService(serviceSlug: string) {
  return db
    .select()
    .from(packages)
    .where(eq(packages.serviceSlug, serviceSlug))
    .orderBy(asc(packages.sortOrder));
}
