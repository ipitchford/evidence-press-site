## Summary

**What Gromov–Wasserstein transport does.** Ordinary optimal transport measures how far mass has to move between two distributions, which only makes sense when both live in the same space. Gromov–Wasserstein (GW) transport drops that requirement. It compares, say, a cloud of points in a plane with a cloud on a line, a three-dimensional shape with a flat scan, or two sets of measurements with no shared coordinates, by pairing points up so that distances *within* one dataset match distances *within* the other as closely as possible. That makes it a standard tool for shape matching, graph matching and aligning datasets or learned representations. Its drawback is cost: finding the best pairing is a hard, nonconvex problem, and practical solvers return local answers.

**The tempting shortcut.** For Gaussian (bell-shaped) data, Delon, Desolneux and Salmona (2022) found a closed-form answer by searching only over Gaussian pairings. It needs nothing but the eigenvalues of the two covariance matrices, so anyone who summarises each dataset by its covariance can use it. They conjectured that the restriction loses nothing. In October 2026 Gabriel Peyré showed that it can fail when a line is compared with a space of sufficiently high dimension.

**The example that drives the paper.** Match a standard Gaussian cloud in the plane to a standard Gaussian cloud on a line. The best Gaussian pairing simply projects the plane onto one axis and scores 12 (lower is better). The paper builds a curved rearrangement of the plane that keeps the line exactly Gaussian and provably scores below 76/7 ≈ 10.86 (about 10.47 numerically), and it proves that the true optimum lies between 8.68 and 10.85. So the shortcut overstates the true value by at least 9.6% here.

**What was found.** The shortcut is exact *if and only if* the two covariances have the same rank and their eigenvalues, sorted, are in the same proportions. In every other case, including two datasets of the same dimension, a Gaussian-preserving curved pairing does strictly better. The size of the error is bracketed from both sides by quantities computable from the two eigenvalue lists, and the Gaussian answer is never more than twice the true optimum; the factor two is approached by nearly isotropic data in high dimension. The underlying reason is a general fact: a linear map, such as a principal-component projection, is a GW-optimal pairing onto its image only if it multiplies all distances by one constant. Finally, plugging sample covariances into the Gaussian formula gives an estimate of the GW value that does not converge to the right answer when the proportions differ.

**How sure we are.** Every theorem has a written proof. Seven scripts check the identities, constants and examples with exact rational arithmetic, finite enumeration and high-precision numerics, and a negative-control script shows that planted errors are caught. This is an anonymous, AI-assisted, unrefereed candidate; its review was internal, not peer review. The true optimum when the proportions differ is still unknown, and some values quoted (10.47, 10.03, about 8.82) are numerical rather than certified.

## Summary for specialists

Squared-distance GW: $Q(\pi)=\mathbb E[(\|X-X'\|^2-\|Y-Y'\|^2)^2]$ with $(X,Y),(X',Y')$ independent draws from a coupling $\pi$ (no prefactor, squared inner and outer costs, the default POT objective with square loss). $Q_*$ is the unrestricted minimum and $Q_G=4[(\alpha-\beta)^2+2\|a-b\|^2]$ the Gaussian-restricted one (Delon et al., 2022), for zero-padded sorted covariance spectra $a,b$ with traces $\alpha,\beta$.

- Gaussian exactness: for positive-rank Gaussians, some unrestricted optimiser is jointly Gaussian $\iff Q_*=Q_G\iff$ equal positive ranks and proportional ordered positive eigenvalues; the conjecture of Delon et al. fails on every other pair, including equal dimensions (Theorem 5) *(proof; sufficiency due to Delon et al.)*
- Affine rigidity: if $\mu$ has finite fourth moment and support with nonempty relative interior in its affine hull, $(\mathrm{id},T)_\#\mu$ is optimal for affine $T$ iff $T$ is a similarity or constant, i.e. $L^\top L=\lambda I$ (Theorem 3); a four-point example shows interior support is needed *(proof)*
- Two-sided excess bound: with $S=\|a\|^2\|b\|^2-(a\cdot b)^2$, $S/(\|a\|\|b\|)\le Q_G-Q_*\le8(\|a\|\|b\|-a\cdot b)$ (Theorem 8), with sharper pair-specific certificates (Sections 6.1–6.2) and the maximal Gaussian-preserving slope (Proposition 7) *(proof; upper bound due to Delon et al.)*
- Factor two: $Q_G/2\le Q_*\le Q_G$, with $1/2$ approached by nearly isotropic spectra in high dimension (Corollary 9) *(proof)*
- Plane to line: $12-8(\sqrt2-1)\approx8.6863\le Q_*\le12-4/(1+\sqrt6)\approx10.8404$, and the flow coupling at $t=1/7$ has $Q<76/7$ *(proof)*; refinements to about 8.82 (Proposition 10, numerically evaluated) and couplings to about 10.03 *(numerical)*
- Equal dimensions, $a=(2,1)$, $b=(1,1)$: $10.70\le Q_*\le11.41<Q_G=12$ (Section 7) *(proof)*
- Plug-in inconsistency: for nonproportional spectra the empirical GW value converges to $Q_*$ while the plug-in Gaussian value converges to $Q_G\ne Q_*$ (Lemma 11, Proposition 12) *(proof)*

