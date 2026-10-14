# Evidence Atlas discovery pilot outputs

This folder holds repository-only artefacts of the bounded
relationship-discovery pilot described in `docs/ATLAS_DISCOVERY_PILOT.md`.
Nothing here is built into the public site.

- `BENCHMARK.json`: frozen corpus fingerprint, recorded direct pairs, the
  deterministic hidden half and maintainer-confirmed negative controls.
  Written only by `tools/atlas-benchmark.js freeze`.
- `NEGATIVE_CONTROLS.json`: the maintainer-confirmed negative-control list
  consumed by `freeze`.
- `runs/`: one run record per corpus state and mode. Candidates in a run
  record are retrieval results, not relationships.
- `drafts/`: draft proposals written by `tools/atlas-discovery.js draft`.
  A draft enters the live register only when moved into
  `data/atlas-proposals/` and published through the normal gate.

No file here can add an accepted Atlas relationship.
