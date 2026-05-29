import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { adminUsers } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@dientertainment.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.ADMIN_NAME ?? "Super Admin";

  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (existing.length > 0) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(adminUsers).values({ email, passwordHash, name, role: "superadmin" });
  console.log(`\nCreated superadmin:`);
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`\nIMPORTANT: Change the password after first login.\n`);
}

seedAdmin().catch(console.error).finally(() => process.exit(0));
