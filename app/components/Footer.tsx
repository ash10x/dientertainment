const footerLinks: Record<string, string[]> = {
  Services: [
    "Digital Marketing",
    "News & Media",
    "Photo Production",
    "Video Production",
  ],
  Company: ["About", "Work", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service"],
};

const socials = [
  { label: "IG", name: "Instagram" },
  { label: "TW", name: "Twitter / X" },
  { label: "LI", name: "LinkedIn" },
  { label: "YT", name: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/[0.05] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-white/[0.05]">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-display text-3xl tracking-widest mb-5">
              <span className="text-[#E50019]">di</span>
              <span className="text-[#F5F5F5]">ENTERTAINMENT</span>
            </div>
            <p className="text-[#F5F5F5]/35 text-sm leading-relaxed max-w-[260px]">
              News, media, and digital marketing for brands that refuse to be
              ignored.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-5 mt-8">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="text-[#F5F5F5]/25 hover:text-[#E50019] text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <div className="text-[#F5F5F5]/25 text-[9px] tracking-[0.3em] uppercase mb-5">
                {category}
              </div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[#F5F5F5]/55 hover:text-[#F5F5F5] text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 gap-3">
          <p className="text-[#F5F5F5]/25 text-[10px] tracking-[0.2em]">
            © 2024 diEntertainment. All rights reserved.
          </p>
          <p className="text-[#F5F5F5]/15 text-[10px] tracking-[0.25em] uppercase">
            Elevating Brands. Moving Culture.
          </p>
        </div>
      </div>
    </footer>
  );
}
