import { db } from "@/lib/db";
import { navItems } from "@/lib/schema";
import { asc } from "drizzle-orm";
import NavManager from "./NavManager";

export default async function NavPage() {
  const items = await db.select().from(navItems).orderBy(asc(navItems.sortOrder));
  return <NavManager initialItems={items} />;
}
