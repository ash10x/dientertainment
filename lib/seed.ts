import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { workProjects, testimonials, siteStats } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Seeding database…");

  // ─── Work Projects ───────────────────────────────────────────────────────────
  await db.delete(workProjects);
  await db.insert(workProjects).values([
    {
      slug: "01",
      title: "Empire Brand Relaunch",
      client: "Apex Corp",
      category: "Digital Marketing",
      year: "2024",
      outcome: "+187% organic reach in 90 days",
      bg: "#111111",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 1,
    },
    {
      slug: "02",
      title: "Executive Portrait Series",
      client: "Meridian Group",
      category: "Photo Production",
      year: "2024",
      outcome: "120-image brand library delivered",
      bg: "#E50019",
      accentColor: "#0A0A0A",
      textLight: true,
      sortOrder: 2,
    },
    {
      slug: "03",
      title: "Product Launch Film",
      client: "Nova Brands",
      category: "Video Production",
      year: "2023",
      outcome: "2.4M views in the first week",
      bg: "#EBEBEB",
      accentColor: "#E50019",
      textLight: false,
      sortOrder: 3,
    },
    {
      slug: "04",
      title: "Industry News Editorial",
      client: "Sterling Media",
      category: "News & Media",
      year: "2024",
      outcome: "Featured in 40+ publications",
      bg: "#0F0F0F",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 4,
    },
    {
      slug: "05",
      title: "Social Dominance Campaign",
      client: "Vanta Group",
      category: "Digital Marketing",
      year: "2024",
      outcome: "#1 trending campaign — 3 weeks",
      bg: "#1A0808",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 5,
    },
    {
      slug: "06",
      title: "CEO Brand Identity Shoot",
      client: "Crest Digital",
      category: "Photo Production",
      year: "2023",
      outcome: "Full identity system deployed",
      bg: "#1C1C1C",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 6,
    },
    {
      slug: "07",
      title: "Corporate Vision Film",
      client: "Luminary Co.",
      category: "Video Production",
      year: "2024",
      outcome: "Screened at 3 industry events",
      bg: "#0A0A14",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 7,
    },
    {
      slug: "08",
      title: "Media Strategy Rollout",
      client: "Orbit Media",
      category: "News & Media",
      year: "2023",
      outcome: "300% growth in press coverage",
      bg: "#E50019",
      accentColor: "#F5F5F5",
      textLight: true,
      sortOrder: 8,
    },
    {
      slug: "09",
      title: "E-Commerce Relaunch",
      client: "Prism Studios",
      category: "Digital Marketing",
      year: "2024",
      outcome: "4.2× ROAS across all channels",
      bg: "#EBEBEB",
      accentColor: "#E50019",
      textLight: false,
      sortOrder: 9,
    },
    {
      slug: "10",
      title: "Lifestyle Photo Collection",
      client: "Nexus",
      category: "Photo Production",
      year: "2023",
      outcome: "Campaign ran across 6 markets",
      bg: "#141414",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 10,
    },
    {
      slug: "11",
      title: "AI Brand Commercial",
      client: "Velour Studios",
      category: "AI Video Creation",
      year: "2025",
      outcome: "1.8M impressions in first 48 hrs",
      bg: "#0A0014",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 11,
    },
    {
      slug: "12",
      title: "AI Product Campaign",
      client: "Luxe Goods Co.",
      category: "AI Video Creation",
      year: "2025",
      outcome: "3× conversion vs. traditional ads",
      bg: "#E50019",
      accentColor: "#F5F5F5",
      textLight: true,
      sortOrder: 12,
    },
    {
      slug: "13",
      title: "Luxury Product Imagery",
      client: "Auric Brand",
      category: "AI Image Generation",
      year: "2025",
      outcome: "60-image library — 3-day turnaround",
      bg: "#111108",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 13,
    },
    {
      slug: "14",
      title: "Billboard Campaign Visuals",
      client: "Pinnacle Retail",
      category: "AI Image Generation",
      year: "2025",
      outcome: "Deployed across 12 OOH placements",
      bg: "#EBEBEB",
      accentColor: "#E50019",
      textLight: false,
      sortOrder: 14,
    },
    {
      slug: "15",
      title: "Viral Ad Script Series",
      client: "Momentum Brand",
      category: "Script Writing",
      year: "2025",
      outcome: "4 hooks hit 500K+ views each",
      bg: "#0F0A0A",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 15,
    },
    {
      slug: "16",
      title: "Brand Storytelling Campaign",
      client: "Crest Media",
      category: "Script Writing",
      year: "2025",
      outcome: "42% lift in brand recall",
      bg: "#1A1A0A",
      accentColor: "#E50019",
      textLight: true,
      sortOrder: 16,
    },
  ]);

  // ─── Testimonials ────────────────────────────────────────────────────────────
  await db.delete(testimonials);
  await db.insert(testimonials).values([
    {
      name: "Client Name",
      role: "CEO, Brand Name",
      review:
        "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.",
      service: "AI Video Creation",
      featured: false,
      sortOrder: 1,
    },
    {
      name: "Client Name",
      role: "Founder, Brand Name",
      review:
        "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.",
      service: "AI Image Generation",
      featured: false,
      sortOrder: 2,
    },
    {
      name: "Client Name",
      role: "Marketing Director, Brand Name",
      review:
        "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.",
      service: "Digital Marketing",
      featured: false,
      sortOrder: 3,
    },
    {
      name: "Client Name",
      role: "Owner, Brand Name",
      review:
        "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.",
      service: "Script Writing",
      featured: false,
      sortOrder: 4,
    },
    {
      name: "Client Name",
      role: "Creative Director, Brand Name",
      review:
        "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.",
      service: "Video Production",
      featured: false,
      sortOrder: 5,
    },
    {
      name: "Client Name",
      role: "Brand Manager, Brand Name",
      review:
        "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.",
      service: "Photo Production",
      featured: true,
      sortOrder: 6,
    },
  ]);

  // ─── Site Stats ──────────────────────────────────────────────────────────────
  await db.delete(siteStats);
  await db.insert(siteStats).values([
    // Home page stats strip (Stats.tsx)
    { page: "home", statValue: "150+", statLabel: "Brands Elevated", sortOrder: 1 },
    { page: "home", statValue: "500+", statLabel: "Campaigns Executed", sortOrder: 2 },
    { page: "home", statValue: "8+", statLabel: "Years Active", sortOrder: 3 },
    { page: "home", statValue: "10M+", statLabel: "Audience Reached", sortOrder: 4 },

    // Work page hero stats
    { page: "work", statValue: "16+", statLabel: "Projects", sortOrder: 1 },
    { page: "work", statValue: "7", statLabel: "Disciplines", sortOrder: 2 },
    { page: "work", statValue: "150+", statLabel: "Brands", sortOrder: 3 },

    // Testimonials page stats
    { page: "testimonials", statValue: "150+", statLabel: "Brands Served", sortOrder: 1 },
    { page: "testimonials", statValue: "10+", statLabel: "Years Experience", sortOrder: 2 },
    { page: "testimonials", statValue: "98%", statLabel: "Client Satisfaction", sortOrder: 3 },
    { page: "testimonials", statValue: "500+", statLabel: "Projects Delivered", sortOrder: 4 },

    // WhyChooseUs client results stats
    { page: "why-choose-us", statValue: "150+", statLabel: "Brands Elevated", sortOrder: 1 },
    { page: "why-choose-us", statValue: "10+", statLabel: "Years in Industry", sortOrder: 2 },
    { page: "why-choose-us", statValue: "500+", statLabel: "Projects Delivered", sortOrder: 3 },
    { page: "why-choose-us", statValue: "3×", statLabel: "Avg. Conversion Lift", sortOrder: 4 },
  ]);

  console.log("✓ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
