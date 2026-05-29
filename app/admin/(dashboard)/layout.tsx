import type { Metadata } from "next";
import AdminShell from "../components/AdminShell";

export const metadata: Metadata = {
  title: "Admin — diEntertainment",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
