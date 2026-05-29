import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { desc } from "drizzle-orm";
import SubmissionsManager from "./SubmissionsManager";

export default async function SubmissionsPage() {
  const rows = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  return <SubmissionsManager initialSubmissions={rows} />;
}
