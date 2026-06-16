import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { getAllServices } from "@/lib/queries";
import TestimonialsManager from "./TestimonialsManager";

export default async function TestimonialsPage() {
  const [rows, allServices] = await Promise.all([
    db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)),
    getAllServices(),
  ]);
  const services = allServices.map((s) => s.title);
  return <TestimonialsManager initialTestimonials={rows} services={services} />;
}
