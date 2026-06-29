"use client";

import { useState } from "react";
import SchedulerStep from "@/app/components/SchedulerStep";
import ConfirmationStep from "@/app/components/ConfirmationStep";
import type { MeetingConfirmation } from "@/types/meeting";

type ServiceOption = { value: string; label: string };

type Step = "form" | "submitting" | "scheduling" | "confirmed" | "error";

const budgetOptions = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1k", label: "$500 – $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-plus", label: "$15,000+" },
];

const inputClass =
  "w-full bg-transparent border-b border-white/14 focus:border-red text-brand-white text-sm py-3 outline-none placeholder:text-brand-white/20 transition-colors duration-200 caret-red";

const labelClass =
  "block text-brand-white/35 text-[9px] tracking-[0.3em] uppercase mb-2";

export default function ContactForm({
  initialService = "",
  initialPackage = "",
  initialPrice = "",
  initialDeposit = "",
  serviceOptions = [],
}: {
  initialService?: string;
  initialPackage?: string;
  initialPrice?: string;
  initialDeposit?: string;
  serviceOptions?: ServiceOption[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState(initialService);
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [submissionId, setSubmissionId] = useState<number>(0);
  const [bookingRef, setBookingRef] = useState("");
  const [timezone] = useState(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "America/New_York"; }
  });
  const [confirmation, setConfirmation] = useState<MeetingConfirmation | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const hasPackage = Boolean(initialPackage);
  const selectedServiceLabel =
    serviceOptions.find((s) => s.value === service)?.label ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          socialHandle: instagram || null,
          companyName: company || null,
          service,
          budget: budget || null,
          packageName: initialPackage || null,
          packagePrice: initialPrice || null,
          packageDeposit: initialDeposit || null,
          message,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissionId(data.submissionId ?? 0);
        setBookingRef(data.bookingRef ?? "");
        setStep("scheduling");
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong.");
        setStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStep("error");
    }
  }

  if (step === "scheduling") {
    return (
      <SchedulerStep
        submissionId={submissionId}
        bookingRef={bookingRef}
        clientName={name}
        onConfirmed={(c) => { setConfirmation(c); setStep("confirmed"); }}
      />
    );
  }
  if (step === "confirmed" && confirmation) {
    return <ConfirmationStep confirmation={confirmation} timezone={timezone} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">

      {/* ── Package Banner ── */}
      {hasPackage && (
        <div className="border border-red/30 bg-red/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-red text-[9px] tracking-[0.35em] uppercase mb-1">
              Selected Package
            </div>
            <div className="text-brand-white font-medium text-sm">
              {initialPackage}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div
              className="font-display text-brand-white leading-none"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              {initialPrice}
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="text-brand-white/30 text-[9px] tracking-[0.2em] uppercase hover:text-red transition-colors duration-200 mt-1 inline-block"
            >
              ← Change package
            </a>
          </div>
        </div>
      )}

      {/* Row 1 — Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <label htmlFor="cf-name" className={labelClass}>
            Full Name <span className="text-red">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClass}>
            Email Address <span className="text-red">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
            className={inputClass}
          />
        </div>

        {/* Row 2 — Phone + Instagram */}
        <div>
          <label htmlFor="cf-phone" className={labelClass}>
            Phone Number <span className="text-red">*</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (305) 000-0000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-instagram" className={labelClass}>Instagram / Social Handle</label>
          <input
            id="cf-instagram"
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@yourbrand"
            className={inputClass}
          />
        </div>

        {/* Row 3 — Company + Service */}
        <div>
          <label htmlFor="cf-company" className={labelClass}>Company / Brand Name</label>
          <input
            id="cf-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your Brand"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-service" className={labelClass}>
            Service Interest <span className="text-red">*</span>
          </label>
          <div className="relative">
            <select
              id="cf-service"
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-brand-black border-b border-white/14 focus:border-red text-sm py-3 outline-none appearance-none transition-colors duration-200 cursor-pointer"
              style={{ color: service ? "#F5F5F5" : "rgba(245,245,245,0.2)" }}
            >
              <option value="" disabled>Select a service...</option>
              {serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#111111] text-brand-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red text-[10px] pointer-events-none">▾</span>
          </div>
        </div>
      </div>

      {/* Budget — hidden when a package is pre-selected */}
      {!hasPackage && (
        <div>
          <label htmlFor="cf-budget" className={labelClass}>Budget Range</label>
          <div className="relative">
            <select
              id="cf-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-brand-black border-b border-white/14 focus:border-red text-sm py-3 outline-none appearance-none transition-colors duration-200 cursor-pointer"
              style={{ color: budget ? "#F5F5F5" : "rgba(245,245,245,0.2)" }}
            >
              <option value="">Select budget range...</option>
              {budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#111111] text-brand-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red text-[10px] pointer-events-none">▾</span>
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className={labelClass}>
          {hasPackage ? "Anything we should know?" : "Tell Us About Your Project"}{" "}
          <span className="text-red">*</span>
        </label>
        <textarea
          id="cf-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            hasPackage
              ? "Share your vision, preferred dates, locations, or any special requirements..."
              : "Describe your goals, timeline, and anything else we should know..."
          }
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Honeypot (hidden) */}
      <input type="text" name="website" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />

      {/* Error message */}
      {step === "error" && (
        <p className="text-red text-xs tracking-wide">{errorMsg}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={step === "submitting"}
        className="flex items-center gap-3 bg-red text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 rounded-xs hover:bg-[#FF001F] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(229,0,25,0.35)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        {step === "submitting" ? (
          <>
            <span
              className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin"
              aria-hidden="true"
            />
            Sending...
          </>
        ) : (
          <>
            {hasPackage ? "Book Package" : "Send Message"}{" "}
            <span className="text-sm">→</span>
          </>
        )}
      </button>
    </form>
  );
}
