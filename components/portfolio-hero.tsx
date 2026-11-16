"use client";

import SculptureHero from "@/components/ui/liquid-sculpture-hero";
import { heroContent, navLinks } from "@/data/showcase";
import { setTheme, useTheme } from "@/lib/theme";

const palette = {
  dark: { text: "#F4F5F7", accent: "#C8CED8" },
  light: { text: "#0A0B0E", accent: "#4A505C" },
};

export default function PortfolioHero() {
  const theme = useTheme();

  return (
    <SculptureHero
      src="/sculpture-light.svg"
      darkSrc="/sculpture-dark.svg"
      mobileSrc="/sculpture-mobile-light.svg"
      mobileDarkSrc="/sculpture-mobile-dark.svg"
      imageAlt={heroContent.imageAlt}
      brand={heroContent.brand}
      navLinks={navLinks}
      navCta={heroContent.navCta}
      eyebrow={heroContent.eyebrow}
      headline={heroContent.headline}
      headlineAccent={heroContent.headlineAccent}
      body={heroContent.body}
      primaryCta={heroContent.primaryCta}
      secondaryCta={heroContent.secondaryCta}
      hint={heroContent.hint}
      hintTouch={heroContent.hintTouch}
      background="#F5F6F8"
      darkBackground="#07080A"
      theme={theme}
      onThemeChange={setTheme}
      textColor={palette[theme].text}
      accentColor={palette[theme].accent}
      loadFonts={false}
      headingFont="var(--font-sans)"
      accentFont="var(--font-serif)"
      bodyFont="var(--font-sans)"
      backdropText={heroContent.backdropText}
      showCredit={false}
      intro
      ambient
      ambientIntensity={0.6}
      radius={240}
      liquid={1.2}
      mobileSculptureScale={0.8}
    />
  );
}
