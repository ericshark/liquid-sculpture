import SectionHeading, { Accent } from "@/components/section-heading";
import { profile } from "@/data/portfolio";

const ACCENT_PHRASE = "the model in the middle";

/** Sets the closing phrase of the headline in the ember accent, if present. */
function accentHeadline(text: string) {
  const at = text.indexOf(ACCENT_PHRASE);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <Accent>{ACCENT_PHRASE}</Accent>
      {text.slice(at + ACCENT_PHRASE.length)}
    </>
  );
}

export default function About() {
  const { about } = profile;

  return (
    <section id="about" className="scroll-mt-20 py-24 sm:py-32">
      <SectionHeading index="01" label="About" title={accentHeadline(profile.headline)} />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
        <aside className="reveal flex flex-col gap-6">
          <p className="inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-ember-soft px-3.5 py-1.5 text-[13px]">
            <span className="size-2 animate-[ember-pulse_2s_ease-out_infinite] rounded-full bg-ember" />
            {profile.availability}
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
            <dt className="tracking-widest uppercase">Based in</dt>
            <dd className="text-foreground">{profile.location}</dd>
            <dt className="tracking-widest uppercase">Focus</dt>
            <dd className="text-foreground">{profile.role}</dd>
            <dt className="tracking-widest uppercase">Updated</dt>
            <dd className="text-foreground">
              <time dateTime={about.updated.dateTime}>{about.updated.label}</time>
            </dd>
          </dl>
        </aside>
        <div className="reveal space-y-6">
          <h3 className="font-serif text-3xl text-ember italic">{about.title}</h3>
          {about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="max-w-2xl text-[17px] leading-relaxed text-pretty text-foreground/80 first-of-type:text-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
