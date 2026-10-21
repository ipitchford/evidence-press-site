## Summary

This page explains, in order: the planning problem, what a "commitment radius" is, what the release proves and computes, where its guarantees stop, and how to check the recorded evidence.

**The planning problem.** A manufacturer or retailer deciding when to place production runs or orders usually plans several periods ahead from a demand forecast. Each run carries a fixed setup cost, so the classical Wagner–Whitin lot-sizing model chooses the setup periods that balance setup cost against the cost of holding stock. The difficulty is that forecasts are revised all the time, and a plan that is re-optimised after every revision can keep changing its near-term setups. One common response is a fixed calendar fence that freezes the first few periods, but that answers a scheduling convention, not a robustness question.

**The question.** Forecasts change after purchasing, production and supplier decisions have begun. This release asks how far demand forecasts may move before an optimal revised lot-sizing plan can stop sharing a protected prefix of setup decisions with the nominal plan.

Version 3.0.0 makes the modelling boundary explicit. Its basic mathematical object is a **forced-source path graph**, where every complete path begins at period 1. That object has an ordinary uncapacitated Wagner–Whitin interpretation only under the stated **classical active-horizon** conditions: the first-period demand floor is strictly positive, every later setup cost is strictly positive, reduced slopes are ordered, initial inventory is zero and backlogging is absent.

A retained negative control shows why the distinction matters. With setup costs $(100,1)$, reduced slopes $(1,0)$ and demand $(0,1)$, the forced-source graph costs 101 while the physical model can wait until period 2 and costs 1. Classical mode rejects that instance.

**What was found.** The release defines a distance, the *strong commitment radius*: how far the forecast must move before an optimal plan may abandon the protected near-term setups. Within the declared domain, the candidate supplies exact fixed-path tie distances, an exact-rational frozen-comparator lower certificate, certified brackets, a prefix-to-arc decomposition and a single-detour optimal-face theorem. The software reports exact values, certified intervals, guarded refusals and solver-only outcomes separately.

> **Status: Anonymous · unrefereed theoretical-computational candidate.** Producer replay, CI, finite audits and internal editorial review pass. Independent reproduction, proof-assistant verification, external specialist review, journal peer review, exhaustive priority and field validation have not occurred.

## Summary for specialists

The strong prefix-stability radius (Definition 1.1) is the weighted, floor-truncated $L_\infty$ distance from a nominal demand forecast to the nearest revision at which some optimal replenishment path can leave a protected setup prefix. Under ordered reduced slopes every path cost is affine in demand, with reduced arc costs $K_i + q_i(D_j-D_i)$ (Proposition 2.1).

| Result in the manuscript | Content |
|---|---|
| Theorem 2.2 (classical active-horizon bridge) | Under the stated conditions, a cost-preserving bijection between optimal physical setup patterns and optimal forced-source graph paths |
| Theorems 4.1–4.2 (common optimal prefix, positive-radius criterion) | The longest prefix common to every nominal optimum determines whether the radius is positive |
| Theorem 5.1 (floor-aware fixed-path tie radius) | Exact distance to a cost tie with any fixed competing path |
| Theorems 7.1–7.2 and 8.1 | Polynomial exact-rational frozen-comparator lower certificate, exact for a complete path, and a polynomial lower–upper bracket with exact closure conditions |
| Theorem 11.6 and Corollary 11.8 | Single-detour optimal-face witness; prefix-to-arc radius decomposition |
| Theorem 11.1 and Corollary 11.2 | The released escalation is worst-case exponential; the complexity of the decision problem remains open |
| Theorem 12.1 and Corollary 12.2 | One-step marginal split-conformal revision tube under exchangeability |
| Theorem 13.3 (certified dead-zone bound) | Deterministic rolling structural-loss bound under quantity recourse |

Let a protected nominal setup prefix contain $k$ arcs. The strong commitment radius is the nearest admissible demand revision at which some optimal path can leave that prefix. Version 3.0.0 proves that this radius decomposes as the minimum of at most $k$ one-protected-arc suffix radii.

At every finite nearest loss, the optimal face contains a retaining path and a leaving path that are adjacent and differ on one divergence–remergence interval. This **single-detour witness** turns a global-looking loss of prefix optimality into a local exact boundary object. The family of possible detours can still be exponential, so the theorem does not settle computational complexity.

For the familiar positive-demand three-period example,

