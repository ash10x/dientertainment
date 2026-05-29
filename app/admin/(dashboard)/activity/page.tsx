import { db } from "@/lib/db";
import { activityLogs } from "@/lib/schema";
import { desc } from "drizzle-orm";
import ActivityManager from "./ActivityManager";

export default async function ActivityPage() {
  const rows = await db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(200);
  return <ActivityManager initialLogs={rows} />;
}
