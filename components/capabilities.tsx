import SectionHeading, { Accent } from "@/components/section-heading";
import { capabilities } from "@/data/showcase";

export default function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-20 py-24 sm:py-32">
      <SectionHeading
        index="02"
        label="Capabilities"
        title={
          <>
            Design craft, <Accent>from grid to surface.</Accent>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {capabilities.map((item) => (
          <article
            key={item.index}
            className="reveal group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-silver/50 sm:p-9"
          >
            {/* Subtle silver glow on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 -right-32 size-72 rounded-full bg-silver opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-15"
            />

            <div className="relative">
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-silver">{item.index}</span>
                {" · "}
                {item.subtitle}
              </p>
              <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                {item.title}
              </h3>
              <p className="mt-4 text-[16.5px] leading-relaxed text-pretty text-foreground/80">
                {item.description}
              </p>
            </div>

            <ul className="relative mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
              {item.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full bg-silver-soft px-3 py-1 text-[13px] text-silver"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
