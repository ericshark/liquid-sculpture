import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/data/portfolio";

const links = [
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-border py-24 sm:py-32">
      <p className="reveal flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        <span className="text-ember">05</span>
        <span className="h-px w-10 bg-ember/60" />
        Contact
      </p>
      <h2 className="reveal mt-6 max-w-4xl text-4xl leading-[0.98] font-medium tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
        {profile.contactHeadline}
      </h2>
      <a
        href={`mailto:${profile.email}`}
        className="reveal group mt-12 inline-flex max-w-full items-center gap-3 text-2xl font-medium tracking-[-0.03em] break-all text-ember sm:text-4xl"
      >
        <Mail className="size-6 shrink-0 sm:size-8" strokeWidth={1.25} aria-hidden="true" />
        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
          {profile.email}
        </span>
      </a>
      <div className="reveal mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border-b border-foreground/30 pb-0.5 text-[15px] font-medium transition-colors hover:border-ember hover:text-ember"
          >
            {link.label}
            <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </a>
        ))}
        <p className="inline-flex items-center gap-2.5 text-[15px] text-muted-foreground">
          <span className="size-2 animate-[ember-pulse_2s_ease-out_infinite] rounded-full bg-ember" />
          {profile.availability} · {profile.location}
        </p>
      </div>
    </section>
  );
}