$$
\rho_{\mathrm{frozen}}=\frac{3}{2},
\qquad
\rho_{\mathrm{strong}}=2.
$$

The polynomial frozen certificate is therefore safe but can be conservative for a partial prefix.

## Technical account

**Why the problem becomes geometric.** Because each path's cost is affine in demand, the admissible forecasts at which a fixed outside path costs no more than a fixed comparator form a half-space cut by the demand floors, and its weighted $L_\infty$ distance has an exact formula (Theorem 5.1). Freezing the nominal path as the comparator gives the polynomial lower certificate; the strong radius instead compares the best leaving path with the best retaining path, which is why the two can differ for a partial prefix.

**What "certified" means here.** For a fixed competing path, the candidate derives the exact weighted-$L_\infty$ distance to a cost tie while respecting coordinate demand floors. For a protected prefix, a prefix-deviation directed acyclic graph represents the paths that leave it. The frozen-comparator calculation supplies an exact lower bound; a feasible outside path supplies an upper witness. Coincident bounds close the exact radius.

The interface deliberately preserves unresolved states:

- `exact_certified` means the lower and upper evidence close to one exact rational value;
- `certified_interval` means the exact radius lies inside a valid interval but is not closed;
- `enumeration_completed_with_certified_interval` means all candidates were processed but at least one disjunct remained unresolved;
- `refused_by_candidate_guard` means a declared finite cap stopped enumeration and no safety conclusion follows;
- `solver_level_only` means a numerical optimization result lacks the exact evidence needed for certification;
- proven infinity requires either no outside path or a closing exact residual-gap argument.

## How to inspect or reproduce the recorded checks

