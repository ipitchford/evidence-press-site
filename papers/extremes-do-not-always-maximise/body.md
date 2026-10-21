## Summary

This page explains, in order: the question being asked, the small example that answers it, why the example works, what it does not settle, and what has and has not been checked.

**The question.** A Markov chain is a random process that hops between states, where each step depends only on the current state. A standard way to measure how much a chain still "remembers" where it started is to run two copies from different starting states and compare where they are likely to be after $t$ steps; the comparison used here is *total-variation distance*, which is $0$ when the two distributions agree and $1$ when they cannot overlap. Some chains, including the heat-bath (Gibbs-sampler) dynamics used here, are *monotone*: the states have an order, and starting higher never makes the future stochastically lower. If such a chain is also *reversible* (in equilibrium it looks the same run forwards or backwards), it is natural to guess that the lowest and highest starting states are always the pair that stays furthest apart. Problem 1.6 on the American Institute of Mathematics (AIM) list of Markov-chain mixing problems asks this question, first for zero-field Ising dynamics and then, more generally, for every monotone reversible chain.

**What was found.** For the general clause the guess is false, and four states are enough to show it. Arrange four states as a diamond: `00` at the bottom, `11` at the top, and two middle states `10` and `01` that are not comparable with each other. At each step choose one of the two coordinates at random and resample it from a weighted rule (a *random-scan single-site heat-bath* update), using the weights

$$
(1,\tfrac12,2,1).
$$

The resulting chain is irreducible, aperiodic, reversible and monotone. Yet at every positive integer time the two middle states are further apart than the bottom and top, by the exact ratio $4/3$. Three further results complete the picture:

- *A whole family is classified.* For weights $(1,b,c,1)$ with $bc\le1$, all six pairwise distances are given by three short formulas at every time, so one can see exactly when the middle pair or the extreme pair wins. Some members keep the middle pair ahead for any prescribed finite number of steps before switching once to the extremes; an exact example leads through time 32 and switches at time 33.
- *Four states are the minimum.* With a unique bottom and top, a poset on at most three states is a chain, and monotonicity then forces the bottom and top to be the furthest-apart pair.
- *The zero-field Ising question stays open.* The counterexample uses opposing site fields, so it is not a zero-field Ising example. A bounded exact screen of small graphs found no zero-field counterexample, but that is finite evidence only.

**Status.** An anonymous, unrefereed theorem candidate, prepared with AI assistance. The universal claims rest on a short written proof; exact rational programs replay the formulas and examples. There has been no independent reproduction, formal verification, external specialist review or peer review, and the release makes no claim to be new or first.

## Summary for specialists

Setting: finite state space with unique minimum and maximum; $P^t(x,\cdot)$ is the row law after $t$ transitions; the *row-TV diameter* at time $t$ is $\max_{x,y}\lVert P^t(x,\cdot)-P^t(y,\cdot)\rVert_{\rm TV}$. On the Boolean diamond $\Omega=\{00,10,01,11\}$ with coordinatewise order, random-scan single-site heat bath for positive weights $w$ is reversible with stationary law proportional to $w$, and monotone when $w_{00}w_{11}\ge w_{10}w_{01}$ (log-supermodularity). The source is AIM Problem 1.6(1); this release addresses only its general monotone-reversible clause.

