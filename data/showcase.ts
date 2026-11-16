/**
 * All editable showcase content for FORMA — Tactile Interface & Shader Lab.
 * Components render from these objects.
 */

import type { FluidSettings } from "@/lib/fluid-smoke";

export type NavItem = {
  label: string;
  href: string;
};

export type FluidPresetId = "vapor" | "mercury" | "silica";

export type FluidPreset = {
  id: FluidPresetId;
  label: string;
  code: string;
  summary: string;
  fluid: FluidSettings;
  intensity: number;
  /** Monochromatic RGB dye palette [0..1] for cursor and ambient splats */
  palette: [number, number, number][];
};

export type ArchitectureLayer = {
  index: string;
  code: string;
  name: string;
  subtitle: string;
  budget: string;
  description: string;
  metrics: { label: string; value: string }[];
  specs: string[];
  tags: string[];
};

export type DesignPrinciple = {
  index: string;
  title: string;
  axiom: string;
  body: string;
  metricLabel: string;
  metricValue: string;
};

export type SpecRow = {
  parameter: string;
  specification: string;
  subsystem: string;
};

export const siteMeta = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://forma.lab",
  title: "FORMA® — Tactile Interface & Shader Lab",
  description:
    "A design engineering specimen exploring real-time WebGL particle fields, Navier–Stokes fluid continuums, and monochrome interface primitives.",
  brand: "FORMA",
  edition: "Specimen Vol. 01 — Monochrome & Silver",
};

export const navLinks: NavItem[] = [
  { label: "01 Continuum", href: "#continuum" },
  { label: "02 Primitives", href: "#primitives" },
  { label: "03 Architecture", href: "#architecture" },
  { label: "04 Principles", href: "#principles" },
];

export const heroContent = {
  brand: "FORMA®",
  eyebrow: "DESIGN ENGINEERING SPECIMEN — VOL. 01",
  headline: "Interfaces that behave\nlike physical matter.",
  headlineAccent: "like physical matter.",
  body: "A study in real-time WebGL shaders, tactile micro-interactions, and high-contrast monochrome systems built for modern web surfaces.",
  primaryCta: { label: "Explore continuum", href: "#continuum" },
  secondaryCta: { label: "Interactive primitives", href: "#primitives" },
  navCta: { label: "Specifications", href: "#principles" },
  hint: "Stir the silver filaments",
  hintTouch: "Touch the silver filaments",
  backdropText: "forma",
  imageAlt:
    "Braided filaments of liquid silver and brushed chrome rebuilt from 100,000 GPU particles",
};

export const FLUID_PRESETS: Record<FluidPresetId, FluidPreset> = {
  vapor: {
    id: "vapor",
    label: "Silver Vapor",
    code: "01 · VPR",
    summary: "High vorticity and soft optical bloom that trails like illuminated mist.",
    fluid: {
      curl: 24,
      velocityDissipation: 0.26,
      densityDissipation: 0.72,
      pressure: 0.8,
      splatRadius: 0.28,
      bloom: 0.95,
      rays: 0.85,
      paper: false,
    },
    intensity: 0.62,
    palette: [
      [0.82, 0.85, 0.91], // cool platinum
      [0.95, 0.96, 0.99], // specular white
      [0.62, 0.66, 0.74], // brushed steel
      [0.74, 0.78, 0.84], // sterling silver
    ],
  },
  mercury: {
    id: "mercury",
    label: "Liquid Mercury",
    code: "02 · MRC",
    summary: "Dense, tight-radius metallic ribbons with sharp specular light shafts.",
    fluid: {
      curl: 34,
      velocityDissipation: 0.16,
      densityDissipation: 0.48,
      pressure: 0.86,
      splatRadius: 0.16,
      bloom: 1.25,
      rays: 1.1,
      paper: false,
    },
    intensity: 0.82,
    palette: [
      [0.96, 0.97, 1.0], // chrome highlight
      [0.76, 0.8, 0.88], // liquid mercury
      [0.54, 0.58, 0.66], // gunmetal sheen
      [0.88, 0.9, 0.95], // fine silver
    ],
  },
  silica: {
    id: "silica",
    label: "Silica Ink",
    code: "03 · SLC",
    summary: "Low-dissipation marbled plumes that linger and fold like smoke in still air.",
    fluid: {
      curl: 11,
      velocityDissipation: 0.65,
      densityDissipation: 0.18,
      pressure: 0.8,
      splatRadius: 0.22,
      bloom: 0.45,
      rays: 0.35,
      paper: false,
    },
    intensity: 0.5,
    palette: [
      [0.86, 0.88, 0.92], // pale silica
      [0.66, 0.7, 0.77], // slate mist
      [0.48, 0.52, 0.59], // pewter smoke
      [0.92, 0.94, 0.97], // alabaster wisp
    ],
  },
};

