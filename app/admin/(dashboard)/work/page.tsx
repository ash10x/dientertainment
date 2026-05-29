import { db } from "@/lib/db";
import { workProjects } from "@/lib/schema";
import { asc } from "drizzle-orm";
import WorkManager from "./WorkManager";

export default async function WorkPage() {
  const projects = await db.select().from(workProjects).orderBy(asc(workProjects.sortOrder));
  return <WorkManager initialProjects={projects} />;
}
