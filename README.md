# Evidence Press — research press-release site

A dependency-free static site for press releases about new research published with complete, replayable evidence — designed for popular audiences, specialists, and AI research agents.

Live site: https://evidencepress.org

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21817379.svg)](https://doi.org/10.5281/zenodo.21817379)

Archived on Zenodo: concept DOI [10.5281/zenodo.21817379](https://doi.org/10.5281/zenodo.21817379) always resolves to the latest archived version; each release also has its own version DOI (v1.1.3 is [10.5281/zenodo.21817380](https://doi.org/10.5281/zenodo.21817380)). Cite the software with these; cite a research release with that release's own DOI.

## Build

```
REQUIRE_COMMITTED_MANIFESTS=1 ./protocols/deploy/integrate.sh
                     # writes the complete site, including /protocols/, to ./dist
node build.js        # focused host-site build only; useful while editing the renderer
```

Requires only Node ≥ 18 (`tools/check-published.js` uses the built-in fetch). No packages, no framework. KaTeX is vendored in `assets/katex/`.

The build is deterministic: the build timestamp comes from the commit, not the clock, so the same source always produces byte-identical output and a third party can rebuild a tag and compare.

## Verify

```
node tools/test-render.js      # renderer regression + property tests
node tools/test-operating-model.js # doctrine, method/IBE/work ledgers, prospective contract + hostile controls
node tools/test-metadata.js    # schema conformance + cross-surface consistency
node tools/check-links.js      # every internal link and asset resolves
node tools/check-published.js  # publication-preservation gate (never lose a URL)
```

CI runs these checks on Node 18, 20 and 22, plus protocol integrity, a byte-identical-rebuild check, an inline-script check (the pages ship a CSP with `script-src 'self'`), and an automated accessibility pass (`.pa11yci.json`). See `docs/ACCESSIBILITY.md` for what is and is not covered by automation.

Release metadata is validated against strict authoring contracts *before* any file is written: an invalid record fails the build rather than being published. Slugs must match `^[a-z0-9]+(-[a-z0-9]+)*$`, DOIs and canonical URLs must be unique, and only `http:`, `https:` and `mailto:` may reach an `href` or `src`. The operating-model contract additionally enforces reciprocal attempt receipts, method references, evidence-backed lineage, semantic-bridge status, assurance targets, human judgement gates and aim-scoped impact-evidence boundaries for every post-baseline release.

## Add a new release

1. Before substantive work, register an `attemptId` and `workId` in `data/WORK_LEDGER.json`. Retain stopped, null, failed and unreleased attempts; use explicit missingness rather than reconstructed clocks.
2. Copy an existing folder in `papers/` (e.g. `papers/z20-equals-6/`) to `papers/<new-slug>/`.
3. Edit `meta.json` — title, one-line summary, abstract, date (`YYYY-MM-DD`), version, DOI, **pdfUrl** (direct link to the manuscript PDF), Zenodo/GitHub URLs, authors as listed on the archive record, keywords, key results, evidence description, verification status, open follow-up problems, related works (each with a URL), citation text, and a complete `operatingModel` record conforming to `schemas/release-operating-model.schema.json`. Its attempt IDs must reciprocate the work-ledger release link, and its artifact roles must distinguish research outputs from assessments, method demonstrations and communications. Set `"math": true` if the page uses LaTeX (`$...$` / `$$...$$`). Optionally add `"narration"` (plain-spoken text for the audio briefing) and `"media": [{"type":"video","url":"...","name":"..."}]` for additional audio/video.
4. Add the slug to one or more appropriate method assignments and exactly one broad method cluster in `data/METHOD_REGISTRY.json`. Add it to a lineage only when a published dependency supplies the evidence. Update `data/IBE_LEDGER.json` only when the release materially bears on a recorded explanation. Registry inclusion is not a correctness or impact claim.
5. Edit `body.md` — the press release. Template sections: `## Summary` (popular), `## Summary for specialists`, `## Technical summary`, `## Who should care, and why` (audience table), `## The most valuable next projects`, `## Specialist audience candidates`, `## What is in the evidence package`.
6. Run the asset generators (outputs are committed):
   - `node tools/make-art.js` — regenerate SVG cover art (add a motif function for the new slug, or copy an existing one).
   - `node tools/make-og.js` — regenerate Open Graph card PNGs (needs Playwright + Chromium).
   - `node tools/make-thumb.js <slug>` — automatically generate the 2560×1440 YouTube thumbnail. Bespoke slug specifications take precedence; otherwise release metadata supplies a safe default. Backgrounds rotate deterministically through the Evidence Press palette. The command writes the committed `thumbs/<slug>.jpg` and an exact upload-ready mirror at `/Users/admin/thumbs/<slug>.jpg` (or `$EVIDENCE_PRESS_THUMBNAIL_DIR`).
   - `node tools/make-thumb.js --check` — require one valid sub-2-MB thumbnail for every release and, on the maintainer Mac, an exact central mirror. This gate also runs in the composite build.
   - `node tools/make-audio.js --force <slug>` — generate the narrated audio briefing through the OpenAI API house profile (`gpt-4o-mini-tts`, British `fable` voice; requires `OPENAI_API_KEY`). The command writes the MP3, exact transcript and a byte-binding provenance receipt. It never falls back to an operating-system voice.
   - `node tools/make-audio.js --check <slug>` — verify the committed provider/model/voice declaration and the transcript and MP3 hashes without an API key.
7. Run `node tools/test-operating-model.js`, then `REQUIRE_COMMITTED_MANIFESTS=1 ./protocols/deploy/integrate.sh`, and check `dist/` locally (`python3 -m http.server -d dist 8000`).
8. Commit the candidate. Publication remains a separate, explicitly authorised action and must use `./tools/deploy.sh`. See *Before you deploy* below.

The index page, feeds, sitemap, `llms.txt`, `api/papers.json`, per-release RO-Crate packages and Signposting link sets all regenerate automatically from the `papers/` folder — nothing else to update.

### Assurance and corrections

Each release carries an **assurance matrix** rather than a single verification level: eight independent dimensions (availability, internal replay, independent rerun, independent reimplementation, formal verification, specialist review, editorial peer review, data and environment reproducibility), each with a state of `passed`, `partial`, `failed`, `not-assessed` or `not-applicable`. Declare any of them in `meta.json` under `assurance`; anything undeclared is reported as *not assessed*, which is a statement about what nobody has done yet, not a finding against the work. The legacy `verification` booleans are derived from this matrix, so they cannot disagree with it.

Prospective workflow receipts use those eight release-object dimensions plus three explicitly epistemic targets: semantic validation, novelty assessment and priority assessment. This 11-dimension target does not retrospectively upgrade the public matrix or collapse it to a score. The release matrix describes the published object; the dated work-ledger endpoint records which assurance boundary a prospective attempt actually reached, with evidence and a claim ceiling.

If a published page turns out to be wrong, add an entry to that release's `corrections` array (`date`, `scope` — one of `presentation`, `metadata`, `claim`, `evidence` — `summary`, optional `detail` and `fixedIn`). It renders as a dated notice on the release page and is published in the release's JSON. Corrections are additive: the record of the error stays.

## What the build emits

- `/` — index of all releases (newest first), cover art, client-side topic filter
- `/releases/<slug>/` — one page per release: audio briefing player, PDF button, popular/specialist/technical layers, audience table, open follow-up problems, verification status, fully linked sources, copyable APA + BibTeX
- `/releases/<slug>/paper.json` · `index.md` · `cite.bib` — structured record, Markdown version, BibTeX (CORS-enabled JSON)
- `/api/papers.json` + `/api/schema.json` — full structured index with JSON Schema
- `/api/v1/papers.json` + `/api/v1/schema.json` — the same content under a versioned route
- `/operating-model/` — the human-readable doctrine, plus Markdown and JSON representations
- `/api/operating-model.json` — the institutional contract and frozen adoption baseline
- `/api/method-registry.json` — reusable methods, failure modes, broad method clusters, evidence-backed lineages and release assignments
- `/api/ibe-ledger.json` — observations, rival explanations, predictions and potential falsifiers
- `/api/work-ledger.json` — prospective attempts, including stopped and unreleased work, clocks, resources, comparisons, assurance endpoints and explicit missingness
- `/api/atlas-proposals.json` — quarantined research tips from people and agents, with content-derived IDs, cheap falsifiers, separate assessments, expiry and append-only review receipts
- `/api/schemas/*.schema.json` — schemas for all operating artifacts and prospective release records
- `/api/stability.json` — field stability, compatibility guarantees and deprecation procedure
- `/api/build.json` — software version, source commit and schema version for this build
- `/releases/<slug>/ro-crate-metadata.json` — RO-Crate 1.1 package
- `/releases/<slug>/linkset.json` — FAIR Signposting Level 2 link set
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
./tools/deploy.sh # build → preservation gate → deploy → live readback/ledger → IndexNow push
```

`tools/deploy.sh` is the only supported deployment path. It runs the full safe sequence and, as its last step, pushes every
sitemap URL to IndexNow (Bing, Yandex, DuckDuckGo, Seznam) via
`tools/indexnow-submit.js`, so new or changed pages are announced on every deploy
without a manual step. Google does not use IndexNow — that channel is Search
Console plus the sitemap. Do not invoke `wrangler pages deploy` directly: that
would bypass the exact protocol source, operating-contract checks, live
preservation gate and post-deploy readback.

IndexNow ownership is proved by the fixed `indexNowKey` in `site.config.json`,
which `build.js` serves as `/<key>.txt` at the domain root.

`PUBLISHED.json` is the ledger of every URL the site has published. The gate is offline
and takes no arguments; `--live` additionally reconciles the ledger against the deployed
site, probing each candidate slug's `paper.json` directly, because the site's own index
endpoints have been observed to under-report what is actually live.

If the gate refuses, the build is wrong, not the ledger. Merge the missing release in and
rebuild. The supported deploy wrapper performs post-deploy readback and records only
URLs it can confirm live; do not run record mode before publication.

## Configuration

`site.config.json` holds the site name, tagline, description, and `baseUrl`. If you attach a custom domain, change `baseUrl` and rebuild — canonical URLs, feeds, sitemap, and JSON-LD all follow it.

## Cloudflare Pages settings

- Build command: `REQUIRE_COMMITTED_MANIFESTS=1 ./protocols/deploy/integrate.sh`
- Build output directory: `dist`
- No environment variables required (audio/og/art generation happens at authoring time, not deploy time).

## Licensing

The publishing software — `build.js`, `tools/`, `assets/style.css` and `assets/js/` — is MIT licensed (see `LICENSE`). The published research and institutional content — `papers/`, `pages/`, `docs/OPERATING_MODEL.md`, `data/` and everything rendered from them — is dedicated to the public domain under CC0 1.0, as stated on every page of the site. Vendored KaTeX keeps its own MIT licence.

Cite the software with `CITATION.cff`; cite a research release with its own DOI.
