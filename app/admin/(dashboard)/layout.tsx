import type { Metadata } from "next";
import AdminSidebar from "../components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — diEntertainment",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
