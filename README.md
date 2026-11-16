# Liquid Sculpture

An experimental take on the portfolio: an "ink & ember" single page whose hero is a
WebGL particle sculpture that turns liquid under the cursor. Text comes from the
main site's `src/data/portfolio.ts` (copied to `data/portfolio.ts`).

```bash
pnpm install
pnpm dev -p 3001
```

- `components/ui/liquid-sculpture-hero.tsx` — the particle hero (by guglielmogiannattasio.it).
- `components/portfolio-hero.tsx` — feeds it the portfolio text, palette, and sculptures.
- `scripts/make-sculpture.mjs` — regenerates the braided sculpture SVGs in `public/`
  (`node scripts/make-sculpture.mjs`).
- Theme lives on `<html data-theme>`; the hero's toggle and the sticky header share it.