| Result | Status |
|---|---|
| Weights $(1,\tfrac12,2,1)$: irreducible, aperiodic, reversible, monotone; for every integer $t\ge1$, $d_{\rm TV}(10,01)=\tfrac23(\tfrac12)^{t-1}$ while the other five pairs, including $(00,11)$, have $2^{-t}$; the incomparable pair is the unique maximiser at every positive time (Theorem 1) | proof; exact replay |
| Endpoint-symmetric family $(1,b,c,1)$, $bc\le1$: $E_t=A^t$, $M_t=RB^{t-1}$, $C_t=(A^t+B^t)/2$; diameter $\max\{E_t,M_t\}$; at most one crossover if $bc<1$; incomparable pair wins for all $t$ if $bc=1$, $b\ne c$ (Theorem 2) | proof; exact replay |
| Strict failures for any prescribed finite time; exact switch for $(b,c)=(1/10,9)$ between $t=32$ and $t=33$; one-step witness $(1,1/2,3/2,1)$ (Corollaries 2.1, 2.2) | proof; exact integer certificate |
| Monotone kernels on at most three states with unique minimum and maximum: extremes attain the diameter for every $t\ge1$; reversibility not needed (Theorem 3) | proof |
| Two zero-field spins: extremal pair maximises, strictly for positive interaction; extremal distance is $1$ whenever $2t<n$ on $n$ vertices (Section 5) | proof |
| Zero-field screen: every connected labelled simple graph on 2–4 vertices, five temperatures, times 1–6; extremal pair attained every tested diameter (claim B1) | exact bounded computation; not a theorem |
| Zero-field Ising on every graph; AIM 1.6(2) and 1.6(3) | not addressed |

## Technical account

**The permanent counterexample.** In state order $(00,10,01,11)$ the heat-bath kernel is

$$
P=\begin{pmatrix}
1/2&1/6&1/3&0\\
1/3&1/3&0&1/3\\
1/6&0&2/3&1/6\\
0&1/6&1/3&1/2
\end{pmatrix},
$$

with stationary distribution $(2,1,4,2)/9$ and spectrum $1,1/2,1/2,0$. Every diagonal entry is positive and the transition graph is connected, and detailed balance $\pi_iP_{ij}=\pi_jP_{ji}$ holds by direct multiplication. The weights satisfy $w_{00}w_{11}=w_{10}w_{01}=1$; in fact the Gibbs measure is a product measure, with conditional probabilities $1/3$ and $2/3$ of a one at the two coordinates, so the common-uniform heat-bath coupling is monotone. For every integer $t\ge1$,

$$
d_{\mathrm{TV}}\!\left(P^t(10,\cdot),P^t(01,\cdot)\right)
=\frac23\left(\frac12\right)^{t-1},
\qquad
d_{\mathrm{TV}}\!\left(P^t(00,\cdot),P^t(11,\cdot)\right)
=\left(\frac12\right)^t,
$$

and each of the four adjacent pairs also has distance $(1/2)^t$.

**Why the middle pair wins: two eigenmodes.** For weights $(1,b,c,1)$ put

$$
p=\frac{b}{1+b},\qquad r=\frac{c}{1+c},\qquad
B=\frac{p+r}{2},\qquad A=1-B,\qquad R=\max(p,r).
$$

The condition $bc\le1$ is equivalent to $p+r\le1$, hence $B\le\tfrac12\le A$, and it is exactly log-supermodularity, so the chain is monotone. The row vectors $u=(1,0,0,-1)$ and $v=\big(\tfrac{r-p}{2},p,-r,\tfrac{r-p}{2}\big)$ satisfy $uP=Au$ and $vP=Bv$. The time-one row differences of the extremal and incomparable pairs are $Au$ and $v$, with half-$\ell^1$ norms $A$ and $R$, which gives

$$
\text{extremal}=A^t,\qquad
\text{incomparable}=RB^{t-1},\qquad
\text{adjacent}=\frac{A^t+B^t}{2}.
$$

The adjacent-pair formula follows by a sign check on $A^tu/2-B^{t-1}v/2$, together with coordinate exchange and bit complementation. For $(b,c)=(1/2,2)$ both modes have base $1/2$, while the incomparable mode starts at $R=2/3$; that fixed head start is the all-time $4/3$ gap. When $bc<1$ the ratio $M_t/E_t=(R/A)(B/A)^{t-1}$ is strictly decreasing, so the maximiser can switch at most once. For $(b,c)=(1/10,9)$, with $A=111/220$, $B=109/220$, $R=9/10$, the switch is certified by the exact inequalities

$$
66\,109^{31}>37\,111^{31},\qquad
66\,109^{32}<37\,111^{32}.
$$

