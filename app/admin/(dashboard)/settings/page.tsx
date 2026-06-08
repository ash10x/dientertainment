import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import SettingsManager from "./SettingsManager";

export default async function SettingsPage() {
  const rows = await db.select().from(siteSettings);
  const current = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return <SettingsManager initial={current} />;
}
