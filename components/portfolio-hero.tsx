"use client";

import SculptureHero from "@/components/ui/liquid-sculpture-hero";
import { profile, siteMeta } from "@/data/portfolio";
import { setTheme, useTheme } from "@/lib/theme";

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
];

const palette = {
  dark: { text: "#EDE6D8", accent: "#FF6A3D" },
  light: { text: "#15171C", accent: "#D9481F" },
};

export default function PortfolioHero() {
  const theme = useTheme();

  return (
    <SculptureHero
      src="/sculpture-light.svg"
      darkSrc="/sculpture-dark.svg"
      mobileSrc="/sculpture-mobile-light.svg"
      mobileDarkSrc="/sculpture-mobile-dark.svg"
      imageAlt="Braided filaments of ember and copper light, rebuilt from particles"
      brand={profile.name}
      navLinks={navLinks}
      navCta={{ label: "Contact", href: "#contact" }}
      eyebrow={`${profile.role} — ${profile.location}`}
      headline={"Database to interface,\nand the model in the middle."}
      headlineAccent="the model in the middle."
      body={siteMeta.description}
      primaryCta={{ label: "Selected work", href: "#work" }}
      secondaryCta={{ label: "Get in touch", href: `mailto:${profile.email}` }}
      hint="Stir the filaments"
      hintTouch="Touch the filaments"
      background="#F1ECE2"
      darkBackground="#0E1116"
      theme={theme}
      onThemeChange={setTheme}
      textColor={palette[theme].text}
      accentColor={palette[theme].accent}
      loadFonts={false}
      headingFont="var(--font-sans)"
      accentFont="var(--font-serif)"
      bodyFont="var(--font-sans)"
      backdropText="systems"
      intro
      ambient
      ambientIntensity={0.6}
      radius={240}
      liquid={1.2}
      mobileSculptureScale={0.8}
    />
  );
}
