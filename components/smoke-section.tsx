"use client";

import { useEffect, useRef, useState } from "react";
import { Accent } from "@/components/section-heading";
import { siteMeta, smokeContent } from "@/data/showcase";
import { Fluid, isSoftwareRenderer } from "@/lib/fluid-smoke";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    __formaSmoke?: {
      frames: () => number;
      splats: () => number;
    };
  }
}

// Monochromatic silver and white palette for fluid splats
const SILVER_TONES: [number, number, number][] = [
  [0.82, 0.85, 0.91],
  [0.92, 0.94, 0.98],
  [0.64, 0.68, 0.76],
  [0.75, 0.78, 0.85],
];

export default function SmokeSection() {
  const theme = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<Fluid | null>(null);
  const [webglAvailable, setWebglAvailable] = useState(true);

  const stateRef = useRef({
    theme,
    lastPointerAt: 0,
    toneIndex: 0,
  });

  useEffect(() => {
    stateRef.current.theme = theme;
    if (fluidRef.current) {
      fluidRef.current.settings.paper = theme === "light";
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const lowPower = isSoftwareRenderer() || window.innerWidth < 760;
    const fluid = Fluid.create(canvas, lowPower);
    fluidRef.current = fluid;

    if (!fluid) {
      setWebglAvailable(false);
      return;
    }

    fluid.settings.paper = stateRef.current.theme === "light";

    // Seed gentle rising silver smoke plumes on initial mount
    const seeds = [
      { x: 0.24, y: 0.18, dx: 190, dy: 300 },
      { x: 0.56, y: 0.14, dx: -150, dy: 340 },
      { x: 0.8, y: 0.22, dx: -200, dy: 280 },
    ];
    seeds.forEach((s, i) => {
      const tone = SILVER_TONES[i % SILVER_TONES.length];
      const color = tone.map((v) => v * 0.26) as [number, number, number];
      fluid.splat(s.x, s.y, s.dx, s.dy, color, 1.4);
    });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    io.observe(section);

    const pointer = { x: 0, y: 0, down: false, has: false };

    const onPointerDown = () => {
      pointer.down = true;
      pointer.has = false;
    };

    const onPointerUp = () => {
      pointer.down = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      if (pointer.has) {
        const dx = (x - pointer.x) * rect.width;
        const dy = (y - pointer.y) * rect.height;
        const force = pointer.down ? 14 : 6;
        const ink = pointer.down ? 0.14 : 0.055;
        const tone =
          SILVER_TONES[stateRef.current.toneIndex++ % SILVER_TONES.length];
        const color = tone.map((c) => c * ink) as [number, number, number];
        fluid.splat(
          x,
          y,
          dx * force,
          dy * force,
          color,
          pointer.down ? 0.65 : 0.48,
        );
        stateRef.current.lastPointerAt = performance.now();
      }
      pointer.x = x;
      pointer.y = y;
      pointer.has = true;
    };

    const onPointerLeave = () => {
      pointer.has = false;
    };

    section.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);

    let raf = 0;
    let last = performance.now();
    let lastAmbient = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || !visible) {
        last = now;
        return;
      }
      const dt = (now - last) / 1000;
      last = now;
      fluid.resize();

      if (
        now - stateRef.current.lastPointerAt > 3000 &&
        now - lastAmbient > 1400
      ) {
        lastAmbient = now;
        const tone =
          SILVER_TONES[stateRef.current.toneIndex++ % SILVER_TONES.length];
        const c = tone.map((v) => v * 0.24) as [number, number, number];
        fluid.splat(
          Math.random(),
          Math.random() * 0.4 + 0.1,
          (Math.random() - 0.5) * 300,
          260 + Math.random() * 200,
          c,
          1.4,
        );
      }

      fluid.step(dt);
      fluid.render();
    };

    raf = requestAnimationFrame(frame);

    window.__formaSmoke = {
      frames: () => fluid.frames,
      splats: () => fluid.splats,
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      section.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      fluid.destroy();
      fluidRef.current = null;
      delete window.__formaSmoke;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="smoke"
      aria-label="Interactive silver smoke background"
      className="relative flex min-h-svh w-full flex-col justify-between overflow-hidden border-t border-border bg-background"
    >
      {/* Interactive WebGL2 fluid smoke background canvas */}
      <canvas
        ref={canvasRef}
        id="fluid"
        aria-hidden="true"
        className={cn(
          "absolute inset-0 block size-full touch-none",
          !webglAvailable && "hidden",
        )}
      />

      {/* Fallback when WebGL2 float targets are unavailable */}
      {!webglAvailable && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(200,206,216,0.22),transparent_42%),radial-gradient(circle_at_72%_40%,rgba(244,245,247,0.16),transparent_40%)] blur-2xl"
        />
      )}

      {/* Soft edge & readability scrims so overlaid text always stays crisp */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/90 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_25%_50%,color-mix(in_oklab,var(--background)_72%,transparent),transparent_78%)]"
      />

      {/* Spacer for fixed StickyHeader */}
      <div className="h-16" aria-hidden="true" />

      {/* Minimal, readable design-oriented copy */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          <span className="text-silver">{smokeContent.index}</span>
          <span className="h-px w-10 bg-silver/60" />
          {smokeContent.label}
        </p>

        <h2 className="mt-6 max-w-3xl text-4xl leading-[0.96] font-medium tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
          {smokeContent.headline} <Accent>{smokeContent.accent}</Accent>
        </h2>

        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-pretty text-foreground/85 sm:text-lg">
          {smokeContent.body}
        </p>

        <p className="mt-8 font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          {smokeContent.cue}
        </p>
      </div>

      {/* Minimal footer bar anchored inside the bottom of the second screen */}
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap justify-between gap-3 border-t border-border/70 py-7 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          <p>
            {siteMeta.brand}® · {siteMeta.edition}
          </p>
          <a href="#top" className="transition-colors hover:text-silver">
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
