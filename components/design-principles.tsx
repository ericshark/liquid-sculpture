import { ArrowUpRight } from "lucide-react";
import SectionHeading, { Accent } from "@/components/section-heading";
import { designPrinciples, specificationTable } from "@/data/showcase";

export default function DesignPrinciples() {
  return (
    <section
      id="principles"
      className="scroll-mt-20 border-t border-border py-24 sm:py-32"
    >
      <SectionHeading
        index="04"
        label="Principles & Specification"
        title={
          <>
            Monochrome discipline. <Accent>Zero ornamental noise.</Accent>
          </>
        }
      />

      {/* Three Pillars */}
      <div className="grid gap-6 lg:grid-cols-3">
        {designPrinciples.map((item) => (
          <article
            key={item.index}
            className="reveal flex flex-col justify-between rounded-3xl border border-border bg-card p-7 sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span className="text-silver">PILLAR {item.index}</span>
                <span>0{item.index.length}</span>
              </div>
              <h3 className="mt-4 text-2xl font-medium tracking-[-0.025em]">
                {item.title}
              </h3>
              <p className="mt-2 font-serif text-lg text-silver italic">
                &ldquo;{item.axiom}&rdquo;
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-4 font-mono text-[11px] uppercase">
              <span className="text-muted-foreground">{item.metricLabel}</span>
              <span className="text-foreground">{item.metricValue}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Technical Specification Matrix */}
      <div className="reveal mt-12 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-7 py-5 sm:px-9">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              SYSTEM TELEMETRY MATRIX
            </p>
            <h3 className="mt-1 text-xl font-medium tracking-tight">
              FORMA® Specimen Vol. 01 — Surface &amp; Shader Specifications
            </h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-silver-soft px-3.5 py-1 font-mono text-[11px] text-silver uppercase">
            <span className="size-1.5 rounded-full bg-silver" />
            All Subsystems Nominal
          </span>
        </div>

        <div className="divide-y divide-border">
          {specificationTable.map((row) => (
            <div
              key={row.parameter}
              className="grid gap-2 px-7 py-4 text-sm sm:grid-cols-[13rem_1fr_9rem] sm:items-center sm:gap-6 sm:px-9"
            >
              <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                {row.parameter}
              </span>
              <span className="font-medium text-foreground">
                {row.specification}
              </span>
              <span className="font-mono text-xs text-silver sm:text-right">
                {row.subsystem}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Interactive Banner */}
      <div className="reveal mt-12 flex flex-col items-start justify-between gap-8 rounded-3xl border border-border bg-secondary/40 p-8 sm:flex-row sm:items-center sm:p-12">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] tracking-[0.18em] text-silver uppercase">
            INTERACTIVE SPECIMEN
          </p>
          <h3 className="mt-2 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
            Return to the particle sculpture or stir the fluid continuum.
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#continuum"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            Open Fluid Continuum
            <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-silver/60"
          >
            Sculpture Hero ↑
          </a>
        </div>
      </div>
    </section>
  );
}