## Technical account

**Moment reduction.** After centring, $Q(\pi)=C_{\mu,\nu}-4G(\pi)$ with $G(\pi)=\mathbb E[\|X\|^2\|Y\|^2]+2\|K_\pi\|_F^2$ and $K_\pi=\mathbb E[XY^\top]$, so minimising $Q$ means maximising a radial fourth-moment term plus a covariance term (Lemma 1, known). Among all couplings $\|K_\pi\|_F^2\le a\cdot b$, and for jointly Gaussian couplings both terms are maximised together by the common-latent coupling $X=D_a^{1/2}Z$, $Y=D_b^{1/2}Z$, which gives $Q_G$ (Lemma 2, known).

**Why affine maps are rigid.** If an affine coupling is optimal, a first-order expansion shows it must also be optimal for an ordinary transport cost $c_0(x,y)=-\|x\|^2\|y\|^2-4x^\top AL^\top y$ (the established linearisation of squared-distance GW). Cyclical monotonicity of that cost on small cycles in the interior of the support forces a polynomial identity whose curl vanishes only when $L^\top L$ is a multiple of the identity. The radial term $\|x\|^2\|y\|^2$ is what rules out every anisotropic affine map; that is why the conclusion does not transfer to inner-product GW, which lacks it.

**A pairing that stays Gaussian.** For coordinates $i<j$ the field $V^{ij}_i=z_i(z_j^2-1)$, $V^{ij}_j=z_j(1-z_i^2)$ has zero Gaussian divergence, so its flow preserves $N(0,I_d)$ exactly; it is a classical Lotka–Volterra centre. Running it on the latent variable of one side changes the coupling without changing either marginal. The first variation of $G$ along such a flow is $G'(0)=4\Delta_{ij}$ with $\Delta_{ij}=b_ia_j-b_ja_i$, a two-by-two minor of the two spectra; some minor is nonzero exactly when the spectra are not proportional, so the Gaussian coupling is strictly improvable there (Lemma 6, Proposition 7). Bounding the second derivative along the whole path by an explicit curvature constant $\kappa$ turns this slope into the certified lower bound of Theorem 8; in the plane-to-line case it yields $Q<76/7$ at time $t=1/7$.

**Classical and new.** The moment reduction, the Gaussian-restricted value, sufficiency of proportional spectra and the upper bound on the excess are due to Delon et al. (2022); the linearisation is established (Dumont et al., 2025; Zhang et al., 2024); Vayer (2020) gave a sufficient radial condition; Gaussian-preserving rearrangements are known in ordinary optimal transport (Morel et al., 2023); Peyré (2026) gave the first counterexample. Within a bounded search, the new elements are the necessity direction and hence the exact classification, the only-if direction of affine rigidity, the positive lower bound on the excess with its certificates, the factor-two corollary and its sharpness, the comonotone refinement and the plug-in consequence.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/gaussian-gromov-wasserstein-exactness.txt) is available for reading.

