"use client";

import { useState } from "react";
import SchedulerStep from "@/app/components/SchedulerStep";
import ConfirmationStep from "@/app/components/ConfirmationStep";
import type { MeetingConfirmation } from "@/types/meeting";

const inputClass =
  "w-full bg-transparent border-b border-white/14 focus:border-red text-brand-white text-sm py-3 outline-none placeholder:text-brand-white/20 transition-colors duration-200 caret-red";
const labelClass =
  "block text-brand-white/35 text-[9px] tracking-[0.3em] uppercase mb-2";

type Props = {
  packageName: string;
  packagePrice: string;
  packageDeposit: string | null;
  service: string;
};

type Step = "form" | "submitting" | "scheduling" | "confirmed" | "error";

export default function BookingForm({
  packageName,
  packagePrice,
  packageDeposit,
  service,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [submissionId, setSubmissionId] = useState<number>(0);
  const [bookingRef, setBookingRef] = useState("");
  const [timezone] = useState(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "America/New_York"; }
  });
  const [confirmation, setConfirmation] = useState<MeetingConfirmation | null>(null);

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
          socialHandle: null,
          companyName: company || null,
          service,
          budget: null,
          packageName,
          packagePrice,
          packageDeposit,
          message,
          timezone,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissionId(data.submissionId ?? 0);
        setBookingRef(data.bookingRef ?? "");
        setStep("scheduling");
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
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
        packageName={packageName}
        onConfirmed={(c) => {
          setConfirmation(c);
          setStep("confirmed");
        }}
      />
    );
  }

  if (step === "confirmed" && confirmation) {
    return <ConfirmationStep confirmation={confirmation} timezone={timezone} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Selected package — read-only */}
      <div className="border border-red/30 bg-red/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-red text-[9px] tracking-[0.35em] uppercase mb-1">Selected Package</div>
          <div className="text-brand-white font-medium text-sm">{packageName}</div>
        </div>
        <div
          className="font-display text-brand-white leading-none shrink-0"
          style={{ fontSize: "clamp(24px, 2.5vw, 36px)" }}
        >
          {packagePrice}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <label htmlFor="bf-name" className={labelClass}>Full Name <span className="text-red">*</span></label>
          <input id="bf-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bf-email" className={labelClass}>Email Address <span className="text-red">*</span></label>
          <input id="bf-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bf-phone" className={labelClass}>Phone Number <span className="text-red">*</span></label>
          <input id="bf-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (305) 000-0000" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bf-company" className={labelClass}>Company / Brand Name</label>
          <input id="bf-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your Brand" className={inputClass} />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="bf-message" className={labelClass}>Tell Us About Your Project <span className="text-red">*</span></label>
        <textarea
          id="bf-message" required rows={5}
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your vision, preferred dates, locations, or any special requirements..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Honeypot (hidden) */}
      <input type="text" name="website" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />

      {step === "error" && <p className="text-red text-xs tracking-wide">{errorMsg}</p>}

      <button
        type="submit"
        disabled={step === "submitting"}
        className="flex items-center gap-3 bg-red text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 rounded-xs hover:bg-[#FF001F] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(229,0,25,0.35)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        {step === "submitting" ? (
          <><span className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />Sending...</>
        ) : (
          <>Book Package <span className="text-sm">→</span></>
        )}
      </button>
    </form>
  );
}
