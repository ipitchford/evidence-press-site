## Summary

**In one sentence.** Looking at $n$ different sources of evidence through $n$ random draws with replacement can make a test between two explanations slightly better than looking once at each source; this candidate finds exact worst cases, showing that in a natural class the advantage over guessing can grow by at most $14/9$, and that in general the best universal homogenisation constant is at most $9/14$, below the earlier bound $8/9$.

**The everyday problem.** You want to decide between two explanations using several different sources of evidence, say $n$ different sensors or $n$ different sites. Design A looks at every source once. Design B makes $n$ draws at random with replacement, so some sources are seen twice and some not at all, as a bootstrap or a random-design study does. You would expect B to be worse, since it may miss a source altogether. Surprisingly, it can be slightly better. The question is by how much.

**How "better" is measured.** The quality of a design is the total-variation distance between what the data look like under the two explanations. It is the advantage over guessing of the best possible test: with equal prior odds the best test is right with probability $(1+\text{distance})/2$. Write $D$ for the distance under design A (the fixed design) and $H$ for the distance under design B (the resampled, or homogenised, design).

**What was known.** Aryeh Kontorovich proved in a series of preprints that resampling can never help by more than a constant factor: $D\ge cH$ for a universal constant $c>0.1489$, whatever the sources and however many there are. In the other direction, his yes/no (Bernoulli) example showed $c\le8/9$, and $8/9$ was conjectured to be optimal for Bernoulli data.

**What is new.**

| What | In plain terms | Where |
|---|---|---|
| A better bound for the general constant | $c\le9/14\approx0.643$; two sources already give $2/3$. So $8/9$ is not the answer for general data. The Bernoulli conjecture is not addressed | Theorem 4.1 |
| Exact worst cases for erasure experiments | Each observation either rules one explanation out or lands in a shared zone where both behave alike. For every random sampling rule chosen independently of the data, the worst-case factor $\sup H/D$ is found; it depends only on how often pairs of sources are drawn | Theorem 3.1 |
| Uniform resampling | The factor is $3/2$ for two sources, $14/9$ for three (its maximum), and decreases towards about $1.524$ for many sources | Theorem 4.1, Proposition 4.2 |
| Two sources, all data | For arbitrary experiments with two sources the largest possible $H$ is $\tfrac32D-\tfrac12D^2$; more generally the exact bound is known whenever only two sources differ, and the exact optimum for three erasure sources is found | Theorem 5.1, Corollary 5.2, Theorem 6.1 |
| Strong evidence | Resampling with $n$ draws always leaves at least $n!/n^n$ of the fixed design's error probability (for three sources, $2/9$ of it), the chance that every source is drawn exactly once; this factor is attained when the evidence is already strong | Theorem 7.1, Corollary 7.3 |

**A concrete example.** Take three sources: two carry weak opposing "rules out" signals and one carries nothing. Looking once at each gives advantage $D$. Three random draws give exactly

$$H=\tfrac{14}{9}D-\tfrac23D^2+\tfrac{2}{27}D^3,$$

about $14/9$ times $D$ when $D$ is small. That is $14/9$ times the advantage over guessing, not $55.6\%$ more accuracy: accuracy is $(1+H)/2$, so only the excess over one half is multiplied.

**The idea of the proof.** In the erasure class the information carried by any sampling outcome is a maximum of two linear budgets, one for each explanation. The worst case puts each explanation's whole budget on a single source, so only pairs of counts matter, and the factor becomes the expected larger of two counts. For strong evidence, a base-$(k+1)$ "digit" construction makes every unbalanced draw much less informative than the balanced one, so the chance of drawing every source equally often is exactly what survives.

**Limits.** Whether $9/14$ is the exact general constant is open: it is conjectured, and a numerical search found nothing larger, but that is not a proof. The erasure-class results are not known to bound general data. The high-signal limit can be approached slowly. The Bernoulli conjecture $8/9$ is not addressed. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks, not peer review. The homogenisation problem, the bounds $c>0.1489$ and $c\le8/9$ and the labelled-lift argument used here are Kontorovich's.

## Summary for specialists

Experiments $(P_i,Q_i)$, $i=1,\dots,n$, on one measurable space; $D=\mathrm{TV}(\bigotimes_iP_i,\bigotimes_iQ_i)$ and $H=\mathrm{TV}(\bar P^{\otimes n},\bar Q^{\otimes n})$ with $\bar P=\frac1n\sum_iP_i$. Let $c^*$ be the best constant in $D\ge cH$ over all $n$ and all spaces. An *erasure* experiment is a pair whose likelihood ratio takes at most one value in $(0,\infty)$. A schedule is a random count vector $N$ independent of the data; $K,L$ denote the numbers of draws of two fixed experiments under $\mathrm{Mult}(n;1/n,\dots,1/n)$.

