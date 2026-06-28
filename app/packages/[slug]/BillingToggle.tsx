"use client";

import { useState } from "react";

type Props = {
  monthlyPrice: string;
  annualPrice: string;
  deposit: string | null;
  duration: string | null;
};

export default function BillingToggle({
  monthlyPrice,
  annualPrice,
  deposit,
  duration,
}: Props) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="flex flex-col items-start gap-5">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-brand-white leading-none transition-all duration-300"
          style={{ fontSize: "clamp(52px, 7vw, 88px)" }}
        >
          {isAnnual ? annualPrice : monthlyPrice}
        </span>
        <span className="text-brand-white/30 text-[10px] tracking-[0.2em] uppercase self-end pb-2">
          USD
        </span>
      </div>

      {/* Savings badge */}
      {isAnnual && (
        <span className="text-[9px] tracking-[0.28em] uppercase text-red border border-red/30 bg-red/6 px-3 py-1.5">
          10 months · save 2
        </span>
      )}

      {/* Deposit + duration */}
      <div className="flex flex-wrap items-center gap-4">
        {deposit && (
          <p className="text-brand-white/35 text-xs tracking-wide">
            Deposit:{" "}
            <span className="text-brand-white/55">{deposit}</span>{" "}
            <span className="text-brand-white/20 text-[9px] uppercase tracking-widest">
              USD
            </span>
          </p>
        )}
        {duration && (
          <span className="text-[9px] tracking-[0.25em] uppercase text-brand-white/30 border border-white/8 px-3 py-1">
            {duration}
          </span>
        )}
      </div>

      {/* Toggle pill */}
      <div className="flex items-center gap-4">
        <span
          className={`text-[10px] tracking-[0.28em] uppercase transition-colors duration-200 ${
            !isAnnual ? "text-brand-white" : "text-brand-white/35"
          }`}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isAnnual}
          aria-label="Toggle billing period"
          onClick={() => setIsAnnual((v) => !v)}
          className="relative w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red/50"
          style={
            isAnnual
              ? {
                  backgroundColor: "rgba(229,0,25,0.12)",
                  borderColor: "rgba(229,0,25,0.35)",
                }
              : {
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.14)",
                }
          }
        >
          <span
            className="absolute top-1 left-1 w-5 h-5 rounded-full transition-all duration-300"
            style={
              isAnnual
                ? { transform: "translateX(28px)", background: "#E50019" }
                : { background: "rgba(245,245,245,0.5)" }
            }
          />
        </button>
        <span
          className={`text-[10px] tracking-[0.28em] uppercase transition-colors duration-200 ${
            isAnnual ? "text-brand-white" : "text-brand-white/35"
          }`}
        >
          Annual
        </span>
      </div>
    </div>
  );
}
