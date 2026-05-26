import type { Metadata } from "next";
import ServicePage, { type ServiceData } from "../../components/ServicePage";

export const metadata: Metadata = {
  title: "Photo Production — diEntertainment",
  description:
    "High-end brand photography that captures your brand's essence and commands attention across every platform.",
};

const data: ServiceData = {
  number: "03",
  slug: "photo-production",
  category: "Photo Production",
  titleLines: ["PHOTO", "PRODUCTION."],
  tagline:
    "High-end brand photography that captures your essence, commands respect, and stops the scroll — every single time.",
  pullquote: "Visuals that speak before words can.",
  description: [
    "A single powerful image can do more for your brand than a thousand words ever could.",
    "We approach every shoot with the precision of fine art and the intent of a marketing strategist. The result is a visual identity that earns attention, commands respect, and leaves a lasting impression on everyone who sees it.",
    "From creative concept through final delivery, we handle every detail — so you get images that don't just look great, they work hard for your brand.",
  ],
  deliverables: [
    {
      number: "01",
      title: "Creative Concept",
      description:
        "A detailed shoot concept and full mood board developed around your brand's identity, goals, and target audience.",
    },
    {
      number: "02",
      title: "Location Scouting",
      description:
        "We find and secure the perfect backdrop — whether studio, on-location, or a destination shoot anywhere in the world.",
    },
    {
      number: "03",
      title: "Full Shoot Day",
      description:
        "A professionally directed shoot with a complete crew — lighting, styling, art direction, and behind-the-scenes included.",
    },
    {
      number: "04",
      title: "Expert Retouching",
      description:
        "High-end post-production that enhances every image to perfection while maintaining the authenticity of your brand.",
    },
    {
      number: "05",
      title: "Curated Image Library",
      description:
        "A delivered library of final images, selects, and alternates — organized and formatted for every intended use.",
    },
    {
      number: "06",
      title: "Full Usage Rights",
      description:
        "Complete commercial usage rights for every delivered image, forever. No licensing fees, no hidden catches.",
    },
  ],
  process: [
    {
      number: "01",
      title: "Creative Brief",
      description:
        "We gather everything we need to understand your brand, goals, audience, and visual direction before anything else.",
    },
    {
      number: "02",
      title: "Pre-Production",
      description:
        "Mood boards, location scouting, prop sourcing, styling direction, and full crew coordination locked and loaded.",
    },
    {
      number: "03",
      title: "Shoot Day",
      description:
        "Professional execution with an expert crew delivering a full day of high-quality, on-brand imagery.",
    },
    {
      number: "04",
      title: "Post-Production",
      description:
        "Expert selection, retouching, color correction, and final delivery of your complete branded image library.",
    },
  ],
  ctaHeadline: "Let's shoot your\nbrand story.",
  packagesVariant: "photo",
};

export default function PhotoProductionPage() {
  return <ServicePage {...data} />;
}