Use the immutable [v3.0.0 GitHub candidate release](https://github.com/ipitchford/certified-commitment-horizons/releases/tag/v3.0.0-candidate) or [Zenodo version DOI](https://doi.org/10.5281/zenodo.22086554). The sealed archive SHA-256 is `4d09e03fc3146018e6c11d3dce8ac9e3cb74bcc07bf4564583207a7c01784744`.

From a fresh extraction, the quick deterministic replay is:

```bash
bash run_all.sh --quick
```

The release verifier and independent record check are:

```bash
PYTHONPATH=src python scripts/verify_release.py --run-tests
python scripts/check_certificate.py \
  examples/sample_decision.json \
  examples/strict_gap_instance.json
```

The strict-gap example in `examples/` is in classical active-horizon mode and returns a frozen lower certificate of exactly `3/2`, an exact strong radius of exactly `2/1` and the one-based nominal path `[1, 2, 4]`. Certified quantities are recorded as exact rational strings; floating-point values never decide a certified classification.

## Evidence, assurance and limitations

The public evidence ledger records:

| Gate | Denominator | Producer-side result |
|---|---:|---|
| Semantic bridge | 320 exact active-horizon instances | 320 graph/physical optimum and optimal-pattern-set matches; negative control retained |
| Frozen certificate and bracket | 512 rows | 411 exact closures; 101 certified intervals |
| Exact certification | 330 brute-force comparisons | 330 frozen matches; 305 exact strong radii; 25 certified intervals |
| Optimal-face witness | 315 prefix cases | 254/254 finite boundaries yielded a single-detour witness; 61 cases were proven infinite |
| Compact-model comparison | 627 stratified rows | 305 exact matches, 247 exact decomposition equalities, 55 platform-sensitive rows, 20 unresolved pairs, zero warranted disagreements |
| Test suite | 94 deterministic tests | pass normally and with assertions disabled |

Python 3.11 and 3.13 [GitHub Actions](https://github.com/ipitchford/certified-commitment-horizons/actions/runs/32773103076) passed. GitHub and Zenodo expose byte-identical copies of the archive, paper, verification receipt and checksum ledger. Finite replay can refute implementation defects; it does not machine-prove the universal theorems.

### Statistical and operational boundary

The statistical layer provides one-step marginal split-conformal coverage under exchangeability. It does not provide conditional, adaptive, rolling or time-uniform coverage. A Bonferroni construction gives a finite-family marginal statement under the paper’s assumptions.

The deterministic rolling bound concerns structural loss when quantities may adjust inside retained replenishment cycles. A certified radius protects setup epochs and cycle boundaries, not fixed order quantities. Capacity, service constraints, backlogging, multi-item coupling and behavioural implementation effects are outside the release.

The UCI exercise uses real observed demand but reconstructed forecast vintages and stylised costs. It demonstrates an interface; it does not estimate savings, service improvements, causal effects or field validity.

### What the result does not establish

- It does not prove the sufficient classical active-horizon bridge conditions are necessary.
- It does not give an exact polynomial-time algorithm, an NP-hardness result or another complexity classification for the one-protected-arc core.
- It does not turn exact arithmetic, a separate producer checker, finite audit agreement, CI or internal review into independent reproduction or formal verification.
- It does not establish exhaustive novelty or priority. The Richter–Vörös conclusion is a source-specific, hash-bound producer reading inside a targeted literature audit.
- It does not validate the rule in an operating supply chain or establish economic benefit.
- It does not extend to capacitated, multi-item, backlogging, fixed-quantity or service-constrained planning without new analysis.

## Why the problem matters

Planning nervousness — near-term setups changing after forecast revisions — matters because purchasing, production and supplier decisions may already have begun. A fixed frozen fence treats every instance alike. The commitment radius instead asks an instance-specific question: how far must the current forecast move before an optimal schedule may change any protected setup epoch or replenishment-cycle boundary? Answering it exactly, with explicit refusals when the answer is not closed, gives planners and researchers a defensible way to separate near-term structure from exploratory forecast movement, within the uncapacitated single-item model the release covers.

## Who should care, and why

| Audience | Potential use | Highest-value caution or check |
|---|---|---|
| Operations-research specialists | Audit a new inverse-stability object and its exact structural theorems. | Reconstruct the forced-source to active-horizon semantic bridge independently. |
| Production-planning researchers | Study a certificate separating defensible near-term structure from exploratory forecast movement. | Test genuine forecast vintages, costs and constraints before operational use. |
| Exact-computation researchers | Reuse rational witnesses, floor handling, bracket states and local optimal-face objects. | Build a genuinely separate implementation rather than importing the released package. |
| Statistical researchers | Examine the one-step calibration layer and negative controls. | Preserve exchangeability and marginal-coverage qualifications. |
| AI research agents and reviewers | Consume claims, provenance, assurance states, hashes and open gates. | Do not translate replay or public availability into theorem authority or impact. |

## The most valuable next projects

1. Obtain an unaffiliated clean-environment rerun tied to the exact archive hash.
2. Commission an operations-research specialist review of the semantic bridge and setup-cycle interpretation.
3. Reimplement the fixed-path radius, deviation graph, frozen certificate and single-detour audit in a separate codebase.
4. Classify the exact complexity of the demand-induced one-protected-arc problem.
5. Formalize the bridge, graph reduction, tie theorem, decomposition and certificate logic in a proof assistant.
6. Broaden the literature and priority audit with independent attestation.
7. Run a preregistered prospective study with genuine forecast vintages, actual constraints and a predeclared operational comparator.

## Version and correction history

Version 3.0.0 supersedes the v2.1.2 research package and active Evidence Press briefing. It repairs the leading-zero-demand semantic counterexample, introduces explicit graph-only and classical modes, corrects an invalid test of monotonicity across independently found unresolved upper witnesses, replaces ambiguous completion labels, adds the prefix decomposition and single-detour theorem, stratifies the compact-model corpus, strengthens the literature boundary, and rebuilds the package under Anonymous scholarly attribution with an explicit CC0/MIT/third-party rights map.

Earlier immutable DOI and Git tags remain part of the concept history; this page points to version DOI [10.5281/zenodo.22086554](https://doi.org/10.5281/zenodo.22086554).

## What is in the public package

The sealed archive contains the 40-page manuscript and LaTeX source; exact-rational Python package and version-matched wheel; accessible documentation; examples and decision records; 94 tests; semantic, certificate, equivalence, calibration, rolling and benchmark audit programs and results; source-data provenance; exact claim, operating-model, literature, rights and assurance records; a separately implemented producer-side record checker; fresh-extraction and PDF-quality evidence; internal editorial role reports and confirmation; and the final SHA-256 manifest and verification receipt.

Original research prose, metadata and result tables are dedicated under CC0 1.0. Original code is MIT. The included UCI data retain CC BY 4.0. Third-party literature PDFs used during review are not redistributed. The page art, Open Graph card, transcript, audio and thumbnail are communication aids, not additional research evidence.
