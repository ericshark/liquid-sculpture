"use client";

import { useEffect, useRef, useState } from "react";
import { Accent } from "@/components/section-heading";
import { smokeContent } from "@/data/showcase";
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

// Monochromatic silver/white palette replacing Chromasonic's Scriabin colours
const SILVER_TONES: [number, number, number][] = [
  [0.85, 0.88, 0.94],
  [0.95, 0.96, 1.0],
  [0.68, 0.72, 0.8],
  [0.78, 0.81, 0.87],
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

    // Seed gentle initial silver smoke plumes matching Chromasonic's ambient feel
    const seed = () => {
      const seeds = [
        { x: 0.25, y: 0.2, dx: 180, dy: 280 },
        { x: 0.55, y: 0.16, dx: -140, dy: 320 },
        { x: 0.78, y: 0.24, dx: -190, dy: 260 },
      ];
      seeds.forEach((s, i) => {
        const tone = SILVER_TONES[i % SILVER_TONES.length];
        const color = tone.map((v) => v * 0.26) as [number, number, number];
        fluid.splat(s.x, s.y, s.dx, s.dy, color, 1.4);
      });
    };
    seed();

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
        const force = pointer.down ? 14 : 4;
        const ink = pointer.down ? 0.12 : 0.025;
        const tone =
          SILVER_TONES[stateRef.current.toneIndex++ % SILVER_TONES.length];
        const color = tone.map((c) => c * ink) as [number, number, number];
        fluid.splat(
          x,
          y,
          dx * force,
          dy * force,
          color,
          pointer.down ? 0.6 : 0.4,
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

    // Listen on section so hovering over overlaid text also stirs the smoke smoothly
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

      // Slow ambient silver smoke bloom while idle (matches Chromasonic's main.ts loop)
      if (
        now - stateRef.current.lastPointerAt > 3500 &&
        now - lastAmbient > 1400
      ) {
        lastAmbient = now;
        const tone =
          SILVER_TONES[stateRef.current.toneIndex++ % SILVER_TONES.length];
        const c = tone.map((v) => v * 0.25) as [number, number, number];
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
      id="craft"
      aria-label="Interactive silver smoke background"
      className="relative flex min-h-[600px] w-full items-center overflow-hidden border-y border-border bg-background sm:min-h-[680px]"
    >
      {/* Pure Chromasonic smoke background canvas */}
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

      {/* Soft top/bottom fade to blend into adjacent sections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
      />

      {/* Clean design-oriented editorial framing over the smoke */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          <span className="text-silver">{smokeContent.index}</span>
          <span className="h-px w-10 bg-silver/60" />
          {smokeContent.label}
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2 className="max-w-2xl text-4xl leading-[0.98] font-medium tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
            {smokeContent.headline} <Accent>{smokeContent.accent}</Accent>
          </h2>

          <div className="space-y-5">
            <p className="max-w-md text-[17px] leading-relaxed text-pretty text-foreground/85">
              {smokeContent.body}
            </p>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              {smokeContent.cue}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
