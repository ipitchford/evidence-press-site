# Local prospective Atlas evaluation

The dependency-free `tools/atlas-campaign.js` records a small, prospective matched campaign locally. It does not execute tasks, call models, access the network, assign quality stars, establish causation, or update the operational ledger. `data/WORK_LEDGER.json` remains the canonical operational attempt record. Link its `attemptId` where one exists; this recorder supplements it with evaluation-specific intake and receipts, not a competing truth record.

## Small matched design

Before any outcomes, select two genuinely unanswered tasks from a dated intake source. Keep the task question, selection rule, evidence that its answer was previously unknown to the operator, and any exclusions. Register both tasks in both arms. Use separate contexts, the same model, ordered tool list, token cap and elapsed-time cap. Baseline gets the agreed source materials without the Atlas packet; Atlas gets those same materials plus the frozen packet. Counterbalance execution order across the two tasks and state the allocation in `measurementPlan`. Record contamination or deviations rather than silently excluding attempts. Two tasks are a feasibility pilot, not a causal productivity estimate; correlated tasks, unblinded operators and carryover limit interpretation.

Task `sourceDate` is a historical source date, not a recorder timestamp. `previouslyUnknownEvidence` is a required operator declaration with a reference to the dated intake evidence: the tool cannot determine whether somebody already knew an answer. Registering a declaration does not certify genuine prospectivity. Do not import seeded historical examples as new prospective results. Synthetic regression tests and the retrospective discovery pilot are separate evidence classes.

## Executable intake

Prepare an external JSON spec with this shape (replace every example identity and task with actual local inputs). SHA256 values bind raw file bytes, not a reserialized JSON representation. Both packet and index are required. Their embedded `packetSha256` and `indexSha256` have a different, canonical-content meaning; retain them in the input artifacts rather than confusing them with these byte hashes.

```json
{
  "question": "Does the frozen packet help on these two new tasks?",
  "indexIdentity": {"path": "/absolute/local/index.json", "sha256": "REPLACE_WITH_64_HEX_RAW_FILE_SHA256"},
  "packetIdentity": {"path": "/absolute/local/packet.json", "sha256": "REPLACE_WITH_64_HEX_RAW_FILE_SHA256"},
  "conditions": ["Both arms receive the same source materials; only Atlas receives the packet"],
  "arms": [
    {"id": "baseline", "model": "EXACT_MODEL", "tools": ["local-reader"], "budget": {"maxTokens": 2000, "maxSeconds": 300}},
    {"id": "atlas", "model": "EXACT_MODEL", "tools": ["local-reader"], "budget": {"maxTokens": 2000, "maxSeconds": 300}}
  ],
  "tasks": [
    {"id": "t1", "question": "REPLACE with first new task", "source": "REPLACE with intake reference", "sourceDate": "2026-10-15", "previouslyUnknownEvidence": "REPLACE with dated evidence reference"},
    {"id": "t2", "question": "REPLACE with second new task", "source": "REPLACE with intake reference", "sourceDate": "2026-10-15", "previouslyUnknownEvidence": "REPLACE with dated evidence reference"}
  ],
  "measurementPlan": "t1 baseline then Atlas; t2 Atlas then baseline, isolated contexts. Record all four pairs. Assess retrieval, utility, scientific outcome separately against predeclared evidence criteria; unknown telemetry stays null.",
  "declaration": "registered-before-outcomes"
}
```

With the real spec saved outside the repository, these commands perform intake and readback only:

```sh
node tools/atlas-campaign.js begin /absolute/local/new-campaign /absolute/local/spec.json
node tools/atlas-campaign.js report /absolute/local/new-campaign
```

The campaign directory must not already exist; its parent must exist. In this checkout it must be outside the repository. The CLI recognizes that boundary only when `AGENTS.md`, `data/OPERATING_MODEL.json`, and the matching `tools/atlas-campaign.js` path are present. A standalone downloaded copy instead protects only its own directory, not the directory's parent: for example a script in `Downloads` allows a sibling campaign folder in the home directory, but not a campaign inside `Downloads`. Symlinks are resolved when checking these boundaries. Retain the returned manifest hash and each subsequent head hash externally (for example in the operational attempt evidence). Nothing here is a completed experiment.

## Outcome receipts and corrections

Save an outcome JSON outside the repository, with `taskId`, `armId`, `status`, nonempty `reason`, `evidence` (array of absolute-path/raw-SHA256 identities), `dimensions`, and `metrics`. Status is exactly one of `success`, `null`, `failed`, `stopped`, `duplicate`, `budget-exhausted`. A duplicate needs an explanatory reason identifying the original; it remains in the denominator.

`dimensions` has exactly `retrieval`, `researchUtility`, `scientificOutcome`. Each is `{ "value": null, "reason": "not assessed" }` or an evidence-backed boolean. Retrieval means useful material found; research utility means documented assistance to the task; scientific outcome means a separately evidenced substantive result. None implies either of the others. A positive dimension requires evidence, but the tool does not judge that evidence. Overall `success` is an operator status, not automatic scientific success.

`metrics` has exactly `elapsedSeconds`, `humanEffortSeconds`, `tokens`, each `{ "value": null, "reason": "not instrumented" }` unless actually measured. Numeric zero is an observed zero, never missingness. Numeric measurements require evidence. Do not derive human effort from recorder timestamps or guess unknown historical telemetry. This CLI records receipt time only, not task start or duration; budgets are registered caps, not enforced execution limits.

```sh
node tools/atlas-campaign.js record /absolute/local/new-campaign /absolute/local/outcome.json PREVIOUS_HEAD_SHA256
node tools/atlas-campaign.js report /absolute/local/new-campaign LATEST_HEAD_SHA256
```

Every record requires the current head (optimistic concurrency control). Replacing an existing task/arm result requires `supersedes` equal to that pair's latest event hash and a reason explaining the correction. The old event remains. The new event also links to the overall previous head. Reports contain all registered task/arm pairs, missing and stopped counts, separate dimension counts, latest outcomes, and complete revision history. Revisions do not increase the attempt denominator. Automatic timestamps cannot be supplied or backdated through the CLI.

## Integrity and limits

Files are created exclusively and concurrent writers fail closed through an exclusive lock; stale locks require inspection, never automatic theft. Do not hand-edit receipt files. A crash during writing may leave a partial receipt and/or lock: preserve the directory for diagnosis; there is no automatic repair. Hash checks detect accidental/tampered contents and internal gaps. External head anchoring detects tail deletion; an entirely rewritten directory cannot be authenticated without trusted external hashes. Local OS clock integrity, declared task novelty, model equality, and substantive truth of evidence are not independently attested. Evidence bytes are checked at intake/append; reports preserve references without claiming those external files still exist or still match.

No averaging unknown metrics into zeros; no pooled causal effect, statistical significance, REF score, or institutional endorsement. Keep retrieval, research utility and scientific outcome evidence separate when reporting beyond this CLI.

```sh
node tools/test-atlas-campaign.js
```

These tests generate isolated synthetic temporary fixtures and delete only their own temporary test directory. They are software regression checks, not pilot outcomes.
