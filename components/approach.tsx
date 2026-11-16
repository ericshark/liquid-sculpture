import SectionHeading, { Accent } from "@/components/section-heading";
import { approachContent } from "@/data/showcase";

export default function Approach() {
  return (
    <section
      id="approach"
      className="scroll-mt-20 border-t border-border py-24 sm:py-32"
    >
      <SectionHeading
        index={approachContent.index}
        label={approachContent.label}
        title={
          <>
            {approachContent.title} <Accent>{approachContent.accent}</Accent>
          </>
        }
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
        <p className="reveal max-w-md font-serif text-2xl leading-snug text-silver italic sm:text-3xl">
          {approachContent.intro}
        </p>

        <ol className="divide-y divide-border border-y border-border">
          {approachContent.pillars.map((pillar) => (
            <li
              key={pillar.number}
              className="reveal grid gap-3 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6"
            >
              <span className="font-mono text-xs tracking-[0.16em] text-silver">
                {pillar.number}
              </span>
              <div>
                <h3 className="text-xl font-medium tracking-[-0.02em] sm:text-2xl">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 max-w-xl text-[15.5px] leading-relaxed text-pretty text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
