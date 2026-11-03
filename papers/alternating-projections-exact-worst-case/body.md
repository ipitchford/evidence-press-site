## Summary

**In one sentence.** When two convex sets share a ball, the slowest possible run of alternating projections is exactly a thin wedge made of two half-planes; this proves a 2024 conjecture of Luner and Grimmer, in every dimension.

**The method.** Many practical problems ask for a point that satisfies two constraints at once: an image that matches measured data and has no negative brightness, a matrix with prescribed entries that is also positive semidefinite, a signal with a given spectrum and a given support. *Alternating projections* (von Neumann's method; POCS in signal processing) find such a point by repeatedly jumping to the nearest point of one set, then to the nearest point of the other. When both sets are convex the method converges, but it can be slow, and it is also widely used as a subroutine inside larger algorithms.

**What "worst case" means here.** Suppose both sets contain a common ball of radius $\delta$, and the starting point lies within distance $R$ of the ball's centre. After $N$ rounds (one jump to each set per round), how far from a solution can the method still be, over every possible pair of sets in every dimension? The answer, $W_N$, is a guarantee: no instance satisfying these two conditions can do worse.

**What was conjectured.** Luner and Grimmer (arXiv:2410.14811, versions 1 and 2, 2024) built a pair of half-planes that touch the ball and meet in a narrow corner. The iterates zig-zag towards the corner and get closer by the same factor $c$, the cosine of the corner angle, at every jump. Choosing the angle well for each $N$ gives the error

$$
W_N=\max_{0\le c\le\kappa}c^{2N-1}\left(\sqrt{R^2-\delta^2}-\delta\sqrt{\frac{1+c}{1-c}}\right),\qquad \kappa=1-\frac{2\delta^2}{R^2}.
$$

They conjectured that nothing is worse (their Conjecture 6.2). Their journal version omits this section, and no proof had been found.

**What is now proved.** Theorem 1 proves the conjecture for every $N$, in every dimension: no pair of convex sets with a common ball of radius $\delta$ and a start within $R$ does worse than the wedge. If $R\le\sqrt2\,\delta$, one round always reaches a solution. The argument is short enough to check by hand. The same argument gives exact answers for balls of different radii about a common centre, for any number of single projections (at least two), in infinite-dimensional Hilbert space, and for the residual (the distance to the other set).

**What was already known, and what is new.** The formula and the attaining wedge are Luner and Grimmer's. Classical results already gave a linear rate under an interior ball (Gubin, Polyak and Raik, 1967), the exact rate for two subspaces (Kayalar and Weinert, 1988), and an exact residual rate without an interior ball (Zamani and Glineur, 2024). The new content is the matching upper bound and the extensions.

**What it means in practice.** The guarantee is much better than the classical one. With $R/\delta=10$, reaching accuracy $10^{-3}R$ needs at most **93 cycles** in the worst case, against 212 from an elementary bound with the same geometric factor and **833** from the classical interior-point bound (the banner shows the comparison). Typical problems usually converge faster still: these are worst-case counts.

## Summary for specialists

Let $A,B$ be closed convex subsets of $\mathbb R^d$ with $\overline B(q,\delta)\subseteq A\cap B$, $\|x_0-q\|\le R$, $y_0=P_Ax_0$ and $x_N=(P_BP_A)^Nx_0$. Define $W_N(R,\delta)=\sup\operatorname{dist}(x_N,A\cap B)$ over all dimensions and admissible instances.

| Result | Status |
|---|---|
| $W_N=0$ if $R\le\sqrt2\,\delta$; otherwise $W_N$ equals the formula above, with a unique maximiser, attained by two planar half-planes, independent of dimension | **Theorem 1 (proof)**; formula and lower construction from Luner–Grimmer (2024, Prop. 6.1); upper bound new |
| Unequal radii $a,b$ about a common centre, any $k\ge2$ single projections, real Hilbert space: $W=\max_{c}c^{k-1}D_{AB}(R,c)$, zero iff $R^2\le a^2+b^2$ | **Theorem 7 (proof)** |
| Exact worst residual $\max_c c^m\sqrt{1-c^2}\,D_{AB}(R,c)$; as $\delta\to0$ it tends to the Zamani–Glineur rate | **Theorem 8 (proof)** |
| $W_N\sim R^4\kappa^{2N}/(8e\delta^2\sqrt{R^2-\delta^2}\,N)$; limiting profile as $N\delta^2/R^2\to\lambda$ | **Corollaries 5–6 (proof)** |
| Near-worst instances: $\operatorname{dist}(P_Ax_0,A\cap B)=\Theta(1/N)$; geometric contraction relative to the initial distance | **Corollaries A2–A3 (proof)** |

The per-projection factor in the exponent is $\kappa=\cos 2\theta$ with $\sin\theta=\delta/R$, four times better in the exponent than the classical factor of about $1-\delta^2/(2R^2)$, plus an extra $1/N$.

## Technical account

**Two numbers per iterate.** Translate the ball centre to the origin. For each iterate $y_j$ the proof tracks only $r_j=\|y_j\|$ and the next step length $t_{j+1}=\operatorname{dist}(y_j,\text{other set})$. Two projection identities, which use only the ball and the normal cones, show that the next state is dominated coordinatewise by the state the half-plane wedge would produce (Lemma 2): $r_{j+1}^2\le r_j^2-t_{j+1}^2-2\delta t_{j+1}$ and $t_{j+2}\le c(r,t)\,t_{j+1}$.

**A value function.** Lemma 4 defines a value function $V_k(r,t)$, the best error the wedge can still achieve in $k$ further steps from state $(r,t)$. It increases in both coordinates and does not increase under the wedge update. Telescoping along any trajectory therefore bounds its final state by the wedge's.

**A sharp error bound.** Lemma 3 converts the final state into a distance: for any admissible point $y\in A$ with $\|y\|\le r$ and $t=\operatorname{dist}(y,B)$, $\operatorname{dist}(y,A\cap B)\le E(r,t)$, with equality for half-planes. This is a sharp, explicit form of bounded linear regularity, and it doubles as a computable stopping test for any run.

**Why the worst case has a $1/N$.** A thinner wedge contracts more slowly but forces the start closer to its corner. The optimal angle moves towards $\kappa$ as $N$ grows, which produces the factor $1/N$. After the first projection, near-worst instances are only $\Theta(1/N)$ from a solution, so measured from the initial distance every instance contracts at least geometrically.

**Extensions.** The proof never uses equal radii, the parity of the number of projections or finite dimension, beyond what the scalar inequalities need. With balls of radii $a\ne b$ about one centre, the same comparison holds with a two-radius state function. The order of projections matters for the constant but not for the rate. Three or more sets break the key inequality (7), so they remain open.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/alternating-projections-exact-worst-case.txt) is available for reading.