- **Theorem 3.1** *(proof)*: for erasure experiments and any revealed schedule, the sharp constant in $H_\nu\le\kappa_\nu D$ is $\max\{\mathbb P(N\ne0),\ \max_{i,j}\mathbb E\max(N_i,N_j)\}$. The lift to the labelled experiment ($H\le H_\nu$) is Kontorovich's.
- **Theorem 4.1, Proposition 4.2** *(proof)*: for uniform resampling of erasure experiments $H\le C_nD$ with $C_n=\mathbb E\max(K,L)$ sharp as $D\to0$; $C_2=3/2$, $C_3=14/9$, $C_4=99/64$, strictly decreasing for $n\ge3$ to $C_\infty=1+e^{-2}(I_0(2)+I_1(2))\approx1.5238$. A five-outcome family gives $c^*\le9/14$ for arbitrary experiments; every $n\ge3$ gives $c^*<0.6563$. With Kontorovich's lower bound, $0.1489<c^*\le9/14$.
- **Remark 4.3**: the family has labelled ratio $H_\nu/D\to14/9$ even on a two-point space, so any proof through the labelled lift cannot give $c>9/14$, and a proof of the Bernoulli conjecture would have to use the loss of labels.
- **Theorem 5.1, Corollary 5.2** *(proof)*: if $P_i=Q_i$ except in two coordinates, the exact bound is $H\le F_n(D)$, attained at every $D$. For $n=2$ the unrestricted problem is solved: $\sup H=\tfrac32D-\tfrac12D^2$. Kontorovich's local-to-global paper had the linear bound $H\le\tfrac32D$.
- **Theorem 6.1, Corollary 6.2** *(proof)*: the exact three-component erasure optimum at every distance, with transitions $D_0\approx0.3249$, $D_1\approx0.6972$ and crossover $D_*=(9-\sqrt{33})/8\approx0.4069$; near $D=1$ the optimal overlap is $\tfrac29r+O(r^{6/5})$ with $r=1-D$.
- **Theorem 7.1, Corollary 7.3** *(proof)*: for arbitrary experiments and any data-independent schedule with $kn$ draws, $1-H\ge q\,(1-D)^k$ at every distance, where $q$ is the probability that every experiment is used exactly $k$ times; a radix construction with base $B\ge k+1$ attains the leading term as $D\to1$ with an explicit power-saving remainder. For uniform resampling with $k=1$ the optimal ratio of Bayes errors tends to $n!/n^n$, the classical no-collision probability (Darroch–Jirina–Speed).
- **Conjecture 8.1**: $c^*=9/14$. Evidence: 40 Nelder–Mead restarts per configuration over arbitrary finite experiments found no labelled ratio above $C_n$ (tolerance $10^{-6}$); without labels on a common two-point space the best ratio for $n=2$ was $1.12495$, close to the Bernoulli value $9/8$.

Section 8.3 shows that the erasure class is not a reduction target: garbling preserves mutual absolute continuity, and revealing common parts can never show amplification. Privacy amplification by subsampling (Balle–Barthe–Gaboardi, Theorem 10, at $\varepsilon=0$) is the one-differing-record counterpart of Theorem 3.1.

## Technical account

**Erasure overlaps.** For an erasure experiment, given the counts $N$, the overlap of the labelled experiment is a product over coordinates. Taking logarithms, the information is $\max(N\cdot a,N\cdot b)$ for two nonnegative budget vectors $a,b$, one per hypothesis, and the fixed-design distance constrains their sums. The expectation of a maximum of two linear forms is convex in $(a,b)$, so the worst case sits at extreme points of a product of simplices: each hypothesis puts its whole budget on one coordinate. That turns the problem into the law of a pair of counts $(N_i,N_j)$, giving $\mathbb E\max(N_i,N_j)$, or a single count, giving $\mathbb P(N\ne0)$.

**Uniform resampling.** For multinomial counts the pair $(K,L)$ has an explicit law, and $C_n=\mathbb E\max(K,L)$ is computed exactly. As $n\to\infty$, $(K,L)$ tends to two independent Poisson(1) variables, and a telescoping identity for the Bessel functions gives $C_\infty$. The extremal five-outcome family puts weak opposing signals on two coordinates and nothing on the rest; every observation that can occur under both hypotheses reveals its index, so $H$ equals the labelled distance and the ratio $H/D$ tends to $C_n$.

**Two differing coordinates.** Given counts $k$ and $l$ for the two differing coordinates, the observations group into $\min(k,l)$ copies of the pair and $|k-l|$ single copies, each with distance at most $D$. The product-overlap inequality then bounds the conditional distance by $1-(1-D)^{\max(k,l)}$, and the five-outcome family attains this in every count case; averaging gives $F_n$, and for $n=2$ the quadratic modulus.

