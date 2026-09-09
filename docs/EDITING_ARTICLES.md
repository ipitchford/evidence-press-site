# Editing Evidence Press articles

Articles are deliberately simple to maintain. Each article has a Markdown text
file and a small JSON details file in this repository; the public HTML, feeds,
machine record and indexes are generated from them.

## Change an existing article in the browser

1. Open the public article and select **Edit article** near the end of the page,
   or **Article text** in its details panel.
2. Sign in to GitHub if asked. Edit the Markdown in the browser and use the
   Preview tab to inspect headings, links and lists.
3. Choose **Create a new branch for this commit and start a pull request**.
   Summarise the substantive change. Do not describe routine layout or media
   maintenance as a scholarly correction.
4. Let the automated checks finish. Merge only when they pass, then publish
   through the repository's guarded deployment command.

Use **Edit title, dates or sources** when changing structured details. Update
`dateModified` to the date of a substantive change. If a published assertion
was materially wrong, append a dated object to `corrections`; do not erase its
history. Typographical, styling, audio, video and caching work is not an article
correction.

## Add a new article

From a checkout of the repository:

```sh
node tools/new-article.js a-short-url-slug "The article title"
```

This creates:

```text
articles/a-short-url-slug/
├── body.md
└── meta.json
```

Write the article in `body.md`; it should begin with prose rather than repeating
the title. Edit `meta.json` to provide the standfirst, summary, topics, source
anchors and exact publication boundary. The article will appear at
`/articles/a-short-url-slug/` after the guarded publication workflow.

The byline defaults to **Evidence Press**. Name a person or model only when that
attribution has been deliberately agreed and recorded; never infer a byline
from the repository owner or publisher.

When the agreed byline credits AI models, set `bylineType` to `ai-systems`.
The visible byline and article JSON retain that exact credit. Structured web
metadata uses `creditText` instead of falsely describing models as a `Person`.
The optional alternatives are `person` and `organization`; existing articles
without this field retain their previous attribution behaviour.

## Optional article banner

For a generated article, upload an image to `assets/articles/` and add a
`banner` object to `meta.json`:

```json
"banner": {
  "src": "/assets/articles/article-banner.webp",
  "alt": "A concise description of what the image shows.",
  "caption": "Illustrative artwork, not a simulation or research result."
}
```

The three fields are required when a banner is supplied. Use plain text for
`alt` and `caption`. The path must name one local PNG, JPG, JPEG, WebP or SVG
under `assets/articles/`; use letters, digits, hyphens or underscores in its
filename. External URLs, nested paths, query strings and extra fields are
rejected. Existing articles without a banner are unchanged.

The banner appears above the headline with its caption below, never overlaid
on the artwork. It is cropped to about 3:1 on desktop and 16:9 on mobile, so
keep meaningful subjects near the centre and avoid text in the image. The
same image supplies the article's social preview, structured metadata and
Markdown export. Explain whether it is illustration, a schematic or actual
evidence in the caption; decoration must not imply independent validation.

## Optional full-text audio

Articles may offer a single "Listen to the article" player before the main
text, with native playback/seek controls, an MP3 download and a transcript.
This is a full reading, not the two-minute briefing used for research releases.
Use the established OpenAI `gpt-4o-mini-tts` / `fable` British narration profile;
never substitute an operating-system voice. Clearly disclose synthetic speech.

Keep the exact spoken input at `assets/audio/<slug>.txt`. Include the main
text and its qualifications; omit the bibliography URLs and expand mathematical
notation for speech without changing its meaning. Generate bounded chunks
using the speech skill's official SDK CLI, then assemble with
`tools/make-article-audio.js`. Its `--prepare`, `--assemble` and `--check`
commands keep generation separate from normal builds. No API calls occur
during build or deployment.

Add an optional `audio` object with `src`, `transcript`, and `provenance`
pointing to `/assets/audio/<slug>.mp3`, `.txt` and `.provenance.json`;
`durationSeconds` must match the recording receipt and `voiceLabel` must be
`OpenAI API synthetic voice (fable)`. The build verifies transcript, source
article and audio hashes. After editing the text, regenerate and check the
recording or remove the audio field until it is current. Listen/check for
omissions and pronunciation errors before publication. Keep the final MP3
below Cloudflare Pages' 25 MiB per-file limit.

## What belongs here

The Articles section is for essays, commentary, synthesis, research notes and
institutional updates. It is not a shortcut around the research-release gate.
If a work's primary purpose is to establish a theorem, empirical result or
consequential scientific claim, use the complete Evidence Press release
workflow with its evidence package and assurance boundary.

An article may contain or develop research claims, but `newResearchClaims` must
say so and `claimBoundary` must state exactly what has and has not been checked.
Article inclusion never implies a DOI, executable certificate, internal replay,
formal verification, independent reproduction, peer review, novelty or impact.

## Local check

```sh
node tools/test-articles.js
node build.js
node tools/test-metadata.js
node tools/check-links.js
```

The full publication check remains the repository command documented in
`README.md`.
