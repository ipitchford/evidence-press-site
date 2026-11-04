## Summary

**The setting.** Many statistical and physical computations estimate an average, such as a mean energy or a posterior expectation, by simulating one long random trajectory whose long-run distribution is the target and averaging along it. This is Markov chain Monte Carlo. Successive states are correlated, so the accuracy of the average is measured by its **long-run (asymptotic) variance**: the variance after a run of length $T$, multiplied by $T$. Two samplers with the same target can have very different long-run variances.

**The trick being studied.** One way to change those correlations without changing the target is to add a deterministic **rotation** that preserves the target distribution, a *nonreversible perturbation*. For overdamped (first-order) Langevin samplers this is known to help every observable, and the more rotation the better (Hwang, Normand and Wu 2015; Rey-Bellet and Spiliopoulos 2015–2016). **Kinetic** (underdamped) Langevin samplers, widely used in molecular dynamics and Hamiltonian-type MCMC, add a momentum and a friction $\gamma$. There the picture is different. Duncan, Nüsken and Pavliotis (DNP, 2017) proved, for a Gaussian target, that a small matched rotation lowers the variance of linear and quadratic observables when $\gamma>\sqrt2$. They conjectured the same for every square-integrable observable, and their numerics showed rotations can also *raise* the variance.

**What the paper shows.** For exact stationary Gaussian dynamics with matched position and momentum rotations, and observables of the position:

- **The sharp threshold (Theorem 1).** Every square-integrable observable's long-run variance never increases as the rotation strength grows **if and only if $\gamma\ge\sqrt2$**, the endpoint included. It strictly decreases unless the observable is unaffected by the rotation. This is a global form of DNP's conjecture: it holds at every rotation strength, not just near zero.
- **Why √2.** Think of the sampler's position as a damped spring. Its *power spectrum* says how much fluctuation sits at each frequency, $S(\xi)=2\gamma/(\xi^4+(\gamma^2-2)\xi^2+1)$. Rotating at strength $\mu$ shifts the spectrum, so a linear observable's variance becomes $S$ evaluated away from zero. If the spectrum has a single peak at zero, every shift lowers it. A damped spring has such a spectrum exactly when it shows no resonance, which for this oscillator is $\gamma\ge\sqrt2$. Nonlinear observables see convolutions of the same spectrum, and convolution keeps single peaks single (Theorem 2). At $\gamma=1$, for example, the spectrum has a resonance hump: the variance rises from $2$ to $8/3$ before falling.
- **Below the threshold, rotation still helps a lot (Theorem 4A).** For *any* friction, observables that are even ($f(-q)=f(q)$) improve at every rotation strength. Only finitely many odd Hermite components can ever be hurt. One finite rotation strength improves every observable at once. Computed crossing points (Table 1 of the paper) show that for $\gamma\ge1$ only the linear part can be hurt, while at $\gamma=0.1$ odd degrees up to 41 can be.
- **Matrix version (Theorem 10).** For a stiffness matrix $K$ and friction matrix $\Gamma$ that need not commute, the exact condition is $\Gamma^3-\Gamma K-K\Gamma\succeq0$. The least friction at which rotation is safe for every observable is $(2K)^{1/2}$. Two coupled replicas make the result apply to any Gaussian target.
- **Edges of the result.** The literal second-derivative form of the conjecture holds exactly on an explicit class containing every polynomial; rougher observables have sharper peaks (Theorem 5). For large rotations the paper gives sharp rates, including the constant $\sqrt{2\pi/e}$ (Theorem 8). Fixed time horizons and regular sampling intervals can reverse the ordering, while sampling at independent random (Poisson) times preserves it (Section 9).

