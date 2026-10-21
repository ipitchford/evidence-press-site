## Summary

How many classical symbols are needed to imitate a mathematical state space exactly? This candidate answers that question for the six-dimensional cross-polytope: **three symbols suffice, and two do not**. The simulation has free shared randomness. Three symbols mean a three-state alphabet—a trit—not three bits.

The statement concerns all input–output probabilities allowed by the full affine measurement model, not just one successful communication task. Combined with earlier results, it makes dimensions three through six precisely the cross-polytopes with signaling dimension three.

**Why it was open.** Earlier work computed the values through dimension five and left dimension six at three or four. This release supplies the missing upper bound, with exact, inspectable evidence; the value at dimension seven remains between four and five.

**Status.** An anonymous, unrefereed computer-assisted candidate. The checks are producer-coordinated, not unaffiliated reproduction, proof-assistant formalization or human peer review.

## Summary for specialists

For $\diamond_d=\{v\in\mathbb R^d:\sum_i|v_i|\le1\}$, the candidate establishes $\operatorname{sign.dim}(\diamond_6)=3$. The lower bound is imported from Bencze–Frenkel; the new upper bound is an exact finite, computer-assisted proof.

Primitive measurements have affinely independent cube-vertex supports with at most seven points. Supports of size at most five use the published small-facet construction. Exhaustive classification of 133,130 rooted binary-matrix representatives leaves 217 valid records: 39 with six outcomes and 178 with seven. These represent 49 full cube-symmetry classes, not 217 geometrically distinct measurements. The 130 difficult rooted records represent 28 full classes.

## Technical account

A cube vertex $x$ defines the effect $e_x(v)=(1+x\cdot v)/2$. Measurement weights satisfy $\sum_x f(x)=2$ and $\sum_x f(x)x=0$. Choosing a support point as origin converts the remaining vertices to binary columns, with a positive solution of $Bw=\mathbf1$. The basepoint weight is $2-\sum_jw_j>0$. This is a restricted minimal balanced collection, an established object in cooperative game theory.

Bencze–Frenkel's criterion asks for one probability distribution $F$ over output subsets of size at most three. For every subset $S$ lying in a coordinate facet, its weight must not exceed the probability that the random subset intersects $S$.

Crucially, **the same $F$ works for every input**. The shared random choice selects a set of at most three outputs; the input determines how probability is allocated among them. An input-dependent choice of $F$ would not prove this result.

For a six-outcome example with weights $1/3$, a saved certificate selects each of $\{1,2,3\}$, $\{0,3,4\}$ and $\{0,2,5\}$ with probability $1/3$. The package checks every required inequality for its particular support geometry. This example is not a universal recipe for arbitrary six-outcome measurements.

Two distinct checks address coverage and feasibility. The orbit audit accounts for all normalized supports; rational reclassification and certificate checking verify every retained measurement. The small-facet construction, finite criterion and general enumeration strategy are prior work, not new algorithms introduced here.

## Evidence, assurance and limitations

Fresh internal publication checks reclassified all 133,130 supplied representatives, verified 12,091 facet-subset inequalities, and reconstructed 2,604 exact input-column simulations with the common distribution fixed. Normal and optimized Python runs agreed; eight deliberately corrupted inputs were rejected. A separate orbit audit established complete coverage, and optional graph regeneration reproduced the supplied files byte-for-byte. These are producer-coordinated checks, not unaffiliated reproduction, proof-assistant formalization or human peer review.

The result does not improve the general bounds in higher dimensions. No uniform structural explanation of the 28 difficult geometric classes was obtained. The external minimal-balanced-collection catalogue was not downloaded or compared; its availability on request is not evidence of a completed cross-check.

## Relationship to earlier work

Kai–Dall'Arno computed values through dimension five. Bencze–Frenkel supplied the general bounds and the exact simulation criterion, leaving dimension six at three or four. Their lower bound excludes three-state simulation from dimension seven onward. The contribution here is the missing dimension-six upper bound and its inspectable exact evidence.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Generalized-probability researchers | An exact boundary for classical simulation in a natural family | Full affine measurements and free shared randomness are part of the model |
| Discrete geometers | A small catalogue connecting cube supports and balanced collections | Rooted records and full geometric classes are different counts |
| Verification researchers | Separate coverage and rational-feasibility checks | Internal checker diversity is not unaffiliated reproduction |

## Why the problem matters

State-space dimension alone does not determine the classical alphabet needed to reproduce its correlations. An exact endpoint distinguishes a genuine simulation limitation from an incomplete search. This is a bounded theoretical result, not a hardware advantage or an experimentally measured communication saving.

## How to inspect or reproduce the recorded checks

Start with the package's AI index and verification instructions. Use the supplied-input rational replay together with the independent orbit audit: both parts are needed. Regenerating graph representatives is a separate optional route with additional dependencies. Check the worked distribution against its support data rather than treating its three subsets as geometry-free evidence. `REPLAY_RECEIPT.md` gives the exact public commands, hashes and observed outputs for the final package, and `ENVIRONMENT.txt` records the tested environments.

## The most valuable next projects

Find a structural construction explaining the 28 difficult full classes; compare against the external balanced-collection catalogue if it becomes available; or independently reimplement the complete coverage-to-simulation argument. None is claimed completed by this release.

## What is in the evidence package

The manuscript and editable source explain the reduction. Machine-readable class lists and rational distributions carry the finite witnesses. Replay programs and receipts document the checked scope; provenance, licensing and the AI index describe what can be reused and which assurance questions remain open.
