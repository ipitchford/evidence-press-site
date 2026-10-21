## Summary

**The problem.** A family of sets is *union-closed* if the union of any two of its sets is again in the family. Frankl's union-closed sets conjecture asks whether every finite union-closed family has an element appearing in at least half its sets. It remains open. Recent progress has come from *entropy* methods: arguments from information theory that turn the conjecture into an inequality about probability distributions, and then try to prove that inequality for as large a fraction (a "constant") as possible.

**What this release does.** It does not prove a new bound. It audits one conditional entropy proof programme, from the first arXiv version of a paper by Liu (`arXiv:2306.08824v1`), at the exploratory constant `153/400`. This release does not prove the exploratory constant `153/400`, and it does not establish any new universal lower bound.

**What was found.** A step in the proof of Theorem 12 of Liu's first arXiv version treats a two-component objective as jointly concave (curving downward everywhere) after two aggregate moments are fixed. The note constructs two nearby component laws whose aggregate law and both stated constraints stay fixed, while the objective curves upward. A function that curves upward along a permitted direction cannot be concave there, so the printed inference fails. The construction works for every protocol amplitude `0 < ell <= 1`, including the theorem's "sufficiently small" regime.

**What survives.** Several reductions that the programme needs can be repaired by other arguments, and the note proves or reconstructs them. What remains after the repair is a ten-variable inequality that nobody has yet proved.

**Scope.** That is a source-specific obstruction, not a verdict on all of Liu's work. It does not refute the one-measure concavity lemma, the shared-weight conclusion by every possible argument, the separate analytic theorem that some non-explicit strict improvement exists, or the uninspected CISS conference text.

**Status.** An anonymous, AI-assisted, unrefereed candidate. The computations replay byte for byte on two platforms from the same source; there has been no independent specialist review, independent implementation or proof-assistant verification.

## Summary for specialists

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

Concretely (Theorem 2.2 of the paper), with $P=\tfrac12\delta_1+\tfrac14\delta_0+\tfrac14\delta_{1/2}$, $\nu=\delta_0-\delta_{1/2}$, $q=\tfrac12$ and $P_0(t)=P+t\nu$, $P_1(t)=P-t\nu$ for $\lvert t\rvert\le\tfrac14$, the aggregate law stays $P$, with complement mean $5/8$ and $f_\ell$-moment $\ell/16$, matching Liu's aggregate constraints (76)–(77), while the objective gains exactly $\beta t^2h\!\left(\frac{4+\ell^2}{16}\right)$. At the frozen value $\ell=\sqrt{123/500}$ the entropy argument is $2123/8000$. The source location is the proof of Theorem 12 in arXiv:2306.08824v1 (PDF p. 13, `main.tex:791-806`), mapped to the frozen model by Proposition 2.1.

| Result | Status |
|---|---|
| Proposition 2.1 / Theorem 2.2: exact source map and parameterised counterdirection | conventional proof |
| Theorem 3.1: binary-latent minimiser for the continuous candidate kernel | conventional proof |
| Theorems 3.2 and 4.1: conditional-kernel PSD statement for $0\le\tau\le123/500$ | exact rational certificate within a conventional analytic bridge |
| Theorem 3.3: at most three atoms in each component, independent weights | conditional on the PSD bridge |
| Theorem 5.1: sharp uniform endpoint theorem at the entropy-zero boundary | conventional proof |
| Theorem 6.1: one-component atom-zero face | 32,768-leaf, 256-bit directed-rounding certificate |
| Proposition 7.1: exact elimination of the latent weight $q$ | conventional proof |
| Global $\Phi_C\ge0$ on the independently weighted $3+3$-atom domain at $c=153/400$, $C=1+10^{-8}$ | open |

## Technical account

### How the obstruction works

The perturbation is deliberately local. It moves the two component measures in opposite directions, so their mixture and both aggregate constraints remain fixed. The exact positive second variation then contradicts concavity on that feasible line. This mechanism challenges one printed inference while leaving the surviving lemmas and the open global inequality logically separate.

The reason the one-measure lemma does not transfer is visible in the moments: the aggregate constraints are fixed, but each component's own mean and $f_\ell$-moment move with $t$. Concavity on a fixed one-component slice therefore says nothing about the larger aggregate-constrained pair space.

### What survives

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

