import {
  pgTable,
  text,
  integer,
  serial,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const workProjects = pgTable("work_projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  category: text("category").notNull(),
  year: text("year").notNull(),
  outcome: text("outcome").notNull(),
  bg: text("bg").notNull(),
  accentColor: text("accent_color").notNull(),
  textLight: boolean("text_light").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  review: text("review").notNull(),
  service: text("service").notNull(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteStats = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(),
  statValue: text("stat_value").notNull(),
  statLabel: text("stat_label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  socialHandle: text("social_handle"),
  companyName: text("company_name"),
  service: text("service").notNull(),
  budget: text("budget"),
  packageName: text("package_name"),
  packagePrice: text("package_price"),
  packageDeposit: text("package_deposit"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
