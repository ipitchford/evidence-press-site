## Summary

*How to read this page.* This Summary is in plain English and is enough for most readers. Specialists can jump to the exact statements in the next section, and the Technical account explains how the proofs work. Evidence, limitations and the route to rerun the checks follow.

**What Sinkhorn's algorithm does.** Suppose you must move one distribution of mass (the *source*) onto another (the *target*). A plan is a table, or more generally a joint distribution, whose row totals match the source and whose column totals match the target. Sinkhorn's algorithm, also called *matrix scaling* or *iterative proportional fitting* (IPF), finds such a plan by alternation: rescale the rows so that they add up correctly, then rescale the columns, and repeat. One *iteration* is one row step followed by one column step. It is the standard solver for entropy-regularised optimal transport.

**What the regularisation $\lambda$ is.** Transport has a cost, for example the squared distance moved. Entropic regularisation adds a penalty, weighted by a parameter $\lambda>0$, that blurs the plan. A large $\lambda$ gives a smooth, easy problem; a small $\lambda$ gives an answer closer to the sharp, unregularised optimal plan.

**Why the iteration count matters.** Small $\lambda$ is what users want, but it slows the algorithm. The practical question is how fast the number of iterations grows as $\lambda\to0$. Classical guarantees grow exponentially in $1/\lambda$; recent work obtained polynomial growth, but only under strong assumptions on one distribution.

**The answer.** One comparatively mild property of the source is enough: a *Poincaré inequality*, which says that a function with small gradient has small variance, with constant $C_P$. Suppose also that, at each source point, the gradients of the cost lie in a ball of radius $L$. Then every full iteration shrinks the error (the entropic dual gap) by at least the fixed factor

$$
\frac{C_PL^2}{C_PL^2+\lambda^2},
$$

from the very first step, from any bounded starting point and for any target (Theorem 2). The number of iterations needed to cut the error by a factor $\tau$ is at most $\lceil(1+B/\lambda^2)\log(1/\tau)\rceil$ with $B=C_PL^2$, about $(C_PL^2/\lambda^2)\log(1/\varepsilon)$: polynomial, not exponential. Mild integrability conditions hold automatically for bounded costs, and Theorem 3 and Corollary 4 remove boundedness when the target is compact: for the squared-distance cost, any Poincaré source on $\mathbb R^d$ (Gaussian, or exponential-tailed) and any bounded target, including a point cloud, give the factor with $L$ replaced by the target's Chebyshev radius $R$, the radius of its smallest enclosing ball.

**With a bounded source density, about $1/\lambda$.** If the source lives on a compact convex domain with a density whose maximum-to-minimum ratio is bounded, and the cost is bounded and semiconcave, the factor improves to $C/(C+\lambda)$, so about $1/\lambda$ iterations suffice from the start (Corollary 5, in the settings of Chizat, Delalande and Vaškevičius, hereafter CDV).

**Why $1/\lambda^2$ is the limit.** One-dimensional examples with a two-point target show that $1/\lambda^2$ cannot be improved in general. The cusp-shaped source with density $(2/5)|x|\log^2(e/|x|)$ on $(-1,1)$ has very little mass at the point where the plan switches between the two target points. Near the optimum its per-iteration improvement is only about $(8/5)\log2\,\lambda^2\log^2(1/\lambda)$, compared with about $2\lambda$ for the uniform source and the guarantee $\lambda^2/(C_P+\lambda^2)$ (Theorem 6). So no exponent below 2 works, even eventually. Order $\lambda^2$ itself is attained uniformly over a class of sources with bounded Poincaré constant (Proposition 7), but by no single fixed source with a density (Proposition 8). The same examples satisfy Talagrand's inequality, so the exponent 2 in earlier Talagrand-based rates is sharp too (Corollary 9).

**A practical stopping rule.** The remaining error is at most $1+B/\lambda^2$ times the increase of the dual objective observed in the last iteration (Remark 5.1). Using it needs a valid Poincaré constant and accurate evaluation of the continuous integrals.

**What was already known, stated plainly.** Chiarini, Conforti, Greco and Tamanini (CCGT) already had the same rate shape, with a Talagrand constant $\tau$ in place of $C_P$, under the stronger Talagrand inequality and Hessian bounds on the cost. The gain here is weaker hypotheses at an equal or better constant, one formula for every $\lambda$, and the sharpness results; Gaussian sources with compact targets were already covered. Given the paper's key entropy inequality, the contraction also follows from the mirror-descent theorem of Aubin-Frankowski, Korba and Léger (AFKL; Remark 4.2). The curvature estimate behind the $1/\lambda$ result is entirely CDV's (their Proposition 5.1), and CDV's Remark 3.1 conjectured that a Poincaré inequality should suffice; the paper confirms this for the $\lambda^2$ rate. Finally, S. Di Marino announced $\lambda^2$ rates when *both* distributions satisfy Poincaré inequalities, with counterexamples. Those proofs could not be inspected, so priority for the exponent is uncertain.

