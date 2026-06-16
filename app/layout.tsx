import type { Metadata } from "next";
import { Geist, Bebas_Neue } from "next/font/google";
import "./globals.css";
import ConditionalNav from "./components/ConditionalNav";
import CinematicBackground from "./components/CinematicBackground";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import RevealObserver from "./components/RevealObserver";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "diEntertainment — Elevate Your Brand",
  description:
    "News, media, and digital marketing for brands that refuse to be ignored. High-impact content, photo & video production, and brand strategy.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F5F5]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-red focus:text-brand-white focus:px-4 focus:py-2 focus:text-[11px] focus:tracking-[0.22em] focus:uppercase focus:rounded-xs"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <CinematicBackground />
        <CustomCursor />
        <RevealObserver />
        <ConditionalNav />
        <div id="main-content" className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
