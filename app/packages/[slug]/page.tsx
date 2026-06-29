import type { Metadata } from "next";
import Link from "next/link";
import { getPackageBySlug, getAllPackageSlugs } from "@/lib/packages";
import BookingForm from "./BookingForm";
import StatsCounter from "./StatsCounter";
import VideoGallery from "./VideoGallery";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  const description = pkg.description ?? pkg.tagline ?? `Explore the ${pkg.name} package from diEntertainment. Starting at ${pkg.price}.`;
  return {
    title: `${pkg.name} — diEntertainment`,
    description,
    openGraph: {
      title: `${pkg.name} — diEntertainment`,
      description,
      url: `/packages/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPackageSlugs();
  return slugs.map((slug) => ({ slug }));
}

type ServiceType = "photography" | "videography" | "default";

function classifyService(category: string): ServiceType {
  const s = category.toLowerCase();
  if (s.includes("photo")) return "photography";
  if (s.includes("video")) return "videography";
  return "default";
}

const COMPARISON: Record<ServiceType, { label: string; roles: string[]; diItems: string[] }> = {
  photography: {
    label: "Hiring Freelancers Yourself",
    roles: ["Professional Photographer", "Photo Editor / Retoucher", "Location Scouting", "Equipment Rental", "Studio / Lighting Setup", "Post-Processing Specialist"],
    diItems: ["All-Inclusive Shoot", "Professional Equipment", "Expert Retouching", "Same-Day Gallery Access"],
  },
  videography: {
    label: "Hiring Freelancers Yourself",
    roles: ["Videographer / Camera Operator", "Video Editor", "Sound Engineer", "Camera Crew & Equipment", "Color Grading Specialist", "Director / Creative Lead"],
    diItems: ["Full Production Team", "Cinema-Grade Equipment", "Expert Post-Production", "Multi-Format Delivery"],
  },
  default: {
    label: "Hiring a Team Yourself",
    roles: ["Social Media Manager", "Copywriter", "Graphic Designer", "Video Editor", "UGC Creator", "AI Prompt Engineer", "Marketing Strategist", "Community Manager"],
    diItems: ["One Team", "One Strategy", "AI Powered"],
  },
};

const BEFORE_ITEMS = ["10 likes per post", "200 followers", "Poor branding", "No consistency"];
const AFTER_ITEMS = ["Professional AI Brand", "Daily Content", "Multiple AI Ambassadors", "Automated Marketing", "Authority & Trust", "Social Proof"];

function getYouTubeId(url: string) { return url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1] ?? ""; }
function isYouTube(url: string) { return url.includes("youtube.com") || url.includes("youtu.be"); }

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  const serviceType = classifyService(pkg.category);
  const isMedia = serviceType === "photography" || serviceType === "videography";
  const comparison = COMPARISON[serviceType];

  return (
    <main className="bg-brand-black pt-17">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[80vh] bg-brand-black flex flex-col overflow-hidden">
        <div className="absolute top-0 right-0 w-175 h-175 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 15%, rgba(229,0,25,0.09) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse at center, transparent 40%, black 80%)" }} />
        <span className="font-display absolute bottom-0 right-4 lg:right-10 leading-[0.8] text-white/2.5 pointer-events-none select-none" style={{ fontSize: "clamp(180px, 28vw, 400px)" }} aria-hidden="true">{String(pkg.sortOrder).padStart(2, "0")}</span>
        <div className="mt-auto max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 lg:pb-28">
          <Link href="/#packages" className="inline-flex items-center gap-2 text-brand-white/30 hover:text-red text-[10px] tracking-[0.28em] uppercase transition-colors duration-200 group mb-12">
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>All Packages
          </Link>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">{pkg.category}</span>
          </div>
          <h1 className="font-display uppercase leading-[0.87] text-brand-white mb-5" style={{ fontSize: "clamp(48px, 8vw, 120px)" }}>{pkg.name}</h1>
          {pkg.duration && (
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 text-[9px] tracking-[0.32em] uppercase text-red border border-red/30 bg-red/6 px-4 py-2">
                <span className="w-1 h-1 rounded-full bg-red" />{pkg.duration}
              </span>
            </div>
          )}
          {pkg.tagline && <p className="text-brand-white/55 text-xl max-w-lg leading-relaxed mb-10">{pkg.tagline}</p>}
          {pkg.description && !pkg.tagline && <p className="text-brand-white/45 text-lg max-w-md leading-relaxed mb-10">{pkg.description}</p>}
          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-display text-brand-white leading-none" style={{ fontSize: "clamp(52px, 7vw, 88px)" }}>{pkg.price}</span>
            <span className="text-brand-white/30 text-[10px] tracking-[0.2em] uppercase self-end pb-2">USD</span>
          </div>
          {pkg.deposit && <p className="text-brand-white/35 text-xs tracking-wide mt-3">Deposit: <span className="text-brand-white/55">{pkg.deposit}</span> <span className="text-brand-white/20 text-[9px] uppercase tracking-widest">USD</span></p>}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 bg-linear-to-b from-transparent to-red/55" />
      </section>

      {/* ─── HERO VIDEO ─── */}
      {pkg.heroVideoUrl && (
        <section className="bg-brand-black border-t border-white/5 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">Watch the Introduction</span>
            </div>
            <div className="relative aspect-video bg-black/50 overflow-hidden border border-white/5" style={{ boxShadow: "0 0 60px rgba(229,0,25,0.06)" }}>
              {isYouTube(pkg.heroVideoUrl) ? (
                <iframe src={`https://www.youtube.com/embed/${getYouTubeId(pkg.heroVideoUrl)}`} className="absolute inset-0 w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <video src={pkg.heroVideoUrl} controls className="absolute inset-0 w-full h-full object-contain" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── OUTCOMES / RESULTS ─── */}
      {pkg.outcomeStats && pkg.outcomeStats.length > 0 && (
        <section className="bg-[#080808] py-20 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">Results</span>
            </div>
            <h2 className="font-display text-brand-white uppercase mb-12" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
              What You Can Achieve<br />In 90 Days
            </h2>
            <StatsCounter stats={pkg.outcomeStats} />
            <p className="text-brand-white/20 text-[9px] tracking-wide mt-5 max-w-lg">*Actual results vary depending on factors like audience, budget, content performance, and campaign execution.</p>
          </div>
        </section>
      )}

      {/* ─── BEFORE & AFTER ─── */}
      {!isMedia && <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">The Transformation</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
            <div className="bg-[#0d0d0d] p-8 lg:p-12">
              <p className="text-brand-white/25 text-[9px] tracking-widest uppercase mb-8">Before DI Entertainment</p>
              <ul className="space-y-4">
                {BEFORE_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-brand-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/15 shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-black p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-red/50" />
              <p className="text-red text-[9px] tracking-widest uppercase mb-8">After DI Entertainment</p>
              <ul className="space-y-4">
                {AFTER_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-brand-white">
                    <span className="text-red shrink-0">→</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>}

      {/* ─── WHAT YOUR AI MARKETING DEPARTMENT DELIVERS ─── */}
      {pkg.features.length > 0 && (
        <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">What You Get</span>
            </div>
            <h2 className="font-display text-brand-white uppercase mb-12" style={{ fontSize: "clamp(28px, 3.5vw, 52px)" }}>
              {isMedia ? <>What&apos;s In<br />Your Package</> : <>What Your AI Marketing<br />Department Delivers</>}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
              {pkg.features.map((feature, i) => (
                <div key={feature} className="relative bg-brand-black p-8 lg:p-10 group overflow-hidden hover:-translate-y-px transition-transform duration-300">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(229,0,25,0.055) 0%, transparent 70%)" }} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <span className="text-red/20 font-display text-[10px] tracking-[0.38em] uppercase block mb-4 group-hover:text-red/40 transition-colors duration-300">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-brand-white/75 text-sm leading-relaxed group-hover:text-brand-white transition-colors duration-300">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── DEMO VIDEOS ─── */}
      {pkg.demoVideoUrls && pkg.demoVideoUrls.length > 0 && (
        <section className="bg-[#080808] py-20 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">Live Examples</span>
            </div>
            <VideoGallery urls={pkg.demoVideoUrls} />
          </div>
        </section>
      )}

      {/* ─── AI TEAM ─── */}
      {pkg.aiTeamRoles && pkg.aiTeamRoles.length > 0 && (
        <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">Your Team</span>
            </div>
            <h2 className="font-display text-brand-white uppercase mb-12" style={{ fontSize: "clamp(28px, 3.5vw, 52px)" }}>Meet Your AI<br />Marketing Team</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
              {pkg.aiTeamRoles.map((role) => (
                <div key={role} className="bg-brand-black p-6 lg:p-8 group hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="w-8 h-8 rounded-full bg-red/8 border border-red/15 flex items-center justify-center mb-4 group-hover:border-red/35 transition-colors duration-200">
                    <span className="w-2 h-2 rounded-full bg-red/50 group-hover:bg-red transition-colors duration-200" />
                  </div>
                  <p className="text-brand-white/70 text-sm leading-snug group-hover:text-brand-white transition-colors duration-200">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 90-DAY ROADMAP ─── */}
      {pkg.processSteps && pkg.processSteps.length > 0 && (
        <section className="bg-[#080808] py-20 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">{isMedia ? "Production Timeline" : "90-Day Roadmap"}</span>
            </div>
            <h2 className="font-display text-brand-white uppercase mb-12" style={{ fontSize: "clamp(28px, 3.5vw, 52px)" }}>The Process</h2>
            <div className="space-y-0">
              {pkg.processSteps.map((step, i) => (
                <div key={step} className="flex items-start gap-8 py-7 border-b border-white/5 group">
                  <span className="font-display text-red/25 leading-none shrink-0 group-hover:text-red/55 transition-colors duration-300" style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-brand-white/60 text-sm leading-relaxed self-center group-hover:text-brand-white/85 transition-colors duration-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── VS COMPARISON ─── */}
      <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">The Honest Comparison</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
            <div className="bg-[#0d0d0d] p-8 lg:p-12">
              <p className="text-brand-white/25 text-[9px] tracking-widest uppercase mb-6">{comparison.label}</p>
              <ul className="space-y-3">
                {comparison.roles.map((role) => (
                  <li key={role} className="flex items-center gap-3 text-sm text-brand-white/45">
                    <span className="text-red/50 shrink-0 text-xs">✕</span>{role}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-black p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-red/50" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(229,0,25,0.04) 0%, transparent 60%)" }} />
              <p className="text-red text-[9px] tracking-widest uppercase mb-6">DI Entertainment</p>
              <ul className="space-y-3 mb-8">
                {comparison.diItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-brand-white">
                    <span className="text-red shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-red/15 pt-6">
                <p className="text-[9px] tracking-widest uppercase text-red/40 mb-2">Your Investment</p>
                <p className="font-display text-brand-white" style={{ fontSize: "clamp(22px, 2.5vw, 36px)" }}>{pkg.price} <span className="text-base text-brand-white/30">USD</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DELIVERABLES ─── */}
      {pkg.deliverables && pkg.deliverables.length > 0 && (
        <section className="bg-[#080808] py-20 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">What You Receive</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {pkg.deliverables.map((item) => (
                <li key={item} className="bg-[#080808] p-7 flex items-start gap-3 group">
                  <span className="text-red mt-0.5 shrink-0">→</span>
                  <span className="text-brand-white/65 text-sm leading-snug group-hover:text-brand-white transition-colors duration-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── ADD-ONS ─── */}
      {pkg.addOns && pkg.addOns.length > 0 && (
        <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">Optional Add-Ons</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {pkg.addOns.map((addon) => (
                <span key={addon} className="text-sm text-brand-white/60 border border-white/10 px-5 py-3 hover:border-red/40 hover:text-brand-white transition-colors duration-200">{addon}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BEST FOR + BOOKING ─── */}
      <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {pkg.bestFor && pkg.bestFor.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-white/15" />
                <span className="text-brand-white/50 text-[9px] tracking-[0.38em] uppercase">Best For</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pkg.bestFor.map((tag) => (
                  <span key={tag} className="text-[9px] tracking-[0.15em] uppercase text-brand-white/65 border border-white/18 px-4 py-2 rounded-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-red" />
                <span className="text-red text-[10px] tracking-[0.38em] uppercase">Book This Package</span>
              </div>
              <h2 className="font-display uppercase leading-[0.87] text-brand-white mb-8" style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}>
                Let&apos;s get<br /><span className="text-red">started.</span>
              </h2>
              <p className="text-brand-white/40 text-sm leading-relaxed max-w-xs">Fill out the form and our team will follow up within 24 hours to confirm your booking and walk you through next steps.</p>
              {pkg.highlight && (
                <div className="mt-10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                  <span className="text-[9px] tracking-[0.3em] uppercase text-red">Most Popular Package</span>
                </div>
              )}
            </div>
            <BookingForm packageName={pkg.name} packagePrice={pkg.price} packageDeposit={pkg.deposit} service={pkg.category} />
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="bg-red py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/25" />
        <span className="font-display absolute inset-0 flex items-center justify-center leading-none text-white/5 pointer-events-none select-none uppercase" style={{ fontSize: "clamp(140px, 24vw, 360px)" }} aria-hidden="true">di</span>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-6 h-px bg-white/45" />
            <span className="text-white/60 text-[10px] tracking-[0.38em] uppercase">Not quite right?</span>
          </div>
          <h2 className="font-display uppercase leading-[0.87] text-brand-white mb-9" style={{ fontSize: "clamp(40px, 6vw, 96px)" }}>Explore all<br />packages.</h2>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link href="/#packages" className="inline-flex items-center gap-2 bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-px">View All Packages <span>→</span></Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:border-white hover:bg-white/8 transition-all duration-300 hover:-translate-y-px">Custom Quote</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
