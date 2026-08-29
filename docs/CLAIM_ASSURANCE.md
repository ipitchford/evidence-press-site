# Claim-level assurance pilot

Status: one backward-compatible static vertical slice, released for testing  
Pilot claim: `z(20)=6`  
Required cash cost: zero

## Purpose

The release catalogue describes research objects. This pilot adds a narrower
claim layer so an agent can identify one exact statement, see what is explicitly
not claimed, inspect each load-bearing obligation, select a bounded follow-up
task, and preserve a replay receipt without turning that receipt into a blanket
verification status.

The pilot does not alter the z(20) manuscript, DOI, release artefacts, candidate
status or existing assurance matrix. It does not claim independent reproduction,
end-to-end formal verification, human peer review or an audited novelty result.

## Static records

- `claims.json`: exact natural-language and LaTeX statement, content-derived
  claim identity, statement fingerprint, scope, non-claims, dependencies,
  artefact hashes and six proof obligations;
- `assurance-tasks.json`: bounded integrity, producer replay, specialist review,
  independent clean-room reproduction and formalisation tasks;
- `replay-profiles.json`: offline argv-based commands and resource ceilings;
- `assurance-receipts.json`: version- and artefact-bound outcomes with a
  mandatory independence disclosure;
- `assurance-events.jsonl`: append-only claim registration, task-publication and
  receipt-import events.

All have exact `/api/v1/` aliases. The individual claim is also available at
`/api/claims/z20-equals-6-main.json`, with its event stream at
`/api/claims/z20-equals-6-main/events.jsonl`.

## Obligation boundary

The pilot keeps these six obligations separate:

1. the Paley(17) lower bound;
2. the reduction to the two order-16 Ramsey cores;
3. construction of the exact CNFs;
4. the DRUP and LRAT refutation objects;
5. checker behavior, including the scope of the formally verified checking
   core;
6. the semantic bridge from the graph statement to the exact CNFs.

The imported 26 July receipt is explicitly producer-side and non-independent.
It reports replay behavior on one machine. It does not close the independent
reproduction, full semantic-formalisation, peer-review or novelty boundaries.

## Fail-closed rules

`node tools/test-claim-assurance.js` rejects:

- a task or receipt bound to the wrong claim or release version;
- an altered artefact hash;
- a missing independence disclosure;
- an unresolved task dependency;
- producer evidence represented as independent;
- a silently expanded statement under the old identity.

The build emits only validated source records. There is no hosted database,
remote execution surface, paid API, automatic status promotion or external
submission endpoint in this pilot.
