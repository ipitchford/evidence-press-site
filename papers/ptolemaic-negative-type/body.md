## Summary

Not every table of distances can be realised by points in ordinary Euclidean space. One way to make an embedding possible is to raise every distance to a power below one, compressing the ratio between long and short distances. How much compression guarantees success?

This paper studies **Ptolemaic metrics**: distance systems satisfying Ptolemy's inequality on every four points. The anonymous, unrefereed manuscript gives a sharp answer depending only on the number of points. Its analytic argument covers every cardinality from six onwards, with no restriction on distance ratios. Together with earlier small cases, it supplies the full formula.

Sharp means both sides are addressed: every metric in the class satisfies the proposed guarantee, and explicit examples show that a larger universal exponent is impossible. The first values beyond the inspected established results occur at seven and eight points. The written proof is the source of the universal claim; computational checks support particular identities and examples.

## Summary for specialists

For $m\ge3$, let $P(m)$ be the supremum of all $p>0$ such that every Ptolemaic metric on exactly $m$ points has $p$-negative type. Thus, with $E_p=(d(x,y)^p)$,

$$
z^{\mathsf T}E_pz\le0\qquad\text{whenever }\mathbf1^{\mathsf T}z=0.
$$

The main theorem asserts, for every integer $m\ge6$,

$$
P(m)=p_m:=\log_2\!\left(1+\frac{m}{\lfloor(m-1)^2/4\rfloor}\right).
$$

Every such metric has endpoint $p_m$-negative type and strict $p$-negative type for every $0<p<p_m$. For every $p>p_m$, a complete split metric on $m$ points violates the inequality. Equivalently, $(X,d^{p/2})$ embeds isometrically into Euclidean space throughout the guaranteed range; below the endpoint its image can be chosen affinely independent.

The manuscript independently recovers $P(6)=1$. Its next values are

$$
P(7)=\log_2(16/9),\qquad P(8)=\log_2(5/3).
$$

The complete formula uses the established values $P(3)=2$, $P(4)=\log_2 3$ and $P(5)=\log_2(9/4)$. Through Baker–Huh–Kummer–Lorscheid's identity $q(n)=P(n-1)$, it gives their conjectured **rank-two uniform** threshold. It is not a determination of $q(M)$ for every matroid.

## Technical account

The lower bound is the difficult direction. A worst-case example alone cannot show that every other Ptolemaic metric behaves at least as well.

First, a scalar supporting-power inequality bounds a linear packing problem on a powered star metric. The resulting estimate works for every positive vector of branch lengths, including arbitrarily unequal lengths. It controls nonnegative subsolutions of the star system; it does not assume that inverse matrices preserve entrywise order.

Second, the proof bounds normalised off-diagonal entries of an inverse augmented distance matrix. A principal deletion either strengthens a hypothesised violation, produces a controlled sign pattern, or reduces to the nonnegative-vector case handled by packing. Metric inversion keeps the regauged smaller objects inside the Ptolemaic class.

This inverse theorem has an explicit strict-negative-type hypothesis. A separate induction on cardinality supplies it: if the smaller sign class of a zero-sum vector has $a$ points, each two-pole Schur estimate uses only $a+2\le m-1$ metric points. No positive definiteness of the full $m$-point matrix is assumed before it is proved. Finally, pointwise continuity in the exponent reaches the endpoint without inverting a potentially singular endpoint matrix.

### A seven-point sharpness witness

![The complete split metric CS(3,4): three clique points, four independent points, and the exact quadratic form crossing zero at 2^p=16/9.](/assets/art/ptolemaic-negative-type-witness.svg)

In $\operatorname{CS}(3,4)$, all distinct distances are one except distances between the four independent points, which are two. Assign coefficient $1/3$ to each clique point and $-1/4$ to each independent point. The coefficients sum to zero, and direct expansion gives

$$
z^{\mathsf T}d^pz=\frac23+\frac34\,2^p-2.
$$

It is zero at $2^p=16/9$ and positive above it. This is an exact witness to the upper bound, not numerical evidence for the universal lower bound. The graph drawing specifies the shortest-path metric; the drawn Euclidean positions are not asserted to realise those distances.

## Evidence, assurance and limitations

The package contains the analytic manuscript, a map of its strictness dependencies, exact and symbolic checks, explicit witnesses, source records, numerical explorations and the supplied review with its response. Fresh producer-side intake replay completed the full route, and the exact route reproduced its compared outputs byte-for-byte. Scoped rejection controls checked that selected corruptions are refused.

These checks do not certify the universal induction. Archived assertion-based verifiers deliberately refuse optimized Python: a rejection under `python -O` is a safety check, not an optimized-mode science pass. Floating-point outcomes and optimiser convergence can vary; the fresh numerical differences are retained separately from exact comparisons. Feasibility within a tolerance is not solver convergence, and tiny numerical deficits are not certified counterexamples.

The paper remains **unrefereed**. Neither coordinated agent checks nor the supplied favourable review establish unaffiliated reproduction or authenticated external specialist endorsement. This theorem has not been formalised in a proof assistant. The source search is bounded, not exhaustive priority clearance.

