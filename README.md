# Liquid Sculpture — FORMA®

A minimal two-screen monochrome design showcase in black, white, and silver: featuring the original liquid particle sculpture hero on the first screen, followed directly by Chromasonic's interactive fluid smoke background animation on the second screen.

```bash
pnpm install
pnpm dev -p 3001
```

- `components/ui/liquid-sculpture-hero.tsx` — original particle sculpture hero.
- `components/portfolio-hero.tsx` — feeds the hero its monochrome silver palette, sculptures, and design copy.
- `lib/fluid-smoke.ts` & `components/smoke-section.tsx` — Chromasonic's mouse-interactive smoke background adapted to monochrome silver, rendered as the full-screen second section.
- `scripts/make-sculpture.mjs` — regenerates the braided silver sculpture SVGs in `public/` (`node scripts/make-sculpture.mjs`).
- Theme lives on `<html data-theme>`; the hero's toggle, sticky header, and smoke section share it.