**What it does not claim.** These are exact statements about Gaussian targets in continuous time. Nothing is claimed about step-size discretisation, computational cost or non-Gaussian targets. The threshold $\sqrt2$, and $(2K)^{1/2}$ in matrix form, is a **safety boundary, not a recommended friction**: DNP found small friction (about $0.1$) best in practice, and the below-threshold results say what rotation can still do there. The Hermite expansion, the Breuer–Major covariance identities, closure of single-peaked shapes under convolution, Maini's (2026) convolution-power variance formula, the overdamped uniform convergence and monotonicity of Franke et al. (2021), DNP's large-rotation limit and replica coupling are classical or prior ingredients, credited and not claimed. The paper does not "correct" DNP: it proves their conjecture in a global form and says precisely where its literal derivative wording needs qualification.

The sections below move from this overview to a specialist summary, the technical argument, the evidence and its limits, and how to rerun the checks.

## Summary for specialists

Model: $dq=(p-\mu Jq)\,dt$, $dp=(-q-\gamma p-\mu Jp)\,dt+\sqrt{2\gamma}\,dW$ in $\mathbb R^d$, $J^\top=-J\ne0$, invariant law $\mathcal N(0,I_{2d})$, $\pi=\mathcal N(0,I_d)$. For real $f\in L^2(\pi)$, $V_f(\mu)=\lim_T T\operatorname{Var}(T^{-1}\int_0^Tf(q_t)\,dt)$, which is twice DNP's $\sigma_f^2$. With $r_\gamma$ the scalar position autocorrelation and $a_{n,\omega}\ge0$ the squared Hermite/angular weights of $f$,
$$
V_f(\mu)=\sum_{n\ge1,\ \omega}a_{n,\omega}\,S_n(\mu\omega),\qquad S_n=2\pi p^{*n},\quad p=S_\gamma/(2\pi),\quad S_\gamma(\xi)=\frac{2\gamma}{\xi^4+(\gamma^2-2)\xi^2+1}.
$$

- **Theorem 1.** $V_f(b)\le V_f(a)$ for all $0\le a<b$ and all real $f\in L^2(\pi)$ $\iff$ $\gamma\ge\sqrt2$; equality for some $a<b$ iff $f=\Pi_Jf$. For $\gamma<\sqrt2$ a linear observable in a rotation plane of speed $\lambda$ has $V_f(\mu)>V_f(0)$ for $0<|\mu|<\sqrt{2-\gamma^2}/\lambda$.
- **Theorem 2.** For any centred, mean-square continuous stationary Gaussian process with integrable scalar covariance, rotated by $e^{-\mu tJ}$: universal ordering $\iff$ the spectral density is nonincreasing on $[0,\infty)$; strict under strict decrease.
- **Theorem 4A.** For every $\gamma>0$: even-chaos observables satisfy $V_f(\mu)<V_f(0)$ for all $\mu\ne0$ unless $f=\Pi_Jf$; there is $N(\gamma)$ with $S_n(\xi)<S_n(0)$ for all $\xi\ne0$, $n>N(\gamma)$; and $V_f(\mu)<V_f(0)$ for all non-invariant $f$ once $|\mu|>\mu_0(\gamma,J)=\max_{n\le N(\gamma)}\Xi_n(\gamma)/\omega_{\min}$.
- **Theorem 5, Proposition 6.** Every $V_f\in C^1$ with $V_f'(0)=0$; $V_f\in C^2$ (equivalently, a finite second derivative at $0$) iff $\mathcal Q_J(f)=\sum a_{n,\omega}\omega^2n^{-3/2}<\infty$; otherwise $(V_f(\mu)-V_f(0))/\mu^2\to-\infty$, with explicit fractional and logarithmic cusps.
- **Proposition 7, Theorem 8, Section 7.** $V_f(\mu)-V_{\Pi_Jf}(0)=O(\mu^{-4})$ for polynomials; $D_J(\mu)=\sup_{\|f\|=1}(V_f(\mu)-V_{\Pi_Jf}(0))\sim\sqrt{2\pi/e}/(|\mu|\omega_*)$ when $G_J=\omega_*\mathbb Z$; a Diophantine bound, an explicit $|\mu|^{-1/3}$ example and a Liouville example with no algebraic rate.
- **Theorem 10, Corollaries 11–12.** With $[J,K]=[J,\Gamma]=0$ but possibly $K\Gamma\ne\Gamma K$: ordering for every $L^2$ position observable if $\Gamma^3-\Gamma K-K\Gamma\succeq0$, and only if when $J$ is invertible; $\Gamma_*=(2K)^{1/2}$ is the least element in Loewner order; $\Gamma^2\succeq2K$ is insufficient without commutation. Duplication $K\otimes I_2$, $\Gamma\otimes I_2$, $J=I\otimes\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ gives explicit single-copy and replica-average limits.