In Ising language, with $\sigma_i=2x_i-1$, the weights are proportional to $\exp(J\sigma_1\sigma_2+h_1\sigma_1+h_2\sigma_2)$ with $J=\tfrac14\log\tfrac1{bc}$ and $h_1=-h_2=\tfrac14\log\tfrac bc$. So $bc<1$ is strictly ferromagnetic, and the failures always come with opposing site fields.

**Why three states cannot fail.** A three-state poset with unique minimum and maximum is a chain $0<1<2$, and monotonicity orders the rows stochastically. For stochastically ordered measures on three points, total variation equals the larger of the two cumulative-distribution differences, and these differences add along the chain. So the distance between the two extreme rows dominates both other pairs. This argument does not use reversibility.

## What this does not settle

The AIM page places two questions close together. One asks about zero-field ferromagnetic Ising Glauber dynamics on every graph. The next, more general clause asks about any monotone reversible chain. This candidate negates the general clause only.

The four-state example has opposing site-dependent external fields. It is not a zero-field Ising example, and it says nothing decisive about all zero-field graphs. It also does not answer AIM diagnostics 1.6(2) or 1.6(3).

**The bounded zero-field residue.** The archive contains a separate exact screen over every connected labelled simple graph with two through four vertices, five temperatures `1, 3/2, 2, 3, 10`, and times one through six. The canonical receipt covers:

- 43 graphs;
- 215 graph-temperature trajectories;
- 1,290 kernel powers; and
- 140,340 unordered row-pair comparisons.

The extremal pair attained every tested diameter. That result is useful as a regression fixture and a record of where no small counterexample was found. It is finite evidence only, not an all-graph theorem and not evidence that the zero-field statement is true. Larger floating-point screens are kept only as exploratory research history, because their original execution environments are not fully archived.

## Evidence, assurance and limitations

The public source package supplies the six-page proof, accessible Markdown, exact rational verifiers, a separately structured producer cross-check, seven semantic negative controls, deterministic PDF rebuilding, a complete SHA-256 manifest, source-correspondence and novelty reports, and producer-organised five-role review with exact-byte confirmation.

- **Proofs.** Theorems 1–3 and the corollaries have short written proofs in the manuscript. No proof assistant was used.
- **Exact replay.** The standard-library verifier derives every kernel from its Gibbs weights and checks stochasticity, irreducibility, aperiodicity, detailed balance, monotonicity and the exact distance formulas on differentiated rational cases, including an attractive-boundary case, an exact integer crossover tie, a strict one-step switch, a strict time-32 switch and symmetric controls. Load-bearing checks do not use `assert`, so they also run under optimized Python.
- **Cross-check and controls.** `crosscheck_formulas.py` is a second producer encoding that also audits a rational parameter grid and the three-state lemma; it does not count as independent reproduction. The negative controls corrupt the parameter domain, distance formula, detailed balance, irreducibility, monotonicity, maximiser identity and bounded census, and each corruption is rejected.
- **Release checks.** A fresh extraction of the DOI-bearing ZIP passed all 18 release gates. The tagged GitHub workflow passed on Python 3.11 and 3.13, each in normal and optimized mode. GitHub and Zenodo copies of the PDF, ZIP and checksum ledger match the reviewed local assets byte for byte.

These facts establish availability, integrity, producer-side replay and the declared finite computations. They do **not** establish:

- independent rerun or independently authored reimplementation;
- proof-assistant formalisation;
- external Markov-chain specialist review;
- journal or comparable editorial peer review;
- exhaustive novelty or absolute priority; or
- resolution of the all-graph zero-field question.

The universal claims rest on the written proof. Successful code execution checks its formulas and examples but cannot replace mathematical assessment of its quantifiers.

## Relationship to earlier work

The source is AIM Problem 1.6(1). Nearby work studies censoring from extremal configurations, comparison inequalities, two-component Gibbs samplers, order-adapted metrics and coefficients of ergodicity; those results address different starting-law or metric questions, not the ordinary pairwise row-TV diameter statement shown false here. A formula-first search found no matching four-state matrix, all-time distance sequences, `4/3` ratio or family classification.

