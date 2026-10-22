import SectionHeading, { Accent } from "@/components/section-heading";
import { StackChips } from "@/components/work";
import {
  earlierExperience,
  experience,
  type Experience as ExperienceEntry,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";

function Entry({ entry }: { entry: ExperienceEntry }) {
  return (
    <li
      className={cn(
        "reveal relative grid gap-3 border-l border-border pl-7 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-10 sm:border-l-0 sm:pl-0",
        entry.compact ? "pb-10" : "pb-14",
      )}
    >
      {/* timeline node: on the rail for phones, beside the period on wider screens */}
      <span
        aria-hidden="true"
        className="absolute top-1.5 -left-[5px] size-2.5 rounded-full border-2 border-background bg-ember sm:hidden"
      />
      <p className="font-mono text-xs leading-6 text-muted-foreground">{entry.period}</p>
      <div className="sm:border-l sm:border-border sm:pl-10">
        <h3
          className={cn(
            "font-medium tracking-[-0.02em]",
            entry.compact ? "text-lg" : "text-2xl",
          )}
        >
          {entry.role}
          <span className="text-muted-foreground"> — </span>
          <span className="text-ember">{entry.org}</span>
        </h3>
        <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          {entry.location}
        </p>
        <p
          className={cn(
            "mt-4 max-w-2xl leading-relaxed text-pretty",
            entry.compact ? "text-[15px] text-muted-foreground" : "text-[16px] text-foreground/85",
          )}
        >
          {entry.description}
        </p>
        {entry.details?.length ? (
          <ul className="mt-5 max-w-2xl space-y-2.5">
            {entry.details.map((detail) => (
              <li
                key={detail.slice(0, 32)}
                className="relative pl-5 text-[14.5px] leading-relaxed text-muted-foreground before:absolute before:top-[0.62em] before:left-0 before:size-1.5 before:rounded-full before:bg-ember"
              >
                {detail}
              </li>
            ))}
          </ul>
        ) : null}
        {!entry.compact && entry.stack.length ? (
          <div className="mt-5">
            <StackChips stack={entry.stack} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-24 sm:py-32">
      <SectionHeading
        index="03"
        label="Experience"
        title={
          <>
            Where I&rsquo;ve <Accent>shipped and taught.</Accent>
          </>
        }
      />
      <ol>
        {experience.map((entry) => (
          <Entry key={`${entry.org}-${entry.role}`} entry={entry} />
        ))}
      </ol>
      {earlierExperience.length ? (
        <>
          <p className="reveal mt-4 mb-8 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Earlier
          </p>
          <ol>
            {earlierExperience.map((entry) => (
              <Entry key={`${entry.org}-${entry.role}`} entry={entry} />
            ))}
          </ol>
        </>
      ) : null}
    </section>
  );
}