**What is not covered.** Only exact population (continuous) distributions: an empirical source does not satisfy the Poincaré inequality. Unbounded targets, such as Gaussian to Gaussian with squared-distance cost, are not covered. The constants are not sharp, and the eventual factor suggested in Remark 5.2 is a conjecture.

## Summary for specialists

Minimise $\int c\,d\gamma+\lambda\operatorname{KL}(\gamma\Vert\mu\otimes\nu)$ over couplings of $\mu$ (source) and $\nu$ (target). For a bounded target potential $\psi$, $r_\psi$ is the target marginal of the source-normalised coupling $\gamma_\psi$, $E(\psi)=\int\psi\,d\nu-\lambda\int\log Z_\psi\,d\mu$ is the semidual objective, $\Delta=E^*-E$ its gap, and $S\psi=\psi-\lambda\log(dr_\psi/d\nu)$ the exact full Sinkhorn update. When an optimal potential exists, $\Delta(\psi)=\lambda\operatorname{KL}(\gamma_{\psi^*}\Vert\gamma_\psi)$. The paper's $\lambda$ is CDV's $\lambda$ and CCGT's $\varepsilon$.

**Theorem 1 (curvature transfer).** Under integrability conditions (S1)–(S3), if $D^2\Phi(\psi)[h,h]\ge A^{-1}\operatorname{Var}_{r_\psi}(h)$ for every bounded $\psi,h$, with $A\ge\lambda$, then

$$
\Delta(\psi)\le A\operatorname{KL}(\nu\Vert r_\psi),\qquad
\Delta(S\psi)\le(1-\lambda/A)\,\Delta(\psi).
$$

The variance is in the *moving* marginal $r_\psi$, at all potentials.

**Theorem 2.** If $\operatorname{Var}_\mu f\le C_P\int|\nabla f|^2d\mu$ and $\inf_b\sup_y|\nabla_xc(x,y)-b|\le L$ for every $x$, then with $B=C_PL^2$,

$$
\Delta(\psi_t)\le\left(\frac{B}{B+\lambda^2}\right)^t\Delta(\psi_0)
$$

for every bounded $\psi_0$ and $t\ge0$, and by (32) $\lceil(1+B/\lambda^2)\log(1/\tau)\rceil$ iterations reduce the gap by $\tau$.

| Result | Setting | Conclusion |
|:---|:---|:---|
| Thm 3, Cor 4 | Poincaré $\mu$ on $\mathbb R^d$; cost Lipschitz in $y$, linear growth in $\lvert x\rvert$; compact target | Factor $C_PR^2/(C_PR^2+\lambda^2)$ for quadratic cost, every $\lambda$ |
| Cor 5 | CDV (A1)/(A2)/(A3) | Factor $C/(C+\lambda)$ from iteration zero |
| Thm 6 | Cusp $w=\tfrac25\lvert x\rvert\log^2(e/\lvert x\rvert)$, $C_P\le3/4$ | Local deficit $\sim\tfrac85\log2\,\lambda^2\log^2(1/\lambda)$ |
| Prop 7 | $\lambda$-dependent sources, $C_P\le1+\pi/2$ | Local deficit $\sim\pi\lambda^2$ |
| Prop 8 | Any fixed absolutely continuous Poincaré source | Deficit$/\lambda^2\to\infty$ |
| Cor 9 | Talagrand sources, CCGT Prop. 1.9(i) setting | Exponent 2 sharp |

The sharpness results use $X=(-1,1)$, $\nu=(\delta_{-1}+\delta_1)/2$ and $c=-xy$, so $L=1$; they are local and asymptotic. In Corollary 5, $C=e(c_\infty+\xi R_X^2/2)\kappa$ under (A1) and $C=e\max\{c_\infty,1\}$ under (A2)/(A3). Under (A1)/(A2) it gives the linear order from iteration zero, without CDV's factor 176 or the extra conditions of their eventual rate; under (A3) it improves only the constant.

## Technical account

**Curvature transfer (Theorem 1).** Restrict increments to functions constant on a finite partition of the target. The increment of $\Phi$ becomes a smooth convex $F$ on $\mathbb R^m$ whose Hessian dominates $A^{-1}(\operatorname{diag}r-rr^\top)$ everywhere, by the hypothesis at nearby potentials. Its gradient maps the quotient by constants bijectively onto the open simplex, so the convex conjugate has Hessian at most $A\sum_iv_i^2/p_i$. Integrating that bound along a segment gives exactly $A$ times a relative entropy, so the best semidual improvement is at most $A\operatorname{KL}(p\Vert r)$; data processing and uniform approximation pass to general increments. The ascent identity (20) says one full iteration gains at least $\lambda\operatorname{KL}(\nu\Vert r_\psi)$, and combining the two gives the contraction from iteration zero.

