# Source-backed Atlas memory cases

This is a retrospective extraction of reusable facts, failure boundaries and
checking moves from public repository sources. It is not a reconstructed research
diary. The `reviewedAt` timestamps record this extraction review, not theorem
discovery, independent expert review or the chronology of a prior research run.
No claim is made that Atlas caused these results, saved time, improved correctness
or outperformed another workflow.

The twelve cards live in [ATLAS_MEMORY.json](https://github.com/ipitchford/evidence-press-site/blob/main/data/ATLAS_MEMORY.json). Each names
a release, a repository-relative public source, an exact text locator, Boolean
applicability conditions, concrete checks and stop conditions. A condition omitted
by a caller is **unknown**, not false. Declaring a condition true is a routing
input, not proof that it holds. Actions are instructions for a subsequent checked
step, not claims that the memory engine executes a general theorem prover or
solver. The indexing engine binds source bytes separately; this authored file
does not invent hashes or release versions.

## Sources and selection

The following selected source texts were read in full for this extraction:

- [Finite-signal quadratic substitutes](https://github.com/ipitchford/evidence-press-site/blob/main/papers/finite-signal-quadratic-substitutes/body.md): completion criterion, support specialization, sparse and vector boundaries, and certification caveats.
- [Atlas research workbench](https://github.com/ipitchford/evidence-press-site/blob/main/docs/ATLAS_RESEARCH_WORKBENCH.md): actual graph pilot, graph-to-SAT semantic bridge, search boundaries and negative controls.
- [Order-48 successor](https://github.com/ipitchford/evidence-press-site/blob/main/papers/txgraffiti-order48-successor/body.md): independent domination, matching number, finite certificate and unproved global minimality.
- [Unique answer, not identified](https://github.com/ipitchford/evidence-press-site/blob/main/papers/unique-answer-not-identified/body.md): target invariance, selector provenance and the attributed single-condition reaction-network example.
- [Pure-tensor analytic-rank counterexample](https://github.com/ipitchford/evidence-press-site/blob/main/papers/pure-tensor-analytic-rank-counterexample/body.md): exact comparator conventions, all-power argument and unresolved branches.

These are public source accounts, not a fresh audit of every linked manuscript,
external reference, proof object or empirical study. The cards preserve their
assurance ceilings. Before applying a mathematical result to a new object, read
the full version-pinned proof, verify its hypotheses and check external prior art.
The selected cases illustrate distinct usable checks; they are not a representative
sample of research attempts or a novelty survey.

## Finite signals: five cards with different jobs

| Card | Why retain it | Decisive boundary |
|---|---|---|
| `finite-scalar-knot-completion` | Replaces an unlimited disclosure quantifier with simultaneous finite row-loss systems. | Scalar quadratic target, finite signals, positive prior and source-only randomized disclosure; one orientation at a time. |
| `finite-full-support-collapse` | Identifies when those systems simplify to the directed-pair coefficient. | Full rectangular support; equal-mean cases must be handled before division. |
| `finite-sparse-joint-obstruction` | Provides a concrete negative control against pairwise sufficiency outside full support, plus a positive case on the same support. | Exact displayed family and parameters; sparse support itself is not failure. |
| `finite-vector-pairwise-boundary` | Prevents transferring scalar pairwise sufficiency merely because all cells are positive. | A vector example defeats that extension, not every possible vector criterion. |
| `finite-exact-certificate-triage` | Separates real convex characterization, exact acceptance/rejection evidence and numerical heuristics. | Floating-point boundary feasibility and plug-in estimated tables are not exact certificates. |

The key comparison is not “finite versus infinite support.” Both the scalar and
vector examples have finite signal alphabets. **Structural zeros** distinguish
sparse from full rectangular support; **target dimension** distinguishes scalar
from vector value. The scalar completion theorem permits zeros. Its explicit
directed-pair specialization needs full support. The vector counterexample shows
that full support alone does not justify transferring that specialization.

The sparse family's coefficient is `4a²/(a+b)²`: `(a,b)=(1/2,1)` gives `4/9`,
whereas `(1,1/2)` gives `16/9` and a uniform no-disclosure gap of `-1/24`.
The latter's binary restrictions pass in the tested orientation. These numbers
belong to this family; the cards demand reconstruction before reuse.

The shared `conditions` are intentionally explicit rather than hidden in a broad
“information theory” label. `displayedSparseFamily` and `canonicalGraph48` below
mean exact object identity, not resemblance by name or size. A source-provided
predicate still needs verification in a new session.

## Graph pilot: preserve the failed strengthening, not a false impossibility

`graph-matching-sat-bridge` retains the semantic reason for the Boolean encoding.
One endpoint is selected from each matching edge. Maximality ensures no edges
between unmatched vertices, while matched vertices are dominated by their chosen
edge endpoint. Clause satisfaction is equivalent to domination **within this
transversal search space**. A checked output must still be reconstructed and
tested on the original graph.

`graph48-witness-stops-strengthening` records the actual workbench result. Its
15-vertex dominating witness blocks the proposed ordinary-domination
strengthening on the canonical graph. It does not erase the distinct
independent-domination result `i=16`, determine the exact ordinary domination
number, or establish a new general graph theorem. The 317 satisfying assignments
were a post-execution regression expectation; the recorded prospective target was
a verified witness. Source attribution preserves that chronology without making
this retrospective card a contemporaneous receipt.

`graph-budget-versus-restricted-unsat` keeps three outcomes separate:

| Outcome | Permitted conclusion | Not permitted |
|---|---|---|
| Budget exhausted or run cancelled | Search is inconclusive at the recorded coverage. | “UNSAT” or “no witness exists.” |
| Entire supplied-matching transversal space excluded | No dominating transversal for that matching. | No ordinary dominating set of the requested size anywhere in the graph. |
| Original-graph witness verified | This particular set dominates this particular graph. | Independent domination, exact optimality or transfer to another graph without checking. |

The workbench's ten-vertex negative control has no transversal of its supplied
matching but does have a three-vertex ordinary dominating set. This is a direct
counterexample to reversing the restricted implication. The separate 50-vertex
route control is likewise not a replay of a global domination lower bound.
Neither reduced candidate counts nor internal implementation diversity supplies
a measured Atlas speedup or unaffiliated reproduction.

## Identification: separate a selected answer from an identified target

`identification-target-invariance` stores the exact logical obstruction: equal
observable laws with different target values defeat observation-only target
identification under that regime. It is useful before increasing estimation
precision or interpreting a unique optimizer. It also requires checking the
target itself: nonidentification of the full parameter does not prove that every
functional or robust decision is unidentified. This is a classical principle,
not a novelty claim for the release or the memory.

`identification-second-condition` makes the obstruction actionable through the
public body's attributed reaction-network example. Equal internal-state path
laws at one environmental condition can coexist with different stationary
responses to a change. A discriminating second condition must retain the stated
cross-condition parameter restrictions; allowing separate refits changes the
test. A redundant new measurement is a useful negative control. The source
summary is enough to route this check, not to substitute for the benchmark's full
algebra or establish identification from finite noisy observations.

## Tensor normalization: a distinct archived source-interpretation case

`tensor-literal-normalization-obstruction` retains a small exact stress test with
an all-power proof. Under the stated base-2 and fixed-order conventions, pure
tensor rank stays at `a=log₂(4/3)` while the literal scalar comparator `(2ac)^m`
decays because `2a<1`. This diagnoses the literal comparator, not the entire
historical problem or the partition-rank branch.

`tensor-powered-identity-diagnostic` records the contrasting diagonal ratio
`(k/n)^m` when the comparator is the powered identity tensor. It is useful because
a normalization change alters the proposition, not merely its presentation.
The diagonal identity does not prove a general normalized tensorization theorem.
The source also retains a stopped partition-rank route with a missing asymptotic
ingredient. A missing proof ingredient, like a search budget limit, is not itself
an impossibility theorem.

## What this memory does not establish

These cards do not independently prove their source theorems, certify semantic
adequacy of an empirical model, resolve historical priority, or upgrade internal
checks to external review. Related-card links indicate useful comparisons, not
logical implication, shared authorship or independent corroboration. A future
test of whether such memory improves research needs prospectively recorded
attempts, failed routes, matched scope and assurance, effort measurements and a
credible comparator. This retrospective case collection supplies none of those
causal measurements.
