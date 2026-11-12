# Minds Explored

Minds Explored is the public learning application at https://evidencepress.org/minds-explored/.
The user authorised this brand and publication on Evidence Press on 9 November 2026,
and deferred domain registration. It uses the existing static Pages hosting only.

This is a site application, not a research release or article: it adds no DOI,
research-assurance status, research ledger attempt or claim of scientific validation.

## Publication input and rebuild

`pages/minds-explored/site/` is the reviewed static application; its exact file
inventory is bound by `pages/minds-explored/manifest.json`. The host builder verifies
and copies it, includes its routes in the host sitemap, and preserves its own CSP.
The host's normal commit/seal/CI/deployment/readback gates apply without exemptions.

The credential-free authoring project is preserved in `tools/minds-explored-source.zip`.
Unzip it into a new local authoring directory. The original working copy is in
the publication run's `app/` directory beside the host checkout. Its pinned npm lockfile and application tests (59 from 10 November 2026) are retained there.
Build with `ATLAS_BASE_URL=https://evidencepress.org/minds-explored npm run build`.
Run `node tools/update-minds-explored.js /absolute/path/to/authoring-copy` to
import the output and regenerate the manifest. The importer preserves a
per-document CSP and omits nested hosting control files. Review, then use the
guarded host publication workflow. A hash match establishes file identity, not content truth.

Every atlas page opens with the slim Evidence Press bar (Research, Learn,
Practice, About). Its markup is the `EP_BAR` constant in the authoring copy's
`scripts/build.mjs` and must match `bar()` in the host's `tools/site-nav.js`;
`node tools/test-site-nav.js --built` fails if the host navigation changes and the
atlas is not rebuilt to match.

The permanent public edition includes 4,209 discoverable catalogued video records,
51 guides, 20 paths, 118 course/series records and a 4,398-item discovery index.
Only 1,608 videos have retained independent accessibility evidence. The private
API-enriched preview's 4,202 accessible-video count and 201 qualified-core count
do not describe this edition. All guide/path content and source links are retained;
Standard privacy-enhanced YouTube embeds are derived from the independently sourced video URLs, and load only after a viewer chooses them. An embed option does not claim verified access; permanent source links and institution-hosted players remain available.
Unknown access means no retained confirmation, not a finding of unavailability.

No API response fields, private caches, OAuth credentials, analytics, accounts,
video hosting, Workers, Functions, R2 or purchased domain are included.
The library is local to the browser and origin; a localhost library can be exported
and imported on Evidence Press. The existing storage schema/key is preserved.

Original guides and navigation annotations retain CC BY 4.0, application code MIT,
and linked third-party teaching retains its own rights. The host's CC0 statement
explicitly defers to page-specific licences.

Embedding reference checked 9 November 2026: https://developers.google.com/youtube/player_parameters and https://support.google.com/youtube/answer/171780. Standard iframe embedding does not require publishing a Data API response. The general-audience university teaching catalogue retains its privacy prompt, no autoplay, origin referrer, and source fallback.

## Shop and advertising links (10 November 2026)

The owner asked for a shop on 10 November 2026. `/minds-explored/shop/` and the
"Books on this topic" lists on the home, topic, guide, path, course and resource
pages are generated from `content/shop.json` in the authoring copy. Every Amazon link
carries the Associates tag `aphonicdrift-20`, sits under an "Ad" label, has
`rel="sponsored"` and is accompanied by the Associates statement; the app build and
`tests/shop.test.mjs` refuse an untagged link. No prices, Amazon images, click
recording or advertising cookies are used. Book ASINs were resolved by title and
author against Amazon search on 10 November 2026; one title uses a tagged search link.
Selections are editorial: no supplements, devices that claim cognitive benefit, or
self-diagnosis products. The earlier statement that the atlas has no paid
recommendation service was replaced on the privacy page by a disclosure of these links.