## Technical account

**Covariance reduction (Sections 2–3).** Matched rotations commute with the unrotated drift, so $\operatorname{Cov}(q_t,q_0)=r_\gamma(t)e^{-\mu tJ}$. The Mehler semigroup acts as $\rho^n$ on the $n$-th Hermite chaos and the rotation acts unitarily inside each chaos, so after diagonalising, each chaos component of angular frequency $\omega$ contributes $a_{n,\omega}\int r_\gamma(t)^n\cos(\mu\omega t)\,dt$. This is $a_{n,\omega}S_n(\mu\omega)$ with $S_n$ the Fourier transform of $r_\gamma^n$, a convolution power of the scalar spectrum (formula (6)). This identity is classical in substance (Breuer–Major; Maini 2026, Lemma 3.1, at a fixed frequency).

**Criterion (Section 3.2).** The convolution of even, nonnegative, integrable functions that are nonincreasing on $[0,\infty)$ has the same property (Lemma 3, proved via superlevel sets; Lefèvre–Utev discuss the closure). So a single-peaked $S_\gamma$ makes every $S_n$ single-peaked and every term of (6) nonincreasing in $|\mu|$. Conversely a linear observable reads $S_\gamma$ directly.

**The kinetic threshold (Section 4).** $S_\gamma'(\xi)=-4\gamma\xi(2\xi^2+\gamma^2-2)/(\cdots)^2$, which is $\le0$ on $[0,\infty)$ iff $\gamma\ge\sqrt2$. At $\gamma=\sqrt2$, $S=2\sqrt2/(1+\xi^4)$ is strictly decreasing, so the endpoint is included.

**Below the threshold (Section 4.1).** Even powers $r_\gamma^n\ge0$ make $S_n(0)-S_n(\xi)=2\int r_\gamma^n(1-\cos\xi t)\,dt>0$. For high odd degrees a Gaussian-type lower bound near $t=0$, of order $n^{-3/2}\min(1,\xi^2)$, beats the geometrically small tail. Each low degree has a finite last crossing point by Riemann–Lebesgue.

**Matrix case (Section 8).** The physical-position spectrum is $S_q(\xi)=2H_\xi\Gamma H_\xi^*$ with $H_\xi=(K-\xi^2I+i\xi\Gamma)^{-1}$. Without assuming $K\Gamma=\Gamma K$, $S_q=2Q^{-1}$ with $Q(\xi)=K\Gamma^{-1}K+\xi^2B+\xi^4\Gamma^{-1}$ and $B=\Gamma-K\Gamma^{-1}-\Gamma^{-1}K$. Since $Q'(\xi)=2\xi(B+2\xi^2\Gamma^{-1})$ and inversion reverses order, the whitened spectrum decreases in Loewner order iff $B\succeq0$, that is iff $\Gamma B\Gamma=\Gamma^3-\Gamma K-K\Gamma\succeq0$. A tensor-convolution lemma (Lemma 10A) carries Loewner unimodality to all chaoses, including compression to symmetric tensors.

## Evidence, assurance and limitations

