import About from "@/components/about";
import Contact from "@/components/contact";
import Education from "@/components/education";
import Experience from "@/components/experience";
import PortfolioHero from "@/components/portfolio-hero";
import StickyHeader from "@/components/sticky-header";
import Work from "@/components/work";
import { profile } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <StickyHeader />
      <div id="top">
        <PortfolioHero />
      </div>
      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <About />
        <Work />
        <Experience />
        <Education />
        <Contact />
      </main>
      <footer className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap justify-between gap-3 border-t border-border py-8 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          <p>{profile.name}</p>
          <p>{profile.role}</p>
          <a href="#top" className="transition-colors hover:text-ember">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
