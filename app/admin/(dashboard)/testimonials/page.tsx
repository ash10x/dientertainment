import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { asc } from "drizzle-orm";
import TestimonialsManager from "./TestimonialsManager";

export default async function TestimonialsPage() {
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
  return <TestimonialsManager initialTestimonials={rows} />;
}
