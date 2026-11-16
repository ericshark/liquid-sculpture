"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Layers, Sliders, Type } from "lucide-react";
import SectionHeading, { Accent } from "@/components/section-heading";
import { cn } from "@/lib/utils";

type FontSpecimen = "sans" | "serif" | "mono";
type SurfaceMode = "obsidian" | "titanium" | "mercury";

const FONT_SPECIMENS: Record<
  FontSpecimen,
  {
    label: string;
    familyClass: string;
    sample: string;
    sub: string;
    role: string;
  }
> = {
  sans: {
    label: "Geist Sans",
    familyClass: "font-sans",
    sample: "Precision at 120Hz.",
    sub: "Geometric grotesk engineered for high-density interface controls and crisp negative tracking.",
    role: "Primary UI & Display",
  },
  serif: {
    label: "Instrument Serif",
    familyClass: "font-serif italic",
    sample: "Liquid silver in motion.",
    sub: "Editorial high-contrast italic used as a structural counterweight against technical telemetry.",
    role: "Editorial Accent",
  },
  mono: {
    label: "Geist Mono",
    familyClass: "font-mono",
    sample: "0x7F · 16.6ms · RGBA16F",
    sub: "Tabular numeral alignment for live shader diagnostics, coordinates, and frame-time readouts.",
    role: "Telemetry & Spec",
  },
};

const SURFACE_MODES: Record<
  SurfaceMode,
  {
    label: string;
    reflection: string;
    border: string;
    roughness: string;
    ior: string;
  }
> = {
  obsidian: {
    label: "Anodized Obsidian",
    reflection: "12% Specular",
    border: "1px Hairline",
    roughness: "0.28",
    ior: "1.52",
  },
  titanium: {
    label: "Brushed Titanium",
    reflection: "48% Specular",
    border: "1px Bevel",
    roughness: "0.14",
    ior: "2.16",
  },
  mercury: {
    label: "Liquid Mercury",
    reflection: "92% Specular",
    border: " Chrome Rim",
    roughness: "0.03",
    ior: "2.84",
  },
};

