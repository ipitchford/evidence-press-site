# ART article media check

## Editorial artwork replacement

The user rejected the initial SVG treatment as unsophisticated. The current
page uses `assets/articles/art-discovery-editorial-banner-v2.png` and
`assets/articles/art-discovery-explainer-v2.png`, made with the built-in image
generation tool. The previous SVGs and their generator remain historical files.
The banner uses a tactile ribbon as an abstract genomic map. The explainer
separates reported genomic pattern, supported transcription and unresolved
activity. Its protein-like silhouette is explicitly conceptual, not a structure.
One generated label was corrected from “Repeat array” to “Repeat unit”.

Browser inspection passed at desktop width and a 390-pixel mobile viewport:
both images load, the figure remains inside its frame, no horizontal overflow,
and exactly one audio player remains. The detailed figure's small labels require
zoom on a phone; the adjacent caption and prose preserve its main distinctions.

Audio and transcript bytes are unchanged. The source-body hash was rebound only
after proving that old and new Markdown were byte-identical with image markup
excluded. This changes no narrated prose and requires no new TTS call.

### Generation prompts

Banner (built-in generation):

> Create a world-class editorial science illustration for Evidence Press, an elegant research publication. Wide panoramic 3:1 banner composition. Topic: AI helped recognise repeating sequences in viral DNA, a repeat-and-spacer array upstream of a reverse-transcriptase-like gene. Visual concept: an exquisitely crafted physical scientific paper model in a dark petrol-teal studio: a single continuous finely textured ivory genomic ribbon sweeping gently horizontally, with four identical precise teal repeat segments separated by longer distinct amber segments on the LEFT, transitioning along the same ribbon into two larger beautifully sculpted translucent folded-paper gene markers on the RIGHT. The markers are abstract directional forms, NOT protein structures. Show the repeat rhythm unmistakably. Quiet depth, sophisticated macro lighting, tactile materials, delicate shadows, editorial restraint, extraordinary craft. Evidence Press palette deep ink teal #142d30, sea glass turquoise #42d8c1, warm amber #efbe65, ivory #fff9ed. Main visual all within central horizontal 65% height; generous negative space around it to tolerate website crop. No text, letters, numbers, logos, scientific instruments, robots, human hands, brains, generic glowing networks, double helices, glitter, lens flares, fake microscopy, or fake atomistic proteins. This is an abstract conceptual illustration of genomic arrangement, not a biological mechanism or experimental image. Beautiful enough for a leading science magazine, visually rich but exceptionally clear.

Explainer (built-in generation):

> Design an exceptionally polished scientific editorial infographic for Evidence Press about array-associated reverse transcriptases (ART). Portrait composition 4:5, high resolution, crisp impeccable typography large enough for mobile reading. Sophisticated print-science magazine aesthetic: warm ivory paper background, deep petrol teal type, sea-glass teal for observations, muted amber for unresolved hypotheses. Refined dimensional paper-cut scientific illustration, subtle material shadows, elegant whitespace, aligned readable labels. NOT a generic flowchart or PowerPoint boxes. Layout: heading at top 'A pattern is not yet a mechanism'. Three spacious horizontal illustrated chapters stacked vertically, separated by fine rules. Chapter 1 title '01  The genomic pattern' and exact small subtitle 'Reported in the preprint'. Illustration of four repeated teal tabs separated by longer amber ribbon sections, adjacent to abstract directional gene markers; clear small labels 'Repeat array' and 'RT-like gene'. Chapter 2 title '02  RNA is produced' subtitle 'Transcription is supported'. Illustration of a few elegant single-stranded ribbons emerging from a short genomic ribbon, NOT double helices or atomistic molecular structures. Exact note 'Mature RNA identities remain provisional'. Chapter 3 title '03  Function remains open' subtitle 'Activity and substrate are unproved'. Illustration of an unconnected single-strand ribbon and a translucent abstract enzyme-like silhouette, separated by a restrained dotted question path, conveying a proposed interaction not a demonstrated complex. Exact note 'Which RNAs, if any, does ART copy?' Footer in legible type 'Conceptual schematics, not molecular structures or assay data'. All this text exactly, no extra text. No fake quantitative axes, no invented data, no gene editing or DNA synthesis shown as established, no tiny footnotes, no text/graphic overlaps, no gradients masquerading as data. Imagery and typography integrated like a premium science feature, not a software dashboard. Keep labels extremely accurate and readable.

Final edit prompt (applied to the generated explainer):

> Make one precise correction to this infographic. In chapter 01 the small bracket under the first teal unit is labelled 'Repeat array'. Change ONLY that label to 'Repeat unit', because the entire succession of repeats and intervening spacers is the array. Preserve every other word, layout, material, colour, illustration and dimension exactly. Do not redesign anything.

## Initial media pass (superseded visually)

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
