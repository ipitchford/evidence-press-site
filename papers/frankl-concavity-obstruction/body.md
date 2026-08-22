## Plain-English summary

Frankl's union-closed sets conjecture asks whether every finite union-closed
family has an element appearing in at least half its sets. It remains open.
This release does not prove the exploratory constant `153/400`, and it does not
establish any new universal lower bound.

Instead, the candidate audits one conditional entropy proof programme. A step
in the proof of Theorem 12 of Liu's first arXiv version treats a two-component
objective as jointly concave after two aggregate moments are fixed. The note
constructs two nearby component laws whose aggregate law and both stated
constraints stay fixed, while the objective curves upward. The construction
works for every protocol amplitude `0 < ell <= 1`, including the theorem's
"sufficiently small" regime.

That is a source-specific obstruction, not a verdict on all of Liu's work. It
does not refute the one-measure concavity lemma, the shared-weight conclusion
by every possible argument, the separate analytic theorem that some
non-explicit strict improvement exists, or the uninspected CISS conference
text.

## The central finding

In complement coordinates, let `X = 1-S` and use

$$
p(x)=1-x,\qquad f_\ell(x)=\ell x(1-x),\qquad \tau=\ell^2.
$$

For a candidate-feasible base law, the signed direction moves the two
components oppositely. Their mixture is unchanged, so the aggregate mean and
aggregate `f_ell` moment are unchanged. The second-order change in the
component term is

$$
\beta t^2 h\!\left(\frac{4+\ell^2}{16}\right)>0
$$

for every `beta > 0`, `t != 0`, and `0 < ell <= 1`. A concave functional cannot
have positive curvature on such a feasible line. The printed joint-concavity
inference therefore cannot supply the claimed shared component weights.

## How the obstruction works

The perturbation is deliberately local. It moves the two component measures in opposite directions, so their mixture and both aggregate constraints remain fixed. The exact positive second variation then contradicts concavity on that feasible line. This mechanism challenges one printed inference while leaving the surviving lemmas and the open global inequality logically separate.

## What survives

The obstruction does not collapse the entire programme. The release proves or
reconstructs five useful pieces:

1. A compact extreme-point argument reduces an arbitrary latent variable to a
   binary one for the continuous candidate kernel.
2. An explicit signed-measure and operator bridge, together with an
   exact-arithmetic certificate for the finite bound used in a conventional
   positive-semidefinite argument, proves the needed PSD sublemma within the
   stated trust boundary.
3. Sequential minimisation on two-moment slices reduces each component law
   independently to at most three atoms. The two laws need not share weights.
4. A sharp endpoint theorem controls every positive-entropy approach to the
   entropy-zero boundary and identifies the asymptotically worst family.
5. The latent mixing weight `q` can be eliminated exactly because the objective
   is quadratic in `q` while the mean constraint is affine.

One one-component face is also certified by a `32,768`-leaf, `256`-bit
directed-rounding computation.

## What remains open

The repaired generic model uses two independently weighted laws with at most
three atoms each. It has eleven variables before eliminating `q` and ten
afterward. A genuine two-by-two subface has seven variables and six after the
same elimination, but no theorem reduces the global problem to that subface.

The full mixed-component inequality at

$$
c=\frac{153}{400},\qquad C=1+10^{-8}
$$

is still unproved. Raw interval branch-and-bound is not a credible next step at
ten dimensions; an analytic stratification or a new active-constraint theorem
is needed first.

## Evidence and replay boundary

The public package contains:

- the manuscript, source-to-model map and theorem dependency map;
- a frozen identity for `arXiv:2306.08824v1`;
- the analytic repair and endpoint derivations;
- an exact PSD checker with ten mutation controls;
- a directed-rounding face checker with seven mutation controls;
- same-source macOS arm64 and Linux/amd64 replay receipts pinned to MPFR 4.2.2
  and GMP 6.3.0;
- exact latent-weight diagnostics; and
- deterministic manifest and clean-extraction ZIP gates.

These checks establish bounded producer-side replay and byte identity. They do
not establish independent implementation, proof-assistant verification,
external specialist review, editorial peer review, priority, or the open
global inequality.

## Who should read what

| Reader | Start here | Principal caution |
|---|---|---|
| Curious reader | Plain-English summary and "What remains open" | No new Frankl bound is claimed. |
| Union-closed sets researcher | Source-to-model map and Section 3 of the paper | The attribution is confined to arXiv v1. |
| Analyst | PSD bridge and endpoint theorem | Successful certificates do not replace the analytic bridge. |
| Validated-numerics reviewer | Environment and replay records | Same-source cross-platform replay is not independent reimplementation. |
| Future prover | Reduction map and reviewer questions | The generic residual problem is ten-dimensional, not six-dimensional. |

## Next assurance target

The most valuable next step is a focused specialist review of the arXiv-v1
source map, parameterised counterdirection and PSD semantic bridge, preferably
paired with a separately authored arithmetic implementation. Only after those
survive should effort return to the global inequality.

## What is in the public package

The archive contains the candidate manuscript, accessible Markdown, source map, theorem-dependency map, frozen source identity, analytic derivations, exact and directed-rounding checkers, mutation controls, cross-platform producer receipts, deterministic manifest and clean-extraction verifier. The [v0.2.0 candidate release](https://github.com/ipitchford/frankl-concavity-obstruction/releases/tag/v0.2.0-candidate) and [DOI archive](https://doi.org/10.5281/zenodo.21938497) are the pinned inspection points.
