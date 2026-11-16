# Liquid Sculpture — FORMA®

A monochrome UI & visual design showcase in black, white, and silver: featuring the original liquid particle sculpture hero, Chromasonic's mouse-reactive fluid smoke background directly below it, and clean design-focused sections.

```bash
pnpm install
pnpm dev -p 3001
```

- `components/ui/liquid-sculpture-hero.tsx` — original particle sculpture hero.
- `components/portfolio-hero.tsx` — feeds the hero its monochrome silver palette, sculptures, and design copy.
- `lib/fluid-smoke.ts` & `components/smoke-section.tsx` — Chromasonic's smoke background animation adapted to monochrome silver, placed directly below the hero.
- `components/capabilities.tsx` & `components/approach.tsx` — clean editorial sections showcasing interface and visual design capabilities.
- `scripts/make-sculpture.mjs` — regenerates the braided silver sculpture SVGs in `public/` (`node scripts/make-sculpture.mjs`).
- Theme lives on `<html data-theme>`; the hero's toggle, sticky header, and smoke section share it.
