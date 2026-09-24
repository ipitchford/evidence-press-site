# ART article media check

Presentation repair requested after the initial text-only publication. No
scientific assertions, authorship, source-list decision or research deposits changed.

- Banner: source-backed genomic-neighbourhood schematic; four repeats are an
  illustration, not a measured locus. The caption states the unresolved function.
- Inline figure: solid transcription evidence versus dashed proposed RT activity.
  Neither graphic represents an experimental result or demonstrates mechanism.
- Both assets reproduce with `node tools/make-art-discovery-article-art.js --check`.
  Inspected in the browser at desktop and 390px width. No clipped content or
  overlapping labels. The article has one audio player and no horizontal overflow.
- Narration: OpenAI `gpt-4o-mini-tts`, `fable`, repository British profile;
  684.336 seconds. Full main text retained, table verbalised, URLs omitted and
  abbreviations expanded for speech. Audio SHA-256:
  `413fe757b90f0d5c4fcec99801ffe666b864f45d39a11235d2f337151444b002`.
- Local Whisper small.en round-trip checked the whole recording; spelling,
  name and homophone differences were reviewed. A possible billions/millions
  error was corrected by regenerating chunk 2. Chunk 4 repeatedly omitted its
  final disclosure clause. That exact clause, “They add no experimental evidence.”,
  was generated separately with the same speech CLI/provider/voice/profile and
  concatenated to chunk 4 before final assembly. Thus provenance chunk 4 is an
  edited audio unit, not one API request. Its transcript input remains exact.
  Supplemental clip SHA-256:
  `a8a56cd3809764959890859edb15cf8d35cd92cd0148ab47c3e22abc83aaee31`.
  Final padded-tail transcription confirms the complete disclosure. CLI request
  IDs are unavailable, as disclosed in the main provenance receipt. This is an
  internal intelligibility check, not an independent attestation of every word.
- Article authoring guidance and scaffold now explicitly require standard media
  for new articles unless the user opts out or a technical blocker is reported.
  Schema optionality remains for legacy compatibility. A regression test protects
  this article's media and deterministic graphics.
