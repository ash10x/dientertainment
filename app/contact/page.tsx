import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — diEntertainment",
  description:
    "Start a project with diEntertainment. Tell us about your brand and we'll get back within 24 hours.",
};

const contactDetails = [
  { label: "Email", value: "hello@dientertainment.com", href: "mailto:hello@dientertainment.com" },
  { label: "Phone", value: "+1 (234) 567-8900", href: "tel:+12345678900" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
];

export default async function ContactPage(props: {
  searchParams: Promise<{ service?: string }>;
}) {
  const searchParams = await props.searchParams;
  const initialService = searchParams.service ?? "";

  return (
    <main className="bg-[#0A0A0A] pt-16">
      {/* ─── Hero headline ─── */}
      <section className="border-b border-white/[0.05] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#E50019]" />
            <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
              Get In Touch
            </span>
          </div>
          <h1
            className="font-display uppercase leading-[0.88] text-[#F5F5F5]"
            style={{ fontSize: "clamp(56px, 9vw, 136px)" }}
          >
            Let&apos;s build
            <br />
            something{" "}
            <span className="text-[#E50019]">great.</span>
          </h1>
        </div>
      </section>

      {/* ─── Contact info + Form ─── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16 lg:gap-24">

            {/* Left — info panel */}
            <div>
              <p className="text-[#F5F5F5]/45 text-sm leading-relaxed mb-12">
                Tell us about your project and goals. We review every submission
                personally and respond within 24 hours.
              </p>

              <div className="space-y-8">
                {contactDetails.map((item) => (
                  <div key={item.label}>
                    <div className="text-[#E50019] text-[9px] tracking-[0.35em] uppercase mb-1.5">
                      {item.label}
                    </div>
                    <a
                      href={item.href}
                      className="text-[#F5F5F5]/60 text-sm hover:text-[#F5F5F5] transition-colors duration-200"
                    >
                      {item.value}
                    </a>
                  </div>
                ))}

                <div>
                  <div className="text-[#E50019] text-[9px] tracking-[0.35em] uppercase mb-3">
                    Follow
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="text-[#F5F5F5]/40 text-[10px] tracking-[0.2em] uppercase hover:text-[#E50019] transition-colors duration-200"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative quote */}
              <div className="mt-16 pt-10 border-t border-white/[0.07]">
                <blockquote className="text-[#F5F5F5]/30 text-sm leading-relaxed italic">
                  &ldquo;Every great brand starts with a single
                  conversation.&rdquo;
                </blockquote>
                <p className="text-[#E50019] text-[9px] tracking-[0.25em] uppercase mt-3">
                  — diEntertainment
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <ContactForm initialService={initialService} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
