import { db } from "@/lib/db";
import { navItems } from "@/lib/schema";
import { count } from "drizzle-orm";

const defaults = [
  { label: "Home", href: "/", type: "link", visible: true, openInNewTab: false, sortOrder: 10 },
  { label: "Work", href: "/work", type: "link", visible: true, openInNewTab: false, sortOrder: 20 },
  { label: "Services", href: "/services", type: "services-dropdown", visible: true, openInNewTab: false, sortOrder: 30 },
  { label: "About", href: "/about", type: "link", visible: true, openInNewTab: false, sortOrder: 40 },
  { label: "Testimonials", href: "/testimonials", type: "link", visible: true, openInNewTab: false, sortOrder: 50 },
  { label: "Contact", href: "/contact", type: "link", visible: true, openInNewTab: false, sortOrder: 60 },
  { label: "Get Started", href: "/contact", type: "cta", visible: true, openInNewTab: false, sortOrder: 70 },
];

export async function POST() {
  try {
    const [{ total }] = await db.select({ total: count() }).from(navItems);
    if (Number(total) > 0) {
      return Response.json({ error: "Nav items already exist. Delete them first to re-seed." }, { status: 409 });
    }
    const rows = await db.insert(navItems).values(defaults).returning();
    return Response.json(rows, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : "Seed failed." }, { status: 500 });
  }
}
