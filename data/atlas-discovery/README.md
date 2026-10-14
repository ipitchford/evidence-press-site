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
- `drafts/`: identity-free drafts written by `tools/atlas-discovery.js draft`.
  `drafts/intake/`: proposals produced from drafts by
  `tools/atlas-discovery.js intake --submitted-at <ISO UTC>`, validated with
  the live proposal validator. An intake proposal enters the live register
  only when a maintainer moves it into `data/atlas-proposals/` and publishes
  through the normal gate.

- `objects/<corpus-fingerprint>.json`: model-extracted named objects per
  release from `tools/atlas-objects.js extract`, with model, batch id and
  request hashes. Read by the generator's `symbolic-object` route only.
- `burden/`: blinded calibrated burden estimates from `tools/atlas-burden.js`.

Negative-control candidates are proposed by `tools/atlas-negatives.js`; the
freeze in `tools/atlas-benchmark.js` never calls it. Model-produced files
here are retrieval aids and evaluation statistics, not metadata, not
reviews and not relationships.

No file here can add an accepted Atlas relationship.
