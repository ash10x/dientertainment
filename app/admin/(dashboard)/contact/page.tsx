import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { desc } from "drizzle-orm";
import ContactManager from "./ContactManager";

export default async function ContactPage() {
  const rows = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  return <ContactManager initialSubmissions={rows} />;
}
