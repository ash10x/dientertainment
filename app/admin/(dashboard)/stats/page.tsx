import { db } from "@/lib/db";
import { siteStats } from "@/lib/schema";
import { asc } from "drizzle-orm";
import StatsManager from "./StatsManager";

export default async function StatsPage() {
  const rows = await db.select().from(siteStats).orderBy(asc(siteStats.page), asc(siteStats.sortOrder));
  return <StatsManager initialStats={rows} />;
}
