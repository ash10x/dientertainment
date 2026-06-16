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
  previewUrl: text("preview_url"),
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

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  serviceSlug: text("service_slug").notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  deposit: text("deposit"),
  description: text("description"),
  duration: text("duration"),
  includes: text("includes").array().notNull(),
  bestFor: text("best_for").array(),
  highlight: boolean("highlight").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  meta: text("meta"),
  ip: text("ip"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  number: text("number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const navItems = pgTable("nav_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  type: text("type").notNull().default("link"), // 'link' | 'cta' | 'services-dropdown'
  visible: boolean("visible").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const pageHeroes = pgTable("page_heroes", {
  page: text("page").primaryKey(),
  eyebrow: text("eyebrow").notNull().default(""),
  heading: text("heading").notNull().default(""),
  headingAccent: text("heading_accent"),
  body: text("body"),
  bodySecondary: text("body_secondary"),
  ctaPrimaryLabel: text("cta_primary_label"),
  ctaPrimaryHref: text("cta_primary_href"),
  ctaSecondaryLabel: text("cta_secondary_label"),
  ctaSecondaryHref: text("cta_secondary_href"),
});
