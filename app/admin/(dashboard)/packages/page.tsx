import { db } from "@/lib/db";
import { packages } from "@/lib/schema";
import { asc } from "drizzle-orm";
import PackagesManager from "./PackagesManager";

export default async function PackagesPage() {
  const rows = await db.select().from(packages).orderBy(asc(packages.serviceSlug), asc(packages.sortOrder));
  return <PackagesManager initialPackages={rows} />;
}
