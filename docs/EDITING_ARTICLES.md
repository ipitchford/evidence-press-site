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
