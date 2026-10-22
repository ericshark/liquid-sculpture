import { ArrowUpRight } from "lucide-react";
import SectionHeading, { Accent } from "@/components/section-heading";
import { projects } from "@/data/portfolio";

export function StackChips({ stack }: { stack: string[] }) {
  if (!stack.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {stack.map((item) => (
        <li
          key={item}
          className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Work() {
  return (
    <section id="work" className="scroll-mt-20 py-24 sm:py-32">
      <SectionHeading
        index="02"
        label="Selected work"
        title={
          <>
            Systems I built <Accent>end to end.</Accent>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project, i) => (
          <article
            key={project.name}
            className="reveal group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ember/50 sm:p-9"
          >
            {/* ember glow that blooms from the corner on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 -right-32 size-72 rounded-full bg-ember opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20"
            />
            <header className="relative flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  <span className="text-ember">{String(i + 1).padStart(2, "0")}</span>
                  {" · "}
                  {project.category}
                </p>
                <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                  {project.name}
                </h3>
              </div>
              <p className="shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">
                {project.date}
              </p>
            </header>
            <p className="relative mt-5 text-[17px] leading-relaxed text-pretty text-foreground/85">
              {project.description}
            </p>
            <ul className="relative mt-5 flex flex-wrap gap-2">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full bg-ember-soft px-3 py-1 text-[13px] text-ember"
                >
                  {highlight}
                </li>
              ))}
            </ul>
            <ul className="relative mt-7 space-y-3 border-t border-border pt-7">
              {project.details.map((detail) => (
                <li
                  key={detail.slice(0, 32)}
                  className="relative pl-5 text-[14.5px] leading-relaxed text-muted-foreground before:absolute before:top-[0.62em] before:left-0 before:size-1.5 before:rounded-full before:bg-ember"
                >
                  {detail}
                </li>
              ))}
            </ul>
            <footer className="relative mt-auto flex flex-wrap items-end justify-between gap-5 pt-8">
              <StackChips stack={project.stack} />
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border-b border-foreground/30 pb-0.5 text-sm font-medium transition-colors hover:border-ember hover:text-ember"
                >
                  View repository
                  <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </a>
              ) : null}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
