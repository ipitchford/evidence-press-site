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
the publication run's `app/` directory beside the host checkout. Its pinned npm lockfile and 56 application tests are retained there.
Build with `ATLAS_BASE_URL=https://evidencepress.org/minds-explored npm run build`.
Run `node tools/update-minds-explored.js /absolute/path/to/authoring-copy` to
import the output and regenerate the manifest. The importer preserves a
per-document CSP and omits nested hosting control files. Review, then use the
guarded host publication workflow. A hash match establishes file identity, not content truth.

The permanent public edition includes 4,209 discoverable catalogued video records,
51 guides, 20 paths, 118 course/series records and a 4,398-item discovery index.
Only 1,608 videos have retained independent accessibility evidence. The private
API-enriched preview's 4,202 accessible-video count and 201 qualified-core count
do not describe this edition. All guide/path content and source links are retained;
YouTube-only playback opens at YouTube. Institution-hosted players remain available.
Unknown access means no retained confirmation, not a finding of unavailability.

No API response fields, private caches, OAuth credentials, analytics, accounts,
video hosting, Workers, Functions, R2 or purchased domain are included.
The library is local to the browser and origin; a localhost library can be exported
and imported on Evidence Press. The existing storage schema/key is preserved.

Original guides and navigation annotations retain CC BY 4.0, application code MIT,
and linked third-party teaching retains its own rights. The host's CC0 statement
explicitly defers to page-specific licences.
