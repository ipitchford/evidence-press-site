## Summary

**In one sentence.** For a population spread over patches with fixed migration, making environmental change faster can never raise its long-run growth rate exactly when migration has no net circulation around any loop of patches.

**The setting.** Picture a species living in several patches of habitat: islands, ponds, fields. Individuals move between patches at fixed rates, and the local growth rate in each patch rises and falls over time, with the seasons or with longer cycles. Whether a small population persists depends on its long-run growth rate. A natural question for ecologists is whether faster environmental change helps or hurts: does speeding up the swings always lower that growth rate?

**What was known.** For symmetric migration (equal movement rates in both directions between every pair of patches), the answer was known to be yes: faster change only lowers growth. In 2025 Monmarché, Schreiber and Strickler showed with a three-patch one-way loop that the answer can be no: an intermediate speed can be best. They asked which migration patterns behave this way, and conjectured that symmetric or two-patch migration also lowers growth when the environment switches at random.

**What is proved.** The dividing line is a classical condition called **detailed balance**: at equilibrium, the flow of movement between every pair of patches balances, so there is no net circulation around any loop. Every two-patch system satisfies it.

- With detailed balance, faster periodic change never raises the long-run growth rate, and it strictly lowers it unless the environment changes every patch in the same way at once.
- Without it, some weak environment that varies just two patches, a quarter of a cycle apart in the right order, makes an intermediate speed best. A certificate computed from the migration rates alone says which two patches and which order, and how large the gain is at least.
- With detailed balance, the same holds for randomly switching environments: faster switching strictly lowers growth unless switching cannot matter at all. This proves Conjecture 1 of Monmarché, Schreiber and Strickler.

**An example.** On the one-way loop of three patches in the banner, forcing patch 2 to peak a quarter period before patch 1 gives a growth rate that first rises with speed, peaks near angular frequency $\omega\approx0.84$, and then falls to zero; forcing them in the opposite order only loses growth. For this loop the certificate is $d_{12}=1/9\neq0$.

**How sure we are.** Every theorem has a written proof, and a script checks every exact constant in rational arithmetic and illustrates the curves numerically. The gains guaranteed by the converse are small for gentle environments (of order $\varepsilon^2$ at forcing amplitude $\varepsilon$), and the classification says that a helpful environment exists, not how the growth curve of a given environment looks.

## Summary for specialists

Model $x'=[Q+\operatorname{diag}r(\omega t)]x$, $Q$ an irreducible generator with stationary distribution $\pi$, $\Pi=\operatorname{diag}\pi$, $P=\mathbf 1\pi^T$, group inverse $C=(-Q+P)^{-1}-P$, $B=C^2$, $d_{ij}=\pi_iB_{ij}-\pi_jB_{ji}$, $\gamma$ the spectral gap of the Dirichlet form of $Q$; $\lambda_Q(r,\omega)$ the principal Floquet exponent.

