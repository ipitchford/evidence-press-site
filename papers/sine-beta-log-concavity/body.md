## Summary

**In one sentence.** For every strength of repulsion β, the points of the Sine-β process, counted outward from a fixed origin, have a single-peaked (log-concave) and positively dependent joint law. This proves a 2024 conjecture of Johnston and Prochno. As a consequence, the typical gap between neighbouring points obeys explicit Gamma-type bounds, and their shape cannot be improved.

**The object.** Take a large random matrix and look at its eigenvalues on the scale of one typical gap between neighbours. For a very wide range of models the same random pattern appears: the **Sine-β point process**. The number β measures how strongly neighbouring points repel each other. The values β = 1, 2 and 4 are the classical real, complex and quaternion matrix ensembles; at β = 2 the pattern is the "sine process" of the Gaussian unitary ensemble, which is also used as a model for the spacings of zeros of the Riemann zeta function. Exact formulas for this pattern are rare, so properties of its *shape* that hold for every β are valuable.

**The question.** Number the points outward from a fixed origin: $Z_0$ is the first point to the right, $Z_{-1}$ the first point to the left, and so on. Johnston and Prochno (2024, Conjecture 2.2) conjectured that, for the sine process, any selection of these points has a **log-concave** joint density. Log-concave means that the logarithm of the density bends only downwards: the law has a single peak, light tails and strong concentration. In their July 2026 revision the conjecture is described as strongly supported but unproved.

**Why it was not straightforward.** Near the edge of the spectrum the answer was already known (Baslingker, Krishnapur and Madiman), because "the $k$-th point from the edge" is a fixed coordinate of the ordered eigenvalues, and log-concavity passes from finite matrices to the limit. In the middle of the spectrum this breaks down. How many points happen to lie to the left of the origin is random, so "the first point to the right of the origin" is a mixture of different coordinates, and mixing log-concave laws can destroy log-concavity.

**The idea.** Put the particles on a circle instead of a line, and cut the circle at the origin. After the cut, the first point to the right of the origin is literally the first coordinate, and the first point to the left is the last coordinate shifted by one full turn. Nothing about the labelling is random any more. The density of the cut circle is log-concave and **totally positive** (MTP₂, a strong form of positive dependence) because the logarithm of a sine is concave, and both properties survive the limit in which the circle becomes Sine-β.

**What is proved, for every β > 0.**

| Result | In plain terms | Where |
|---|---|---|
| The conjecture, for every β | Any finite selection of origin-labelled points has a log-concave density and is MTP₂ | Theorem 2.1 |
| Repulsion is kept | Dividing the density by the repulsion between the selected points leaves a function that is still log-concave and MTP₂; the same holds seen from a typical point | Theorem 2.2, Corollary 2.3 |
| Gamma bounds for spacings | The typical spacing $G$ (mean one) is less spread out, in the convex order, than a Gamma variable of shape β+1; so $\operatorname{Var}(G)\le1/(\beta+1)$, with moment and tail bounds | Theorem 2.4 |
| The shape cannot be improved | Small gaps have probability of exact order $t^{\beta+1}$; as β → 0 the variance bound becomes exact | Theorem 2.4, Proposition 2.5 |
| Finite matrices | The same Gamma comparison holds for any eigenvalue difference, divided by its mean, in a finite β-ensemble with a convex potential, at every matrix size; for the Gaussian unitary ensemble this improves moment bounds and far-tail bounds of Johnston (2026) | Theorem 2.6, Corollary 2.7 |
| A charge at the origin | For the Hua–Pickrell process (a point charge δ placed at the origin), all labelled laws are MTP₂ when $\operatorname{Re}\delta>-1/2$, and they are log-concave exactly when $\operatorname{Re}\delta\ge0$ | Theorem 2.8 |
| The hard edge | The points on one side of a hard wall (the Bessel-type limit) are log-concave whenever $a\ge1/\beta-1$, a range not covered by earlier work | Proposition 2.9 |

**How good are the numbers?** At β = 2 the exact values can be computed. The variance bound is $1/3$, against the true variance $0.180$: within a factor of two. Small-gap bounds have the correct power of $t$. Large-gap bounds are weak: the bound on the probability that a spacing is at least three times its mean is $0.067$, while the true value is $4.9\times10^{-5}$, because the truth decays like a Gaussian and the bound only exponentially.

