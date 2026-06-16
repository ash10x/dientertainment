import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { workProjects, testimonials, siteStats, packages } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Seeding database…");

  // ─── Work Projects ───────────────────────────────────────────────────────────
  await db.delete(workProjects);
  await db.insert(workProjects).values([
    { slug: "01", title: "Alpha Tribe - Product Launch Campaign", client: "Alpha Tribe", category: "AI Branding", year: "2026", outcome: "Full AI brand launch campaign delivered", bg: "#111111", accentColor: "#E50019", textLight: true, previewUrl: "https://res.cloudinary.com/dzwn2lwdz/video/upload/v1780661931/alphatribe1_b3uvmq.mp4", sortOrder: 1 },
    { slug: "02", title: "The Aroma Circle - Premium Fragrance Series", client: "The Aroma Circle", category: "AI Videos", year: "2026", outcome: "Premium AI video series delivered", bg: "#E50019", accentColor: "#0A0A0A", textLight: true, previewUrl: "https://res.cloudinary.com/dzwn2lwdz/video/upload/v1780661434/aromacircle1_tl9vbj.mp4", sortOrder: 2 },
    { slug: "03", title: "ToYou Car Rentals", client: "ToYou Car Rentals", category: "AI Commercials", year: "2026", outcome: "AI commercial campaign delivered", bg: "#F5F5F5", accentColor: "#E50019", textLight: false, previewUrl: "https://res.cloudinary.com/dzwn2lwdz/video/upload/v1780662315/WhatsApp_Video_2026-06-05_at_6.59.02_AM_3_g934cl.mp4", sortOrder: 3 },
    { slug: "04", title: "Industry News Editorial", client: "Sterling Media", category: "News & Media", year: "2024", outcome: "Featured in 40+ publications", bg: "#0F0F0F", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 4 },
    { slug: "05", title: "Social Dominance Campaign", client: "Vanta Group", category: "Digital Marketing", year: "2024", outcome: "#1 trending campaign — 3 weeks", bg: "#1A0808", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 5 },
    { slug: "06", title: "CEO Brand Identity Shoot", client: "Crest Digital", category: "Photo Production", year: "2023", outcome: "Full identity system deployed", bg: "#1C1C1C", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 6 },
    { slug: "07", title: "Corporate Vision Film", client: "Luminary Co.", category: "Video Production", year: "2024", outcome: "Screened at 3 industry events", bg: "#0A0A14", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 7 },
    { slug: "08", title: "Media Strategy Rollout", client: "Orbit Media", category: "News & Media", year: "2023", outcome: "300% growth in press coverage", bg: "#E50019", accentColor: "#F5F5F5", textLight: true, previewUrl: null, sortOrder: 8 },
    { slug: "09", title: "E-Commerce Relaunch", client: "Prism Studios", category: "Digital Marketing", year: "2024", outcome: "4.2× ROAS across all channels", bg: "#EBEBEB", accentColor: "#E50019", textLight: false, previewUrl: null, sortOrder: 9 },
    { slug: "10", title: "Lifestyle Photo Collection", client: "Nexus", category: "Photo Production", year: "2023", outcome: "Campaign ran across 6 markets", bg: "#141414", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 10 },
    { slug: "11", title: "AI Brand Commercial", client: "Velour Studios", category: "AI Video Creation", year: "2025", outcome: "1.8M impressions in first 48 hrs", bg: "#0A0014", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 11 },
    { slug: "12", title: "AI Product Campaign", client: "Luxe Goods Co.", category: "AI Video Creation", year: "2025", outcome: "3× conversion vs. traditional ads", bg: "#E50019", accentColor: "#F5F5F5", textLight: true, previewUrl: null, sortOrder: 12 },
    { slug: "13", title: "Luxury Product Imagery", client: "Auric Brand", category: "AI Image Generation", year: "2025", outcome: "60-image library — 3-day turnaround", bg: "#111108", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 13 },
    { slug: "14", title: "Billboard Campaign Visuals", client: "Pinnacle Retail", category: "AI Image Generation", year: "2025", outcome: "Deployed across 12 OOH placements", bg: "#EBEBEB", accentColor: "#E50019", textLight: false, previewUrl: null, sortOrder: 14 },
    { slug: "15", title: "Viral Ad Script Series", client: "Momentum Brand", category: "Script Writing", year: "2025", outcome: "4 hooks hit 500K+ views each", bg: "#0F0A0A", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 15 },
    { slug: "16", title: "Brand Storytelling Campaign", client: "Crest Media", category: "Script Writing", year: "2025", outcome: "42% lift in brand recall", bg: "#1A1A0A", accentColor: "#E50019", textLight: true, previewUrl: null, sortOrder: 16 },
  ]);

  // ─── Testimonials ────────────────────────────────────────────────────────────
  await db.delete(testimonials);
  await db.insert(testimonials).values([
    { name: "Client Name", role: "CEO, Brand Name", review: "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.", service: "AI Video Creation", featured: false, sortOrder: 1 },
    { name: "Client Name", role: "Founder, Brand Name", review: "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.", service: "AI Image Generation", featured: false, sortOrder: 2 },
    { name: "Client Name", role: "Marketing Director, Brand Name", review: "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.", service: "Digital Marketing", featured: false, sortOrder: 3 },
    { name: "Client Name", role: "Owner, Brand Name", review: "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.", service: "Script Writing", featured: false, sortOrder: 4 },
    { name: "Client Name", role: "Creative Director, Brand Name", review: "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.", service: "Video Production", featured: false, sortOrder: 5 },
    { name: "Client Name", role: "Brand Manager, Brand Name", review: "Add your client review here. Replace this placeholder with a real testimonial from a satisfied client. The more specific and results-driven, the better.", service: "Photo Production", featured: true, sortOrder: 6 },
  ]);

  // ─── Site Stats ──────────────────────────────────────────────────────────────
  await db.delete(siteStats);
  await db.insert(siteStats).values([
    { page: "home", statValue: "150+", statLabel: "Brands Elevated", sortOrder: 1 },
    { page: "home", statValue: "500+", statLabel: "Campaigns Executed", sortOrder: 2 },
    { page: "home", statValue: "8+", statLabel: "Years Active", sortOrder: 3 },
    { page: "home", statValue: "10M+", statLabel: "Audience Reached", sortOrder: 4 },
    { page: "work", statValue: "16+", statLabel: "Projects", sortOrder: 1 },
    { page: "work", statValue: "7", statLabel: "Disciplines", sortOrder: 2 },
    { page: "work", statValue: "150+", statLabel: "Brands", sortOrder: 3 },
    { page: "testimonials", statValue: "150+", statLabel: "Brands Served", sortOrder: 1 },
    { page: "testimonials", statValue: "10+", statLabel: "Years Experience", sortOrder: 2 },
    { page: "testimonials", statValue: "98%", statLabel: "Client Satisfaction", sortOrder: 3 },
    { page: "testimonials", statValue: "500+", statLabel: "Projects Delivered", sortOrder: 4 },
    { page: "why-choose-us", statValue: "150+", statLabel: "Brands Elevated", sortOrder: 1 },
    { page: "why-choose-us", statValue: "10+", statLabel: "Years in Industry", sortOrder: 2 },
    { page: "why-choose-us", statValue: "500+", statLabel: "Projects Delivered", sortOrder: 3 },
    { page: "why-choose-us", statValue: "3×", statLabel: "Avg. Conversion Lift", sortOrder: 4 },
    { page: "about", statValue: "2016", statLabel: "Founded", sortOrder: 1 },
    { page: "about", statValue: "8+", statLabel: "Years Active", sortOrder: 2 },
    { page: "about", statValue: "150+", statLabel: "Brands Elevated", sortOrder: 3 },
    { page: "about", statValue: "10M+", statLabel: "Audience Reached", sortOrder: 4 },
  ]);

  // ─── Packages ────────────────────────────────────────────────────────────────
  await db.delete(packages);

  // AI packages — shared across ai-video-creation, ai-image-generation, script-writing
  const aiPackages = [
    {
      name: "Starter AI Branding",
      price: "$300",
      deposit: null,
      description: null,
      duration: null,
      includes: ["5 AI promotional pictures", "3 AI promotional videos", "Script writing", "Captions included", "1 promotional post on diEntertainment", "10+ years marketing experience"],
      bestFor: ["Startups", "Local businesses", "Personal brands"],
      highlight: false,
    },
    {
      name: "Business Boost Package",
      price: "$700",
      deposit: null,
      description: null,
      duration: null,
      includes: ["15 AI promotional pictures", "5 AI videos", "Custom captions", "14-day promotion on diEntertainment", "Content strategy assistance", "AI branding consultation"],
      bestFor: ["Growing brands", "Restaurants", "Clothing brands", "Beauty businesses"],
      highlight: true,
    },
    {
      name: "Premium AI Takeover",
      price: "$1,000",
      deposit: null,
      description: null,
      duration: null,
      includes: ["30 AI promotional pictures", "10 AI promotional videos", "Daily promotional posting", "30-day marketing campaign", "Premium cinematic edits", "Priority delivery", "Custom strategy planning", "Luxury branding package"],
      bestFor: ["Serious businesses", "Music artists", "Influencers", "Large campaigns"],
      highlight: false,
    },
  ];

  for (const slug of ["ai-video-creation", "ai-image-generation", "script-writing"]) {
    await db.insert(packages).values(
      aiPackages.map((p, i) => ({ ...p, serviceSlug: slug, sortOrder: i + 1 }))
    );
  }

  // Photo production packages
  await db.insert(packages).values([
    { serviceSlug: "photo-production", name: "V.I.P Photo Shoot", price: "$349.99", deposit: "$150", description: "Recommended for Airbnb hosts, Turo hosts, small businesses, birthdays, and any professional photo shoot requirement.", duration: null, includes: ["1 hour V.I.P shooting time", "2 high-end professional photo edits", "Full access to all excellent photos taken", "Unlimited clicks", "Unlimited poses"], bestFor: null, highlight: false, sortOrder: 1 },
    { serviceSlug: "photo-production", name: "V.I.P Bronze Package", price: "$499.99", deposit: "$250", description: "For the individual looking for a birthday shoot to remember for a lifetime, the model updating their portfolio, or the influencer taking their content grid to the next level.", duration: null, includes: ["2-hour V.I.P photo shoot — unlimited clicks & unlimited poses", "Location of choice within Miami-Dade, Palm Beach & Broward County", "5 excellent professional high-end photo edits (you choose which 5)", "Additional edits available at $50 each", "Email with all photos taken at shoot", "Delivering intense, impactful photos built to last a lifetime"], bestFor: null, highlight: false, sortOrder: 2 },
    { serviceSlug: "photo-production", name: "V.I.P Silver Package", price: "$999.99", deposit: "$500", description: "For hairstylists, skincare gurus, Amazon sellers, and beauty influencers who want photos that elevate their brand across every platform.", duration: null, includes: ["4-hour V.I.P photo shoot — unlimited clicks & unlimited poses", "Location of choice within Miami-Dade, Palm Beach & Broward County", "10 excellent professional high-end photo edits (you choose which 10)", "Additional edits available at $50 each", "Email with all photos taken at shoot", "Memory card with all raw photos from shoot", "Extra lighting, smoke machine & colorful light machine", "Delivering intense, impactful photos built to last a lifetime"], bestFor: null, highlight: false, sortOrder: 3 },
    { serviceSlug: "photo-production", name: "V.I.P Gold Package", price: "$1,999.99", deposit: "$999", description: "For hairstylists, skincare gurus, Amazon sellers, and beauty influencers ready to fully refresh their website, social media, and brand presence.", duration: null, includes: ["4-hour V.I.P photo shoot — unlimited clicks & unlimited poses", "Location of choice within Miami-Dade, Palm Beach & Broward County", "15 excellent professional high-end photo edits (you choose which 15)", "Additional edits available at $50 each", "Email with all photos taken at shoot", "Memory card with all raw photos from shoot", "Extra lighting, smoke machine & colorful light machine", "1-minute high-end edited video (raw version included)"], bestFor: null, highlight: true, sortOrder: 4 },
    { serviceSlug: "photo-production", name: "V.I.P Diamond Package", price: "$2,499.99", deposit: "$1,000", description: "The ultimate V.I.P experience for hairstylists, skincare gurus, Amazon sellers, and beauty influencers. The best photos made to last forever.", duration: null, includes: ["4-hour V.I.P photo shoot — unlimited clicks & unlimited poses", "Location of choice within Miami-Dade, Palm Beach & Broward County", "10 excellent professional high-end photo edits (you choose which 10)", "Additional edits available at $50 each", "Email with all photos taken at shoot", "Memory card with all raw photos from shoot", "Extra lighting, smoke machine & colorful light machine", "1-minute high-end edited video (raw version included)", "10 photos printed at standard picture size", "1 photo enlarged, printed & framed", "A wonderful photo printed teacup"], bestFor: null, highlight: false, sortOrder: 5 },
  ]);

  // Marketing packages — shared across digital-marketing and news-media
  const marketingPackages = [
    { name: "First Choice Marketing", price: "$15", deposit: null, description: null, duration: "Permanent", includes: ["3 permanent posts on 1 page", "1 story"], bestFor: null, highlight: false },
    { name: "Third Priority Marketing", price: "$49", deposit: null, description: null, duration: "1 Week", includes: ["1-week promotion", "15 posts", "7 story / 8 page"], bestFor: null, highlight: false },
    { name: "Second Priority Marketing", price: "$99", deposit: null, description: null, duration: "15 Days", includes: ["15-day promotion", "30 posts", "15 story / 15 page"], bestFor: null, highlight: false },
    { name: "First Priority Marketing", price: "$149", deposit: null, description: null, duration: "30 Days", includes: ["30-day promotion", "60 posts", "30 story / 30 page"], bestFor: null, highlight: true },
    { name: "High Priority Marketing", price: "$399", deposit: null, description: null, duration: "3 Months", includes: ["3 months of full promotion", "240 posts", "120 story / 120 page"], bestFor: null, highlight: false },
  ];

  for (const slug of ["digital-marketing", "news-media"]) {
    await db.insert(packages).values(
      marketingPackages.map((p, i) => ({ ...p, serviceSlug: slug, sortOrder: i + 1 }))
    );
  }

  // Video production packages
  await db.insert(packages).values([
    { serviceSlug: "video-production", name: "Brand Reel", price: "$799", deposit: "$300", description: "A polished short-form brand video built for social media. Perfect for businesses launching or refreshing their digital presence.", duration: null, includes: ["Up to 60-second final video", "1 shoot day (half day)", "Professional editing & color grade", "Licensed background music", "1 round of revisions", "Delivered in 16:9 + 9:16 formats"], bestFor: null, highlight: false, sortOrder: 1 },
    { serviceSlug: "video-production", name: "Commercial Package", price: "$1,499", deposit: "$600", description: "A full-length brand commercial for campaigns, websites, and paid media. Cinema-grade quality built to convert.", duration: null, includes: ["Up to 2-minute final video", "Full shoot day", "Script & storyboard development", "Professional editing & color grade", "Custom sound design", "2 rounds of revisions", "Multi-format delivery"], bestFor: null, highlight: false, sortOrder: 2 },
    { serviceSlug: "video-production", name: "Brand Film", price: "$2,999", deposit: "$1,000", description: "A cinematic brand story experience. Built for brands that want to dominate every screen — TV, social, and everything in between.", duration: null, includes: ["Up to 5-minute final video", "Full shoot day + additional coverage", "Complete pre-production (script, storyboard, casting)", "Cinema-grade filming & direction", "Advanced color grading & sound design", "3 rounds of revisions", "All cuts delivered — broadcast, social, web", "Raw footage included"], bestFor: null, highlight: true, sortOrder: 3 },
    { serviceSlug: "video-production", name: "Content Series", price: "$4,999", deposit: "$1,500", description: "A full multi-video content package for brands that want to dominate social media and advertising with consistent, high-quality content.", duration: null, includes: ["5 individual videos (up to 90 sec each)", "2 shoot days", "Full creative direction & strategy", "Advanced editing, grading & sound", "Platform-optimized cuts per video", "Priority delivery", "Content calendar consultation", "All raw footage delivered"], bestFor: null, highlight: false, sortOrder: 4 },
  ]);

  console.log("✓ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
