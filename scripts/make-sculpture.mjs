/**
 * Generates the hero sculpture SVGs in public/.
 *
 * A braid of filaments twists around a curved axis. Each filament is cut into
 * short segments coloured by their depth in the twist and painted back to
 * front, which gives the flat SVG a lit, three-dimensional read. Backgrounds
 * stay transparent so the particle engine samples by alpha.
 *
 *   node scripts/make-sculpture.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = {
  // liquid silver on obsidian: gunmetal shadows at the back, pure specular white at the front
  dark: ["#1C2029", "#4E5564", "#949CA9", "#D4D8E1", "#FFFFFF"],
  // brushed pewter and carbon ink on alabaster
  light: ["#D5D9E2", "#9AA2B1", "#5E6573", "#262A33", "#0A0B0E"],
};

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function ramp(stops, t) {
  const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = hexToRgb(stops[i]);
  const b = hexToRgb(stops[i + 1]);
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Axis of the braid: position and unit normal for t in [0, 1]. */
const AXES = {
  wide: (t, w, h) => {
    const x = w * (0.06 + 0.88 * t);
    const y = h * (0.5 + 0.07 * Math.sin(t * Math.PI * 2 - 0.6));
    const dy = h * 0.07 * Math.PI * 2 * Math.cos(t * Math.PI * 2 - 0.6);
    const dx = w * 0.88;
    const len = Math.hypot(dx, dy);
    return { x, y, nx: -dy / len, ny: dx / len };
  },
  portrait: (t, w, h) => {
    // a gentle S rising from bottom-left to top-right
    const x = w * (0.22 + 0.56 * t + 0.12 * Math.sin(t * Math.PI * 2));
    const y = h * (0.94 - 0.88 * t);
    const dx = w * (0.56 + 0.12 * Math.PI * 2 * Math.cos(t * Math.PI * 2));
    const dy = -h * 0.88;
    const len = Math.hypot(dx, dy);
    return { x, y, nx: -dy / len, ny: dx / len };
  },
};

function sculpture({ width, height, axis, palette, seed, radius }) {
  const rand = mulberry32(seed);
  const stops = PALETTES[palette];
  const axisAt = (t) => AXES[axis](t, width, height);
  const STRANDS = 3;
  const PER_STRAND = 19;
  const STEPS = 140;
  const SEGMENT = 7;
  const twists = 2.35;
  const segments = [];
  const dots = [];

  for (let s = 0; s < STRANDS; s++) {
    const strandPhase = (s / STRANDS) * Math.PI * 2;
    for (let f = 0; f < PER_STRAND; f++) {
      const spread = (rand() - 0.5) * 0.9;
      const phase = strandPhase + spread;
      const radial = radius * (0.55 + rand() * 0.55);
      const wobble = rand() * Math.PI * 2;
      const start = rand() * 0.05;
      const end = 1 - rand() * 0.05;
      const weight = 1.3 + rand() * 3.2;
      const points = [];
      for (let i = 0; i <= STEPS; i++) {
        const t = start + ((end - start) * i) / STEPS;
        const a = axisAt(t);
        // thick in the middle, pinched at the ends
        const envelope = Math.pow(Math.sin(Math.PI * t), 0.75);
        const angle = phase + t * Math.PI * 2 * twists + 0.25 * Math.sin(t * 9 + wobble);
        const r = radial * envelope * (1 + 0.18 * Math.sin(t * 13 + wobble));
        const offset = r * Math.cos(angle);
        const depth = (Math.sin(angle) + 1) / 2;
        points.push({ x: a.x + a.nx * offset, y: a.y + a.ny * offset, depth, envelope });
      }
      for (let i = 0; i < STEPS; i += SEGMENT) {
        const slice = points.slice(i, Math.min(points.length, i + SEGMENT + 1));
        const depth = slice.reduce((sum, p) => sum + p.depth, 0) / slice.length;
        const envelope = slice.reduce((sum, p) => sum + p.envelope, 0) / slice.length;
        segments.push({ slice, depth, envelope, weight });
      }
      // a few loose sparks shed from the front of the braid
      for (let d = 0; d < 6; d++) {
        const p = points[Math.floor(rand() * points.length)];
        if (p.depth < 0.45) continue;
        const a = rand() * Math.PI * 2;
        const dist = 4 + rand() * radius * 0.35;
        dots.push({ x: p.x + Math.cos(a) * dist, y: p.y + Math.sin(a) * dist, r: 1.2 + rand() * 2.4, depth: p.depth });
      }
    }
  }

  segments.sort((a, b) => a.depth - b.depth);
  const fmt = (n) => n.toFixed(1);
  const paths = segments.map(({ slice, depth, envelope, weight }) => {
    const d = slice.map((p, i) => `${i ? "L" : "M"}${fmt(p.x)} ${fmt(p.y)}`).join("");
    const stroke = ramp(stops, depth * 0.9 + envelope * 0.1);
    const sw = weight * (0.55 + depth * 0.9) * (0.35 + envelope * 0.65);
    const opacity = 0.4 + depth * 0.6;
    return `<path d="${d}" stroke="${stroke}" stroke-width="${sw.toFixed(2)}" stroke-opacity="${opacity.toFixed(2)}"/>`;
  });
  const circles = dots.map(
    (p) => `<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="${p.r.toFixed(1)}" fill="${ramp(stops, p.depth)}"/>`
  );

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round">`,
    ...paths,
    `</g>`,
    ...circles,
    `</svg>`,
  ].join("\n");
}

mkdirSync(outDir, { recursive: true });
const variants = [
  { file: "sculpture-dark.svg", width: 2000, height: 800, axis: "wide", palette: "dark", radius: 230 },
  { file: "sculpture-light.svg", width: 2000, height: 800, axis: "wide", palette: "light", radius: 230 },
  { file: "sculpture-mobile-dark.svg", width: 1000, height: 1100, axis: "portrait", palette: "dark", radius: 190 },
  { file: "sculpture-mobile-light.svg", width: 1000, height: 1100, axis: "portrait", palette: "light", radius: 190 },
];
for (const { file, ...options } of variants) {
  writeFileSync(join(outDir, file), sculpture({ ...options, seed: 1987 }));
  console.log(`wrote public/${file}`);
}