That search has a material gap. The closest 1992 coefficient-of-ergodicity article by Pflug and Schachermayer was available only through its abstract, bibliography and cited-by metadata, not full text. The elementary example may also be known under different terminology or in informal circulation. Accordingly, the release makes no claim to be new, first or historically definitive.

## Who should care, and why

| Reader | What is useful now | Principal caution |
|---|---|---|
| Markov-chain researchers | A minimal exact stress test for extremal-start intuition | Check the proof and prior art independently |
| Gibbs-sampler researchers | A complete two-spin family with explicit switch regimes | The permanent witness uses external fields |
| Software authors | A four-state regression fixture for row-diameter assumptions | Passing the fixture does not validate a general algorithm |
| Formalisers | A small rational kernel with short universal formulas | No proof-assistant development is supplied |
| Research-methods readers | A package that separates theorem, bounded screen, replay and review | Internal role separation is not external validation |

## Why the problem matters

Extremal starts recur throughout the surrounding literature on monotone chains, from censoring to comparison inequalities, so it matters whether the bottom and top really are the worst-case pair for total variation. The diamond example shows that, without further structure, it need not be, even when the chain is also reversible, and the family classification shows how long the failure can persist. Because the counterexample is cardinality-minimal and has a closed form, it is suitable as a teaching example and as an exact regression fixture for software that assumes the bottom/top pair realises the row-TV diameter. No adoption, performance or downstream-impact evidence is claimed. The result also sharpens what remains open: any positive answer for zero-field Ising dynamics must use structure that the general monotone-reversible setting lacks.

## How to inspect or reproduce the recorded checks

Use tag `v0.2.0-candidate` or the Zenodo version DOI rather than the moving `main` branch. Python 3.11 or later is sufficient for the exact verifiers, which use only the standard library:

```sh
python3 verify_two_spin_family.py
python3 -O verify_two_spin_family.py
python3 crosscheck_formulas.py
python3 -O crosscheck_formulas.py
python3 test_negative_controls.py
python3 -O test_negative_controls.py
python3 verify_zero_field_bounded.py
python3 -O verify_zero_field_bounded.py
./build_paper.sh
```

The expected output prefixes are:

```text
PASS: exact endpoint-symmetric two-spin classification
PASS: separate exact cross-check
PASS: targeted negative controls were rejected
PASS_BOUNDED: extremal pair attained every tested row-TV diameter
PASS_CANONICAL_B1: parameters and census match the frozen claim
```

To understand the mathematics, read Sections 2–4 of `paper.md` (about six pages). Then inspect `CLAIMS.json`, `ASSURANCE.md`, `SOURCE_CORRESPONDENCE.md` and `NOVELTY_REPORT.md`. The versioned manifest binds every release file.

## The most valuable next projects

1. **Zero-field theorem or counterexample.** Resolve the every-graph Ising question without extrapolating from the bounded four-vertex screen.
2. **Independent reconstruction.** Re-derive the kernel powers, family regimes and cardinality-minimality proof without importing the package formulas.
3. **Specialist prior-art audit.** Inspect the 1992 antecedent in full and search coefficient-of-ergodicity and binary Gibbs-sampler terminology.
4. **Formalisation.** Encode stochastic monotonicity, reversibility, row total variation and the three-state CDF argument in a proof assistant.
5. **Remaining AIM diagnostics.** Treat questions 1.6(2) and 1.6(3) as separate projects with their own quantifiers and assurance gates.

## What is in the evidence package

The immutable release includes the manuscript PDF and sources, accessible Markdown, exact verifiers, mutation tests, claim and nonclaim registry, environment record, replay receipt, operating-model and metrics records, source and novelty audits, internal review reports, licensing files and a complete checksum manifest. Original prose, structured records and project data are CC0-1.0; original Python code is MIT; cited papers and the supplied review are not redistributed. The [v0.2.0 candidate release](https://github.com/ipitchford/extremes-do-not-always-maximise/releases/tag/v0.2.0-candidate) and [version DOI](https://doi.org/10.5281/zenodo.22163995) are the pinned inspection points.
