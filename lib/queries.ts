import { db } from "./db";
import { workProjects, testimonials, siteStats, packages, siteSettings, services, pageHeroes } from "./schema";
import { eq, asc } from "drizzle-orm";

export type PackageRow = typeof packages.$inferSelect;

export async function getWorkProjects() {
  return db
    .select()
    .from(workProjects)
    .orderBy(asc(workProjects.sortOrder));
}

export async function getWorkProjectsByCategory(category: string) {
  return db
    .select()
    .from(workProjects)
    .where(eq(workProjects.category, category))
    .orderBy(asc(workProjects.sortOrder));
}

export async function getTestimonials() {
  return db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder));
}

export async function getFeaturedTestimonial() {
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.featured, true))
    .orderBy(asc(testimonials.sortOrder));
  return rows[0] ?? null;
}

export async function getStatsByPage(page: string) {
  return db
    .select()
    .from(siteStats)
    .where(eq(siteStats.page, page))
    .orderBy(asc(siteStats.sortOrder));
}

const SETTING_DEFAULTS: Record<string, string> = {
  phone: "+12345678900",
  phone_display: "+1 (234) 567-8900",
  email: "hello@dientertainment.com",
  social_instagram: "#",
  social_twitter: "#",
  social_linkedin: "#",
  social_youtube: "#",
  social_tiktok: "#",
};

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(siteSettings);
    return { ...SETTING_DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
  } catch {
    return SETTING_DEFAULTS;
  }
}

export async function getPackagesByService(serviceSlug: string) {
  return db
    .select()
    .from(packages)
    .where(eq(packages.serviceSlug, serviceSlug))
    .orderBy(asc(packages.sortOrder));
}

export async function getActiveServices() {
  try {
    return await db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(asc(services.sortOrder));
  } catch {
    return [];
  }
}

export async function getAllServices() {
  return db.select().from(services).orderBy(asc(services.sortOrder));
}

export type HeroRow = typeof pageHeroes.$inferSelect;

const HERO_PAGES = ["home", "about", "work", "contact"] as const;

const HERO_DEFAULTS: Record<string, HeroRow> = {
  home: {
    page: "home",
    eyebrow: "Digital Marketing · News & Media · AI Branding",
    heading: "We Create AI Content\nThat Makes Brands\nLook",
    headingAccent: "Million Dollar.",
    body: "AI Videos. AI Commercials. AI Reels. AI Branding.",
    bodySecondary: "Luxury marketing powered by artificial intelligence.",
    ctaPrimaryLabel: "Start a Project",
    ctaPrimaryHref: "#contact",
    ctaSecondaryLabel: "View Our Work",
    ctaSecondaryHref: "#work",
  },
  about: {
    page: "about",
    eyebrow: "Who We Are",
    heading: "Built for\nbrands that",
    headingAccent: "mean it.",
    body: "diEntertainment is a full-service news, media, and AI-powered marketing agency. We help ambitious brands build a presence that commands attention, earns respect, and drives real results.",
    bodySecondary: null,
    ctaPrimaryLabel: null,
    ctaPrimaryHref: null,
    ctaSecondaryLabel: null,
    ctaSecondaryHref: null,
  },
  work: {
    page: "work",
    eyebrow: "Portfolio",
    heading: "Selected",
    headingAccent: "Projects.",
    body: "A selection of brand stories we've helped tell — across digital marketing, media, and production.",
    bodySecondary: null,
    ctaPrimaryLabel: null,
    ctaPrimaryHref: null,
    ctaSecondaryLabel: null,
    ctaSecondaryHref: null,
  },
  contact: {
    page: "contact",
    eyebrow: "Get In Touch",
    heading: "Let's build\nsomething",
    headingAccent: "great.",
    body: null,
    bodySecondary: null,
    ctaPrimaryLabel: null,
    ctaPrimaryHref: null,
    ctaSecondaryLabel: null,
    ctaSecondaryHref: null,
  },
};

export async function getPageHero(page: string): Promise<HeroRow> {
  try {
    const [row] = await db.select().from(pageHeroes).where(eq(pageHeroes.page, page));
    return row ?? HERO_DEFAULTS[page] ?? HERO_DEFAULTS.home;
  } catch {
    return HERO_DEFAULTS[page] ?? HERO_DEFAULTS.home;
  }
}

export async function getAllPageHeroes(): Promise<HeroRow[]> {
  try {
    const rows = await db.select().from(pageHeroes);
    return HERO_PAGES.map((p) => rows.find((r) => r.page === p) ?? HERO_DEFAULTS[p]);
  } catch {
    return HERO_PAGES.map((p) => HERO_DEFAULTS[p]);
  }
}