- **Proofs.** Every theorem, proposition, lemma and corollary has a written proof in the 16-page manuscript, with a proof outline in the package.
- **Computational checks.** Seven scripts check 24 exact rational identities (including the certificate $Q<76/7$ and all 441 sorted two-coordinate integer spectrum pairs with entries 0 to 5); 28 identities in a separately written rational-polynomial implementation; simultaneous-field identities on 120 integer spectra in dimensions 2 to 4; the four-point example and flow reductions; the factor-two corollary on 1,156 integer and 20,000 random pairs; the curvature bound along whole flow paths in seven nonproportional cases; Tables 1 and 2; and quadrature of the plane-to-line flow. Every check raises an error on failure, so all remain active under Python's `-O` flag.
- **Negative controls.** A dedicated script plants one false value in each of six checkers and confirms that each run fails, with and without `-O` (12 of 12 detected).
- **Review.** Internal AI-assisted review in five roles, an adversarial review and an audit of the new proofs by a separate model, a separate proof audit and a clean replay of the handoff bundle led to one revision round; a re-review found no open correctness issue. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The unrestricted optimiser and its value for nonproportional spectra are not computed, and the constants in Theorem 8 are not known to be sharp. Values marked numerical are floating-point quadrature or high-precision evaluations, not interval enclosures; no theorem depends on them. All quantitative statements assume Gaussian marginals: for non-Gaussian data summarised by covariances, the Gaussian formula need not equal or bound the GW value. Entropic, inner-product and ordinary-distance GW are different problems.

## Relationship to earlier work

Mémoli (2011) set out GW distances for comparing metric-measure spaces. Delon, Desolneux and Salmona (2022) reduced squared-distance GW to moments, computed the Gaussian-restricted value with its common-latent optimiser, proved that proportional spectra are exact, gave the upper bound on the excess and conjectured that the restriction is always exact; Salmona's thesis (2023) described counterexamples as open. Peyré (2026) disproved the conjecture for a line against a space of sufficiently high, unspecified dimension; Theorem 5 extends this to every nonproportional pair, including two dimensions against one and equal dimensions. Dumont, Lacombe and Vialard (2025) and Zhang et al. (2024) supply the linearisation used in Theorem 3, and Vayer (2020) a sufficient radial condition that, for linear maps, is the similarity condition. Morel et al. (2023) use Gaussian-preserving flows for ordinary transport maps. Arya et al. (2026) study GW between spheres, where the radial term is constant, and Le et al. (2022) entropic GW between Gaussians, a different objective.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Practitioners using the Gaussian GW formula | Check proportionality of the two spectra; use the Section 6.3 bracket (standard-library script) to see how far off the formula can be | Gaussian marginals only; sample-covariance plug-in is inconsistent |
| Developers of GW solvers and embeddings | A test case with a known bracket for the optimum; slack in GW scores of linear embeddings is structural, not evidence of a poor embedding | The exact optimum is still unknown |
| Optimal-transport theorists | An exact classification, an affine rigidity theorem and an explicit Gaussian-preserving descent | Bounded literature search; sharp constants open |
| Research agents | Machine-readable claims, an agent index and replayable checks with negative controls | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

GW is one of the few principled ways to compare datasets with no common coordinates, and closed-form answers are valuable precisely because the general problem is hard. A practitioner who summarises data by covariances and uses the Gaussian formula is assuming that Gaussian pairings are good enough. This paper tells that practitioner exactly when the assumption holds, how wrong the formula can be when it does not, and that the error never exceeds a factor of two. It also shows that a projection which discards some, but not all, principal directions is never GW-optimal: an affine map is optimal onto its image only if it multiplies every distance by the same constant.

## Where to inspect the package and reproduce the checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.12:

```sh
shasum -a 256 -c SHA256SUMS
python3 -m pip install -r requirements.txt          # numpy 2.3.5, scipy 1.17.0, matplotlib 3.10.8, mpmath 1.4.1
python3 -I -B tools/replay_compare.py . --quick      # exact checkers and negative controls, under -O (seconds)
python3 -I -B tools/replay_compare.py .              # all seven checkers (about ten minutes, 1.3 GB)
python3 gw_gaussian_bracket.py                       # Gaussian value and certified bracket from two spectra
```

`VERIFICATION.md` maps each script to the result it checks and states what it does not establish, and `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Compute the exact plane-to-line optimum and decide whether it is attained by a map.
2. Find the optimal constants in the two-sided bound, in particular the limit of $D/S$ as $S\to0$.
3. Test whether iterating the Gaussian-preserving flow, or using it to initialise a solver, approaches the true optimum.
4. Prove analogues for entropy-regularised GW and for GW with ordinary (unsquared) distances.
5. Find a version of the affine rigidity theorem for finite point clouds in general position.
