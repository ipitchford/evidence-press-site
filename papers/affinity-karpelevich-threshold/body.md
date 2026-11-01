## Summary

**The question.** Many small systems in physics and biology hop at random between a handful of states: a molecular motor stepping along a filament, an enzyme cycling through its conformations, a biochemical clock. Such a system is described by a table of hopping rates, the *rate matrix*. The eigenvalues of that matrix answer two practical questions. How fast does the system settle down? And can it oscillate on the way there, like a clock? Oscillation is never free. A system at equilibrium cannot oscillate at all, and stronger oscillations need a stronger thermodynamic push around some loop of states. That push is measured by the loop's *cycle affinity*.

**What was conjectured.** For ordinary discrete-time chains, the exact set of all possible eigenvalues is a classical shape called the **Karpelevich region** $\Omega_n$, worked out in 1951. In 2025, Xu, Kolchinsky, Delvenne and Ito proposed a tidy extension to driven continuous-time networks. Take $\Omega_n$, stretch it by the fastest escape rate $\alpha$, and squash it vertically by a factor $\beta'$ set by the strongest push per step around any cycle. They conjectured that every eigenvalue of every $n$-state rate matrix lands inside this squashed region. If true, one could read off a network's possible oscillations from just two numbers.

**What was found.** The conjecture is false. An explicit four-state network with whole-number rates has the eigenvalue $-4745+450\sqrt3\,\mathrm i$. After undoing the stretch and the squash, this eigenvalue lands at $\zeta\approx-0.7062+0.3161\,\mathrm i$, which is **0.0087 outside** the classical region $\Omega_4$, just above its left boundary arc (the banner shows this). One integer inequality proves it. With three or fewer states the conjecture is true, so four is the smallest size at which it fails.

**Why it fails.** The trick is weak *resetting*: occasionally jumping back to the long-run distribution. Resetting at a small rate $\varepsilon$ moves the eigenvalues only by about $\varepsilon$. But it creates a strongly driven three-state loop whose push relaxes the squashing factor by about $\varepsilon^{2/3}$, which is much larger. The squashed region shrinks faster than the eigenvalue moves, so the eigenvalue pokes out.

**What this does and does not cover.** Every counterexample here uses a network in which **every pair of states is connected**. Whether the conjecture holds for a **single ring** of states, which is the setting in which its authors tested it, is **still open**. A small computer search over four- and five-state rings found no violation; that is evidence, not proof. The violations are small. The thermodynamic bounds that *have* been proved, an ellipse and a polygon, are unaffected.

**Status.** An anonymous, AI-assisted, unrefereed candidate. It was checked by internal AI-assisted review, including correctness audits by a different model, not by peer review or independent reproduction.

## Summary for specialists

Let $Q$ be an irreducible rate matrix on $n$ states with bidirectional edges. Write $\alpha=\max_i|Q_{ii}|$ and $\beta'=\tanh\bigl(\max_c F_c/(2n_c)\bigr)$, where $F_c$ is the affinity of simple cycle $c$ and $n_c$ its length. Supplement Eq. (S3) of Xu et al. (PRL 135, 257102, 2025), quoted verbatim from arXiv:2507.08938v2, asserts that the eigenvalue region is the affine image $\{\alpha(\operatorname{Re}z-1)+\mathrm i\alpha\beta'\operatorname{Im}z: z\in\Omega_n\}$. Under either reading of its quantifiers this implies the containment

