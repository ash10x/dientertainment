import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { asc } from "drizzle-orm";
import UsersManager from "./UsersManager";

export default async function UsersPage() {
  const rows = await db
    .select({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, role: adminUsers.role, createdAt: adminUsers.createdAt })
    .from(adminUsers)
    .orderBy(asc(adminUsers.createdAt));
  return <UsersManager initialUsers={rows} />;
}
