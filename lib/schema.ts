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
  submissionRef: text("submission_ref").unique(),       // DI-YYYYMMDD-XXXXXX
  bookingStatus: text("booking_status").default("pending-scheduling"),
  timezone: text("timezone"),
  referralSource: text("referral_source"),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  serviceSlug: text("service_slug").notNull(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  price: text("price").notNull(),
  deposit: text("deposit"),
  description: text("description"),
  duration: text("duration"),
  includes: text("includes").array().notNull(),
  deliverables: text("deliverables").array(),
  addOns: text("add_ons").array(),
  processSteps: text("process_steps").array(),
  bestFor: text("best_for").array(),
  heroVideoUrl: text("hero_video_url"),
  demoVideoUrls: text("demo_video_urls").array(),
  aiTeamRoles: text("ai_team_roles").array(),
  outcomeStats: text("outcome_stats").array(),
  highlight: boolean("highlight").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  meta: text("meta"),
  ip: text("ip"),
  read: boolean("read").notNull().default(false),
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

// ── NEW: Scheduling System Tables ──────────────────────────────────────

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => contactSubmissions.id),
  bookingRef: text("booking_ref").notNull().unique(),
  meetingDate: timestamp("meeting_date", { withTimezone: true }).notNull(),
  meetingEndDate: timestamp("meeting_end_date", { withTimezone: true }).notNull(),
  timezone: text("timezone").notNull().default("America/New_York"),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  meetingType: text("meeting_type").notNull(),
  status: text("status").notNull().default("scheduled"),
  meetingUrl: text("meeting_url"),
  meetingPlatformId: text("meeting_platform_id"),
  meetingProvider: text("meeting_provider").notNull().default("custom"),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  cancelReason: text("cancel_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Mon–Fri working hours (dayOfWeek: 0=Sun, 1=Mon … 6=Sat)
export const availabilityRules = pgTable("availability_rules", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull().default("09:00"),
  endTime: text("end_time").notNull().default("17:00"),
  breakStart: text("break_start").default("12:00"),
  breakEnd: text("break_end").default("13:00"),
  isActive: boolean("is_active").notNull().default(true),
});

export const blackoutDates = pgTable("blackout_dates", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // "YYYY-MM-DD"
  reason: text("reason"),
});

export const bookingStatusHistory = pgTable("booking_status_history", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => contactSubmissions.id),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  changedBy: text("changed_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
