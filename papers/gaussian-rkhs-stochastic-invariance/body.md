## Summary

**In one sentence.** A Gaussian kernel space stays invariant under a linear stochastic system exactly when $AP+PA^\top\preceq4BB^\top$, not only under the earlier sufficient condition with factor 2, and among Gaussian or "map plus fixed noise" transitions only affine maps can keep it invariant at all.

**The problem, in plain terms.** Kernel methods such as kernel extended dynamic mode decomposition (kEDMD) learn how a random system evolves. They do this inside a space of smooth test functions: the reproducing kernel Hilbert space (RKHS) of a Gaussian kernel

$$k_P(x,y)=\exp[-(x-y)^\top P^{-1}(x-y)],$$

whose width is set by the matrix $P$. Much of their error analysis assumes the space is *invariant*: if you take any function in the space and average it over one step of the random motion, the result is again in the space. If that fails, the operator being learned is not even well defined on the space, and the error bounds do not apply.

**What was known.** For linear stochastic differential equations $dX=AX\,dt+B\,dW$ (Ornstein–Uhlenbeck processes), Philipp, Schaller, Worthmann, Peitz and Nüske (2025, PAMM) proved invariance whenever $AP+PA^\top\preceq2BB^\top$. They left open, explicitly, whether this condition is also necessary.

**What is proved.**

- **The exact condition has factor 4.** Invariance at all times holds exactly when $AP+PA^\top\preceq4BB^\top$. The factor 4 has a simple source: averaging one kernel over Gaussian noise widens it by $2Q$, but the norm of the space compares two independent copies of the noise, whose difference has covariance $2Q$, giving $P+4Q$. The stable shear $A=\begin{pmatrix}-1&5\\0&-1\end{pmatrix}$, $B=P=I$ satisfies the exact condition but not the factor-2 one.
- **Rigidity.** If a transition has Gaussian random steps $N(F(x),Q(x))$, with any (measurable) mean and covariance fields, and maps one Gaussian kernel space boundedly into another, then the covariance is constant and the mean is affine. The same holds for "map plus fixed noise" transitions whenever the noise is not too smooth, which includes every infinitely divisible noise, pure jumps too. So Euler steps of nonlinear SDEs never preserve a Gaussian kernel space.
- **Only the Gaussian part of the noise counts.** For linear dynamics driven by Lévy noise, jumps change the norm but never decide which kernel widths are admissible.
- **A discontinuous limit.** Replace Brownian noise by small jumps $\pm\varepsilon$. Predictions converge at the sharp rate $\varepsilon^2$, yet at time $t=1/10$ every jump approximation sends the fixed function $e^{-8|x|^2/5}$ out of the space, while the Brownian limit keeps it in.
- **A practical rule.** For an isotropic width $P=\sigma^2I$, the admissible range is $\sigma^2\le4/\lambda$, where $\lambda$ is the largest eigenvalue of $A+A^\top$ after rescaling by the noise ($B=I$ needs no rescaling), twice the earlier range: $4/3$ rather than $2/3$ for the shear. The invariance hypothesis of a published kEDMD error bound then holds for multivariate OU processes.