- **Proofs.** Every theorem, lemma, corollary and proposition has a written proof in the 19-page manuscript.
- **Finite checks.** Four standard-library suites run 88,902 explicit checks in exact rational or high-precision decimal arithmetic. Two independently written suites check the scalar identities and inequalities of Lemmas 2–4. A third computes exact projections onto 160 polygon pairs containing the unit ball and compares with the formula (largest ratio 0.99940). The extension suite covers Theorems 7–8, a randomised search over 720 instances (largest ratio 0.99862), the Zamani–Glineur limit, the asymptotics and the cycle-count tables. These checks can reveal errors; they do not prove the theorems.
- **Negative controls.** Planted single-inequality errors made every suite fail, with and without Python's `-O` flag. Every check is explicit rather than an `assert`.
- **Replay.** The suites were rerun from a fresh copy of the approved package and again from the frozen archive, with and without `-O`. Outputs matched the shipped results apart from timings and the recorded manuscript hash, and the figures were regenerated byte for byte. GitHub CI reruns the checks on Linux.
- **Review.** Internal AI-assisted review only: five reviewer roles, an adversarial review by a second model, a proof audit, a second-model audit of the new proofs, and a re-review. None found a correctness issue. Reviewers' own numerical attacks, tens of thousands of polygon and polytope instances, found nothing above the bounds. A rating-free summary of the objections and how each was resolved is in the package. None of this is human peer review, independent reproduction or formal verification.
- **Scope.** The results cover two closed convex sets, exact (unrelaxed) projections, and a common ball, or balls about a common centre. They are worst cases over all such sets; typical runs are faster.
- **Priority.** A dated search on 3 November 2026 (arXiv, Crossref, Semantic Scholar citing works, the web, GitHub issues and the authors' repository) found no earlier proof. One GitHub issue about alternating projections, trureturing #24957, concerns von Neumann's subspace theorem and is unrelated. A bounded search is not a certificate of priority.

## Relationship to earlier work

The conjecture, its formula and the extremal wedge come from Luner and Grimmer's performance-estimation study of smooth and strongly convex sets (arXiv:2410.14811 v1 and v2; the journal version in *Mathematical Programming*, 2026, drops the section). Performance estimation itself goes back to Drori and Teboulle (2013) and Taylor, Hendrickx and Glineur (2016, 2017). For alternating projections, Kayalar and Weinert (1988) gave the exact rate for subspaces, Gubin, Polyak and Raik (1967) the classical interior-point rate, De Bernardi and Miglierina (2021) a non-sharp radius-loss inequality, and Zamani and Glineur (2024) the exact worst residual without an interior ball, which Theorem 8 recovers as a limit. Bauschke, Deutsch and Hundal (2009) show why some condition such as an interior ball is needed: without it convergence can be arbitrarily slow.

Within Evidence Press, [*Exact finite-horizon gap constants and non-attainment for Davis–Yin splitting*](/releases/davis-yin-gap-sharpness/) also computes exact finite-horizon worst-case constants, for a different splitting method.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Engineers using POCS or projection-based feasibility methods in imaging and signal processing | An exact worst-case cycle count and a computable stopping bound when a common interior ball of known radius is available | Worst case over all sets; typical runs are faster. Two sets and exact projections only |
| Optimisation researchers | A short proof technique (two-number state, monotone value function, sharp error bound) for exact finite-horizon analysis | Not yet extended to three or more sets, relaxed projections or smooth/strongly convex classes |
| Authors of the conjecture | A proof of Conjecture 6.2 with extensions to unequal radii and residuals | No external check yet; Lemmas 2–4 are the place to start |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | Checks are finite; the theorems rest on the written proofs |

## Why the problem matters

Alternating projections are among the oldest and most widely used algorithms in applied mathematics, both on their own and inside larger methods. Users need to know how many iterations to run. Classical guarantees under an interior point are valid but pessimistic, by a factor of five to nine in the examples here. An exact worst-case count tells a user precisely what can be promised and when to stop, and the sharp error bound gives a stopping test that any run can compute.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B run_checks.py --out NEW_DIR      # 88,902 checks, standard library, about 40 seconds
python3 -I -B -O run_checks.py --out NEW_DIR_O # the same under -O; every check is explicit
python3 -m venv env && env/bin/pip install -r requirements.txt   # numpy 2.3.5, matplotlib 3.10.8
env/bin/python -I -B code/plot_exact_results.py                 # regenerates figures/
```

`AI_INDEX.md` maps each claim to its place in the paper and its evidence, `VERIFICATION.md` describes each suite, `PRIOR_ART.md` records the dated search, and `REVIEW_SUMMARY.md` lists the review objections and their dispositions.

## The most valuable next projects

1. Extend the exact worst case to three or more sets, where the key inequality (7) fails and a new comparison is needed.
2. Treat relaxed or averaged projections, and balls with different centres.
3. Settle the smooth and strongly convex set classes of Luner and Grimmer's wider study.
4. Have a specialist check Lemmas 2–4, or formalise the scalar lemmas in a proof assistant.

## What is in the evidence package

The 19-page paper (PDF and Markdown source) with its build script and three figures, their plotted data and plotting script. Four check suites, the runner and their recorded outputs. A verification record, an agent index, the dated prior-art record and a rating-free review summary. Crossref records and a bibliography built from registry records. Contribution and limitation records (`RESEARCH_GATES.json`), citation metadata, CI and SHA-256 sums for every file. The paper is an unrefereed candidate, released for scrutiny.
