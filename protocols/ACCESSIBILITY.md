# Accessibility

The goal is that anyone can use a protocol, regardless of tooling, model access,
or technical skill. Progress and honest gaps:

## Done

- **Copy-and-run edition** (baseline) — every pack ships
  `adapters/generic-chat/prompt.md`: a plain-language prompt needing no install,
  no tools, and no network. This is the accessibility floor.
- **Minimum-model / low-token edition** — `adapters/generic-chat/prompt-min.md`
  (flagship): a short, step-by-step version for small or low-cost models and
  scarce-token settings, keeping the safety core. Measured: the concise edition
  roughly halves cost versus the full transcript (see the flagship `evals/`).
- **Translation (demonstration)** — `adapters/generic-chat/prompt-fr.md`
  (flagship, French): shows the copy-and-run edition translated while the machine
  contract stays canonical in English.
- **Print-friendly pages** — the site's `@media print` styles drop the filters and
  chrome and render black-on-white, so any protocol page prints (or "saves as PDF"
  from a browser) cleanly.
- **Machine-readable everything** — registry, schemas, and feeds let assistive and
  automated clients consume the library directly.

## Honest gaps (scale items, not done)

- **Minimum-model and translated editions for every pack** — only the flagship has
  them; the pattern is documented for the rest.
- **Audio narration + transcripts** per protocol — needs a TTS pipeline; deferred.
- **Full localisation** into multiple languages — one demonstration only.
- **A generated PDF artefact** per protocol (beyond browser print-to-PDF) — needs a
  dependency-free PDF path or an added tool; deferred.

These are stated rather than quietly skipped. The copy-and-run and minimum-model
editions mean the core method is usable with no install and a weak model today.