**The variance decomposition (Theorem 2).** Let $m(x)$ be the conditional mean of a test function $h$ under the source-normalised plan. Its gradient is $-\lambda^{-1}$ times a conditional covariance of $h$ with $\nabla_xc$, the mechanism behind Di Marino and Gerolin's observation that potential gradients are conditional means. Cauchy–Schwarz and the ball condition give $|\nabla m|^2\le L^2\lambda^{-2}\operatorname{Var}_{q_x}(h)$. The law of total variance and the Poincaré inequality then give $\operatorname{Var}_{r_\psi}(h)\le(1+B/\lambda^2)\int\operatorname{Var}_{q_x}(h)\,d\mu$, which is the curvature hypothesis with $A=\lambda+B/\lambda$. Equivalently, every source-normalised coupling has squared maximal correlation at most $B/(B+\lambda^2)$ (Remark 4.1).

**Unbounded costs (Lemmas 1–2, Theorem 3).** Lemma 1 is classical exponential integrability, $\int e^{t|x|}d\mu<\infty$ when $C_Pt^2<4$, reproved for the restricted test class; Lemma 2 is a cap bound, every $\delta$-ball of a compact target having mass at least $m_\delta>0$. Together they verify the integrability conditions for every $\lambda$ when the cost grows linearly in $|x|$ and is Lipschitz in $y$.

**Sharpness (Lemma 3 and Section 7).** With two target atoms, potentials are scalars and Sinkhorn is an explicit map $T_\lambda(\theta)=\theta-\lambda\operatorname{artanh}m_\lambda(\theta)$. Its derivative at the optimum is $1-D_\lambda$, with $D_\lambda$ an integral of $\operatorname{sech}^2(x/\lambda)$ against the density, so the local gap factor is $(1-D_\lambda)^2$. The cusp's vanishing density at zero makes $D_\lambda$ small, while a weighted Hardy argument certifies $C_P\le3/4$. Lemma 3, in the spirit of Muckenhoupt's criterion, shows that a Poincaré inequality forces $1/w$ to be locally integrable, which makes $D_\lambda/\lambda^2\to\infty$ for any fixed source (Proposition 8). Remark 7.1's power densities $|x|^a$ defeat any $\beta<2$, but their Poincaré constants blow up. By Remark 7.2, on the family of Proposition 7 the guarantee is pessimistic by a bounded factor (about 8.3 at $\lambda=0.005$ with the certified constant, about 6.0 with a numerical one), not by a power of $\lambda$.

**Inexact iterations (Section 5.3).** If each computed update is within $\eta$ of the exact one in supremum norm, modulo constants, the gap obeys the contraction plus an error floor of at most $2\eta(1+B/\lambda^2)$. This is conditional: it supplies no quadrature or sampling estimate.

**Mirror descent (Remark 4.2).** Inequality (10) is relative strong convexity in AFKL's framework, on the couplings generated by bounded potentials, so AFKL's Theorem 4 gives the same rate if a bounded optimal potential exists. AFKL's own coefficient is exponential in $1/\varepsilon$; the new step is the polynomial one.

**Classical and new.** Convex duality, the total-variance decomposition, exponential concentration, Hardy-type weights and Gozlan's Poincaré–Talagrand comparisons are classical; the curvature estimate in Corollary 5 is CDV's. As far as a bounded literature search found, new are the curvature-to-entropy transfer with a polynomial coefficient, the explicit Poincaré factor with first-derivative hypotheses valid for every $\lambda$, its extension to unbounded costs with compact targets, the global linear rate in CDV's settings, and the sharpness constructions. A bounded search cannot establish priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/poincare-sinkhorn-global-rates.txt) is available for reading.

