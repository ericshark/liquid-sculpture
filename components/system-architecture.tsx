import SectionHeading, { Accent } from "@/components/section-heading";
import { architectureLayers } from "@/data/showcase";

export default function SystemArchitecture() {
  return (
    <section
      id="architecture"
      className="scroll-mt-20 border-t border-border py-24 sm:py-32"
    >
      <SectionHeading
        index="03"
        label="Rendering & Motion Architecture"
        title={
          <>
            Three real-time layers, <Accent>one unified frame budget.</Accent>
          </>
        }
      />

      <div className="space-y-8">
        {architectureLayers.map((layer) => (
          <article
            key={layer.code}
            className="reveal group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-colors duration-500 hover:border-silver/50 sm:p-10"
          >
            {/* Subtle silver corner bloom on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 -right-28 size-64 rounded-full bg-silver opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-15"
            />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-14">
              {/* Left Column: Layer Identity & Telemetry Metrics */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                      <span className="text-silver">{layer.index}</span> ·{" "}
                      {layer.code}
                    </p>
                    <span className="rounded-full border border-border bg-secondary/70 px-3 py-1 font-mono text-[11px] text-silver">
                      {layer.budget}
                    </span>
                  </div>

                  <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                    {layer.name}
                  </h3>
                  <p className="mt-2 font-serif text-xl text-silver italic">
                    {layer.subtitle}
                  </p>
                </div>

                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
                  {layer.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                        {m.label}
                      </dt>
                      <dd className="mt-1 font-mono text-xs font-medium text-foreground sm:text-sm">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Right Column: Narrative Description, Specs & Tags */}
              <div className="flex flex-col justify-between border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                <div>
                  <p className="text-[16.5px] leading-relaxed text-pretty text-foreground/90">
                    {layer.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {layer.specs.map((spec) => (
                      <li
                        key={spec.slice(0, 32)}
                        className="relative pl-5 text-[14.5px] leading-relaxed text-muted-foreground before:absolute before:top-[0.62em] before:left-0 before:size-1.5 before:rounded-full before:bg-silver"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="mt-7 flex flex-wrap gap-2 pt-2">
                  {layer.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