**What this does not say.** Nothing here concerns actual zeros of the Riemann zeta function. The Hua–Pickrell results concern laws (with densities only at β = 2). Whether the hard-edge range is the exact one, and several other questions, are open (see the next projects below).

## Summary for specialists

Let Sine-β have intensity one, with origin labels $\cdots<Z_{-1}<0<Z_0<Z_1<\cdots$ and, under the Palm law $\mathbb P^0$, labels $X_0=0<X_1<\cdots$ and spacings $G_j=X_j-X_{j-1}$, $G=G_1$, $\mathbb E^0G=1$. Write $\Delta(z)=\prod_{r<s}(z_s-z_r)$ and $U\preceq_{\mathrm{cx}}V$ for the convex order.

- **Theorem 2.1** *(proof)*: for every $\beta>0$ and distinct integers $i_1,\dots,i_d$, $(Z_{i_1},\dots,Z_{i_d})$ has a log-concave density, positive on its ordered sign chamber, and is $\mathrm{MTP}_2$. At $\beta=2$ this is Johnston–Prochno, arXiv:2410.10754v2, Conjecture 2.2.
- **Theorem 2.2** *(proof)*: $f_I/\Delta^\beta$ is log-concave and $\mathrm{MTP}_2$; for Palm labels, $f_I^0(x)/\big(\Delta(x)^\beta\prod_r|x_r|^\beta\big)$ is too. **Corollary 2.3**: the density $p_\beta$ of $G$ has $p_\beta(s)/s^\beta$ log-concave, and consecutive Palm spacings satisfy the corresponding joint statements.
- **Theorem 2.4** *(proof)*: $G\preceq_{\mathrm{cx}}\mathrm{Gamma}(\beta+1,\beta+1)$; hence $\operatorname{Var}(G)\le1/(\beta+1)$, $\mathbb E G^{-1}\le(\beta+1)/\beta$ and $\mathbb P^0(G\le t),\ \mathbb P^0(G\ge t)\le(te^{1-t})^{\beta+1}$ on the respective ranges. The shape is optimal: $G\preceq_{\mathrm{cx}}\mathrm{Gamma}(a',a')$ fails for $a'>\beta+1$, and $c\,t^{\beta+1}\le\mathbb P^0(G\le t)\le C\,t^{\beta+1}$ on $(0,1]$. **Proposition 2.5**: $(\beta+1)\operatorname{Var}(G)\to1$ as $\beta\to0$.
- **Theorem 2.6** *(proof)*: for an ordered density $\propto\mathbf 1\{x_1<\dots<x_n\}e^{-V(x)}\prod_{i<j}(x_j-x_i)^\beta$ with $V$ convex, every selected marginal satisfies "$f_I/\Delta^\beta$ log-concave", and every normalised difference $D_{ij}/\mathbb E D_{ij}\preceq_{\mathrm{cx}}\mathrm{Gamma}(\beta+1,\beta+1)$; the comparator is attained for $n=2$. **Corollary 2.7** gives explicit bounds for Gaussian β-ensembles at every $N$; for GUE the moment bounds beat Johnston (2026, Proposition 2.2) for every $p>1$ and the tail bounds for $h>2.15$ and $h<0.31$, so the two sets of tail bounds should be combined by minima.
- **Theorem 2.8** *(proof)*: for $\mathrm{HP}_{\beta,\delta}$, $\delta=a+ib$, $a>-1/2$: all labelled laws are $\mathrm{MTP}_2$; all are log-concave iff $a\ge0$; $\mathbb P(\lambda_0\le\varepsilon)\ge C\varepsilon^{2a+1}$, and for $a\ge0$ the first point is log-concave of order $2a+1$ with optimal Gamma shape. Statements are for laws; densities exist at $\beta=2$.
- **Proposition 2.9** *(proof)*: the positive points of Li–Valkó's $\mathrm{Bess}_{\beta,a}$ are $\mathrm{MTP}_2$ for every $a>-1$ (also a consequence of Baslingker–Krishnapur–Madiman, Theorem 8) and log-concave for $a\ge1/\beta-1$.