- **Proofs.** Every theorem, lemma, corollary and proposition has a written proof in the 25-page paper. The eventual factor $(B/(B+\lambda^2))^2$ in Remark 5.2 is a conjecture, and the Poincaré constants in Remark 7.2 are numerical estimates, not certificates.
- **Numerical checks.** Three floating-point programmes check displayed formulas: `sharpness_check.py` (uniform and cusp sources, 180 combinations of $\lambda$ and potential, trajectory gap ratios within $3.5\times10^{-10}$ of $(1-D_\lambda)^2$), `multitarget_gaussian_check.py` (Gaussian source, five target atoms) and `revision_checks.py` (refined cusp expansion, numerical Poincaré constants, Remark 5.2). The last illustrates Corollary 4 with a two-sided exponential source ($C_P\le4$), quadratic cost and three target atoms: at $\lambda=1,0.5,0.3$ the worst observed one-step ratios were 0.136, 0.363 and 0.552, below the guaranteed 0.800, 0.941 and 0.978, and the stopping certificate held.
- **Replay.** All three programmes were rerun from a fresh copy with Python `-I -B` and with `-I -B -O` (Python 3.12.11, NumPy 2.3.5, SciPy 1.17.0, Matplotlib 3.10.8, mpmath 1.4.1). There were zero failures in all six runs, and every numeric output matched the shipped checks to roundoff (maximum scaled difference $2.3\times10^{-12}$); results are not bit-identical across Python and BLAS versions. GitHub CI on Linux (Python 3.12) passed all three normally and under `-O`. No result depends on the scripts.
- **Review.** Internal AI-assisted review only: five reviewer roles, a separate-model adversarial review, one revision round with extensions, a proof audit of the new and rewritten proofs, a re-review and a separate-model audit of the new proofs. No stage found a counterexample to a stated theorem; the audits repaired a constant in Corollary 5, a restriction in Remark 4.2 and the scope of Corollary 9, and the main objection, overlap with CCGT, led to the repositioning above. This is not human peer review, independent reproduction or formal verification; no proof assistant or interval arithmetic was used.
- **Limitations.** Population measures and exact transforms only; no empirical sources, sampling complexity or bias relative to unregularised transport; no unbounded targets with quadratic cost; constants not sharp. Whether a bounded density on a non-convex Poincaré domain gives a linear rate is open. No priority is claimed for the $\lambda^2$ exponent relative to Di Marino's announcements.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| People running entropic OT in POT or OTT-JAX, semi-discrete OT and Schrödinger-bridge solvers | An iteration budget $\lceil(1+C_PR^2/\lambda^2)\log(1/\tau)\rceil$ for a Poincaré source and a bounded target or point cloud; the stopping certificate (33) | Population measures only; the certificate needs a valid $C_P$ and accurate integrals |
| Optimal-transport theorists | A transfer from curvature bounds to global rates; sharp exponent examples; CDV's Remark 3.1 | Compare with CCGT and Di Marino's announced work; constants not sharp |
| Statisticians using IPF | One Poincaré inequality on one margin gives geometric convergence of the continuous iteration | Continuous source margin only; discrete sources need open question 4 |
| Research agents | Claim map, agent index and replayable checks | Checks corroborate formulas; the theorems rest on the written proofs |

## Why the problem matters

Sinkhorn's algorithm is the default solver for regularised transport, and users push $\lambda$ small to approach the unregularised answer. Knowing how the iteration count scales tells them what accuracy is affordable and when to stop. Exponential guarantees say little at small $\lambda$; this paper gives a polynomial guarantee under a mild, checkable property of one distribution, shows exactly where the $1/\lambda$ and $1/\lambda^2$ regimes divide, and shows that $1/\lambda^2$ is the best possible in general.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
uv run --with numpy==2.3.5 --with scipy==1.17.0 --with matplotlib==3.10.8 --with mpmath \
  python3 -I -B code/revision_checks.py --output-dir reproduction/revision
python code/sharpness_check.py --output-dir reproduction/binary
python code/multitarget_gaussian_check.py --output-dir reproduction/gaussian
```

Each programme takes seconds (the recorded `revision_checks.py` run took 13.5 s) and returns zero only when all its checks pass, also under `python -O`. Without `--output-dir` they overwrite the delivered outputs in `checks/`. A pinned `requirements.txt` can replace `uv`. `AI_INDEX.md` maps claims to proofs and evidence; `VERIFICATION.md` and `review/REVIEW_SUMMARY.md` record the checks and review objections.

## The most valuable next projects

1. Prove or refute the eventual factor $(B/(B+\lambda^2))^2$ suggested in Remark 5.2, and find the sharp universal constant.
2. Decide whether a bounded density on a non-convex Poincaré domain gives a global rate linear in $\lambda$ (Section 7.6).
3. Treat unbounded targets with quadratic cost, such as Gaussian to Gaussian, under one Poincaré inequality.
4. Find a discrete analogue for empirical sources, using a graph Poincaré inequality and a discrete covariance identity.
5. Extend Theorem 1 to multimarginal block-coordinate Sinkhorn with one Poincaré marginal per block.

## What is in the evidence package

The 25-page paper (PDF and Markdown source) with the sharpness figure in PNG and SVG. The three check programmes, their JSON outputs and logs, and the earlier replay record. A proof outline, verification record, agent index, dated literature audit, rating-free review summary, earlier versions with diffs and the bibliography. Licences (text and figures CC0-1.0; code MIT), citation metadata, CI, pinned requirements and SHA-256 sums for every file. The paper is an unrefereed candidate, released for scrutiny.
