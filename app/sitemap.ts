import type { MetadataRoute } from "next";
import { getActiveServices } from "@/lib/queries";
import { getAllPackageSlugs } from "@/lib/packages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dientertainment.com";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, packageSlugs] = await Promise.all([
    getActiveServices().catch(() => []),
    getAllPackageSlugs().catch(() => []),
  ]);

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const packageRoutes: MetadataRoute.Sitemap = packageSlugs.map((slug) => ({
    url: `${SITE_URL}/packages/${slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...serviceRoutes, ...packageRoutes];
}