export const architectureLayers: ArchitectureLayer[] = [
  {
    index: "01",
    code: "SYS · GPGPU-PT",
    name: "Instanced Particle Matter",
    subtitle: "100,000 GPU-simulated filaments with elastic home-state recovery",
    budget: "≤ 2.1 ms / frame",
    description:
      "The hero sculpture samples alpha and luminance from braided vector paths into floating-point textures, driving an instanced capsule pass that stretches along instantaneous velocity vectors.",
    metrics: [
      { label: "Instance count", value: "~100k quads" },
      { label: "State target", value: "RGBA16F ping-pong" },
      { label: "Wake solver", value: "256 × 104 flow map" },
    ],
    specs: [
      "Complementary energy cross-fade between crisp lensed image and live particle capsules so transitions never pop.",
      "Curl-noise turbulence field coupled with Hookean spring return forces tuned per particle depth.",
      "Automatic hardware-tier scaling for coarse pointers and low-memory devices.",
    ],
    tags: ["WebGL2", "GLSL ES 3.00", "EXT_color_buffer_float", "Instanced Drawing"],
  },
  {
    index: "02",
    code: "SYS · NAVIER-STOKES",
    name: "Eulerian Fluid Continuum",
    subtitle: "Real-time stable-fluids solver with vorticity confinement and radial bloom",
    budget: "≤ 1.8 ms / frame",
    description:
      "Directly below the hero, a multi-pass Navier–Stokes solver advects velocity and monochrome silver dye across half-float framebuffers, preserving fine rotational eddies through vorticity confinement.",
    metrics: [
      { label: "Pressure solver", value: "22 Jacobi steps" },
      { label: "Dye resolution", value: "1024 px adaptive" },
      { label: "Post-processing", value: "Dual-pass bloom + rays" },
    ],
    specs: [
      "Pointer delta vectors inject directional momentum and silver-spectrum dye splats in normalized UV space.",
      "Radial shockwave pass injects divergence-free outward velocity rings on demand.",
      "8-wedge kaleidoscopic UV folding and theme-aware alabaster ink absorption.",
    ],
    tags: ["Stable Fluids", "Vorticity Confinement", "Jacobi Iteration", "Separable Blur"],
  },
  {
    index: "03",
    code: "SYS · TACTILE-UI",
    name: "Direct-Manipulation Primitives",
    subtitle: "Sub-millisecond pointer telemetry, magnetic deflection, and spring physics",
    budget: "120 Hz input path",
    description:
      "Interface controls are treated as physical mechanisms with mass, friction, and optical specular response—communicating state through spatial displacement and luminance rather than decorative chrome.",
    metrics: [
      { label: "Input latency", value: "< 1 frame" },
      { label: "Color mixing", value: "OKLab perceptual" },
      { label: "Contrast target", value: "WCAG AAA / AA+" },
    ],
    specs: [
      "Magnetic surface fields compute pointer proximity to deflect controls and position radial specular highlights.",
      "Live harmonic oscillators visualize damping ratio, stiffness, and settling time on an interactive canvas.",
      "Optical typography matrix pairs geometric sans, editorial italic serif, and tabular monospace metrics.",
    ],
    tags: ["Pointer Events", "Spring Dynamics", "OKLab Tokens", "Tabular Telemetry"],
  },
];

export const designPrinciples: DesignPrinciple[] = [
  {
    index: "I",
    title: "Physicality Over Decoration",
    axiom: "Every motion vector must have a physical cause.",
    body: "Surfaces do not animate on arbitrary timers. Particles scatter because cursor momentum transfers kinetic energy; smoke curls because vorticity resists numerical diffusion; buttons deflect because pointer proximity exerts pull.",
    metricLabel: "Conservation",
    metricValue: "Momentum-Driven",
  },
  {
    index: "II",
    title: "Monochrome Restraint",
    axiom: "Remove hue so luminance, texture, and form carry the hierarchy.",
    body: "By restricting the palette to obsidian, alabaster, and metallic silver, attention shifts to light falloff, typographic rhythm, and micro-contrast. State changes read unmistakably through density and specular edge light.",
    metricLabel: "Chroma Budget",
    metricValue: "0.00 — Achromatic",
  },
  {
    index: "III",
    title: "Zero-Jank Ergonomics",
    axiom: "Visual ambition never compromises responsiveness or accessibility.",
    body: "Offscreen WebGL contexts pause via IntersectionObserver, scroll reveals progressively enhance native CSS view timelines, and every interactive primitive maintains keyboard focusability and high-contrast legibility.",
    metricLabel: "Frame Target",
    metricValue: "60 / 120 FPS Lock",
  },
];

export const specificationTable: SpecRow[] = [
  {
    parameter: "Color Architecture",
    specification: "Obsidian (#07080A) · Alabaster (#F5F6F8) · Liquid Silver (#C8CED8)",
    subsystem: "Token Engine",
  },
  {
    parameter: "Typography Triad",
    specification: "Geist Sans (UI) · Instrument Serif Italic (Accent) · Geist Mono (Telemetry)",
    subsystem: "Optical Scale",
  },
  {
    parameter: "Hero Simulation",
    specification: "WebGL2 GPGPU Particle System · RGBA16F State · Instanced Capsules",
    subsystem: "Stage 00",
  },
  {
    parameter: "Continuum Simulation",
    specification: "Stam Stable-Fluids Solver · Curl + Vorticity + 22-Step Jacobi Pressure",
    subsystem: "Stage 01",
  },
  {
    parameter: "Viewport Lifecycle",
    specification: "IntersectionObserver Pause/Resume + Page Visibility Throttling",
    subsystem: "Runtime",
  },
  {
    parameter: "Motion Accessibility",
    specification: "Native prefers-reduced-motion & @supports(animation-timeline: view())",
    subsystem: "Ergonomics",
  },
];