- **Proofs.** All theorems have written proofs in the manuscript and its appendices. The finite-horizon counterexample of Section 9.2 carries an exact rational certificate.
- **Supplementary checks.** `verify.py`: exact rational spectral fingerprints for the first six Hermite orders against cosine quadrature and a complex Laplace sum (optionally simplified to zero by SymPy); covariance against matrix exponentials and a Lyapunov equation; linear and quadratic variances against Poisson-equation and Lyapunov solves; the finite-horizon reversal; aliasing and Poisson-sampling identities; high-degree limits; the figure. `verify_matrix_extension.py`: a noncommuting admissible example, tensor convolution against Lyapunov at three amplitudes, the insufficiency of $\Gamma^2\succeq2K$, the least-friction identity and a precision-mismatch formula. `verify_below_threshold.py`: the Table 1 crossing points from an exact exponential-sum formula cross-checked by quadrature.
- **Computed, not proved.** Table 1's crossing points and the observed high-degree error slopes are numerical evidence; the theorems do not depend on them.
- **Replay.** All three scripts were rerun from fresh copies with and without Python `-O`. Checks raise errors rather than using `assert`, and a deliberately corrupted least-friction formula is rejected under `-O`. GitHub CI reruns them.
- **Limits.** Exact stationary Gaussian dynamics; matched, target-preserving rotations; position observables (momentum observables can get worse). No discretisation, cost or optimal-friction statement. The prior-art searches of 1 and 4 November 2026 covered the originating paper and thesis, the overdamped variance-reduction literature, work citing DNP, related nonreversible-sampling work and formula-level aliases; Maini (2026) and the published text of Franke et al. (2021) were read in full. No earlier statement of the main results was found. Review was internal and AI-assisted only.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Designers of kinetic Langevin and molecular-dynamics samplers | A friction level ($\gamma\ge\sqrt2$, or $\Gamma^3-\Gamma K-K\Gamma\succeq0$) above which a target-preserving rotation cannot hurt any position average, and a guarantee that a large enough rotation helps below it | Exact continuous-time Gaussian dynamics; integrator step size, cost and non-Gaussian targets are not covered; the threshold is not a recommended friction |
| Researchers in nonreversible MCMC | A global proof of the DNP conjecture's intended content, an exact domain for its derivative wording, and sharp rates | Classical ingredients are credited; no earlier statement of the main results was found |
| Gaussian-process and spectral analysts | A clean criterion: universal rotation ordering iff the spectral density is single-peaked | Applies to rotations preserving a Gaussian law, with integrable covariance |

## Why the problem matters

Rotations are cheap to add and are used to speed up samplers, but for kinetic samplers they can make some estimates worse. A practitioner needs to know when the trick is safe for every quantity being estimated, not just for a few test functions. The paper turns that question into a one-line spectral test: no resonance peak means no risk. It also explains what remains true at the small frictions people actually use.

## How to inspect or reproduce the recorded checks

From the unpacked archive (Python 3.10 or later):

```sh
cd research_sampling
uv run --with numpy --with scipy --with matplotlib --with sympy python3 -I -B code/verify.py --symbolic --output /tmp/rg/verification_results.json --figures-dir /tmp/rg/figures
uv run --with numpy --with scipy python3 -I -B code/verify_matrix_extension.py --output /tmp/rg/matrix_extension_results.json
uv run --with numpy --with scipy python3 -I -B code/verify_below_threshold.py --output /tmp/rg/below_threshold_results.json
```

The first two take seconds and the third about two to four minutes. Add `-O` to confirm the checks still run. The reports match the shipped ones in every exact field, with floats equal to round-off.

## The most valuable next projects

1. An exact discrete-time criterion for a specified splitting integrator with rotation, where aliasing (Section 9.3) is the obstacle.
2. A perturbative ordering statement for near-Gaussian targets.
3. A certified value of $N(\gamma)$ and of the Table 1 crossing points.
4. A quantitative comparison of adding rotation with retuning the friction, under a stated cost model.

## What is in the evidence package

The archive contains the manuscript (Markdown source, generated LaTeX and PDF), the three verification scripts with their JSON reports, the four-panel figure, the matrix-extension notes, the dated novelty reports and search log, frozen targets and formula fingerprints, a rating-free record of the internal review, the bibliography with the Crossref, DataCite and arXiv records it was generated from, an AI index, research-gate records, CI configuration and SHA-256 manifests. Text and data are CC0-1.0 and code is MIT. This remains an unrefereed candidate.
