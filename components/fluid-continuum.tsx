"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Waves, RotateCcw } from "lucide-react";
import { Accent } from "@/components/section-heading";
import {
  FLUID_PRESETS,
  type FluidPresetId,
} from "@/data/showcase";
import { Fluid, isSoftwareRenderer } from "@/lib/fluid-smoke";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    __formaFluid?: {
      frames: () => number;
      splats: () => number;
      preset: () => FluidPresetId;
      kaleido: () => boolean;
    };
  }
}

const PRESET_ORDER: FluidPresetId[] = ["vapor", "mercury", "silica"];

export default function FluidContinuum() {
  const theme = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<Fluid | null>(null);

  const [presetId, setPresetId] = useState<FluidPresetId>("vapor");
  const [kaleido, setKaleido] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [splatCount, setSplatCount] = useState(0);

  const stateRef = useRef({
    preset: "vapor" as FluidPresetId,
    kaleido: false,
    theme: theme,
    lastPointerAt: 0,
    colorIdx: 0,
    energy: 0,
  });

  useEffect(() => {
    stateRef.current.theme = theme;
    const fluid = fluidRef.current;
    if (fluid) {
      fluid.settings.paper = theme === "light";
    }
  }, [theme]);

  const seedPlumes = (fluid: Fluid, id: FluidPresetId) => {
    const preset = FLUID_PRESETS[id];
    const plumes = [
      { x: 0.28, y: 0.24, dx: 210, dy: 340, scale: 1.3 },
      { x: 0.52, y: 0.18, dx: -160, dy: 410, scale: 1.5 },
      { x: 0.74, y: 0.26, dx: -240, dy: 310, scale: 1.25 },
    ];
    plumes.forEach((p, idx) => {
      const base = preset.palette[idx % preset.palette.length];
      const color = base.map((c) => c * 0.42 * preset.intensity) as [
        number,
        number,
        number,
      ];
      fluid.splat(p.x, p.y, p.dx, p.dy, color, p.scale);
    });
    setSplatCount(fluid.splats);
  };

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

    const initialPreset = FLUID_PRESETS[stateRef.current.preset];
    Object.assign(fluid.settings, initialPreset.fluid, {
      paper: stateRef.current.theme === "light",
    });
    fluid.segments = stateRef.current.kaleido ? 8 : 1;

    // Seed initial silver smoke plumes so the field is immediately atmospheric
    seedPlumes(fluid, stateRef.current.preset);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    io.observe(section);

    const pointer = { x: 0, y: 0, down: false, has: false };

    const onPointerDown = (event: PointerEvent) => {
      pointer.down = true;
      pointer.has = false;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const preset = FLUID_PRESETS[stateRef.current.preset];
      const base =
        preset.palette[stateRef.current.colorIdx++ % preset.palette.length];
      const color = base.map((c) => c * 0.45 * preset.intensity) as [
        number,
        number,
        number,
      ];
      fluid.splat(
        x,
        y,
        (Math.random() - 0.5) * 260,
        260 + Math.random() * 200,
        color,
        0.95,
      );
      fluid.pulse(x, y, 220, 0.11);
      stateRef.current.lastPointerAt = performance.now();
      stateRef.current.energy = Math.min(1, stateRef.current.energy + 0.35);
      setSplatCount(fluid.splats);
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
        const speed = Math.hypot(dx, dy);
        if (speed > 0.25) {
          const force = pointer.down ? 14 : 5.2;
          const ink = pointer.down ? 0.14 : 0.04;
          const preset = FLUID_PRESETS[stateRef.current.preset];
          const base =
            preset.palette[stateRef.current.colorIdx++ % preset.palette.length];
          const color = base.map(
            (c) => c * ink * preset.intensity * 2.1,
          ) as [number, number, number];
          fluid.splat(
            x,
            y,
            dx * force,
            dy * force,
            color,
            pointer.down ? 0.65 : 0.44,
          );
          stateRef.current.lastPointerAt = performance.now();
          stateRef.current.energy = Math.min(
            1,
            stateRef.current.energy + Math.min(speed / 180, 0.18),
          );
          if (fluid.splats % 6 === 0) setSplatCount(fluid.splats);
        }
      }
      pointer.x = x;
      pointer.y = y;
      pointer.has = true;
    };

    const onPointerLeave = () => {
      pointer.has = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

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

      // Slow ambient silver bloom while the visitor isn't stirring
      if (
        now - stateRef.current.lastPointerAt > 2600 &&
        now - lastAmbient > 1350
      ) {
        lastAmbient = now;
        const preset = FLUID_PRESETS[stateRef.current.preset];
        const base =
          preset.palette[stateRef.current.colorIdx++ % preset.palette.length];
        const c = base.map((v) => v * 0.28 * preset.intensity) as [
          number,
          number,
          number,
        ];
        fluid.splat(
          0.15 + Math.random() * 0.7,
          0.12 + Math.random() * 0.38,
          (Math.random() - 0.5) * 280,
          240 + Math.random() * 210,
          c,
          1.35,
        );
      }

      stateRef.current.energy *= Math.pow(0.92, dt * 60);
      fluid.step(dt, stateRef.current.energy);
      fluid.render(stateRef.current.energy);
    };

    raf = requestAnimationFrame(frame);

    window.__formaFluid = {
      frames: () => fluid.frames,
      splats: () => fluid.splats,
      preset: () => stateRef.current.preset,
      kaleido: () => stateRef.current.kaleido,
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      fluid.destroy();
      fluidRef.current = null;
      delete window.__formaFluid;
    };
  }, []);

  const handlePresetChange = (id: FluidPresetId) => {
    setPresetId(id);
    stateRef.current.preset = id;
    const fluid = fluidRef.current;
    if (!fluid) return;
    const preset = FLUID_PRESETS[id];
    Object.assign(fluid.settings, preset.fluid, {
      paper: stateRef.current.theme === "light",
    });
    seedPlumes(fluid, id);
  };

  const handleToggleKaleido = () => {
    const next = !kaleido;
    setKaleido(next);
    stateRef.current.kaleido = next;
    if (fluidRef.current) {
      fluidRef.current.segments = next ? 8 : 1;
    }
  };

  const handlePulseWave = () => {
    const fluid = fluidRef.current;
    if (!fluid) return;
    const preset = FLUID_PRESETS[presetId];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.4;
      const base = preset.palette[i % preset.palette.length];
      const color = base.map((c) => c * 0.45 * preset.intensity) as [
        number,
        number,
        number,
      ];
      fluid.splat(
        0.5 + Math.cos(angle) * 0.08,
        0.48 + Math.sin(angle) * 0.08,
        Math.cos(angle) * 420,
        Math.sin(angle) * 420,
        color,
        1.1,
      );
    }
    fluid.pulse(0.5, 0.48, 440, 0.14);
    stateRef.current.energy = 0.85;
    setSplatCount(fluid.splats);
  };

  const handleClear = () => {
    const fluid = fluidRef.current;
    if (!fluid) return;
    fluid.clear();
    seedPlumes(fluid, presetId);
  };

  const activePreset = FLUID_PRESETS[presetId];

  return (
    <section
      ref={sectionRef}
      id="continuum"
      aria-label="Interactive fluid smoke continuum"
      className="relative min-h-[720px] w-full overflow-hidden border-y border-border bg-background sm:min-h-[820px]"
    >
      {/* WebGL2 Fluid Smoke Canvas */}
      <canvas
        ref={canvasRef}
        id="fluid"
        aria-hidden="true"
        className={cn(
          "absolute inset-0 block size-full cursor-crosshair touch-none",
          !webglAvailable && "hidden",
        )}
      />

      {/* Fallback monochrome mist if WebGL2 float targets are unavailable */}
      {!webglAvailable && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_25%_65%,rgba(200,206,216,0.28),transparent_40%),radial-gradient(circle_at_68%_35%,rgba(244,245,247,0.2),transparent_38%)] blur-2xl"
        />
      )}

      {/* Subtle top and bottom edge vignette so the stage transitions smoothly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/45 to-transparent"
      />

      {/* Overlaid Editorial Framing + Interactive Controls */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[720px] w-full max-w-6xl flex-col justify-between px-5 py-12 sm:min-h-[820px] sm:px-8 sm:py-16">
        {/* Top Editorial Header */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              <span className="text-silver">01</span>
              <span className="h-px w-10 bg-silver/60" />
              Fluid Continuum · Navier–Stokes Solver
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl leading-[0.96] font-medium tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              Move across the field.{" "}
              <Accent>Watch velocity become smoke.</Accent>
            </h2>
          </div>

          <div className="space-y-4 lg:justify-self-end lg:pt-6">
            <p className="max-w-md text-[15.5px] leading-relaxed text-pretty text-foreground/80">
              Where the hero above suspends discrete particles in elastic
              equilibrium, this stage solves continuous Eulerian fluid dynamics
              in real time. Cursor momentum injects vorticity, pressure waves,
              and liquid-silver dye into a half-float WebGL2 field.
            </p>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/65 px-3 py-1 backdrop-blur-md">
                <span className="size-1.5 animate-[silver-pulse_2s_ease-out_infinite] rounded-full bg-silver" />
                Drag or hover to stir
              </span>
              <span className="rounded-full border border-border bg-background/65 px-3 py-1 tabular-nums backdrop-blur-md">
                Curl {activePreset.fluid.curl} · Splats {splatCount}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Studio Control Dock */}
        <div className="pointer-events-auto mt-12 flex flex-col gap-4 rounded-3xl border border-border bg-background/70 p-4 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div
              role="radiogroup"
              aria-label="Fluid smoke preset"
              className="inline-flex w-fit shrink-0 rounded-full border border-border bg-secondary/70 p-1"
            >
              {PRESET_ORDER.map((id) => {
                const preset = FLUID_PRESETS[id];
                const active = presetId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    data-preset={id}
                    onClick={() => handlePresetChange(id)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium tracking-tight transition-colors sm:px-4 sm:text-[13px]",
                      active
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <p className="hidden text-xs text-muted-foreground xl:block">
              {activePreset.summary}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              data-kaleido
              aria-pressed={kaleido}
              onClick={handleToggleKaleido}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-[13px]",
                kaleido
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-secondary/50 text-foreground hover:bg-secondary",
              )}
            >
              <Sparkles size={13} strokeWidth={1.75} aria-hidden="true" />
              Kaleidoscope
            </button>

            <button
              type="button"
              data-pulse
              onClick={handlePulseWave}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary sm:text-[13px]"
            >
              <Waves size={13} strokeWidth={1.75} aria-hidden="true" />
              Shockwave
            </button>

            <button
              type="button"
              data-clear-fluid
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground sm:text-[13px]"
            >
              <RotateCcw size={12} strokeWidth={1.75} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