export default function UiPrimitives() {
  // Card 1: Magnetic Specular Surface
  const magneticCardRef = useRef<HTMLDivElement>(null);
  const [cursorOffset, setCursorOffset] = useState({
    x: 0,
    y: 0,
    spotX: 50,
    spotY: 50,
    active: false,
  });

  // Card 2: Optical Typography & Contrast
  const [fontKey, setFontKey] = useState<FontSpecimen>("sans");
  const [trackingStep, setTrackingStep] = useState<number>(-3);

  // Card 3: Tactile State Choreography
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>("titanium");
  const [hapticSnap, setHapticSnap] = useState(true);
  const [specularEdge, setSpecularEdge] = useState(true);
  const [subpixelGrid, setSubpixelGrid] = useState(false);

  // Card 4: Harmonic Motion & Damping Tuner
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const [stiffness, setStiffness] = useState(220);
  const [damping, setDamping] = useState(18);
  const [impulseCount, setImpulseCount] = useState(1);

  const handleMagneticMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = magneticCardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;
    const dx = Math.round((relX - 0.5) * 28);
    const dy = Math.round((relY - 0.5) * 24);
    setCursorOffset({
      x: dx,
      y: dy,
      spotX: Math.round(relX * 100),
      spotY: Math.round(relY * 100),
      active: true,
    });
  };

  const handleMagneticLeave = () => {
    setCursorOffset({ x: 0, y: 0, spotX: 50, spotY: 50, active: false });
  };

  // Draw the harmonic damped spring curve on the canvas whenever parameters or time advance
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const start = performance.now();

    const renderWave = (now: number) => {
      const elapsed = (now - start) / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const isLight = document.documentElement.dataset.theme === "light";
      const lineCol = isLight ? "rgba(10, 11, 14, 0.85)" : "rgba(212, 216, 225, 0.92)";
      const gridCol = isLight ? "rgba(10, 11, 14, 0.1)" : "rgba(244, 245, 247, 0.1)";
      const fillTop = isLight ? "rgba(74, 80, 92, 0.18)" : "rgba(200, 206, 216, 0.22)";

      // Center equilibrium rule
      ctx.strokeStyle = gridCol;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spring-damper envelope: y(t) = exp(-zeta * omega * t) * cos(omega_d * t - phase)
      const omega = Math.sqrt(stiffness) * 0.75;
      const zeta = damping / (2 * Math.sqrt(stiffness));
      const phase = elapsed * 3.2;

      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const t = (px / w) * 2.4;
        const env = Math.exp(-zeta * omega * t);
        const y =
          h / 2 -
          env * Math.cos(omega * t * 1.4 - phase) * (h * 0.36);
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.strokeStyle = lineCol;
      ctx.lineWidth = 1.75;
      ctx.stroke();

      // Subtle gradient fill under the curve
      ctx.lineTo(w, h / 2);
      ctx.lineTo(0, h / 2);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, fillTop);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.restore();
      raf = requestAnimationFrame(renderWave);
    };

    raf = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(raf);
  }, [stiffness, damping, impulseCount]);

  const activeFont = FONT_SPECIMENS[fontKey];
  const activeSurface = SURFACE_MODES[surfaceMode];

  return (
    <section id="primitives" className="scroll-mt-20 py-24 sm:py-32">
      <SectionHeading
        index="02"
        label="Interactive UI Primitives"
        title={
          <>
            Surfaces engineered for <Accent>direct manipulation.</Accent>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Primitive 01: Magnetic Specular Surface */}
        <article
          ref={magneticCardRef}
          onPointerMove={handleMagneticMove}
          onPointerLeave={handleMagneticLeave}
          style={
            {
              "--spot-x": `${cursorOffset.spotX}%`,
              "--spot-y": `${cursorOffset.spotY}%`,
            } as React.CSSProperties
          }
          className="reveal group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 transition-colors duration-500 hover:border-silver/50 sm:p-9"
        >
          {/* Radial metallic spotlight following the pointer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(360px circle at var(--spot-x) var(--spot-y), color-mix(in oklab, var(--silver) 14%, transparent), transparent 75%)",
            }}
          />

          <header className="relative flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-silver">01</span> · Spatial Deflection
              </p>
              <h3 className="mt-2.5 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                Magnetic Specular Surface
              </h3>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary/60 text-silver">
              <Compass size={16} strokeWidth={1.6} aria-hidden="true" />
            </span>
          </header>

          <p className="relative mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
            Pointer proximity warps the radial specular highlight and applies
            proportional spring deflection to the target control.
          </p>

          {/* Interactive Magnetic Stage */}
          <div className="relative my-7 flex min-h-40 flex-col items-center justify-center rounded-2xl border border-border bg-background/60 p-6">
            <button
              type="button"
              onClick={() =>
                setCursorOffset((prev) => ({
                  ...prev,
                  x: 0,
                  y: 0,
                  active: !prev.active,
                }))
              }
              style={{
                transform: `translate3d(${cursorOffset.x}px, ${cursorOffset.y}px, 0)`,
              }}
              className="group/btn inline-flex items-center gap-3 rounded-full border border-silver/40 bg-foreground px-6 py-3 text-sm font-medium text-background shadow-lg transition-transform duration-150 ease-out"
            >
              <span className="size-2 rounded-full bg-background transition-transform group-hover/btn:scale-125" />
              Magnetic Target
              <span className="font-mono text-[11px] opacity-75">
                {cursorOffset.x >= 0 ? `+${cursorOffset.x}` : cursorOffset.x},
                {cursorOffset.y >= 0 ? `+${cursorOffset.y}` : cursorOffset.y}px
              </span>
            </button>
          </div>

          <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>Spotlight: {cursorOffset.spotX}% / {cursorOffset.spotY}%</span>
            <span className="text-silver">
              {cursorOffset.active ? "Field Active" : "Equilibrium"}
            </span>
          </footer>
        </article>

        {/* Primitive 02: Optical Typography & Contrast Scale */}
        <article className="reveal relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 transition-colors duration-500 hover:border-silver/50 sm:p-9">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-silver">02</span> · Optical Hierarchy
              </p>
              <h3 className="mt-2.5 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                Typographic Triad &amp; Scale
              </h3>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary/60 text-silver">
              <Type size={16} strokeWidth={1.6} aria-hidden="true" />
            </span>
          </header>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Select font specimen"
              className="inline-flex rounded-full border border-border bg-secondary/70 p-1"
            >
              {(Object.keys(FONT_SPECIMENS) as FontSpecimen[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  data-font={key}
                  onClick={() => setFontKey(key)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    fontKey === key
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {FONT_SPECIMENS[key].label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span>TRACKING</span>
              <input
                type="range"
                min={-6}
                max={4}
                step={1}
                value={trackingStep}
                onChange={(e) => setTrackingStep(Number(e.target.value))}
                className="w-20 cursor-pointer"
              />
              <span className="w-9 text-right text-foreground tabular-nums">
                {(trackingStep * 0.01).toFixed(2)}em
              </span>
            </label>
          </div>

          <div className="my-6 rounded-2xl border border-border bg-background/60 p-6">
            <p
              style={{ letterSpacing: `${trackingStep * 0.01}em` }}
              className={cn(
                "text-3xl leading-tight text-foreground transition-all sm:text-4xl",
                activeFont.familyClass,
              )}
            >
              {activeFont.sample}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {activeFont.sub}
            </p>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>Role: {activeFont.role}</span>
            <span className="text-silver">Contrast 17.4 : 1 (AAA)</span>
          </footer>
        </article>

        {/* Primitive 03: Tactile State Choreography */}
        <article className="reveal relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 transition-colors duration-500 hover:border-silver/50 sm:p-9">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-silver">03</span> · Material Tokens
              </p>
              <h3 className="mt-2.5 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                Monochrome Surface States
              </h3>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary/60 text-silver">
              <Layers size={16} strokeWidth={1.6} aria-hidden="true" />
            </span>
          </header>

          <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
            Achromatic interfaces rely on edge luminance, surface elevation, and
            instant state choreography rather than saturated status hues.
          </p>

          <div className="my-6 space-y-4">
            <div
              role="group"
              aria-label="Material finish"
              className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-background/60 p-1.5"
            >
              {(Object.keys(SURFACE_MODES) as SurfaceMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSurfaceMode(mode)}
                  className={cn(
                    "rounded-xl py-2 text-xs font-medium transition-all",
                    surfaceMode === mode
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {SURFACE_MODES[mode].label.split(" ")[1]}
                </button>
              ))}
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                {
                  label: "Haptic Snap",
                  active: hapticSnap,
                  toggle: () => setHapticSnap((v) => !v),
                },
                {
                  label: "Specular Rim",
                  active: specularEdge,
                  toggle: () => setSpecularEdge((v) => !v),
                },
                {
                  label: "Subpixel Grid",
                  active: subpixelGrid,
                  toggle: () => setSubpixelGrid((v) => !v),
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={item.active}
                  onClick={item.toggle}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-all",
                    item.active
                      ? "border-silver/50 bg-silver-soft text-foreground"
                      : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      "size-2 rounded-full transition-colors",
                      item.active ? "bg-silver" : "bg-muted-foreground/30",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>
              Roughness {activeSurface.roughness} · IOR {activeSurface.ior}
            </span>
            <span className="text-silver">{activeSurface.reflection}</span>
          </footer>
        </article>

        {/* Primitive 04: Harmonic Motion & Damping Tuner */}
        <article className="reveal relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 transition-colors duration-500 hover:border-silver/50 sm:p-9">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-silver">04</span> · Spring Kinematics
              </p>
              <h3 className="mt-2.5 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                Harmonic Damping Curve
              </h3>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary/60 text-silver">
              <Sliders size={16} strokeWidth={1.6} aria-hidden="true" />
            </span>
          </header>

          <div className="my-5 overflow-hidden rounded-2xl border border-border bg-background/60 p-4">
            <canvas
              ref={waveCanvasRef}
              aria-label="Live harmonic spring response waveform"
              className="block h-28 w-full"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
              <div className="flex justify-between">
                <span>STIFFNESS (k)</span>
                <span className="text-foreground tabular-nums">{stiffness} N/m</span>
              </div>
              <input
                type="range"
                min={80}
                max={400}
                step={10}
                value={stiffness}
                onChange={(e) => setStiffness(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </label>

            <label className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
              <div className="flex justify-between">
                <span>DAMPING (c)</span>
                <span className="text-foreground tabular-nums">{damping} Ns/m</span>
              </div>
              <input
                type="range"
                min={6}
                max={42}
                step={1}
                value={damping}
                onChange={(e) => setDamping(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </label>
          </div>

          <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>
              Ratio ζ = {(damping / (2 * Math.sqrt(stiffness))).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => setImpulseCount((c) => c + 1)}
              className="text-silver underline-offset-4 transition-opacity hover:underline hover:opacity-80"
            >
              Trigger Impulse ↻
            </button>
          </footer>
        </article>
      </div>
    </section>
  );
}
