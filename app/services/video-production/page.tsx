import type { Metadata } from "next";
import ServicePage, { type ServiceData } from "../../components/ServicePage";

export const metadata: Metadata = {
  title: "Video Production — diEntertainment",
  description:
    "Cinematic video production from concept to final cut. Brand films, commercials, and social content that converts.",
};

const data: ServiceData = {
  number: "04",
  slug: "video-production",
  category: "Video Production",
  titleLines: ["VIDEO", "PRODUCTION."],
  tagline:
    "Cinematic storytelling from concept to final cut — videos that don't just play, they convert, persuade, and stay with you.",
  pullquote: "Cinematic craft. Commercial results.",
  description: [
    "Video is the most powerful tool in modern marketing — and most brands aren't using it anywhere near its potential.",
    "We produce brand films, commercials, and social content with cinema-grade quality and deliberate strategic intent. Every frame has a purpose. Every cut drives a feeling. Every video is built to perform at every touchpoint.",
    "Our end-to-end production process means you get a seamless, stress-free experience from concept development all the way through final delivery and distribution.",
  ],
  deliverables: [
    {
      number: "01",
      title: "Script & Storyboard",
      description:
        "A complete creative script and detailed visual storyboard developed in deep collaboration with your team.",
    },
    {
      number: "02",
      title: "Pre-Production",
      description:
        "Location booking, casting, crew coordination, scheduling, and all production logistics handled end to end.",
    },
    {
      number: "03",
      title: "Full Production Day",
      description:
        "Cinema-grade filming with a professional crew, director, cinematographer, and all equipment included.",
    },
    {
      number: "04",
      title: "Color Grading",
      description:
        "A signature cinematic look developed specifically for your brand's visual identity — consistent and ownable.",
    },
    {
      number: "05",
      title: "Sound Design",
      description:
        "Professional audio mixing, licensed music selection, and sound design that elevates every single frame.",
    },
    {
      number: "06",
      title: "Multi-Format Delivery",
      description:
        "Final cuts delivered in all required formats — 16:9 broadcast, 1:1 feed, 9:16 social, and everything in between.",
    },
  ],
  process: [
    {
      number: "01",
      title: "Pre-Production",
      description:
        "Scripting, storyboarding, casting, and all logistics locked in before a single camera rolls.",
    },
    {
      number: "02",
      title: "Production",
      description:
        "Cinema-grade filming with a professional crew, director, and every piece of equipment required for the vision.",
    },
    {
      number: "03",
      title: "Post-Production",
      description:
        "Editing, color grading, sound design, and motion graphics — the full post-production pipeline under one roof.",
    },
    {
      number: "04",
      title: "Delivery",
      description:
        "Final exports in every required format, rounds of revisions included, until you are completely satisfied.",
    },
  ],
  ctaHeadline: "Let's produce\nyour vision.",
  packagesVariant: "video",
};

export default function VideoProductionPage() {
  return <ServicePage {...data} />;
}
