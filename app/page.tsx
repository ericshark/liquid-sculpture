import DesignPrinciples from "@/components/design-principles";
import FluidContinuum from "@/components/fluid-continuum";
import PortfolioHero from "@/components/portfolio-hero";
import StickyHeader from "@/components/sticky-header";
import SystemArchitecture from "@/components/system-architecture";
import UiPrimitives from "@/components/ui-primitives";
import { siteMeta } from "@/data/showcase";

export default function Home() {
  return (
    <>
      <StickyHeader />
      <div id="top">
        <PortfolioHero />
      </div>
      <FluidContinuum />
      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <UiPrimitives />
        <SystemArchitecture />
        <DesignPrinciples />
      </main>
      <footer className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap justify-between gap-3 border-t border-border py-8 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          <p>{siteMeta.brand}® · Tactile Interface &amp; Shader Lab</p>
          <p>{siteMeta.edition}</p>
          <a href="#top" className="transition-colors hover:text-silver">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
