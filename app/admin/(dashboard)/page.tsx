import { db } from "@/lib/db";
import { workProjects, testimonials, siteStats, packages, contactSubmissions, adminUsers } from "@/lib/schema";
import { sql } from "drizzle-orm";

async function getCounts() {
  const [projects, testim, stats, pkgs, submissions, users] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(workProjects),
    db.select({ count: sql<number>`count(*)` }).from(testimonials),
    db.select({ count: sql<number>`count(*)` }).from(siteStats),
    db.select({ count: sql<number>`count(*)` }).from(packages),
    db.select({ count: sql<number>`count(*)` }).from(contactSubmissions),
    db.select({ count: sql<number>`count(*)` }).from(adminUsers),
  ]);
  return {
    projects: Number(projects[0].count),
    testimonials: Number(testim[0].count),
    stats: Number(stats[0].count),
    packages: Number(pkgs[0].count),
    submissions: Number(submissions[0].count),
    users: Number(users[0].count),
  };
}

async function getRecentSubmissions() {
  return db
    .select()
    .from(contactSubmissions)
    .orderBy(sql`created_at desc`)
    .limit(5);
}

const statCards = [
  { label: "Work Projects", key: "projects" as const, href: "/admin/work", color: "text-blue-400" },
  { label: "Testimonials", key: "testimonials" as const, href: "/admin/testimonials", color: "text-yellow-400" },
  { label: "Site Stats", key: "stats" as const, href: "/admin/stats", color: "text-purple-400" },
  { label: "Packages", key: "packages" as const, href: "/admin/packages", color: "text-green-400" },
  { label: "Submissions", key: "submissions" as const, href: "/admin/submissions", color: "text-[#E50019]" },
  { label: "Admin Users", key: "users" as const, href: "/admin/users", color: "text-orange-400" },
];

export default async function AdminDashboard() {
  const [counts, recent] = await Promise.all([getCounts(), getRecentSubmissions()]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Overview of all site content and submissions.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, key, color }) => (
          <div key={key} className="bg-[#111] border border-white/8 rounded-xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{label}</p>
            <p className={`text-4xl font-bold ${color}`}>{counts[key]}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-white/8 rounded-xl">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Recent Submissions</h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-8 text-white/30 text-sm text-center">No submissions yet.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map((s) => (
              <div key={s.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{s.fullName}</p>
                  <p className="text-xs text-white/40 mt-0.5">{s.email} · {s.service}</p>
                  {s.packageName && (
                    <p className="text-xs text-white/30 mt-0.5">{s.packageName} {s.packagePrice ? `— ${s.packagePrice}` : ""}</p>
                  )}
                </div>
                <time className="text-xs text-white/30 shrink-0">
                  {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
