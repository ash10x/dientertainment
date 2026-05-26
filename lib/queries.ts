import { db } from "./db";
import { workProjects, testimonials, siteStats } from "./schema";
import { eq, asc } from "drizzle-orm";

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