## Technical account

**The cut.** On a circle of circumference $n$ with $n$ particles, the ordered density of the circular β-ensemble cut at $0$ is $\propto\mathbf 1\{0<y_1<\dots<y_n<n\}\prod_{i<j}\big[2\sin(\pi(y_j-y_i)/n)\big]^\beta$. Its negative log-Hessian is $\beta(\pi/n)^2\sum_{i<j}\csc^2(\pi(y_j-y_i)/n)(v_j-v_i)^2\ge0$, and each pair factor is a log-concave difference kernel, hence $\mathrm{MTP}_2$ (Lemma 3.1). Periodising, $Z^{(n)}_j=y_{j+1}$ and $Z^{(n)}_{-r}=y_{n-r+1}-n$, so every fixed block of origin labels is a set of fixed coordinates: no mixture over a random rank occurs. Prékopa's theorem and the marginal closure of $\mathrm{MTP}_2$ give the finite statement.

**The limit.** Valkó and Virág (2020, Corollary 2) couple the circular ensembles with Sine-β so that every origin-labelled point converges almost surely. Log-concavity and $\mathrm{MTP}_2$ are closed under weak limits (the latter by Colangelo–Müller–Scarsini). Densities need a separate argument, supplied by the tolerance (DLR) theory of Dereudre, Hardy, Leblé and Maïda (Lemma 4.1).

**Keeping the repulsion.** The extra fact is that $\log\big(\sin(\pi s/n)/s\big)$ is still concave, so dividing out the pair factors between retained particles before integrating leaves a log-concave, $\mathrm{MTP}_2$ function (Lemma 5.1). A closure lemma for weighted log-concavity (Lemma 5.3) and convergence of Palm laws (Lemma 5.2) carry this to the limit. For a single spacing it says $G$ is "log-concave of order $\beta+1$", and the two-crossing argument then gives the Gamma comparison.

**Optimality and the charge.** Pinning one particle turns the circular ensemble into a circular Jacobi ensemble with charge $\delta=\beta/2$ (Valkó–Virág 2023), so the Palm process is $\mathrm{HP}_{\beta,\beta/2}$ (Lemma 7.2). A small-ball lower bound for the first Hua–Pickrell point, through Li and Valkó's phase representation with an independent boundary angle (Lemma 7.1), shows $\mathbb P(\lambda_0\le\varepsilon)\ge C\varepsilon^{2a+1}$. With $a=\beta/2$ this gives the optimal shape $\beta+1$; with $-1/2<a<0$ it contradicts log-concavity, which is how the threshold $\operatorname{Re}\delta\ge0$ becomes exact.

**Classical and new.** Classical and cited: the circular density and its convexity; the closure of log-concavity and $\mathrm{MTP}_2$ under marginals and limits; finite convexity on the line (Baslingker–Krishnapur–Madiman, Theorems 7–8); the Gamma comparison principle for laws that are log-concave of a given order (Bobkov–Madiman; Marsiglietti–Melbourne); and the limit theorems of Valkó–Virág and Li–Valkó. New within the prior-art search recorded in the package: the cut-circle route to origin labels, the labelled theorem for every β, the retained-repulsion quotient, the optimality of the shape and the small-gap order, the Hua–Pickrell threshold and the hard-edge range.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/sine-beta-log-concavity.txt) is available for reading.

