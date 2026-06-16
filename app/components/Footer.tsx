import Link from "next/link";
import { getSettings } from "@/lib/queries";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Services: [
    { label: "Digital Marketing", href: "/services/digital-marketing" },
    { label: "News & Media", href: "/services/news-media" },
    { label: "Photo Production", href: "/services/photo-production" },
    { label: "Video Production", href: "/services/video-production" },
    { label: "AI Video Creation", href: "/services/ai-video-creation" },
    { label: "AI Image Generation", href: "/services/ai-image-generation" },
    { label: "Script Writing", href: "/services/script-writing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
};

const socialLabels = [
  { key: "social_instagram", label: "Instagram" },
  { key: "social_twitter", label: "Twitter / X" },
  { key: "social_linkedin", label: "LinkedIn" },
  { key: "social_youtube", label: "YouTube" },
  { key: "social_tiktok", label: "TikTok" },
];

export default async function Footer() {
  const settings = await getSettings();
  const activeSocials = socialLabels.filter(
    (s) => settings[s.key] && settings[s.key] !== "#"
  );

  return (
    <footer className="bg-brand-black border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-white/5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-display text-3xl tracking-widest mb-5">
              <span className="text-red">di</span>
              <span className="text-brand-white">ENTERTAINMENT</span>
            </div>
            <p className="text-brand-white/30 text-sm leading-relaxed max-w-65">
              News, media, and digital marketing for brands that refuse to be
              ignored.
            </p>

            {/* Social icons */}
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-5 mt-8 flex-wrap">
                {activeSocials.map((s) => (
                  <a
                    key={s.label}
                    href={settings[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-brand-white/22 hover:text-red text-[10px] tracking-[0.22em] uppercase transition-colors duration-200"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}

            {/* Contact quick-links */}
            <div className="mt-8 space-y-2">
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="block text-brand-white/30 text-xs hover:text-brand-white transition-colors duration-200"
                >
                  {settings.email}
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="block text-brand-white/30 text-xs hover:text-brand-white transition-colors duration-200"
                >
                  {settings.phone_display || settings.phone}
                </a>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <div className="text-brand-white/22 text-[9px] tracking-[0.32em] uppercase mb-5">
                {category}
              </div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-brand-white/50 hover:text-brand-white text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 gap-3">
          <p className="text-brand-white/22 text-[10px] tracking-[0.22em]">
            © {new Date().getFullYear()} diEntertainment. All rights reserved.
          </p>
          <p className="text-brand-white/12 text-[10px] tracking-[0.28em] uppercase">
            Elevating Brands. Moving Culture.
          </p>
        </div>
      </div>
    </footer>
  );
}
