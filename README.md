# Liquid Sculpture — FORMA®

A monochrome design-engineering specimen combining a 100k-particle WebGL2 sculpture hero, a real-time Navier–Stokes fluid smoke continuum (ported from Chromasonic), and interactive UI primitives in an obsidian, alabaster, and liquid-silver theme.

```bash
pnpm install
pnpm dev -p 3001
```

- `components/ui/liquid-sculpture-hero.tsx` — the instanced particle hero.
- `components/portfolio-hero.tsx` — feeds the hero the FORMA® showcase copy, monochrome silver palette, and braided sculptures.
- `lib/fluid-smoke.ts` & `components/fluid-continuum.tsx` — the WebGL2 Navier–Stokes fluid smoke stage placed directly below the hero.
- `components/ui-primitives.tsx` — live interactive bento showcasing magnetic deflection, optical typography, monochrome surface tokens, and harmonic spring damping.
- `components/system-architecture.tsx` & `components/design-principles.tsx` — rendering architecture and specification matrix.
- `scripts/make-sculpture.mjs` — regenerates the braided silver sculpture SVGs in `public/` (`node scripts/make-sculpture.mjs`).
- Theme lives on `<html data-theme>`; the hero's toggle, sticky header, and fluid continuum share it.
