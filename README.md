# Evidence Press — research press-release site

A dependency-free static site for press releases about new research published with complete, replayable evidence — designed for popular audiences, specialists, and AI research agents.

Live site: https://evidence-press.pages.dev

## Build

```
node build.js        # writes the whole site to ./dist — no npm install needed
```

Requires only Node ≥ 16. No packages, no framework. KaTeX is vendored in `assets/katex/`.

## Add a new release

1. Copy an existing folder in `papers/` (e.g. `papers/z20-equals-6/`) to `papers/<new-slug>/`.
2. Edit `meta.json` — title, one-line summary, abstract, date (`YYYY-MM-DD`), version, DOI, **pdfUrl** (direct link to the manuscript PDF), Zenodo/GitHub URLs, authors as listed on the archive record, keywords, key results, evidence description, verification status, open follow-up problems, related works (each with a URL), and citation text. Set `"math": true` if the page uses LaTeX (`$...$` / `$$...$$`). Optionally add `"narration"` (plain-spoken text for the audio briefing) and `"media": [{"type":"video","url":"...","name":"..."}]` for additional audio/video.
3. Edit `body.md` — the press release. Template sections: `## Summary` (popular), `## Summary for specialists`, `## Technical summary`, `## Who should care, and why` (audience table), `## The most valuable next projects`, `## Specialist audience candidates`, `## What is in the evidence package`.
4. Optional but recommended, run the asset generators (outputs are committed):
   - `node tools/make-art.js` — regenerate SVG cover art (add a motif function for the new slug, or copy an existing one).
   - `node tools/make-og.js` — regenerate Open Graph card PNGs (needs Playwright + Chromium).
   - `OPENAI_API_KEY=... node tools/make-audio.js` — generate the narrated audio briefing (skips existing files; `--force` regenerates).
5. Run `node build.js` and check `dist/` locally (`python3 -m http.server -d dist 8000`).
6. Commit and push — Cloudflare Pages rebuilds and deploys automatically (if connected to Git), or run `npx wrangler pages deploy dist --project-name evidence-press`.

The index page, feeds, sitemap, `llms.txt`, and `api/papers.json` all regenerate automatically from the `papers/` folder — nothing else to update.

## Update the Policy Identification Observatory page

The standalone Observatory page has a small metadata source at
`pages/observatory.json`, its long-form copy at `pages/observatory.md`, and an
authoritative audio script at `assets/audio/observatory-transcript.txt`.

Before a public deploy, replace every `__OBSERVATORY_...__` token in the JSON
with the exact GitHub repository, versioned release, DOI and Zenodo record URLs.
The published-URL gate refuses to deploy while any token remains.

```
OPENAI_API_KEY=... node tools/make-audio.js --observatory --force
node tools/check-observatory-media.js
node build.js
node tools/check-published.js
```

The audio file and transcript hashes, byte size and duration in
`pages/observatory.json` must match the committed assets. The dependency-free
build checks hashes and byte size; the authoring-time media check uses
`ffprobe` to check the exact duration and the 105–135 second briefing window.
The pipeline diagram is a curated PNG; its generation and review record is
committed beside it as `assets/art/observatory-pipeline.provenance.json`.

## What the build emits

- `/` — index of all releases (newest first), cover art, client-side topic filter
- `/releases/<slug>/` — one page per release: audio briefing player, PDF button, popular/specialist/technical layers, audience table, open follow-up problems, verification status, fully linked sources, copyable APA + BibTeX
- `/releases/<slug>/paper.json` · `index.md` · `cite.bib` — structured record, Markdown version, BibTeX (CORS-enabled JSON)
- `/api/papers.json` + `/api/schema.json` — full structured index with JSON Schema
- `/llms.txt`, `/llms-full.txt` — AI-agent index and full text
- `/feed.xml` (RSS with audio enclosures), `/feed.json` (JSON Feed)
- `/sitemap.xml` (with lastmod), `/robots.txt` (AI crawlers explicitly welcomed), `/_headers`

Every release page embeds Schema.org JSON-LD (ScholarlyArticle + SoftwareSourceCode + Dataset + AudioObject), Highwire `citation_*` tags including `citation_pdf_url` (Google Scholar), Dublin Core, Open Graph images, and Signposting link relations (`cite-as`, `describedby`, `item`, `alternate`, `license`).

## Before you deploy: the published-URL gate

**Never deploy a `dist/` you have not checked against `PUBLISHED.json`.** More than one
agent works on this site, and releases are prepared on their own branches and worktrees.
A build made from a branch that lacks another branch's release will silently delete that
release from the live site, breaking a DOI-bearing page and its Zenodo cross-reference.

```
node build.js
node tools/check-published.js          # exits 1 if this build would drop a published URL
npx wrangler pages deploy dist --project-name evidence-press
node tools/check-published.js --record # add anything newly published to the ledger
```

`PUBLISHED.json` is the ledger of every URL the site has published. The gate is offline
and takes no arguments; `--live` additionally reconciles the ledger against the deployed
site, probing each candidate slug's `paper.json` directly, because the site's own index
endpoints have been observed to under-report what is actually live.

If the gate refuses, the build is wrong, not the ledger. Merge the missing release in and
rebuild. Only pass `--record` after a deploy has succeeded.

## Configuration

`site.config.json` holds the site name, tagline, description, and `baseUrl`. If you attach a custom domain, change `baseUrl` and rebuild — canonical URLs, feeds, sitemap, and JSON-LD all follow it.

## Cloudflare Pages settings

- Build command: `node build.js`
- Build output directory: `dist`
- No environment variables required (audio/og/art generation happens at authoring time, not deploy time).

Everything in this repository is dedicated to the public domain under CC0 1.0.
