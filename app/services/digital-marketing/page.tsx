import type { Metadata } from "next";
import ServicePage, { type ServiceData } from "../../components/ServicePage";

export const metadata: Metadata = {
  title: "Digital Marketing — diEntertainment",
  description:
    "Strategic digital marketing campaigns that build brand authority and drive measurable results across every channel.",
};

const data: ServiceData = {
  number: "01",
  slug: "digital-marketing",
  category: "Digital Marketing",
  titleLines: ["DIGITAL", "MARKETING."],
  tagline:
    "From paid media to organic growth — we engineer the digital presence your brand deserves, then scale it aggressively.",
  pullquote: "Campaigns that convert. Strategies that dominate.",
  description: [
    "We engineer digital marketing systems that don't just generate clicks — they build brands.",
    "From awareness to acquisition, every campaign we run is backed by data, driven by creativity, and optimized relentlessly for results. We don't set it and forget it.",
    "We work as an extension of your team, constantly iterating to make sure your brand is always the loudest, most relevant voice in the room.",
  ],
  deliverables: [
    {
      number: "01",
      title: "Content Strategy",
      description:
        "A complete content roadmap tailored to your audience, platforms, and business goals — built to execute from day one.",
    },
    {
      number: "02",
      title: "Paid Media Management",
      description:
        "Precision-targeted ad campaigns across Meta, Google, TikTok, and more — managed, optimized, and reported on daily.",
    },
    {
      number: "03",
      title: "SEO & Organic Growth",
      description:
        "Long-term authority building through keyword strategy, technical SEO, and content that ranks and converts.",
    },
    {
      number: "04",
      title: "Social Media Management",
      description:
        "Consistent, on-brand content and community management that builds genuine audience engagement across all platforms.",
    },
    {
      number: "05",
      title: "Analytics & Reporting",
      description:
        "Clear monthly performance reports showing exactly what's working, what's not, and the data-backed plan for what's next.",
    },
    {
      number: "06",
      title: "Email Marketing",
      description:
        "High-converting email sequences and newsletters that keep your audience engaged, nurtured, and buying.",
    },
  ],
  process: [
    {
      number: "01",
      title: "Discovery",
      description:
        "A deep dive into your brand, audience, competitors, and goals to build an unshakeable strategic foundation.",
    },
    {
      number: "02",
      title: "Strategy",
      description:
        "A bespoke marketing blueprint covering channels, messaging, content cadence, and budget allocation.",
    },
    {
      number: "03",
      title: "Execution",
      description:
        "We launch campaigns, produce content, and activate every channel simultaneously — no delays, no excuses.",
    },
    {
      number: "04",
      title: "Optimize",
      description:
        "Continuous testing, real-time analysis, and relentless refinement to compound performance month over month.",
    },
  ],
  ctaHeadline: "Let's dominate\nyour market.",
};

export default function DigitalMarketingPage() {
  return <ServicePage {...data} />;
}
