// app/admin/(dashboard)/availability/page.tsx
import type { Metadata } from "next";
import AvailabilityManager from "./AvailabilityManager";

export const metadata: Metadata = { title: "Availability — diEntertainment Admin" };

export default function AvailabilityPage() {
  return <AvailabilityManager />;
}
