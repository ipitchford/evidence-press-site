# Executable Atlas research routes

The workbench at `/atlas/#atlas-research` is an executable route tool, not an
extra catalogue of speculative projects. It presently has **one bounded
operator**: a maximal-matching endpoint-transversal search, with a graph-only
witness check. It can run on a user's own finite simple graph, not just the
included example. Inputs stay in the browser. Runs use a cancellable worker.

## What it does

1. Recompute graph and matching properties from edges, ignoring stored claims.
2. Match exact, typed hypotheses against source-linked lemma cards. Missing
   hypotheses remain visible. Numeric strings cannot satisfy numeric bounds.
3. Compose eligible cards until no new conditional obligation is discharged.
4. Execute the available reduction/search, then verify the result in the
   original mathematical representation.
5. Chain checked outputs into the next comparison, retaining scope and source.
6. Download the session's attempts (including negative/budget-limited runs)
   for continuation. There is no automatic promotion into the accepted graph.

The shared Node/browser engine is `assets/js/atlas-route-core.js`; the curated
cards are `data/ATLAS_RESEARCH_ROUTES.json`. Retrieval is keyword/condition
matching over those cards, **not** semantic search of the whole literature.
The nine process patterns and their implemented/unsupported status are explicit
in that file. Open-ended serial research, arbitrary-paper lemma extraction,
scale recursion and automatic formal proof are not implemented.

## Reproduce the real pilot

```sh
node tools/run-atlas-research-pilot.js /tmp/NEW-atlas-pilot.json
python3 -B tools/check-atlas-witness.py /tmp/NEW-atlas-pilot.json
python3 -O -B tools/check-atlas-witness.py /tmp/NEW-atlas-pilot.json
node tools/test-atlas-research.js
python3 -B tools/test-atlas-witness.py
python3 -O -B tools/test-atlas-witness.py
```

The evaluation intake was recorded before search in `data/atlas-research/intake.json`.
The actual execution receipt is `data/atlas-research/pilot-result.json`. This
software pilot is not counted as a new research publication or a fully measured
research campaign: no prospective effort forecast or complete effort telemetry
was recorded, and none has been reconstructed after the result. It asks whether the canonical 48-vertex
independent-domination example can be extended to an ordinary-domination
counterexample. Prior art already covers the general order-48 inequality:
Gupta, arXiv:2608.22498v1, Proposition 7. We deliberately stop duplicate theorem
discovery and perform the useful residual task: construct an actual witness.

The external bridge is Gupta's Definition 2 and Proposition 6. One Boolean
variable selects one endpoint per matching edge. Unmatched vertices impose
clauses; vertices adjacent to both endpoints of an edge yield tautologies.
Because the matching is maximal, unmatched vertices have no edges between them.
All matched vertices are dominated by the selected endpoint of their own edge.
Thus satisfying assignments are exactly dominating transversals of this
matching. This equivalence is elementary and does not require cubic regularity.

For the tagged 48-vertex graph the program finds **317** satisfying assignments
among **32,768**, and reconstructs

`{0,2,4,7,8,10,13,14,16,18,21,22,24,26,28}`.

The separate Python checker verifies directly from edges that this set dominates
all 48 vertices. It is **not independent**. The graph has 72 edges and maximum
degree 3, so any maximal matching has at least `ceil(72/5)=15` edges; the supplied
15-edge matching is checked and is minimum. Therefore this exact graph satisfies
`gamma <= 15 = gamma_e`, despite its release's independently different claim
`i=16`. We do not recompute that release's independent-domination lower bound.
We also do not claim the exact ordinary domination number.

This produces a reusable witness and stops an invalid strengthening route. It
is not a new general theorem or an originality claim. The reduction changes
the candidate space from `binomial(48,15)=1093260079344` unrestricted subsets
to 32768 assignments. This is **not** a measured speedup against an optimized
solver, an unassisted researcher or a blinded baseline. Development, literature
retrieval and verification effort are not included in solver timings.

## Tests that prevent a misleading success

- Remove the graph-to-SAT bridge: the executable route becomes unavailable.
- Supply `i >= 16`: no ordinary-domination lower bound is derived.
- Exhaust the assignment budget: report inconclusive, not UNSAT.
- Change the graph, corrupt the witness or supply a nonmaximal matching: reject.
- Check every graph/matching pair through five vertices (4,637 cases) by direct
  domination versus the SAT reduction.
- The separate 50-vertex graph defined in Afrasyab arXiv:2609.10783v1 Section 2
  has no transversal for its supplied matching. This is a restricted-route
  control, not a replay of its ordinary-domination lower-bound proof.
- A synthetic 10-vertex graph has no transversal of the supplied matching but
  does have a 3-vertex ordinary dominating set. This catches precisely the
  dangerous “no transversal implies no dominating set” mistake.
- Python independently enumerates vertex selections directly, without clauses,
  and reproduces counts 317 and 0 under normal and optimized modes. This is
  implementation-diverse **internal checking**, not unaffiliated reproduction.

The 317 count became a regression expectation **after** the first execution;
the prospective criterion was a verified witness, not that particular count.
All scientific assurance remains scoped; no accepted relationships were added.

## Use a different graph

Provide JSON with `order`, `edges`, and `maximal_matching`; vertices are numbered
from zero. Up to 256 vertices and 20 matching edges are permitted. Inspect before
running. The browser has no network solver and never executes input as code.

```sh
node tools/atlas-research.js inspect graph.json
node tools/atlas-research.js run graph.json --budget 32768 --out /tmp/NEW-run.json
python3 -B tools/check-atlas-witness.py /tmp/NEW-run.json
```

The checker also accepts a downloaded browser session and checks its last
witness-bearing run. Each record carries its own input; never transfer a
witness to another graph merely because the title or vertex count matches.

## Extend without making a documentation treadmill

Add a lemma card only when its exact hypotheses, conclusion, source location and
failure boundary are clear. Add an operator only with a concrete unresolved
task, a source-to-encoding argument, a cheap decisive test, negative controls and
a way to validate its output in the original representation. The planner's
Boolean outputs are **conditional routing facts**, not proof-assistant theorems.
Unknown conditions remain unknown; no rule reverses an implication by default.

The next useful extension should be chosen from an actual research obstruction,
not from a requirement to fill every method category. Preserve failed attempts
and source versions. Prior-art checking precedes every new substantive target.
