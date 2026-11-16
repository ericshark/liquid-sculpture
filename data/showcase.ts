/**
 * All editable design showcase content lives in this file.
 * Components render from these objects.
 */

export type NavItem = {
  label: string;
  href: string;
};

export type Capability = {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
};

export type ApproachPillar = {
  number: string;
  title: string;
  description: string;
};

export const siteMeta = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://forma.design",
  title: "FORMA® — Interface & Visual Design",
  description:
    "A study in calm visual hierarchy, tactile motion, and monochrome interface craft.",
  brand: "FORMA",
  edition: "Interface & Visual Design",
};

export const navLinks: NavItem[] = [
  { label: "Craft", href: "#craft" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Approach", href: "#approach" },
];

export const heroContent = {
  brand: "FORMA®",
  eyebrow: "UI & INTERACTION DESIGN",
  headline: "Calm interfaces,\nshaped by detail.",
  headlineAccent: "shaped by detail.",
  body: "Exploring how typography, spatial rhythm, and subtle motion come together to make digital surfaces feel effortless and alive.",
  primaryCta: { label: "Explore capabilities", href: "#capabilities" },
  secondaryCta: { label: "Design approach", href: "#approach" },
  navCta: { label: "Approach", href: "#approach" },
  hint: "Stir the silver filaments",
  hintTouch: "Touch the silver filaments",
  backdropText: "forma",
  imageAlt:
    "Braided filaments of liquid silver and white light, rebuilt from particles",
};

export const smokeContent = {
  index: "01",
  label: "Living Surface",
  headline: "Subtle motion that invites attention",
  accent: "without distraction.",
  body: "Great interfaces respond naturally to presence. Rather than competing with the content, atmosphere and motion should guide the eye, soften transitions, and reward curiosity.",
  cue: "Move your cursor across the canvas to stir the smoke",
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Interface Systems",
    subtitle: "Structure & rhythm",
    description:
      "Designing cohesive layouts, grid proportions, and reusable component libraries that stay clear and balanced across every screen size.",
    highlights: ["Design tokens", "Responsive grids", "Component architecture"],
  },
  {
    index: "02",
    title: "Visual Hierarchy",
    subtitle: "Typography & contrast",
    description:
      "Pairing expressive display typography with disciplined spacing and monochrome contrast so every headline, label, and action reads at a glance.",
    highlights: ["Editorial typography", "Monochrome balance", "Spatial pacing"],
  },
  {
    index: "03",
    title: "Motion & Tactility",
    subtitle: "Responsive feel",
    description:
      "Crafting fluid transitions, scroll choreography, and cursor-aware surfaces that turn routine interactions into calm, tactile moments.",
    highlights: ["Fluid transitions", "Micro-interactions", "Interactive canvases"],
  },
  {
    index: "04",
    title: "Theme Craft",
    subtitle: "Obsidian & alabaster",
    description:
      "Balancing deep dark surfaces and crisp light compositions with subtle silver accents—maintaining effortless legibility without loud colour.",
    highlights: ["Dark & light parity", "Silver tonal steps", "Quiet restraint"],
  },
];

export const approachContent = {
  index: "03",
  label: "Approach",
  title: "Form follows",
  accent: "feeling and clarity.",
  intro:
    "Every detail on screen should earn its place. Removing unnecessary ornament lets typography, light, and motion speak clearly.",
  pillars: [
    {
      number: "01",
      title: "Clarity Over Noise",
      description:
        "Generous negative space and disciplined contrast give the content room to breathe and keep user focus anchored on what matters.",
    },
    {
      number: "02",
      title: "Restraint in Monochrome",
      description:
        "Working strictly within black, white, and silver shifts attention toward proportion, surface depth, and subtle highlights.",
    },
    {
      number: "03",
      title: "Responsive Precision",
      description:
        "From wide desktop compositions to compact mobile screens, typography scale, spacing, and motion adapt seamlessly.",
    },
  ] satisfies ApproachPillar[],
};
