import SectionHeading, { Accent } from "@/components/section-heading";
import { education } from "@/data/portfolio";

export default function Education() {
  return (
    <section id="education" className="scroll-mt-20 py-24 sm:py-32">
      <SectionHeading
        index="04"
        label="Education"
        title={
          <>
            The <Accent>foundations.</Accent>
          </>
        }
      />
      <div className="reveal grid gap-10 rounded-3xl border border-border bg-card p-7 sm:p-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <h3 className="text-2xl font-medium tracking-[-0.025em] sm:text-3xl">
            {education.degree}
          </h3>
          <p className="mt-2 text-lg text-ember">{education.school}</p>
          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6">
            {[
              ["Graduated", education.graduated],
              ["GPA", education.gpa],
              ["Location", education.location],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  {term}
                </dt>
                <dd className="mt-1.5 text-[15px]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Relevant coursework
          </p>
          <ul className="mt-4 divide-y divide-border">
            {education.coursework.map((course) => (
              <li key={course} className="py-2.5 text-[15px]">
                {course}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
