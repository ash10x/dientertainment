import { db } from "@/lib/db";
import { packages } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { getAllServices } from "@/lib/queries";
import PackagesManager from "./PackagesManager";

export default async function PackagesPage() {
  const [rows, allServices] = await Promise.all([
    db.select().from(packages).orderBy(asc(packages.serviceSlug), asc(packages.sortOrder)),
    getAllServices(),
  ]);
  const services = allServices.map((s) => ({ slug: s.slug, title: s.title }));
  return <PackagesManager initialPackages={rows} services={services} />;
}
