import Approach from "@/components/approach";
import Capabilities from "@/components/capabilities";
import PortfolioHero from "@/components/portfolio-hero";
import SmokeSection from "@/components/smoke-section";
import StickyHeader from "@/components/sticky-header";
import { siteMeta } from "@/data/showcase";

export default function Home() {
  return (
    <>
      <StickyHeader />
      <div id="top">
        <PortfolioHero />
      </div>
      <SmokeSection />
      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Capabilities />
        <Approach />
      </main>
      <footer className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap justify-between gap-3 border-t border-border py-8 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          <p>{siteMeta.brand}®</p>
          <p>{siteMeta.edition}</p>
          <a href="#top" className="transition-colors hover:text-silver">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
