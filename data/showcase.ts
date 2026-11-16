/**
 * Editable showcase copy for FORMA® — two-screen monochrome design study.
 */

export type NavItem = {
  label: string;
  href: string;
};

export const siteMeta = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://forma.design",
  title: "FORMA® — Interface & Visual Design",
  description:
    "A monochrome study in typography, contrast, and responsive surfaces.",
  brand: "FORMA",
  edition: "Interface & Visual Design",
};

export const navLinks: NavItem[] = [{ label: "Living Surface", href: "#smoke" }];

export const heroContent = {
  brand: "FORMA®",
  eyebrow: "UI & INTERACTION DESIGN",
  headline: "Calm interfaces,\nshaped by detail.",
  headlineAccent: "shaped by detail.",
  body: "Exploring how typography, spatial rhythm, and subtle motion make digital surfaces feel effortless and alive.",
  primaryCta: { label: "Explore surface", href: "#smoke" },
  secondaryCta: { label: "", href: "" },
  navCta: { label: "Living surface", href: "#smoke" },
  hint: "Stir the silver filaments",
  hintTouch: "Touch the silver filaments",
  backdropText: "forma",
  imageAlt:
    "Braided filaments of liquid silver and white light, rebuilt from particles",
};

export const smokeContent = {
  index: "01",
  label: "Living Surface",
  headline: "Designed to respond",
  accent: "to your presence.",
  body: "Monochrome restraint, clear hierarchy, and atmospheric motion working quietly behind the type.",
  cue: "Move your cursor across the screen to stir the smoke",
};
