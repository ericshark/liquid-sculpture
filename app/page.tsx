import PortfolioHero from "@/components/portfolio-hero";
import SmokeSection from "@/components/smoke-section";
import StickyHeader from "@/components/sticky-header";

export default function Home() {
  return (
    <>
      <StickyHeader />
      <div id="top">
        <PortfolioHero />
      </div>
      <main>
        <SmokeSection />
      </main>
    </>
  );
}
