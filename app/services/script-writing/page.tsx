import type { Metadata } from "next";
import ServicePage, { type ServiceData } from "../../components/ServicePage";

export const metadata: Metadata = {
  title: "Script Writing — diEntertainment",
  description:
    "Viral hooks, ad scripts, captions, and brand storytelling written to stop the scroll, hold attention, and drive action.",
};

const data: ServiceData = {
  number: "07",
  slug: "script-writing",
  category: "Script Writing",
  titleLines: ["SCRIPT", "WRITING."],
  tagline:
    "Words that stop the scroll, hold attention, and move people to act — copy and scripts engineered for the way modern audiences actually consume content.",
  pullquote: "The right words change everything.",
  description: [
    "Most content fails before it even starts — because the writing isn't built for how people actually consume media today. Attention is earned in the first two seconds, and lost just as fast.",
    "We write scripts, hooks, captions, and brand narratives that are grounded in consumer psychology, platform behaviour, and conversion principles. Every word is intentional. Every line earns its place.",
    "Whether you need a single viral hook or a full content writing system for your brand, we deliver copy that performs — not just copy that reads well in a document.",
  ],
  deliverables: [
    {
      number: "01",
      title: "Viral Hooks",
      description:
        "Scroll-stopping opening lines engineered to capture attention instantly — written for video, social, and paid media using proven psychological triggers.",
    },
    {
      number: "02",
      title: "Captions",
      description:
        "Platform-native captions for Instagram, TikTok, LinkedIn, and beyond — crafted to extend watch time, drive saves, and spark conversation.",
    },
    {
      number: "03",
      title: "Ad Scripts",
      description:
        "Full video ad scripts with hook, body, and CTA structured for maximum conversion — written for paid social, YouTube pre-roll, and broadcast.",
    },
    {
      number: "04",
      title: "Storytelling",
      description:
        "Brand narratives, founder stories, and long-form content scripts that build emotional connection, trust, and loyalty with your audience over time.",
    },
  ],
  process: [
    {
      number: "01",
      title: "Brand Immersion",
      description:
        "We get deep into your brand voice, audience, competitors, and goals before writing a single word — the brief drives everything.",
    },
    {
      number: "02",
      title: "Strategy & Structure",
      description:
        "Every piece of copy is mapped to a clear objective and structured using frameworks proven to hold attention and drive the desired action.",
    },
    {
      number: "03",
      title: "Copy & Revisions",
      description:
        "First drafts delivered fast, with revision rounds included until every line of copy is exactly where it needs to be.",
    },
    {
      number: "04",
      title: "Delivery",
      description:
        "Final scripts and copy delivered in production-ready format — formatted for your team, your editors, or direct use in-platform.",
    },
  ],
  ctaHeadline: "Let's write your\nnext story.",
  packagesVariant: "ai",
};

export default function ScriptWritingPage() {
  return <ServicePage {...data} />;
}
