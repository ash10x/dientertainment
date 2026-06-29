import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import { getSettings, getActiveServices, getPageHero } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact — diEntertainment",
  description:
    "Start a project with diEntertainment. Tell us about your brand and we'll get back within 24 hours.",
  openGraph: {
    title: "Contact — diEntertainment",
    description:
      "Start a project with diEntertainment. Tell us about your brand and we'll get back within 24 hours.",
    url: "/contact",
  },
};

const socialOrder = [
  { key: "social_instagram", label: "Instagram" },
  { key: "social_twitter", label: "Twitter / X" },
  { key: "social_linkedin", label: "LinkedIn" },
  { key: "social_youtube", label: "YouTube" },
  { key: "social_tiktok", label: "TikTok" },
];

export default async function ContactPage(props: {
  searchParams: Promise<{ service?: string; package?: string; price?: string; deposit?: string }>;
}) {
  const [searchParams, settings, dbServices, hero] = await Promise.all([props.searchParams, getSettings(), getActiveServices(), getPageHero("contact")]);
  const serviceOptions = [
    ...dbServices.map((s) => ({ value: s.slug, label: s.title })),
    { value: "general", label: "General Inquiry" },
  ];
  const initialService = searchParams.service ?? "";
  const initialPackage = searchParams.package ?? "";
  const initialPrice = searchParams.price ?? "";
  const initialDeposit = searchParams.deposit ?? "";

  const contactDetails = [
    ...(settings.email ? [{ label: "Email", value: settings.email, href: `mailto:${settings.email}` }] : []),
    ...(settings.phone ? [{ label: "Phone", value: settings.phone_display || settings.phone, href: `tel:${settings.phone}` }] : []),
  ];

  const socials = socialOrder
    .filter((s) => settings[s.key] && settings[s.key] !== "#")
    .map((s) => ({ label: s.label, href: settings[s.key] }));

  return (
    <main className="bg-brand-black pt-17">
      {/* ─── Hero headline ─── */}
      <section className="border-b border-white/5 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.35em] uppercase">
              {hero.eyebrow}
            </span>
          </div>
          <h1
            className="font-display uppercase leading-[0.88] text-brand-white"
            style={{ fontSize: "clamp(56px, 9vw, 136px)" }}
          >
            {hero.heading.split("\n").map((line, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i} className="block">{line}</span>
              ) : (
                <span key={i}>
                  {line}
                  {hero.headingAccent && (
                    <>{" "}<span className="text-red">{hero.headingAccent}</span></>
                  )}
                </span>
              )
            )}
          </h1>
        </div>
      </section>

      {/* ─── Contact info + Form ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16 lg:gap-24">

            {/* Left — info panel */}
            <div>
              <p className="text-brand-white/45 text-sm leading-relaxed mb-12">
                Tell us about your project and goals. We review every submission
                personally and respond within 24 hours.
              </p>

              <div className="space-y-8">
                {contactDetails.map((item) => (
                  <div key={item.label}>
                    <div className="text-red text-[9px] tracking-[0.35em] uppercase mb-1.5">
                      {item.label}
                    </div>
                    <a
                      href={item.href}
                      className="text-brand-white/60 text-sm hover:text-brand-white transition-colors duration-200"
                    >
                      {item.value}
                    </a>
                  </div>
                ))}

                <div>
                  <div className="text-red text-[9px] tracking-[0.35em] uppercase mb-3">
                    Follow
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.label} (opens in new tab)`}
                        className="text-brand-white/40 text-[10px] tracking-[0.2em] uppercase hover:text-red transition-colors duration-200"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative quote */}
              <div className="mt-16 pt-10 border-t border-white/7">
                <blockquote className="text-brand-white/30 text-sm leading-relaxed italic">
                  &ldquo;Every great brand starts with a single
                  conversation.&rdquo;
                </blockquote>
                <p className="text-red text-[9px] tracking-[0.25em] uppercase mt-3">
                  — diEntertainment
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <ContactForm
                initialService={initialService}
                initialPackage={initialPackage}
                initialPrice={initialPrice}
                initialDeposit={initialDeposit}
                serviceOptions={serviceOptions}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
