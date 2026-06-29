// app/admin/(dashboard)/meetings/page.tsx
import type { Metadata } from "next";
import MeetingsManager from "./MeetingsManager";

export const metadata: Metadata = { title: "Meetings — diEntertainment Admin" };

export default function MeetingsPage() {
  return <MeetingsManager />;
}
