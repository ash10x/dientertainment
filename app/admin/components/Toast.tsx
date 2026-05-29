"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}

export default function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg ${
        type === "success"
          ? "bg-[#0a1a0a] border-green-600/40 text-green-400"
          : "bg-[#1a0a0a] border-[#E50019]/40 text-[#E50019]"
      }`}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      {message}
      <button onClick={onDismiss} className="ml-2 opacity-50 hover:opacity-100">✕</button>
    </div>
  );
}
