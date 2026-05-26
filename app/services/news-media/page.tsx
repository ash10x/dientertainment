import type { Metadata } from "next";
import ServicePage, { type ServiceData } from "../../components/ServicePage";

export const metadata: Metadata = {
  title: "News & Media — diEntertainment",
  description:
    "Editorial content and media strategy that shapes narratives and positions your brand as the definitive voice of your industry.",
};

const data: ServiceData = {
  number: "02",
  slug: "news-media",
  category: "News & Media",
  titleLines: ["NEWS &", "MEDIA."],
  tagline:
    "Editorial content that shapes narratives and positions your brand as the undisputed voice of your industry.",
  pullquote: "Stories that shape perception. Narratives that lead industries.",
  description: [
    "We craft editorial content that doesn't just inform — it positions your brand at the top of the conversation.",
    "In today's media landscape, every brand is also a publisher. We help you own that role with press releases, editorial features, and media strategies that put your story in front of the eyes that matter.",
    "From local placements to national syndication, we manage every step of the media journey — story mining, writing, pitching, and amplification.",
  ],
  deliverables: [
    {
      number: "01",
      title: "Press Release Writing",
      description:
        "Professional, compelling press releases written to meet editorial standards and actually get picked up by journalists.",
    },
    {
      number: "02",
      title: "Media List Curation",
      description:
        "A precision-targeted database of journalists, editors, blogs, and publications that genuinely cover your space.",
    },
    {
      number: "03",
      title: "Story Pitching",
      description:
        "Strategic, personalized media pitching that lands your story in front of the right editors at the right moment.",
    },
    {
      number: "04",
      title: "Editorial Content",
      description:
        "Thought leadership pieces, op-eds, and long-form features that establish your brand as an industry authority.",
    },
    {
      number: "05",
      title: "Media Syndication",
      description:
        "Wide distribution of your content to a curated network of media outlets, wires, and digital publications.",
    },
    {
      number: "06",
      title: "Media Monitoring",
      description:
        "Ongoing tracking of your brand mentions, press coverage, and media sentiment with actionable monthly insights.",
    },
  ],
  process: [
    {
      number: "01",
      title: "Story Mining",
      description:
        "We find the angle that makes your brand genuinely newsworthy and builds authentic public interest.",
    },
    {
      number: "02",
      title: "Narrative Craft",
      description:
        "Our editorial team writes compelling stories engineered to resonate with journalists and their readers alike.",
    },
    {
      number: "03",
      title: "Distribution",
      description:
        "We pitch curated media contacts and submit to relevant publications, wires, and digital platforms simultaneously.",
    },
    {
      number: "04",
      title: "Amplify",
      description:
        "We extend the life of every placement through social sharing, content repurposing, and strategic backlinking.",
    },
  ],
  ctaHeadline: "Let's build your\nmedia presence.",
  packagesVariant: "marketing",
};

export default function NewsMediaPage() {
  return <ServicePage {...data} />;
}