- **Theorem A (periodic classification; Theorem 4.1, Corollary 4.4):** $Q$ satisfies detailed balance $\iff$ $\lambda_Q(r,\cdot)$ is nonincreasing for every bounded measurable periodic $r$ $\iff$ $d\equiv0$. Reversible $Q$ give strict decrease unless $r_i(\theta)=a_i+b(\theta)$. Hence the Benaïm–Lobry–Sari–Strickler monotonicity conjecture holds for a fixed migration matrix exactly when it is diagonally symmetrisable, with corrected exceptional set *(proof)*
- **Theorem B (weak witnesses; Theorem 5.2, Proposition 5.3, Corollary 5.4):** if $d_{ij}\neq0$ and $\varsigma=-\operatorname{sign}d_{ij}$, then $r=\varepsilon(e_i\cos\theta+\varsigma e_j\sin\theta)$ has an interior global maximum above both $\lambda_{\rm slow}$ and $\lambda_{\rm fast}=0$ for small $\varepsilon$; with $\zeta_{ij}=\pi_i(1-\pi_i)+\pi_j(1-\pi_j)$ and $\omega_*=|d_{ij}|\gamma^3/(2\zeta_{ij})$, $\lambda_Q(r,\omega_*)-\lambda_{\rm slow}\ge\varepsilon^2|d_{ij}|^2\gamma^3/(16\zeta_{ij})$ for $0<\varepsilon\le\varepsilon_*$ explicit; periodic switching among $N$ constant environments also works *(proof)*
- **Theorem C (random environments; Theorems 7.2–7.4, Proposition 7.6):** for reversible $Q$ the quenched exponent is nonincreasing in $\omega$ for every bounded stationary ergodic environment, and strictly decreasing for irreducible finite-state Markov switching among $Q+D_k$ unless every $D_k-D_1\in\mathbb R I$ — Conjecture 1 of Monmarché, Schreiber and Strickler; irreversible $Q$ admit a cyclic Markov counterexample; with a reversible environmental chain the annealed exponent is convex and strictly decreasing *(proof)*
- **Theorem D (two-state environments; Theorem 6.1):** with $\Phi_Q(x)=x^T\Pi Bx$ on centred real vectors, a negative value gives a time-symmetric two-state witness; positive definiteness rules out slow witnesses at small amplitude; reversible $Q$ give $\Phi_Q(x)=\|Cx\|_\pi^2$ *(proof)*
- **Theorem E (diffusions; Theorem 8.1, Theorem B.1):** for smooth uniformly elliptic $L$ on a closed manifold, detailed balance $\iff$ frequency monotonicity for every smooth periodic potential $\iff$ time-reversal invariance of growth at one frequency; reversible diffusions with Markov-switching potentials have strictly decreasing quenched exponents *(proof)*
- **Worked constants:** directed three-cycle $\beta(\omega)=(1+\omega/2+\omega^2/3)/(\omega^4+3\omega^2+9)$, $d_{12}=1/9$, $\omega_*=27/64$, $g_*=3/256$, $\varepsilon_*=2187/6487040$; fast-edge cycle $\Phi((I-P)e_1)=-5/14641$ *(exact rational checks)*

## Technical account

**Why detailed balance is the boundary.** Freeze the environment at a diagonal matrix $D$. If $Q$ is reversible, the left Perron vector of $Q+D$ is $\Pi$ times the right one for every $D$; circulation breaks this proportionality. When the environment moves slowly round a closed loop, the growth rate picks up a first-order correction $\omega c/(2\pi)$, where $c$ is a sum of logarithms of overlaps between consecutive left and right Perron vectors (Monmarché, Schreiber and Strickler, Theorem 1). For reversible $Q$ the cyclic product of overlaps is a product of cosines between positive vectors, so $c\le0$: there is no geometric phase and slow change can only hurt. For irreversible $Q$ the correction has a gain term $E\cdot\mathrm{Area}$ with $E=|d_{ij}|$, the growth-rate analogue of a Berry-phase curvature, competing with a loss of the same order (Proposition 5.5).

**The harmonic computation.** For a rotating two-patch forcing $z=e_i-i\varsigma e_j$, the growth rate is $\varepsilon^2\beta_z(\omega)+O(\varepsilon^3)$ with $\beta_z(\omega)=\tfrac12\operatorname{Re}\langle z,(-Q+i\omega)^{-1}z\rangle_\pi$ on centred inputs, and $\beta_z'(0)=\tfrac12E>0$ when $d_{ij}\neq0$. A positive square-root lemma (Lemma 3.2) shows that $d$ vanishes identically only for reversible $Q$, so every irreversible generator has a pair of patches on which a slow rotating environment gains. An explicit remainder bound (Appendix A) turns the quadratic response into the quantitative witness of Proposition 5.3.

**Sufficiency and strictness.** For reversible $Q$, the diagonal similarity $\Pi^{1/2}Q\Pi^{-1/2}$ is symmetric and leaves diagonal potentials unchanged, so the known symmetric arguments apply; an energy identity gives strict decrease outside the separable set $r_i=a_i+b(\theta)$. For random Markov environments, nonincrease comes from periodisation of sample paths; strictness uses a positive-cost block argument on good words of the environmental chain, with uniform positivity of the propagators.

