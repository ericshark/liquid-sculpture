# Deployment

Liquid Sculpture (FORMA®) runs on the Vercel Hobby project `liquid-sculpture`.
Its production URL is <https://liquid-sculpture.vercel.app>.

Vercel builds the Next.js app from the repository root. The browser renders the
sculpture and smoke effects with WebGL, with visual fallbacks when WebGL is
unavailable. The app needs no separate API, database, authentication, storage,
or environment variables.

Vercel is connected to `ericshark/liquid-sculpture`. Pushes to `main` build
and deploy to production. GitHub Actions runs lint and the production build on
`main`. Vercel uses Corepack and `pnpm install --frozen-lockfile` to install
the version pinned in `package.json`.

Check build logs and the active commit on the Vercel project's Deployments
page. After a release, load the production URL and check the theme toggle and
smoke section. Redeploy a known-good revision from the dashboard if needed.
