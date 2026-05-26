import type { Metadata } from "next";
import ServicePage, { type ServiceData } from "../../components/ServicePage";

export const metadata: Metadata = {
  title: "AI Image Generation — diEntertainment",
  description:
    "AI-generated product photos, business posters, billboards, lifestyle ads, and Instagram graphics built for brands that demand premium visuals.",
};

const data: ServiceData = {
  number: "06",
  slug: "ai-image-generation",
  category: "AI Image Generation",
  titleLines: ["AI IMAGE", "GENERATION."],
  tagline:
    "Photorealistic, campaign-ready visuals produced by AI — no studio, no photoshoot, no limits on what your brand can look like.",
  pullquote: "Premium visuals. Zero studio required.",
  description: [
    "Great creative doesn't require a six-figure photoshoot budget anymore. AI image generation has reached a quality level that is genuinely indistinguishable from professional photography — and we know exactly how to direct it.",
    "We produce luxury product imagery, campaign graphics, out-of-home ads, and social content that elevates your brand and performs across every placement. Every image is art-directed with intent, not just generated and shipped.",
    "From a single hero product shot to a full campaign rollout across billboard, digital, and Instagram — our AI image pipeline delivers consistent, on-brand visuals at a speed and scale traditional photography cannot match.",
  ],
  deliverables: [
    {
      number: "01",
      title: "Luxury Product Photos",
      description:
        "Photorealistic AI product photography with studio-grade lighting, premium textures, and art-directed compositions that make any product look elite.",
    },
    {
      number: "02",
      title: "AI Business Posters",
      description:
        "High-impact print and digital posters designed for events, promotions, and brand announcements — fully custom to your visual identity.",
    },
    {
      number: "03",
      title: "AI Billboards",
      description:
        "Out-of-home billboard creatives built for maximum visual impact at scale — designed to stop traffic whether placed physically or used in digital campaigns.",
    },
    {
      number: "04",
      title: "AI Lifestyle Ads",
      description:
        "Aspirational lifestyle imagery featuring AI-generated environments, settings, and models that put your product in the world your customers want to live in.",
    },
    {
      number: "05",
      title: "Instagram Promotional Graphics",
      description:
        "Scroll-stopping social graphics optimised for Instagram feed and Stories — consistent, on-brand, and built to drive engagement and conversions.",
    },
  ],
  process: [
    {
      number: "01",
      title: "Creative Direction",
      description:
        "We define the visual language, mood, and art direction for every image before a single prompt is written — strategy first, aesthetics second.",
    },
    {
      number: "02",
      title: "AI Generation",
      description:
        "Using leading generative image models, we produce and iterate on raw assets with precision art direction until the output matches the brief.",
    },
    {
      number: "03",
      title: "Retouching & Polish",
      description:
        "Every image goes through professional retouching, colour grading, and compositing to reach a level of finish that exceeds traditional photography.",
    },
    {
      number: "04",
      title: "Delivery",
      description:
        "Final assets delivered in all required formats and resolutions — print-ready, web-optimised, and sized for every placement in your campaign.",
    },
  ],
  ctaHeadline: "Let's build your\nvisual identity.",
  packagesVariant: "ai",
};

export default function AIImageGenerationPage() {
  return <ServicePage {...data} />;
}