**Classical and new.** The symmetric periodic monotonicity, its energy mechanism and the separable exception go back to Liu, Lou and Song and to Katriel (patch models) and to Liu, Lou, Peng and Zhou (diffusions); the slow and fast expansions and the directed three-cycle example are due to Monmarché, Schreiber and Strickler. Within a bounded literature search, the new elements are the converse for every fixed irreversible generator, the certificate $d_{ij}$ with its quantitative bound, the two-state criterion, strictness for random Markov environments with its cyclic converse, the annealed statement and the diffusion converse.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/reversibility-frequency-reduction.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 35-page manuscript, with an explicit remainder bound (Appendix A) and the random-diffusion extension (Appendix B).
- **Exact checks.** `verify.py` makes 81 exact checks in rational arithmetic: certificate data for six generators, with reversibility decided both by detailed balance and by self-adjointness of $C^2$; the three-cycle response function in both orientations; the Appendix A certificate margin $1427/56340000000$; the quantitative witness constants; and the two-state constants. These verify identities for specific generators; the universal statements rest on the proofs.
- **Numerical illustrations.** 193 floating-point checks integrate Floquet growth rates, reversible controls, switching, two-state witnesses, the energy identity and annealed exponents, and produce Figure 1. They illustrate the theorems and are not part of any proof.
- **Controls and replay.** Five planted errors (a certificate margin, a reversibility label, a closed form, a witness threshold, a quadratic-form sign) each make `verify.py` fail, with and without Python's `-O` flag. Rerun from a fresh extraction of the frozen archive, `verify.py` reproduced its retained output and figure.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review, an audit of the new proofs and a final confirmation by a separate model, a proof audit and a clean replay led to one revision round, which added the two-state theorem, the quantitative witness, the annealed proposition and the geometric explanation; a re-review found no open correctness issue. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The converse is perturbative: the guaranteed gains are of order $\varepsilon^2$ and the classification is existential. Random results concern quenched exponents (annealed only with a reversible environmental chain). Finite-amplitude two-state behaviour, the random converse for irreversible diffusions, domains with boundary and time-varying migration are open. The literature search was dated and bounded, with no author enquiry.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Theoretical ecologists modelling dispersal in fluctuating habitats | A checkable criterion (detailed balance, or the certificate $d_{ij}$) for whether faster environmental fluctuations can ever help persistence, and which patches to look at | Migration is held fixed; the helpful effects guaranteed by the converse can be very small |
| Researchers on principal eigenvalues and random dynamical systems | A complete periodic classification, a proof of the Monmarché–Schreiber–Strickler conjecture, and a two-state criterion | Perturbative witnesses; finite-amplitude and boundary cases remain open |
| Physicists working on stochastic pumps and geometric phases | A growth-rate analogue of geometric-phase effects with a sharp reversibility boundary | Diagonal growth forcing with fixed generator, not modulation of transition rates |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

Whether environmental variability helps or harms populations spread across habitats is a central question in spatial ecology. For years the symmetric case suggested that faster change always hurts, and a recent counterexample showed that it need not. This paper identifies exactly which migration structures allow the exception — those with circulation — and gives a direct test from the migration rates, while settling the corresponding question for randomly switching environments.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root, with Python 3.12:

```sh
shasum -a 256 -c SHA256SUMS
python3 -m venv env && env/bin/pip install -r requirements.txt   # numpy 2.3.5, scipy 1.17.0, matplotlib 3.10.8
env/bin/python -I -B tools/replay_compare.py .                    # verify.py under -O in a temporary copy, output comparison, negative controls
```

`verify.py` alone takes about 20 seconds and rewrites its outputs next to itself, so work in a copy. `AI_INDEX.md` maps each result to its section and evidence, `REVIEW_SUMMARY.md` lists the objections raised in review and how each was handled, and `PRIOR_ART.md` records the dated searches.

## The most valuable next projects

1. Decide which irreversible generators admit a time-symmetric two-state witness at finite amplitude; the directed four-cycle is the first unresolved case.
2. Prove the converse of the random-environment classification for irreversible diffusions with Markov-switching potentials.
3. Extend the diffusion classification to the Neumann (no-flux) problem on bounded domains, the standard ecological setting.
4. Determine whether an irreversible environmental chain can make the annealed exponent increase when migration is reversible.
5. Bound the largest possible gain in terms of the cycle affinities of $Q$, and describe what replaces detailed balance when migration itself varies in time.

## What is in the evidence package

The paper (PDF and LaTeX sources) with Figure 1; `verify.py` with its retained output `verification.json`; the negative controls and replay comparer (`tools/`); a rating-free summary of the internal review (`REVIEW_SUMMARY.md`); a dated prior-art summary (`PRIOR_ART.md`); the bibliography built from Crossref and arXiv records; `AI_INDEX.md`, `CLAIMS.json`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `SHA256SUMS`. Text, data and figures are CC0-1.0; code is MIT.