- **Proofs.** Every result has a written analytic proof in the 18-page paper. The proofs rely on published limit theorems (Valkó–Virág 2020 and 2023; Li–Valkó 2022; Dereudre–Hardy–Leblé–Maïda 2021). No proof assistant was used.
- **Computational checks.** `verify.py` runs 9,694 finite falsification checks of the formulas used in the proofs: symbolic identities, exact fingerprints of the circular ensemble for $n=1,2,3$, random tests of the lattice and concavity inequalities for the cut, cross-cut, pinned, circular Jacobi and real orthogonal densities, and negative controls below the charge and hard-edge thresholds. `sine2_calibration.py` computes the exact β = 2 values (variance $0.17999$, $\mathbb E\,1/G=1.2758$, $\mathbb P(G\le0.1)=1.088\times10^{-3}$, $\mathbb P(G\ge3)=4.944\times10^{-5}$) by Bornemann's Fredholm-determinant method and draws the paper's figure. No computation is part of a proof.
- **A test that can fail.** In a copy of `verify.py` the hard-edge parameter was lowered below $1/\beta-1$; under Python's optimised mode the script reported failure and exited with an error, as it must.
- **Replay.** Both scripts were rerun from two fresh copies of the package, normally and under `python -O`; both reported PASS, and the JSON outputs and PNG figure were byte-identical to the shipped files. GitHub CI reruns both on Linux.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round with extensions (optimal shape, β → 0, the finite Gaussian corollary, the charge-retained quotient, the hard-edge range); a re-review, a proof audit and a second-model audit of the new proofs found no failing result. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The large-gap bounds decay exponentially while the truth decays like a Gaussian. Hua–Pickrell results are for laws, with densities only at β = 2. The hard-edge range $a\ge1/\beta-1$ is sufficient; whether it is necessary is open. The large-β variance constant of about $0.494$ is a labelled heuristic. Nothing concerns actual zeta zeros. Priority rests on a bounded literature search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Random matrix theorists | A structural theorem for bulk labelled points for every β, a cut-circle route that may transfer to other ensembles, and an exact threshold for charged limits | The proofs lean on strong known limit theorems; densities for charged limits are proved only at β = 2 |
| Users of eigenvalue-spacing statistics | Explicit, model-free bounds on spacing variance, moments and small-gap probabilities, for every β and at every finite size for convex-potential ensembles | Bounds are tight near zero and within a factor of two for the variance, but loose for very large gaps |
| Probabilists working on log-concavity and positive dependence | A natural infinite system where log-concavity and total positivity of marginals hold with an exact repulsion factor retained | No positive-association statement for gap vectors |
| Research agents | Machine-readable claims, an agent index, and two scripts that rerun in seconds | The computations check formulas; the theorems rest on the written proofs |

## Why the problem matters

Universality says that the local statistics of eigenvalues look the same across very different random matrix models, but it does not say what those statistics look like. Shape properties such as log-concavity are among the few things one can prove for every β at once, and they immediately give concentration and small-ball estimates. The conjecture was natural and well supported, yet the obvious proof failed in the bulk for a structural reason (the random rank of the origin). Removing that obstacle by a deterministic cut gives the conjecture, a stronger statement that retains the repulsion, and quantitative spacing bounds whose shape is provably the right one.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root, with [uv](https://docs.astral.sh/uv/):

```sh
shasum -a 256 -c MANIFEST.sha256
uv run --no-project --python 3.12 --with numpy==2.3.5 --with scipy==1.17.0 --with sympy==1.14.0 \
    --with matplotlib==3.10.8 python -I -B verification/verify.py --out fresh_output
uv run --no-project --python 3.12 --with numpy==2.3.5 --with scipy==1.17.0 --with sympy==1.14.0 \
    --with matplotlib==3.10.8 python -I -B verification/sine2_calibration.py --out fresh_output
```

Each script prints `"status": "PASS"` and exits with status 0 only if every check passes; the checks are explicit tests, so they also run under `python -O`. On other platforms last digits of floating-point values can differ. Section 9 of the paper says what the scripts test. `AI_INDEX.md` maps each claim to its proof and checks, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. The exact hard-edge threshold: is log-concavity false for $a<1/\beta-1$? This needs a hard-edge small-ball lower bound, where no independent boundary angle is available.
2. Densities for Hua–Pickrell laws at every β, through a tolerance theory for charged limits.
3. Sums of spacings: is $X_m$ log-concave of the larger order suggested by counting powers in the retained repulsion?
4. Large gaps and large β: a comparison that captures the Gaussian decay of large gaps, and a proof of the large-β variance constant.
5. Dependence between spacings: are the Palm spacings positively or negatively associated?

## What is in the evidence package

The paper (LaTeX source and PDF); `verification/verify.py` and `verification/sine2_calibration.py` with their recorded outputs and the figure; `requirements.txt` and `ENVIRONMENT.txt`; the dated prior-art search record (`novelty_report.md`, `target.yaml`); `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and `MANIFEST.sha256`.
