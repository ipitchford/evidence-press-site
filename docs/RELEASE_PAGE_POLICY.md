# Reader-first release-page policy

**Effective:** 22 August 2026
**Machine contract:** [`data/PAGE_STRUCTURE_POLICY.json`](../data/PAGE_STRUCTURE_POLICY.json)

Evidence Press pages must help a reader understand the research before asking them to understand the publication machinery. The reference experience is the original six-release cohort, especially `z20-equals-6`: plain summary, specialist statement, technical account, audience guidance, significance, inspection route, next projects and package map.

The contract is functional rather than stylistically uniform. A theorem, computational certificate, negative result, policy-identification case and correction audit may use different headings and lengths, but each current record must answer the same core questions. The renderer owns the page title and generated evidence, source, citation and reuse panels; `body.md` must not duplicate them.

Operational names are retained in machine provenance when useful or necessary, but are not routine reader or narration boilerplate. Immutable historical scholarly creator and citation records are preserved and changed only additively.

Scholarly corrections and presentation maintenance are separate. Corrections affecting claims, formulae, evidence, assurance, attribution, citation, objections, retractions, supersession or safe reuse remain visible. Routine audio, video, art, cache and deployment events remain auditable in [`data/PRESENTATION_EVENTS.json`](../data/PRESENTATION_EVENTS.json) without occupying the reader correction panel.

Older releases are explicitly grandfathered. Their recorded evidence is not reconstructed, and missing later-schema fields are not inferred. The linter reports their reader-function gaps but fails current or upgraded records, structural defects, unnecessary personal attribution and routine maintenance presented as scholarly correction.

Run:

```sh
node tools/test-release-pages.js --report
node tools/build-audio-provenance-status.js --check
```

The second command verifies the current audio-status snapshot. Unknown legacy provider, model or voice values remain unknown; they are never inferred by listening.
