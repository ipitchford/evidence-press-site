# Changelog

Notable changes to the Evidence Press publishing software. Versions follow
semantic versioning. Research releases have their own versions and DOIs and
are not covered here.

## Unreleased

- The site's canonical address is now **https://evidencepress.org**. The
  previous address, evidence-press.pages.dev, continues to serve every
  published URL — nothing ever moves or disappears — and its pages carry
  canonical links to the new domain, so existing citations, feeds and the
  URLs recorded in Zenodo deposits keep resolving. The registrar and DNS sit
  in the same account as the hosting, and the domain is set to auto-renew.
- Correction notices moved from the top of the release page to the end of the
  article body, after the citation section. A presentation-scope correction
  does not challenge the result, so it should not lead the page; it remains on
  the page, dated, and in the release's machine-readable record.

## 1.1.3 — 2026-08-06

Release housekeeping for the first archived deposit: tracks the
already-deployed `observatory-pipeline.svg` (published content belongs in the
repository) and aligns every version marker, so the archived snapshot rebuilds
the deployment byte-for-byte. No functional change.

## 1.1.2 — 2026-08-06

### Fixed

- **Missing URLs returned HTTP 200.** The site shipped no `404.html`, so
  Cloudflare Pages answered every unmatched path with a success status and the
  home page's HTML. An agent requesting `paper.json` for a nonexistent release
  could not distinguish absence from presence. The build now emits a `404.html`
  (served with a genuine 404 status), which tells automated clients that an
  existing release always serves `/releases/<slug>/paper.json` with a matching
  `slug` field.

## 1.1.1 — 2026-08-06

### Fixed

- **Operating-system metadata was published.** `assets/` was copied into the
  site wholesale, so `.DS_Store` files were publicly served at
  `/assets/.DS_Store` and `/assets/katex/.DS_Store`. They also differ between
  machines, which prevented a tagged release from rebuilding byte-for-byte.
  The asset copy now filters `.DS_Store`, AppleDouble `._*`, `Thumbs.db`,
  `desktop.ini` and `.localized`, and `tools/test-metadata.js` fails the build
  if any reappear.

  Found by doing what an external evaluator would do: clean-cloning the v1.1.0
  tag, rebuilding, and diffing the result against the local build. CI could not
  have caught it — CI builds from a clean checkout, so it never sees files that
  exist only on a maintainer's machine.

## 1.1.0 — 2026-08-06

Response to an external software-artifact review dated 5 August 2026, after
verifying each finding against the source rather than accepting the report.

### Fixed — publication integrity

- **Renderer corrupted prose containing integers.** The inline renderer used
  space-delimited integers as placeholders for stashed code and mathematics
  tokens, then restored *any* space-delimited integer. A literal integer in
  prose could therefore be replaced by an unrelated formula. This was not
  hypothetical: the main theorem statement of the Erdős 848 release read "for
  every $N$ from $\lfloor (N+18)/25 \rfloor$ upwards" where the source says
  "from 1 upwards". Placeholders are now `\u0000`-delimited sentinels, and
  input is stripped of `\u0000` first, so collision with document text is
  impossible rather than unlikely. The raw Markdown and JSON representations
  of that release were always correct; only the HTML was affected.
- **Currency parsed as mathematics.** Inline maths delimiters now follow the
  Pandoc rule — an opening `$` is not followed by whitespace, a closing `$` is
  not preceded by whitespace and not followed by a digit — so a range such as
  `$290k–$430k` is left as text.

### Added — assurance model

- Releases now carry an **assurance matrix** of eight independent dimensions,
  each with its own state (`passed`, `partial`, `failed`, `not-assessed`,
  `not-applicable`), replacing a single linear ladder as the authoritative
  model. Independent reproduction, formal verification and peer review answer
  different questions and none ranks above another.
- The legacy `verification` booleans are now **derived** from the matrix
  rather than hardcoded, so the coarse and scoped views cannot drift apart. A
  test enforces the agreement.
- Catalogue cards show the assurance summary, so a reader no longer has to
  open a release to see what has been checked.

### Added — machine-actionable publishing

- RO-Crate 1.1 packaging per release (`ro-crate-metadata.json`).
- FAIR Signposting Level 2 link sets per release (`linkset.json`), discoverable
  from the landing page via `rel="linkset"`.
- Versioned API at `/api/v1/`. The unversioned paths remain and serve the same
  content; they are published URLs and will not be withdrawn.
- Published API stability policy and deprecation procedure
  (`/api/stability.json`), and build identity (`/api/build.json`).
- The published JSON Schema is tightened: patterns for DOIs, slugs, dates and
  schema versions, `additionalProperties: false` where the shape is closed,
  and minimum cardinality on authors and keywords.

### Added — assurance of the software itself

- `tools/test-render.js` — 28 renderer regression and property tests, which
  extract the real functions from `build.js` rather than copying them, so the
  tests cannot drift from the code they check.
- `tools/test-metadata.js` — validates the built catalogue against its own
  published schema, and cross-checks the catalogue, JSON Feed, RSS, sitemap,
  publication ledger and files on disk against each other.
- `tools/check-links.js` — verifies every internal link and asset reference
  resolves in `dist/`.
- Continuous integration on Node 18, 20 and 22: syntax, tests, clean build,
  conformance, link check, publication-preservation gate and an automated
  accessibility pass.
- `LICENSE`, `CITATION.cff`, `codemeta.json`, `SECURITY.md`, `CONTRIBUTING.md`
  and this changelog.

### Added — accessibility

- Visible keyboard focus indication (`:focus-visible`, 3px, offset).
- A `prefers-reduced-motion` override for smooth scrolling and card motion.
- The release filter announces its result count and empty state through a live
  region, offers a clear control, and reflects the query in the URL so a
  filtered view can be bookmarked.
- Copy buttons report failure instead of silently claiming success, and select
  the text so it can still be copied by hand.
- Audio controls follow the media element's own events and handle a refused or
  failed `play()`, with `aria-pressed` and a state-appropriate label.

### Security

- Content-Security-Policy with `script-src 'self'`; every inline script and
  the one inline `onload` handler moved into `assets/js/`.
- Permissions-Policy switching off the features the site does not use, leaving
  the video embeds' delegated features untouched.
- Output paths asserted inside `dist/`; slug pattern and uniqueness enforced;
  URI schemes restricted to `http:`, `https:` and `mailto:`, failing the build
  on anything else.

### Changed

- Documented Node requirement corrected from ≥ 16 to ≥ 18, matching
  `tools/check-published.js`, which uses the built-in `fetch`.
- Build output is deterministic: the build timestamp comes from the commit,
  never the clock, so the same source rebuilds byte-for-byte.

## 1.0.1 — 2026-08-03

Applied verified findings from two independent external reviews.

## 1.0.0

Initial public deployment: ten releases, catalogue API, JSON Schema, RSS and
JSON Feed, sitemap, BibTeX, Markdown representations, Signposting relations,
and the `PUBLISHED.json` deployment gate.
