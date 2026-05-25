export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="bg-[#E50019] py-24 lg:py-36 relative overflow-hidden"
    >
      {/* Giant background watermark */}
      <span
        className="font-display absolute inset-0 flex items-center justify-center leading-none text-white/[0.06] pointer-events-none select-none uppercase"
        style={{ fontSize: "clamp(160px, 28vw, 420px)" }}
        aria-hidden="true"
      >
        di
      </span>

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-6 h-px bg-white/40" />
            <span className="text-white/65 text-[10px] tracking-[0.35em] uppercase">
              Let&apos;s Work Together
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-display uppercase leading-[0.88] text-[#F5F5F5] mb-8"
            style={{ fontSize: "clamp(60px, 10vw, 148px)" }}
          >
            Ready to elevate
            <br />
            your brand?
          </h2>

          <p className="text-white/65 text-lg max-w-lg leading-relaxed mb-12">
            Let&apos;s create something powerful together. Tell us about your
            project and we&apos;ll get back to you within 24 hours.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="mailto:hello@dientertainment.com"
              className="bg-[#0A0A0A] text-[#F5F5F5] text-[11px] tracking-[0.22em] uppercase px-9 py-4 hover:bg-[#1A1A1A] transition-colors duration-300 flex items-center gap-2"
            >
              Email Us <span className="text-sm">→</span>
            </a>
            <a
              href="tel:+1234567890"
              className="border border-white/35 text-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Call Us
            </a>
          </div>

          {/* Divider + social proof */}
          <div className="mt-16 pt-10 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="text-white/50 text-[10px] tracking-[0.25em] uppercase">
              Follow us
            </span>
            <div className="flex items-center gap-6">
              {["Instagram", "Twitter / X", "LinkedIn", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-white/50 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