**High signal.** Every count vector other than the balanced one $(k,\dots,k)$ is shown to carry overlap of smaller order. The construction gives coordinate $i$ a weight $B^{i-1}$, so that the total exponent for a count vector is a base-$B$ number; only the balanced vector achieves the minimum, and unbalanced vectors lose at least a fixed power of $1-D$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/resampling-homogenisation-constants.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 16-page paper. The paper opens with a plain introduction (the problem, what was known, what is new with the class and regime of each result, relation to other work, and a roadmap) and ends with interpretation, the conjecture with its evidence, why the erasure class is not a reduction, open problems and an AI-use statement. No proof assistant was used.
- **Exact checks.** Exact rational arithmetic checks the extremal families directly over finite product spaces for $n=2,\dots,5$; the constants $C_n$ for $n\le40$ and the limit; the identities for $F_2$, $F_3$ and $D_*$; the three-component formula against independent constrained optimisation at nine distances and against 4916 rational chamber cases; the high-signal construction for nine choices of $(n,k,B)$ (107 count vectors) and the base-$B$ separation in 72 cases; and the Bernoulli example of Section 8.3. These test the formulas and constructions; the general statements rest on the proofs.
- **Numerical search.** A fixed-seed search over arbitrary finite experiments supports Conjecture 8.1. It is a finite numerical search, not a proof.
- **Tests that can fail.** No script uses `assert`, so the checks behave identically under Python's optimised mode. Changing $87/400$ to $88/400$ in the Bernoulli check, or doubling the lower bound in the high-signal sandwich check, makes the script exit with failure.
- **Replay.** All nine scripts were rerun from fresh copies before release under Python 3.12 with pinned libraries, the exact checks also under `python -O`; every log matched apart from wall-clock timings. GitHub CI reruns the exact checks under `-O` against the recorded logs, with both negative controls, as a blocking job; the figure and the search run in a separate non-blocking job.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay found no error in any theorem and led to one revision round. It stated the improvement over $8/9$ prominently, put the class restriction into every headline, credited the labelled lift and the earlier two-source bound, added related work, replaced an unread terminology citation by an intrinsic definition, rewrote the introduction for non-specialists, replaced `assert` checks, and added extensions: the exact two-source problem, the large-$n$ limit, a sharper high-signal construction and the documented conjecture. A re-review, a proof audit and a second-model audit of the new proofs followed. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The exact general constant is conjectural. The erasure constants are not known to bound general experiments. The high-signal limit keeps $n$ and $k$ fixed and can converge slowly. Finite-distance optima for four or more erasure experiments, budgets that are not multiples of $n$, adaptive schedules and differential-privacy versions are open. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Statisticians comparing fixed and random designs | Exact worst-case factors by which resampling can raise a test's power in a natural class, and the exact two-source answer | The general constant $9/14$ is an upper bound; its exactness is conjectural |
| Information theorists | Sharp tensorisation-type constants for mixtures of product experiments | Erasure results do not transfer to general experiments |
| Differential-privacy researchers | Two-record analogues of amplification by subsampling at $\varepsilon=0$ | Hockey-stick versions are not proved here |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks test formulas; they are not part of the proofs |

## Why the problem matters

Resampling is everywhere: the bootstrap, random-design experiments, randomised data collection and subsampling for privacy all replace "look once at each source" by "draw at random". Knowing how much such a design can gain or lose against the fixed design, in the quantity that controls the best possible error rate, tells a designer how much randomness costs or buys. Kontorovich showed the gain is bounded by a universal constant; this candidate pins down exact constants in a natural class, improves the general bound, and identifies exactly what survives when the evidence is strong.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, on a copy of the package (the scripts write into `logs/` and `figures/`), with [uv](https://docs.astral.sh/uv/):

```sh
shasum -a 256 -c MANIFEST.sha256
UV="uv run --no-project --python 3.12 --with numpy==2.3.5 \
  --with scipy==1.17.0 --with sympy==1.14.0 --with mpmath==1.3.0 \
  --with matplotlib==3.10.8"
$UV python -I -B -O code/verify.py        # about 2 s
$UV python -I -B -O code/check_extensions.py
$UV python -I -B code/search_unrestricted.py   # about 2.5 min
```

`ENVIRONMENT.txt` lists the software used. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Prove or refute $c^*=9/14$, even for three sources or in the weak-signal limit $D\to0$ (Conjecture 8.1).
2. Determine the Bernoulli constant, conjecturally $8/9$.
3. Find the exact finite-distance optimum for four or more erasure experiments, and for three or more arbitrary experiments.
4. Extend the schedule constant to the hockey-stick divergences of differential privacy, which would give exact amplification factors for subsampling with several differing records, and to adaptive schedules.

## What is in the evidence package

The paper (LaTeX source and PDF); nine scripts in `code/` with their recorded logs in `logs/`; Figure 1 in `figures/`; `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, figure and data, MIT for code), the CI workflows and SHA-256 sums.
