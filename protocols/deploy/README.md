# Deploying Productivity Protocols into evidencepress.org

The subsystem is built to mount at `/protocols/` on the live site **without editing
the live `build.js`**. That keeps the two builds independent: the main site's
byte-identical-build guarantee is untouched, and the protocols subsystem stays
self-contained.

## The integration

[`integrate.sh`](integrate.sh) composes the two builders and mounts the result:

1. `node build.js` — the main site → `dist/`
2. `node protocols/build-protocols.js` — the subsystem → `protocols/dist/`
3. copy `protocols/dist` → `dist/protocols/`
4. `node tools/merge-protocols-sitemap.js` — fold the `/protocols/` page URLs into
   the main `dist/sitemap.xml` (idempotent), so crawlers using `/sitemap.xml`
   discover them directly.

The merged `dist/` then serves the whole site with `/protocols/` included and in
the main sitemap. Verify locally with `python3 -m http.server 8080 -d dist` and
open `/protocols/`. Note: the standalone `./tools/deploy.sh` does NOT do steps
2–4; use `integrate.sh` (or the manual sequence) to include `/protocols/`.

## Deploy — a maintainer decision, not done here

The final step is **not** run by the build agent:

```bash
wrangler pages deploy dist
```

Deploying publishes to the live public site (`evidencepress.org`). It is
outward-facing and is left as an explicit maintainer action. This candidate has
been prepared and verified locally only — not deployed, no remote created.

## What was verified vs left to the maintainer

- **Verified here:** the protocols subsystem builds byte-identically, and its
  `dist/` mounts cleanly as a `/protocols/` subtree (checked into a temporary
  directory, so the live site's tracked `dist/` was not disturbed).
- **Left to the maintainer:** running `integrate.sh` for real (it rebuilds the
  whole site into the tracked `dist/`), a visual pass on the merged site, and the
  `wrangler` deploy.

## A note on the standing constraint

Building the merged site edits files at the repo root (`dist/`), which is outside
`protocols/`. That is why the full `integrate.sh` was authored but **not run** by
the agent: the standing constraint was to keep changes inside `protocols/` and to
not deploy. Lifting that — running the integration and deploying — is your call.