| Printed shared-weight route | Repaired independent-weight route |
|---|---|
| aggregate constraints on $(P_0,P_1)$ | fix each component's own two moments |
| invoke one-measure slice concavity jointly | apply separate concavity sequentially |
| common three weights for paired atoms | at most three atoms per component with independent weights |
| nine-dimensional numerical programme | eleven variables, ten after exact $q$-elimination |

### What remains open

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
is needed first. Numerical searches did not locate a reliable negative point, but that observation is an exploratory record and is not used as proof evidence.

## Evidence, assurance and limitations

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

- **Review.** An AI-assisted bounded confirmation review found no remaining P0/P1/P2 issue after the recorded corrections. It is not the independent specialist review that remains the next assurance target, and publication does not confer that review.
- **Limitations.** The global ten-variable inequality is open; no new Frankl bound is proved. The CISS 2024 full text has not been assessed. The literature search is bounded rather than exhaustive. The attribution of the obstruction is confined to arXiv v1.

## Who should care, and why

| Reader | Start here | Principal caution |
|---|---|---|
| Curious reader | Summary and "What remains open" | No new Frankl bound is claimed. |
| Union-closed sets researcher | Source-to-model map and Section 3 of the paper | The attribution is confined to arXiv v1. |
| Analyst | PSD bridge and endpoint theorem | Successful certificates do not replace the analytic bridge. |
| Validated-numerics reviewer | Environment and replay records | Same-source cross-platform replay is not independent reimplementation. |
| Future prover | Reduction map and reviewer questions | The generic residual problem is ten-dimensional, not six-dimensional. |

## Why the problem matters

Entropy programmes for Frankl's conjecture proceed by reducing an infinite-dimensional optimisation over probability laws to a small one that can be checked. Each reduction step must be valid, or the final computation proves nothing about the conjecture. A shared-weight reduction would have left a smaller problem than the honest count shows; the obstruction means that work building on the printed joint-concavity step should not rely on it. The repaired reductions, and the exact ten-variable count of what remains, give the next attempt a correct starting point at the frozen target $c=153/400$.

## How to inspect or reproduce the recorded checks

From the extracted package root (GitHub release or Zenodo archive):

```sh
export PYTHONDONTWRITEBYTECODE=1
python3 -B verify_candidate.py          # manifest, status/claim consistency, exact PSD replay
python3 -B -OO psd_checker/run_all.py   # exact rational PSD gate and ten mutations
```

The MPFR directed-rounding certificate needs a C17 compiler, `pkg-config`, **MPFR 4.2.2** and **GMP 6.3.0** (other versions are rejected):

```sh
CC=cc python3 -B -OO interval_pilot/run_all.py --work-dir replay/interval
```

This regenerates all 32,768 leaves, requires exact certificate equality and requires all seven proof-critical mutations to be rejected. `REPLAY.md` also gives a digest-pinned Linux/amd64 container build and the archive check `verify_candidate_zip.py`. Start reading with Section 2 of the paper (Proposition 2.1 and Theorem 2.2); `SOURCE_TO_MODEL_MAP.md` and `REDUCTION_MAP.md` give the source bridge and the state-space map.

## The most valuable next projects

The most valuable next step is a focused specialist review of the arXiv-v1
source map, parameterised counterdirection and PSD semantic bridge, preferably
paired with a separately authored arithmetic implementation. Only after those
survive should effort return to the global inequality.

1. Check that Proposition 2.1 reproduces Example 5, objective (43) and constraints (76)–(77) of arXiv:2306.08824v1 exactly, and that Theorem 2.2 invalidates only the printed joint-concavity inference.
2. Reproduce the finite-row and tail comparison of the PSD certificate without using the producer's checker or operation ordering.
3. Find a valid theorem reducing the generic ten-variable $3+3$ problem further while retaining slack-mean, endpoint and interior-vertex cases.
4. Compare the CISS 2024 proceedings text with arXiv v1.

`REVIEWER_QUESTIONS.md` lists nine focused questions for that review.

## What is in the evidence package

The archive contains the candidate manuscript, accessible Markdown, source map, theorem-dependency map, frozen source identity, analytic derivations, exact and directed-rounding checkers, mutation controls, cross-platform producer receipts, deterministic manifest and clean-extraction verifier. The [v0.2.0 candidate release](https://github.com/ipitchford/frankl-concavity-obstruction/releases/tag/v0.2.0-candidate) and [DOI archive](https://doi.org/10.5281/zenodo.21938497) are the pinned inspection points.