The result does not classify all extremising metrics, give a scale-independent positive spectral gap, or establish a threshold for every matroid. The proof for $m\ge6$ is self-contained relative to its stated elementary background; the all-cardinality corollary additionally depends on the cited smaller endpoints. Ercan's external Bernstein certificate was not replayed as part of this publication intake.

## Relationship to earlier work

[Baker, Huh, Kummer and Lorscheid](https://arxiv.org/abs/2607.15375v2) formulated the sharp parity conjecture, related it to Ptolemaic negative type, and established the four-point endpoint. [Ercan](https://arxiv.org/abs/2608.20606v1) proved the five- and six-point cases using partial correlations, copositivity and coefficient transport under metric inversion. Those results are the baseline, not discoveries of this release.

[Korea Superintelligence Labs, version 3](https://ideosphere.ai/papers/ptolemaic-negtype-v3.pdf), identifies the general anchor constants and their relationship to complete split thresholds, and exhibits an obstruction above exponent one. That paper leaves the general low-exponent estimate unresolved. The present manuscript's claimed contribution is the universal star-packing estimate and inverse-correlation induction below one, with their hypotheses discharged by the cardinality induction. The constants, predicted thresholds, inversion framework and split witnesses are not claimed as new.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Metric geometers | A sharp cardinality-dependent guarantee for snowflake embeddings | Inspect the universal packing and induction arguments, not only the examples |
| Researchers in Lorentzian polynomials and matroids | An explicit proposed formula for the rank-two uniform threshold | General matroid thresholds are outside the claim |
| Matrix analysts and proof-assistant contributors | A focused inverse-correlation theorem with explicit inertia and deletion hypotheses | Preserve the two inductions and every strictness assumption |
| Readers exploring finite geometry | A concrete example of local four-point constraints controlling a global embedding guarantee | Ptolemy's condition does not by itself make the original metric Euclidean |

## Why the problem matters

Ptolemy's inequality examines only four points at a time, while negative type constrains every zero-sum weighting of the entire space. A sharp formula connects these local and global properties and identifies exactly how the worst-case guarantee changes with cardinality. Its decay, $mP(m)\to4/\log 2$, also shows why no fixed positive exponent works uniformly over arbitrarily large finite Ptolemaic spaces.

The interest lies in this mathematical classification and its proof mechanism. No empirical performance, downstream adoption or research-productivity improvement is inferred.

## How to inspect or reproduce the recorded checks

Start with `paper/ptolemaic.pdf`, especially the star-packing theorem, inverse-correlation theorem and Appendix B's dependency table. Then read `review/CLAIM_CHECK_MAP.csv` and `review/EVIDENCE_LEDGER.md` to see which claims the executable checks do and do not address. The dated intake findings and bounded prior-art refresh are in `evidence/intake/RESULTS.md` and `evidence/intake/PRIOR_ART_REFRESH.md`.

For a fresh extracted evidence package, use the reference Python 3.13.5 environment and the supplied `requirements.txt`:

```sh
python3 -m pip install -r requirements.txt
python3 replay_publication.py --mode integrity
python3 replay_publication.py --mode exact --output /tmp/ptolemaic-exact
python3 replay_publication.py --mode full --output /tmp/ptolemaic-full
```

Choose new output directories outside the extracted package. Installation may need network access; the replay scripts themselves do not. Do not add `-O`. `integrity` checks the manifest, `exact` runs the scoped exact and reporting checks, and `full` also reruns the numerical experiments. A successful receipt means those specified checks completed; read its exact-versus-floating-point comparisons before drawing a stronger conclusion.

## The most valuable next projects

1. Reconstruct the scalar packing and inverse-deletion arguments outside the producing workflow, checking the universal quantifiers and the smaller-cardinality dependency at each use.
2. Formalise the two-induction proof while keeping the analytic theorem separate from auxiliary finite computations and imported endpoints.
3. Investigate which Ptolemaic metrics attain the sharp endpoint; the present split witnesses do not provide an equality classification.
4. Study quantitative stability only after choosing an explicit normalisation, so rescaling distances cannot trivialise a proposed spectral bound.

## What is in the evidence package

| Location | Contents and role |
|---|---|
| `paper/` | Manuscript PDF, LaTeX source and bibliography |
| `review/` | Source and evidence ledgers, claim-to-check map, supplied review and revision response |
| `evidence/core/` | The original derivation and exact, symbolic and numerical auxiliary checks |
| `evidence/received/` and `evidence/historical/` | Preserved source archives and earlier reports, not silently rewritten as current evidence |
| `evidence/current/` | Corrected numerical summary, retained trial-level data and scoped current reports |
| `evidence/intake/` | Dated producer-side replay, rejection controls, source comparison and separately retained numerical differences |
| `replay_publication.py`, `scripts/`, `requirements.txt`, `SHA256SUMS` | Reproduction entry points, dependencies and package-integrity checks |

Read the final release's dated intake receipts alongside the supplied historical reports: they concern different executions and must not be conflated. Original prose and research records use CC0, original code uses MIT, and third-party material retains its own terms. Media explains the result; it adds no mathematical evidence.
