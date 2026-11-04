## Summary

**The setting.** *Optimal transport* measures how different two probability distributions are by the cheapest way of moving one pile of mass onto the other. Adding a small amount of entropy, with strength $\varepsilon$, makes the computation much faster (*Sinkhorn's method*) and is now standard in statistics and machine learning. The resulting *Sinkhorn divergence* also defines a local "metric": a rule for how far apart two nearby distributions are. As $\varepsilon\to0$ this metric should recover the classical Wasserstein geometry of optimal transport. Lavenant and co-authors (2025) introduced the metric and derived this limit formally; making it rigorous for continuous densities was left open.

**The question.** Data often lie on curved surfaces inside a larger space: a circle, a sphere, a curved sheet. If transport cost is measured by straight-line distance in that space, does the Sinkhorn metric converge to the right limit, and how large is the error at small $\varepsilon$?

**The answer.**

- **The limit is right (proved).** For a smooth positive density on a closed surface of any dimension embedded in Euclidean space, the Sinkhorn metric converges to the Wasserstein metric of the surface, with rates.
- **But it reads slightly short (proved).** At small $\varepsilon$ the metric is too small by $\tfrac{\varepsilon}{4}\int\langle Q\nabla\phi,\nabla\phi\rangle\,d\mu$, where $Q$ measures how sharply the surface bends in space. The reason is simple: the cost uses the straight chord between two points, which is shorter than the arc along the surface.
- **A circle example.** On a circle of radius $R$ every mode of the metric is multiplied by $1-\varepsilon/(4R^2)$ to first order; on the unit circle the eigenvalue $1/k^2$ becomes $(1/k^2)(1-\varepsilon/4)$.
- **Same shape, different bias (proved).** The bias depends on how the surface sits in space, not only on its intrinsic shape. A round circle and an ellipse of the same length have the same limit but different first-order biases.
- **A cheap fix (proved).** A positive correction built from the Sinkhorn quantities themselves removes the first-order error.

**Rule of thumb.** The relative bias is about $\varepsilon/(4R^2)$ for the smallest radius of curvature $R$, so it matters only when $\varepsilon$ is not small compared with $4R^2$.

![Two panels. Left: for the uniform circle of unit radius, the scaled first-order error of the eigenvalues for modes k = 1, 2, 3, plotted against epsilon from 0.0001 to about 0.25; all three curves approach the predicted value minus one quarter as epsilon shrinks. Right: for a nonuniform density on an ellipse, the error of the original Sinkhorn metric falls with slope about 1 in epsilon, while the error after the positive correction falls with slope about 2.](/assets/figures/sinkhorn-metric-curvature-bias-validation.png "Figure 1 of the paper (numerical checks). (a) Unit circle, exact Bessel formula: the first-order coefficient of each mode tends to the predicted −1/4. (b) Ellipse with nonuniform density: the corrected metric's error falls like ε², the original's like ε.")

The sections below move from this overview to a specialist summary, the technical argument, evidence and limits, and how to rerun the checks.

## Summary for specialists

Let $M\subset\mathbb R^D$ be compact, connected, smooth and without boundary, $\mu=\rho\,d\mathrm{vol}$ with $\rho$ smooth and positive, cost $|x-y|^2$. Write $A=-\rho^{-1}\operatorname{div}(\rho\nabla)$, $A\phi=h$, $S_\alpha$ the shape operators, $Q=\sum_\alpha S_\alpha^2$, and $B_\varepsilon$ the Sinkhorn metric operator on centred $L^2(\mu)$.

| Result | Statement in brief | Where |
|:--|:--|:--|
| Limit and bias | $B_\varepsilon\to A^{-1}$ in operator norm; $g_\varepsilon(h\mu,h\mu)=\int|\nabla\phi|^2d\mu-\tfrac{\varepsilon}{4}\int\langle Q\nabla\phi,\nabla\phi\rangle d\mu+O(\varepsilon^2)$ | Thm 2.1, Prop 6.2 |
| Positive correction | corrected form accurate to $O(\varepsilon^2)$ on fixed smooth directions | Cor 2.2 |
| Density families | expansions in every fixed parameter-derivative order | Thm 2.3 |
| Rates | $O(\varepsilon^{1/2})$ in $L^2$ operator norm, $O(\varepsilon)$ from $H^2$ to $L^2$; sharp $O(\varepsilon)$ open | Thm 2.4 |
| Spheres | exact via Funk–Hecke, explicit $\varepsilon^2$ coefficient | Prop 9.1 |
| Obstruction | on the circle no operator-norm rate better than $O(\varepsilon)$ | Prop 9.2 |
| Embedding dependence | isometric embeddings differ at first order; $Q\not\equiv0$ | Prop 10.1 |

**Attribution.** The formal limit is due to Lavenant, Luckhardt, Mordant, Schmitzer and Tamanini. Operator-level Gaussian expansions with extrinsic terms are credited to Smolyanov–von Weizsäcker–Wittich, Liou–Lu and Guo; Guo's SSRN preprint could be read only at abstract level, so the inverse-metric coefficient is described as not located in the sources we could read. Schubr's author-posted preprints treat the analogous intrinsic heat-kernel cost.

## Technical account

**Structure.** After exact Sinkhorn scaling, the normalised transition operator satisfies $P_\varepsilon=I-\tfrac\varepsilon4A+\varepsilon^2(\tfrac{A^2}{32}-\tfrac{A_Q}{16})+O(\varepsilon^3)$ on smooth functions (Proposition 5.2), where the second-order tensor is $Q/16$ (Lemma 5.1): the scalar curvature and density terms cancel. An elementary residual estimate for positive kernels (Lemma 3.1) controls the exact scaling without pointwise ratio bounds.

**The singular inverse.** The metric involves $(I-P_\varepsilon^2)^{-1}$, which blows up like $\varepsilon^{-1}$. A uniform spectral gap (Lemma 4.1) and a uniform gradient bound (Lemma 6.1) pass the expansion through this inverse, giving $B_\varepsilon h=A^{-1}h-\tfrac\varepsilon4A^{-1}A_QA^{-1}h+O(\varepsilon^2)$ and operator-norm convergence. A uniform Sobolev remainder (Lemma 7.1) yields the rates of Theorem 2.4; intermediate frequencies block $O(\varepsilon)$ in general (Remark 7.2).

**Exact cases.** On the circle the eigenvalues are explicit ratios of modified Bessel functions; on spheres the Funk–Hecke formula gives the metric exactly. A frequency sequence $k\sim\varepsilon^{-1/2}$ on the circle shows that the $\varepsilon^2$ expansion cannot be uniform in frequency.

## Evidence, assurance and limitations

- **Proofs.** Every theorem, proposition, corollary and lemma has a written proof. No proof is machine-verified.
- **Checks.** Seven scripts: a symbolic check of the sphere coefficients; 60-digit sphere eigenvalues for $S^1$–$S^4$; a Funk–Hecke check; the flat torus in $\mathbb R^4$; a torus of revolution at nonconstant density; an equal-length ellipse against the circle; circle operator-norm evidence; a nonuniform ellipse at 768 and 1536 nodes; independent circle and ellipse implementations. These are floating-point checks, not certificates.
- **Replay.** All seven were rerun from fresh copies with and without Python `-O`; outputs matched the shipped results to roundoff (residual-level fields near $10^{-14}$ differ at roundoff). A deliberately corrupted circle coefficient is rejected under `-O`. GitHub CI reruns all seven on Linux.
- **Limits.** Population densities only, with no sampling theory; closed manifolds without boundary; smooth strictly positive density; the correction needs the curvature to be known; no convergence of global geodesic distances; the sharp $O(\varepsilon)$ operator-norm rate is open. The literature search was bounded (1 and 4 November 2026). Review was internal and AI-assisted only.

## Who should care, and why

| Audience | Potential use | Required caution |
|:--|:--|:--|
| People computing Sinkhorn distances or metrics on data lying on curved surfaces (manifold learning, shape analysis, meshes) | Size of the curvature bias, the rule of thumb $\varepsilon\ll4R^2$, and a correction | Continuous densities with known curvature; no sampling theory |
| Optimal-transport and geometric-analysis researchers | A rigorous small-$\varepsilon$ limit with rates and an exact extrinsic coefficient | Unrefereed; Guo's full text unread |

## Why the problem matters

Entropic regularisation is used because it is fast, and users rely on small $\varepsilon$ to approximate true transport geometry. This paper shows the approximation is right in the limit but systematically biased on curved data when distances are measured through the surrounding space, and says exactly how large the bias is and how to remove it.

## Related reading on Evidence Press

[*Curvature, relative entropy, and global Sinkhorn convergence*](https://evidencepress.org/releases/poincare-sinkhorn-global-rates/) asks a different question: how fast the Sinkhorn algorithm converges. It is cited by the paper and shares no theorem with this one.

## How to inspect or reproduce the recorded checks

From the unpacked archive (Python 3.11 or later, [uv](https://docs.astral.sh/uv/)):

```sh
export OPENBLAS_NUM_THREADS=1
U="uv run --with numpy==2.3.5 --with scipy==1.17.0 --with matplotlib==3.10.8 --with mpmath --with sympy python3 -I -B"
for s in sympy_sphere_coefficients check_spheres_tori check_torus_revolution check_ellipse_bias independent_circle_check independent_ellipse_check make_figures; do $U code/$s.py; done
```

Each script takes a few seconds, rewrites its JSON in `results/` and exits with an error if any check fails, also under `python -O`.

## The most valuable next projects

1. Prove or refute the sharp $O(\varepsilon)$ operator-norm rate on general manifolds.
2. Joint limits with empirical samples: how the curvature bias interacts with sampling error.
3. Boundaries, vanishing densities and estimated (noisy) curvature in the correction.
4. Read Guo's full text to settle the operator-level priority question.

## What is in the evidence package

The archive contains the LaTeX source and PDF, the bibliography built from saved Crossref, DataCite and arXiv records, the seven check scripts with their outputs, the validation figure, working proof notes, the dated prior-art ledger, a rating-free summary of the internal review, an AI index, research-gate records, CI configuration and SHA-256 sums. Text and data are CC0-1.0 and code is MIT. This is an unrefereed candidate.
