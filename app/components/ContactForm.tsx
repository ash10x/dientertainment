"use client";

import { useState } from "react";

const serviceOptions = [
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "news-media", label: "News & Media" },
  { value: "photo-production", label: "Photo Production" },
  { value: "video-production", label: "Video Production" },
  { value: "general", label: "General Inquiry" },
];

const budgetOptions = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-50k", label: "$15,000 – $50,000" },
  { value: "50k-plus", label: "$50,000+" },
];

const inputClass =
  "w-full bg-transparent border-b border-white/[0.14] focus:border-[#E50019] text-[#F5F5F5] text-sm py-3 outline-none placeholder:text-[#F5F5F5]/20 transition-colors duration-200 caret-[#E50019]";

const labelClass =
  "block text-[#F5F5F5]/35 text-[9px] tracking-[0.3em] uppercase mb-2";

export default function ContactForm({
  initialService = "",
}: {
  initialService?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState(initialService);
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const selectedServiceLabel =
    serviceOptions.find((s) => s.value === service)?.label ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    // Simulate async submission — wire to Resend / your backend here
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col py-16">
        <div
          className="font-display text-[#E50019] leading-none mb-6"
          style={{ fontSize: "clamp(56px, 6vw, 80px)" }}
        >
          ✓
        </div>
        <h3
          className="font-display uppercase text-[#F5F5F5] mb-4"
          style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
        >
          Message Received.
        </h3>
        <p className="text-[#F5F5F5]/45 text-sm leading-relaxed max-w-sm">
          {selectedServiceLabel
            ? `We received your inquiry about ${selectedServiceLabel}. `
            : "We received your message. "}
          Our team will review your brief and be in touch within 24 hours.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-[#E50019] text-[11px] tracking-[0.25em] uppercase hover:gap-4 transition-all duration-300"
        >
          Back to Home <span>→</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <label className={labelClass}>
            Full Name <span className="text-[#E50019]">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            Email Address <span className="text-[#E50019]">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
            className={inputClass}
          />
        </div>

        {/* Row 2: Company + Service */}
        <div>
          <label className={labelClass}>Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your Company"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            Service Interest <span className="text-[#E50019]">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-[#0A0A0A] border-b border-white/[0.14] focus:border-[#E50019] text-sm py-3 outline-none appearance-none transition-colors duration-200 cursor-pointer"
              style={{ color: service ? "#F5F5F5" : "rgba(245,245,245,0.2)" }}
            >
              <option value="" disabled>
                Select a service...
              </option>
              {serviceOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-[#111111] text-[#F5F5F5]"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#E50019] text-[10px] pointer-events-none">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Budget */}
      <div className="mt-8">
        <label className={labelClass}>Budget Range</label>
        <div className="relative">
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-[#0A0A0A] border-b border-white/[0.14] focus:border-[#E50019] text-sm py-3 outline-none appearance-none transition-colors duration-200 cursor-pointer"
            style={{ color: budget ? "#F5F5F5" : "rgba(245,245,245,0.2)" }}
          >
            <option value="">Select budget range...</option>
            {budgetOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[#111111] text-[#F5F5F5]"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#E50019] text-[10px] pointer-events-none">
            ▾
          </span>
        </div>
      </div>

      {/* Row 4: Message */}
      <div className="mt-8">
        <label className={labelClass}>
          Tell Us About Your Project <span className="text-[#E50019]">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your goals, timeline, and anything else we should know..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-10 flex items-center gap-3 bg-[#E50019] text-[#F5F5F5] text-[11px] tracking-[0.22em] uppercase px-10 py-4 hover:bg-[#FF0022] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
      >
        {status === "submitting" ? (
          <>
            <span
              className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin"
              aria-hidden="true"
            />
            Sending...
          </>
        ) : (
          <>
            Send Message <span className="text-sm">→</span>
          </>
        )}
      </button>
    </form>
  );
}
