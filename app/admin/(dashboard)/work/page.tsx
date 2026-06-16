import { db } from "@/lib/db";
import { workProjects, services } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";
import WorkManager from "./WorkManager";

export default async function WorkPage() {
  const [projects, activeServices] = await Promise.all([
    db.select().from(workProjects).orderBy(asc(workProjects.sortOrder)),
    db.select({ slug: services.slug, title: services.title }).from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder)),
  ]);
  return <WorkManager initialProjects={projects} services={activeServices} />;
}