**What is not new, and what is not proved.** The fixed affine criterion is a specialisation of classical theory of Gaussian operators on Fock space (Neretin, Olshanski): the OU answer is a translation, not a new operator theorem. The shear witness and a proposed derivation were posted first, explicitly unproven, in GitHub issue [the-omega-institute/trureturing #23376](https://github.com/the-omega-institute/trureturing/issues/23376) on 28 October 2026. All statements concern the global norm of the space, not pointwise prediction or learning from finite data. Transitions whose random steps are state-dependent and non-Gaussian remain open.

**How sure we are.** Every theorem has a written proof. A script checks the example, the thresholds and the constants, in exact rational arithmetic where possible. Review was internal and AI-assisted; this is not peer review.

## Summary for specialists

Notation: $\mathcal H_P$ is the RKHS of $k_P$ on $\mathbb R^d$; $Tf(x)=\mathbb E f(X')$; affine means $F(x)=Mx+b$; and $D=BB^\top$.

| Result | Statement | Relation to prior work |
|---|---|---|
| Theorem 5 | Gaussian $N(F(x),Q(x))$, Borel fields, bounded $\mathcal H_P(\mathbb R^m)\to\mathcal H_R(\mathbb R^d)$ $\Rightarrow$ $Q$ constant, $F$ affine, $M$ full column rank, $MRM^\top\preceq P+4Q$ | Deterministic affine rigidity known (Ikeda, Ishikawa, Sawano 2022); covariance rigidity proposed as new |
| Theorem 9 | $F(x)+Z$ with $\lvert\varphi_Z(\xi)\rvert\ge ce^{-\xi^\top C\xi}$ $\Rightarrow$ $F$ affine | Proposed as new; covers pure-jump Lévy noise |
| Theorems 8, 11 | Affine infinitely divisible noise: boundary uses the Gaussian component only; Lévy–OU iff $AP+PA^\top\preceq4D$ | Lévy–Khintchine machinery standard |
| Theorem 12, Prop. 13 | $\lVert K_\varepsilon-K_0\rVert_{\mathcal H_I\to C_b}\sim\Gamma\varepsilon^2$, $\Gamma\approx0.0993$; $K_\varepsilon f\notin\mathcal H_I$ for all $\varepsilon$ | Coexistence proposed as new |
| Prop. 3, Theorem 6 | Exact range and norm; OU all-time iff $AP+PA^\top\preceq4BB^\top$; norm $e^{-t\operatorname{tr}A/2}$ | Specialisation of Neretin's Gaussian-Fock criterion; witness in issue #23376 |
| Props. 14–17, Cor. 18 | Sampling thresholds; $\sigma^2\le4/\lambda_{\max}$; kEDMD hypothesis for multivariate OU | Consequences |
| Theorems 19, 20 | Isometry to a classical OU semigroup; spectrum and growth; essential norm equals norm | Imported spectral theorem attributed |

- **Two noise copies.** $\langle Tk_x,Tk_y\rangle$ involves $Z-Z'$ with covariance $2Q$, so the image space is the Gaussian space of matrix $E=(M^\top S^{-1}M)^{-1}$ with $S=P+4Q$; boundedness into $\mathcal H_R$ is $E\succeq R$, i.e. $MRM^\top\preceq S$.
- **Rigidity mechanism.** Applying $T$ to complex-centred kernel sections gives a jointly entire function of the state (along a line) and the centre, bounded uniformly over real centres. Along real states it is an explicit Gaussian in the centre with coefficients from $F$ and $Q$; the bound forces the quadratic coefficient to have nonnegative real part, and a Cayley transform with Liouville's theorem makes it constant. For additive noise, evaluation representers are translates of one fixed function; dividing out the noise factor leaves a character $e^{-i\eta\cdot F(x)}$ that continues holomorphically and stays multiplicative, which forces $F$ affine.

## Technical account

**Fourier picture.** $\mathcal H_P$ consists of the $f$ with $\int|\hat f(\xi)|^2e^{\xi^\top P\xi/4}d\xi<\infty$. An affine Gaussian transition multiplies $\hat f$ by a Gaussian factor and composes with $M^\top$; Lemma 2 computes the range of Gaussian smoothing exactly, and Proposition 3 gives the image space, range and norm $|\det M|^{-1/2}(\det P/\det R)^{1/4}$ when $MRM^\top\preceq P+4Q$. Section 3 writes the Bargmann-type isometry that turns this into Neretin's criterion for bounded Gaussian operators on Fock space, which is why no priority is claimed for it.

**Ornstein–Uhlenbeck.** With $M_t=e^{At}$ and $Q_t=\int_0^te^{As}De^{A^\top s}ds$, the semigroup identity shows that $e^{At}Pe^{A^\top t}\preceq P+4Q_t$ for all $t$ iff its derivative at $0$ is nonpositive, i.e. $AP+PA^\top\preceq4D$; no stability or controllability is needed. For the shear, $2I-(A+A^\top)$ has eigenvalues $-1,9$ and $4I-(A+A^\top)$ has $1,11$.

**Rigidity.** No continuity of $F$ or $Q$ is assumed. Boundedness first follows from inclusion by the closed graph theorem. Functions in $\mathcal H_R$ extend to entire functions with controlled growth, so $T$ applied to complex-centred sections yields an entire function whose quadratic coefficient in the centre is $(P+2Q)^{-1}$ along real states; uniform bounds and Liouville's theorem make it constant, and a second step makes the mean affine. The additive-noise case (Theorem 9) uses translate structure instead: the Gaussian lower bound on the characteristic function is what allows the noise factor to be divided out.

**Diffusion limit.** Section 6 computes the exact $\mathcal H_I\to C_b$ distance between two affine infinitely divisible transitions (kernel-mean duality), giving the sharp $\varepsilon^2$ order with an explicit constant, while the compound-Poisson noise has no Gaussian component, so by Theorem 11 the matrix inequality fails for every $\varepsilon>0$ at $t=1/10$ and the fixed observable leaves the space.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/gaussian-rkhs-stochastic-invariance.txt) is available for reading.

- **Proofs.** All theorems have written proofs in the 26-page manuscript.
- **Checks.** `code/verify.py` derives the slack eigenvalues, effective diffusion, isotropic thresholds and witness norms of the separating example in exact rational arithmetic; compares closed shear formulas with quadrature at 140 parameter settings; computes the diffusion-limit constants ($\Gamma\approx0.0993$, coefficient $0.4475$, Brownian margin $\tfrac14$) and the exact $\varepsilon$-norms; checks Theorem 9 numerically for Cauchy noise; and reproduces Table 1. These test constants and implementation, not the theorems.
- **Controls and replay.** Every check raises explicitly, so Python's `-O` flag does not disable it. From a fresh copy the run reproduced its retained output byte for byte; changing the factor 4 to 2, or the shear entry 5 to 7, makes it fail. GitHub CI reruns it on Linux.
- **Review.** Five internal AI reviewer roles, a separate-model adversarial review, one revision round, a re-review and two audits of the new proofs; no open correctness issue remained. None of this is peer review or independent reproduction.
- **Limitations.** Statements concern the global RKHS norm; they say nothing against finite-data kEDMD predictions. State-dependent non-Gaussian transitions, and noise without a Gaussian characteristic-function lower bound, remain open. Priority holds only within a dated, bounded search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Users of kernel EDMD and kernel Koopman methods | Choose Gaussian widths that keep the invariance assumption true for linear-Gaussian or Lévy-driven models; know that nonlinear Euler steps never satisfy it | Global RKHS norm only; linear or affine dynamics |
| Theorists of Koopman and transfer operators | Rigidity results that delimit where invariance-based error bounds can apply | State-dependent non-Gaussian transitions open |
| Operator theorists | An explicit bridge between Gaussian-Fock criteria and kernel learning | The fixed criterion is classical |
| Research agents | Agent index, machine-readable claims and replayable checks | Finite checks only |

## Why the problem matters

Invariance is the hypothesis that lets kernel learning theory treat the evolution of observables as one bounded operator. Knowing exactly when it holds tells practitioners which kernel widths are safe for linear models, and the rigidity results show that for nonlinear models the hypothesis must be replaced by bounds in weaker norms.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
python -m pip install -r requirements.txt                    # numpy 2.3.5, scipy 1.17.0, matplotlib 3.10.8
python3 -I -B code/verify.py --output-dir OUT                # about 15 seconds
python3 -I -B -O code/verify.py --output-dir OUT_O           # same result: no assert statements
```

Compare `OUT/verification_results.json` with `audit/verification_results.json`. `AI_INDEX.md` maps each result to its section and evidence, and the reports in `audit/` record the sources inspected.

## The most valuable next projects

1. Decide whether any state-dependent non-Gaussian transition (a state-dependent Lévy kernel or a Gaussian mixture) can map one global Gaussian RKHS into another.
2. Extend drift rigidity to noise whose characteristic function vanishes on an open set or decays faster than a Gaussian.
3. Find weighted or data-adapted kernel norms in which stable OU semigroups are invariant and contractive under a sharp condition.
4. Characterise when the admissible bandwidth set is nonempty for non-stabilisable pairs $(A,B)$.

## What is in the evidence package

The manuscript (PDF and Markdown source with its build script); `code/verify.py` with the retained output `audit/verification_results.json`, the figure and pinned `requirements.txt`; the bibliography (`refs.bib`) with the Crossref, arXiv and GitHub records it was copied from; four dated novelty reports and target files in `audit/`; `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text is CC0-1.0; code is MIT. This remains an unrefereed candidate.
