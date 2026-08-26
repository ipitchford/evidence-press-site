# Research-object discoverability

Evidence Press publishes exact mathematical objects and formal references in addition to reader-facing release prose. This layer is for discovery and citation; it does not raise any release's assurance status.

## Source fields

`papers/<slug>/meta.json` is authoritative. Do not edit generated HTML or API files.

### `mathObjects`

Add an object only when the exact expression and its scope can be transcribed from the release evidence without strengthening the claim.

Required fields:

- `id`: stable lower-case slug, unique inside the release;
- `kind`: `statement`, `identity`, `formula`, `bound`, `recurrence`, `generating-function`, `sequence`, `counterexample`, or `obstruction`;
- `label`: short reader-facing name;
- `plainText`: exact ASCII-searchable statement;
- `status`: `claimed-result`, `supporting-result`, `computed-finite`, `definition`, `conjecture`, `open-problem`, or `counterexample`;
- `scope`: precise assurance boundary.

Optional fields are `latex`, `sequenceTerms` (strings, so arbitrarily large integers remain exact), and `oeisId`.

The build publishes these records visibly on the release page and at:

- `/api/math-objects.json`;
- `/api/v1/math-objects.json`;
- `/api/schemas/math-object.schema.json`.

Inclusion means “this object is recorded by this versioned release,” not “Evidence Press independently verified it.”

### `relatedWorks`

Each reference must contain a complete human-readable `citation` and, where available, a canonical public `url`. Prefer `https://doi.org/<DOI>` for DOI-bearing works and `https://arxiv.org/abs/<identifier>` for arXiv-only works. Put evaluative commentary in release prose rather than inside a bibliographic citation when a clean citation is available.

The renderer produces an ordered **References** section and one Highwire `citation_reference` element per source. Canonical DOI and arXiv URLs also feed `/api/citations.json`. That file is a synchronization plan; it never asserts that Zenodo, DataCite, Google Scholar, or another provider has accepted or indexed a relationship.

## Zenodo reference synchronization

Build first, then inspect the public provider state:

```sh
node build.js
node tools/audit-reference-discoverability.js
node tools/sync-zenodo-references.js --plan <release-slug>
```

Authenticated application is intentionally limited to one named release:

```sh
ZENODO_ACCESS_TOKEN=... node tools/sync-zenodo-references.js --apply <release-slug>
```

The updater reads the token from the environment, removes it immediately, never prints it, opens the published record for metadata editing, appends only missing references and DOI `Cites` relations, verifies that unrelated metadata is unchanged, republishes, and performs a public readback. It attempts to discard the draft if verification fails.

Provider acceptance is recorded only after public readback. Never infer delivery or indexing from a successful local plan.

## OEIS gate

OEIS submissions remain human-gated. Before proposing a new entry or edit:

1. fetch the current entry and revision;
2. determine whether the sequence is new, an existing sequence needing a comment, or an existing conjecture needing a proof-status update;
3. publish a stable proof source with replay material and an immutable identifier;
4. verify offsets, indexing, definitions, formulas, recurrence ranges, and initial terms independently;
5. preserve unresolved conjectures as unresolved;
6. prepare the exact OEIS edit for the maintainer to understand, approve, and submit.

Do not bulk-submit or let an agent represent an unreviewed candidate as an accepted OEIS theorem.

## Google Scholar boundary

Evidence Press emits standard article and reference metadata, indexable HTML, stable canonical URLs, and direct PDF links. Indexing and citation-alert behavior remain decisions of external crawlers. A successful build or Zenodo update is not evidence of Google Scholar inclusion. Hosting each PDF in the same release directory remains a possible future compatibility improvement; external repository PDF URLs are currently retained.

## Validation

Run the ordinary release gates plus:

```sh
node tools/test-metadata.js
node tools/audit-reference-discoverability.js --json
```

The public provider audit is read-only and time-dependent. Keep its dated receipt when it is used as evidence for a synchronization decision.
