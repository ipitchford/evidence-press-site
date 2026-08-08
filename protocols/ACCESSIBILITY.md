# Accessibility

The goal is that anyone can use a protocol, regardless of tooling, model access,
or technical skill. Progress and honest gaps:

## Implemented artefacts

- **Copy-and-run edition** — every pack ships
  `adapters/generic-chat/prompt.md`: a plain-language prompt needing no install,
  repository setup, or protocol-declared external tool/integration. The chosen AI
  interface may still require network access and remains subject to its own data
  terms. This is the current accessibility floor.
- **Minimum-model / low-token candidate** — `adapters/generic-chat/prompt-min.md`
  (flagship): a short, step-by-step version for small or low-cost models and
  scarce-token settings, keeping the safety core. This candidate has not been
  evaluated. A separate version 0.1.0 `prompt-concise.md` predecessor benchmark
  used fewer model tokens/cost than its full predecessor, but found no clear gain
  and does not validate `prompt-min.md` or the current 0.1.1 pack.
- **Translation demonstration** — `adapters/generic-chat/prompt-fr.md`
  (flagship, French): shows the copy-and-run edition translated while the machine
  contract stays canonical in English.
- **Print-friendly pages** — the site's `@media print` styles drop the filters and
  chrome and render black-on-white, so any protocol page prints (or "saves as PDF"
  from a browser) cleanly.
- **Machine-readable everything** — registry, schemas, and feeds let assistive and
  automated clients consume the library directly.

These are availability statements, not evidence that a novice user can operate
the material successfully. No representative human usability study has yet been
completed.

## Honest gaps

- **Minimum-model and translated editions for every pack** — only the flagship has
  them; the pattern is documented for the rest.
- **Audio narration + transcripts** per protocol — needs a TTS pipeline; deferred.
- **Full localisation** into multiple languages — one demonstration only.
- **A generated PDF artefact** per protocol (beyond browser print-to-PDF) — needs a
  dependency-free PDF path or an added tool; deferred.
- **Representative novice usability testing** — keyboard and automated checks do
  not establish comprehension, permission understanding or failure recognition.
- **Plain-language and translation review by people** — the current copy and
  French demonstration have not received independent language/user review.

These are stated rather than quietly skipped. The current artefacts can be tried
without installing repository tooling; whether they are usable and beneficial to
the intended audience remains unmeasured.