$$
\zeta=1+\frac{\operatorname{Re}\lambda}{\alpha}+\mathrm i\,\frac{\operatorname{Im}\lambda}{\alpha\beta'}\in\Omega_n\quad\text{for every eigenvalue }\lambda\text{ of }Q. \tag{C}
$$

| Result | Status |
|---|---|
| (S3) implies (C) under both readings (Proposition 2.1) | proved |
| An integer $4\times4$ matrix $Q_{\mathrm w}$, with $\alpha=2781$, triangle ratio $177853829/38529$ and $\lambda=-4745+450\sqrt3\,\mathrm i$, violates (C) by 0.0087 vertically (Theorem 3.1) | proved; exact integer certificate |
| (C) holds for $n\le3$ (Theorem 4.1) | proved, using the Ohga–Ito–Kolchinsky sector bound |
| Counterexamples near every point of the open left arc of $\Omega_4$; explicit interval $0<\varepsilon\le1/100$; an open set of positive-rate counterexamples (Theorems 5.1, 6.1, Corollary 6.2) | proved |
| (C) fails for every $n\ge4$ (Theorem 7.4): fix $n$, then $t\in(0,\eta_n)$, then $\varepsilon<\varepsilon_0(n,t)$ | proved; thresholds not explicit |
| $Q_{5,3/5,1/40000}$ and $Q_{6,1/2,1/8000}$ violate (C) (Theorem 7.6, Appendix A) | certified by exact computation |
| Single-cycle networks (Open problem 8.1) | open |

"Exact dimension" refers to universal containment over irreducible bidirectional generators. All counterexamples use the complete graph.

## Technical account

**Known ingredients.** Karpelevich's theorem, in Ito's form, describes $\partial\Omega_n$ as arcs between roots of unity, one arc for each pair of Farey neighbours. Johnson and Paparella give explicit stochastic matrices realising every arc. Rank-one resetting to the stationary distribution shifts the nonzero spectrum uniformly (Rose et al. 2018). None of these is claimed as new.

**The new combination.** Start from a stochastic matrix $P_n(t)$ whose characteristic polynomial is the boundary polynomial of the arc ending at $-1$: in four states, $(z^2-t)^2-(1-t)^2z$. Form the generator $Q=P_n(t)-I+\varepsilon(\mathbf 1v-VI)$. Its eigenvalues move by $O(\varepsilon)$. Several of its rates are of order $\varepsilon$, however, so one triangle becomes the uniquely dominant cycle, with mean affinity $\tfrac23\log(1/\varepsilon)+O(1)$. Then

$$
\beta_\varepsilon^{-1}=1+2\kappa_n(t)\,\varepsilon^{2/3}+O(\varepsilon^{4/3}),
$$

so the rescaled eigenvalue rises above the arc by about $2y(t)\kappa_n(t)\varepsilon^{2/3}$, while the arc moves by only $O(\varepsilon)$. A local-graph argument shows that the side above the arc is exterior to $\Omega_n$.

**Certificates for five and six states.** A *radial exterior test* (Lemma 2.5) shows that a box $W$ lies outside $\Omega_n$ if no Ito boundary polynomial vanishes at $\sigma w$ for $w\in W$, $1\le\sigma\le S$ and any Farey pair. The test needs only Karpelevich's boundary description and star-shapedness. It is checked by bisection in outward-rounded rational interval arithmetic. Appendix A prints the matrices, the dominant and runner-up cycles, the eigenvalue enclosures, $W$, $S$ and the per-pair box counts and margins. A separate checker re-verifies the terminal boxes with exact, unrounded intervals.

## Evidence, assurance and limitations

- **Proofs.** Every theorem has a written proof. Theorem 4.1 depends on the published sector bound.
- **Exact computation.** The four-state witness is checked by two standard-library verifiers. The five- and six-state certificates are computer-assisted but exact, and the paper prints the data needed to check them.
- **Replay and controls.** A replay driver regenerates every receipt from the archive. Eleven corrupted inputs are rejected, among them a box moved inside the region, a missing box, a one-unit change to the witness and a point just inside the arc.
- **Review.** The paper had internal AI-assisted review, AI-assisted correctness audits by a different model before and after revision, a targeted proof audit and a verification re-review. The final round's points were fixed before publication: printed certificate data, a corrected lemma for $n\ge2$, a direct proof of the four-state slice, a narrower attribution, and a corrected statement of the $\varepsilon$-scale. This is **not** peer review, independent reproduction or formal verification.
- **Limits.** Only complete graphs are covered, and the single-cycle case is open. Theorem 7.4 is non-uniform, and its thresholds are not explicit. The violations are thin: radial margins are about $10^{-4}$ or smaller for $n\ge5$. The literature search was bounded, and no priority is claimed.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Stochastic thermodynamics | Know which spectral bounds are safe: the affinity ellipse and the Farey polygon are proved; the squashed Karpelevich region is not | The single-cycle case, the most physical one, is still open |
| Experimentalists inferring dissipation from oscillations | Avoid over-tight inference: the false region would overstate the minimum driving by about 9% for the witness | The effect is a shape effect, small and confined to damped modes |
| Matrix theorists | A clean interaction between the Karpelevich boundary, cycle affinities and resetting | Counterexamples rely on the complete graph |
| Computer-assisted proof | A small, printed, independently checkable interval certificate | Bisection data are checked by code, not by hand |

## Why the problem matters

Spectral bounds are used in reverse: from a measured relaxation spectrum, experimenters infer the least dissipation a system must have. A tight, exact region would make that inference sharp. This result marks where the sharp version breaks, and confirms that the proved, looser bounds remain the safe ones to use.

## How to inspect or reproduce the recorded checks

1. Read Theorem 3.1. The four-state witness is checked by hand from one integer inequality.
2. Download the archive from the DOI or the GitHub release. Then run `python3 -B code/replay_all.py` and `python3 -B negative_controls.py` (Python 3.11 or later, standard library only, without `-O`).
3. Check the five- and six-state certificates against Appendix A with `python3 -B code/check_exterior_certificate.py receipts/exterior_certificates.json`.

## The most valuable next projects

1. Settle the single-cycle case (Open problem 8.1). The resetting mechanism cannot apply to a ring, which has only one cycle.
2. Find the true eigenvalue region for given $n$, $\alpha$ and $\beta$, or at least the largest excess over $\Omega_n$ (Open problem 8.2).
3. Make $\eta_n$ and $\varepsilon_0(n,t)$ explicit, and test the other arcs of $\Omega_n$ (Open problem 8.3).

## What is in the evidence package

The 20-page paper (PDF and LaTeX) and its figures. Standard-library Python verifiers for the four-state witness and the all-dimension construction. The five- and six-state certifier, with its terminal-box certificate and a stand-alone checker. A replay driver, negative controls and CI. Exact JSON receipts. Dated novelty reports. Records of status, assurance, claims, provenance and citation checks, and SHA-256 sums for every file.
