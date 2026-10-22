type SectionHeadingProps = {
  index: string;
  label: string;
  title: React.ReactNode;
};

export default function SectionHeading({ index, label, title }: SectionHeadingProps) {
  return (
    <div className="reveal mb-12 sm:mb-16">
      <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        <span className="text-ember">{index}</span>
        <span className="h-px w-10 bg-ember/60" />
        {label}
      </p>
      <h2 className="mt-5 max-w-3xl text-4xl leading-[0.98] font-medium tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  );
}

/** Italic serif accent used to echo the hero headline. */
export function Accent({ children }: { children: React.ReactNode }) {
  return (
    <em className="font-serif font-normal tracking-[-0.015em] text-ember italic">{children}</em>
  );
}
