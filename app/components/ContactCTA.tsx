import { getSettings } from "@/lib/queries";

const socialOrder = [
  { key: "social_instagram", label: "Instagram" },
  { key: "social_twitter", label: "Twitter / X" },
  { key: "social_linkedin", label: "LinkedIn" },
  { key: "social_youtube", label: "YouTube" },
  { key: "social_tiktok", label: "TikTok" },
];

export default async function ContactCTA() {
  const settings = await getSettings();

  const activeSocials = socialOrder.filter(
    (s) => settings[s.key] && settings[s.key] !== "#"
  );

  return (
    <section
      id="contact"
      className="bg-red py-24 lg:py-36 relative overflow-hidden"
    >
      {/* Layered glows for depth */}
      <div
        className="absolute top-0 right-0 w-150 h-150 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 90% 10%, rgba(255,255,255,0.07) 0%, transparent 55%)",
        }}
      />

      {/* Giant background watermark */}
      <span
        className="font-display absolute inset-0 flex items-center justify-center leading-none text-white/5.5 pointer-events-none select-none uppercase"
        style={{ fontSize: "clamp(160px, 28vw, 420px)" }}
        aria-hidden="true"
      >
        di
      </span>

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/25" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-6 h-px bg-white/45" />
            <span className="text-white/65 text-[10px] tracking-[0.38em] uppercase">
              Let&apos;s Work Together
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-display uppercase leading-[0.87] text-brand-white mb-8"
            style={{ fontSize: "clamp(60px, 10vw, 148px)" }}
          >
            Ready to elevate
            <br />
            your brand?
          </h2>

          <p className="text-white/60 text-lg max-w-lg leading-relaxed mb-12">
            Let&apos;s create something powerful together. Tell us about your
            project and we&apos;ll get back to you within 24 hours.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
            >
              Start a Project <span className="text-sm">→</span>
            </a>
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 border border-white/30 text-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:border-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-px"
                style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
              >
                Call Us
              </a>
            )}
          </div>

          {/* Divider + socials */}
          {activeSocials.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <span className="text-white/45 text-[10px] tracking-[0.28em] uppercase shrink-0">
                Follow us
              </span>
              <div className="flex items-center gap-6 flex-wrap">
                {activeSocials.map((s) => (
                  <a
                    key={s.key}
                    href={settings[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/45 hover:text-white text-[10px] tracking-[0.22em] uppercase transition-colors duration-200"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
