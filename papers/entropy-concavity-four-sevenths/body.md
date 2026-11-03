## Summary

**In one sentence.** Mix two noisy copies of a signal that is close to Gaussian and symmetric: the entropy of the blend is guaranteed to be a concave function of the mixing weight exactly when the noise variance is more than three quarters of the signal variance.

**The setting.** Take two independent copies $X$ and $Y$ of a random signal and blend them as $\sqrt t\,X+\sqrt{1-t}\,Y$, with a mixing weight $t$ running from 0 (all of $Y$) through $1/2$ (an even blend) to 1 (all of $X$). The weights keep the variance fixed. Mixing tends to make things look more Gaussian, and among all distributions with a given variance the Gaussian has the most entropy. So a natural guess is that entropy rises smoothly as you blend, with no dips along the way. In mathematical terms: entropy is a *concave* function of $t$.

**The conjecture and its refutation.** Ball, Nayar and Tkocz conjectured exactly this for log-concave signals (2016). In 2026 Luo disproved it. He then asked a sharper question: if independent Gaussian noise is added to each copy first, how much noise is needed before concavity returns, at least for signals close to a Gaussian? Write $q$ for the **signal fraction**, the share of each copy's variance that is signal rather than noise. Luo's symmetric counterexamples work whenever $q>4/7$. Schubr proved that nothing can go wrong near the Gaussian when $q<1/2$. The range from $1/2$ to $4/7$ was open.

**What was found.** $4/7$ is the true answer. For every signal fraction below $4/7$, every symmetric signal close enough to a Gaussian gives a concave entropy curve (Theorem A). In noise terms, the noise variance must exceed three quarters of the signal variance, a signal-to-noise ratio of $4/3$. Whether exactly $4/7$ qualifies is still open.

| Signal fraction $q$ | Noise ÷ signal variance | Near the Gaussian, symmetric inputs | Source |
|---|---|---|---|
| below $1/2$ | above 1 | entropy curve always concave | Schubr (2026); also Theorem A |
| $1/2$ to just below $4/7$ | between $3/4$ and 1 | entropy curve always concave | **Theorem A (new)** |
| exactly $4/7$ | exactly $3/4$ | open | Proposition E rules out Luo's family near the midpoint |
| above $4/7$ up to $2-\sqrt2\approx0.586$ | about 0.71 to $3/4$ | a dip at the even blend is possible | Luo (2026) for non-concavity; Theorem B for the midpoint dip, also proposed in a public GitHub argument |
| above $2-\sqrt2$ | below about 0.71 | a dip at the even blend is possible | Luo (2026); Theorem B adds the exact curvature and shape |

**How big is the effect?** Tiny. The dips in the constructions are of order $10^{-13}$ nats, and the neighbourhood in Theorem A is small (a relative density error of about $1.7\times10^{-5}$ at $q=1/2$). The results are structural: they say where the qualitative behaviour changes, not that the change is large.

**How sure we are.** Every result has a written proof. Standard-library scripts check the exact identities, constants and tables, and a harness requires sixteen deliberately broken copies of the checkers to fail. This is an anonymous, AI-assisted, unrefereed candidate; its review was internal, not peer review.

## Summary for specialists

Let $X,Y$ be i.i.d. with even density $f$, mean 0 and variance 1, $G$ standard Gaussian, and $F_{q,f}(t)=h\big(\sqrt{qt}\,X+\sqrt{q(1-t)}\,Y+\sqrt{1-q}\,G\big)$ for $q\in(0,1]$, $t\in[0,1]$. Write $f=\varphi(1+g)$ with $g$ *admissible* (real, even, bounded, $\int g\varphi=\int x^2g\varphi=0$), $T_\rho$ for the Ornstein–Uhlenbeck (Mehler) operator and $N$ for the number operator on the Hermite basis of $L^2(\varphi)$. Let $\mathcal C$ be the set of $q$ for which some $\delta>0$ makes $F_{q,\varphi(1+g)}$ concave for every admissible $g$ with $\|g\|_\infty\le\delta$.

- **Theorem A:** for every $Q<4/7$ there is an explicit $\delta_Q>0$ with $F''_{q,\varphi(1+g)}(t)\le-\tfrac1{16}\big\|N\big(T_{\sqrt{qt}}g+T_{\sqrt{q(1-t)}}g\big)\big\|_2^2$ for all admissible $\|g\|_\infty\le\delta_Q$, $0<q\le Q$, $t\in[0,1]$ *(proof)*
- **Corollary:** $(0,4/7)\subseteq\mathcal C\subseteq(0,4/7]$, so $\sup\mathcal C=4/7$; the same holds for relative $C_b^m$ neighbourhoods and for smooth strongly log-concave inputs matching finitely many Gaussian moments *(proof, with Luo's Theorem 1.2)*
- **Theorem B:** for every $q\in(4/7,1]$, Luo's moment-corrected sequence $f_n$ (smooth, even, strongly log-concave) has $F''_{q,f_n}(1/2)>0$ eventually, with $\gamma(q)=21\sqrt5\,q/(49q-4)$ and $\big(F(1/2+s/\sqrt n)-F(1/2)\big)/D_{q,n}\to1-e^{-4\gamma(q)s^2}$ in $C^2$ *(proof; the sign on $(4/7,2-\sqrt2]$ was also proposed in an earlier public argument)*
- **Proposition S:** for bounded $g$, $\|T_{\sqrt s}g\|_2^2\le J\|g\|_\infty\|T_{\sqrt r}g\|_2$ holds for $s<b(r)=\sqrt{2r(1+r)}-r$ and the quotient is unbounded for $s>b(r)$; $4/7$ is the fixed point $q=b(q/2)$, and at $(r,s)=(2/7,4/7)$ the extremal Hermite parameter is Luo's $a=7/(3\sqrt5)$ *(proof)*
- **Proposition E:** at $q=4/7$ Luo's family has $F''<0$ on a fixed neighbourhood of $t=1/2$ for large $n$ *(proof)*; it does not decide whether $4/7\in\mathcal C$
- **Remark R:** the proof's radius satisfies $\delta_Q\sim C_\delta(4/7-Q)^{9/4}$, $C_\delta\approx5.93\times10^{-3}$ *(first-order expansion, numerically confirmed)*

## Technical account

**The competition.** The density of the noisy mixture is $\varphi(1+L+M)$. The linear term $L=T_{\sqrt{qt}}g+T_{\sqrt{q(1-t)}}g$ damps the degree-$k$ Hermite component by $(qt)^{k/2}+(q(1-t))^{k/2}$, a convex function of $t$, and always pushes the entropy curve towards concavity. The quadratic term $M$ records the interaction of the two copies and can push the other way. At the even blend, $L$ sees the input smoothed to level $r=q/2$, while $M$ behaves like the input smoothed to a level $s$ just above $q$.

**Why four sevenths.** For bounded inputs the comparison $\|T_{\sqrt s}g\|^2\lesssim\|g\|_\infty\|T_{\sqrt r}g\|$ is available exactly when $s<b(r)$ (Lemma I.2, proved sharp in Proposition S). With $r=q/2$ and $s$ slightly above $q$, this needs $q<b(q/2)$, that is $q<4/7$. Schubr's argument instead used the $L^2(\varphi)$ semigroup bound, which needs $s\le\sqrt r$ and so stops at $q<1/2$; the Hermite polynomials show that bound cannot be pushed further, and boundedness of the perturbation is what moves the threshold out to $b(r)$. On the other side, Luo's counterexample family is exactly the extremal Hermite test function at the fixed point, so the positive and negative sides are two views of one smoothing inequality.

**Proof of Theorem A.** Lemma I.2 extends Luo's Gaussian-kernel interpolation (stated for finite Lebesgue $L^2$ norm at a single weight) to bounded inputs with a weak Gaussian weight. Extra Gaussian smoothing makes $M$ twice differentiable in $t$ with explicit bounds, and Schubr's Hermite-energy method absorbs the logarithmic nonlinearity of entropy. The radius is explicit and uniform in $q\le Q$; Section I.7 tabulates it.

**Proof of Theorem B.** Luo's moment-corrected Hermite construction is analysed through a differentiated coefficient lemma and the coefficient of the quadratic convolution, giving the curvature constant $\gamma(q)$, one input sequence for all $q\in(4/7,1]$ including $q=1$, and the $C^2$ local profile.

**Classical and new.** The entropy power inequality, Hermite and Mehler calculus, Luo's construction and interpolation and Schubr's absorption argument are inherited and cited. Within a bounded search, new here are Theorem A, the identification $\sup\mathcal C=4/7$, the exact constant and profile with a complete written proof in Theorem B, and Propositions S and E and Remark R. The sign of Theorem B on $(4/7,2-\sqrt2]$, Luo's Problem 10.3, was proposed in a public, unrefereed GitHub issue dated 1 November 2026; the paper cites it and claims only the additions listed.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/entropy-concavity-four-sevenths.txt) is available for reading.

- **Proofs.** Every result has a written analytic proof in the 32-page manuscript. No proof assistant was used.
- **Computational checks.** Four standard-library checkers test the Part II coefficient asymptotics against $-8\gamma(q)$ and the exact recurrence (233 checks), the Part I radius recipe and table in 100-digit arithmetic (165), the Part II Hermite identities and two-weight inner products to about $10^{-78}$ (178), and the Proposition S envelope, Proposition E diagnostics and Remark R constant (315). They exit with an error if any check fails, including under Python's `-O` flag.
- **Negative controls.** A harness confirms that the checkers contain no `assert` and that 16 deliberately broken copies fail in both normal and optimized mode; the extension checker carries 6 further internal controls.
- **Replay.** Every checker was rerun under `-I -B` and `-I -B -O` from a fresh copy of the package, before freezing and again from the frozen archive; every output matched the shipped one apart from timing fields. GitHub CI repeats this on Linux.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review and proof audit by a separate model, a separate proof audit and a clean replay led to one revision round; a re-review and the audits found no remaining correctness issue. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The results are local: they concern inputs within a tiny uniform relative-density neighbourhood of the Gaussian, and say nothing about concavity for all symmetric log-concave inputs (Luo's Problem 10.1). The boundary $q=4/7$ is open. Evenness is essential: asymmetric inputs fail for every $q>0$. The radius and the constant $1/16$ are not optimised. The finite-precision checks support but do not replace the proofs. Three of the closest sources are unrefereed 2026 preprints or a public issue thread.

## Relationship to earlier work

Ball, Nayar and Tkocz (2016) posed the concavity conjecture; Lieb's form of the entropy power inequality gives the chord inequality it would strengthen, and Eskenazis and Gavalakis (2024) proved it for Gaussian mixtures. Luo (2026) refuted it, constructed the symmetric counterexamples for $q>4/7$ that give the upper half of $\sup\mathcal C=4/7$, proved the interpolation inequality that Lemma I.2 extends, and posed Problems 10.1–10.3. Schubr (2026) proved local concavity for $q<1/2$, and his argument is reused in Part I. Abu-Ajamieh (2026) proved concavity up to $q=5/8$ for one fixed unbounded direction $\varphi(1+a\,\mathrm{He}_4)$; that does not conflict with $4/7$, which concerns whole neighbourhoods containing all directions. A public GitHub issue (1 November 2026) proposed the sign in Theorem B on $(4/7,2-\sqrt2]$.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on entropy inequalities | A sharp local threshold, an explanation of why it is $4/7$, and explicit constants to build on | Local result; the boundary and the global problem remain open |
| Information theorists and signal-processing researchers | A precise noise level (signal-to-noise ratio $4/3$) separating guaranteed concavity from possible midpoint dips for near-Gaussian symmetric sources | Effects are of order $10^{-13}$ nats; this is a population statement, not an estimator property |
| Blind source separation and independent component analysis | Below SNR $4/3$, near-Gaussian symmetric sources give no spurious interior minimum of the entropy contrast; above it, smooth log-concave sources matching any number of Gaussian moments can make the 45° mixing direction a local minimum | In noisy models the contrast's minimiser need not be the noiseless source direction |
| Research agents | Machine-readable claims, an agent index and fail-closed checkers with negative controls | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

Entropy along mixtures is a basic object in information theory, and concavity questions of this kind sit behind entropy power inequalities and central-limit behaviour. Luo's refutation showed the clean conjecture is false; the natural follow-up is how much noise rescues it. This paper gives the exact local answer, explains the number through a sharp Gaussian smoothing inequality, and shows that the two sides of the threshold come from the same mechanism. The blind-source-separation reading turns the threshold into a statement about when a classical contrast can have spurious minima.

## Where to inspect the package and reproduce the checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.12 and no third-party packages:

```sh
shasum -a 256 -c MANIFEST.sha256
cd checks
python3 -I -B coefficient_checks.py --output-dir results/normal/coefficient_checks   # likewise the other three checkers
python3 -I -B -O coefficient_checks.py --output-dir results/optimized/coefficient_checks
python3 -I -B negative_controls.py   # 16 broken copies must fail in both modes (about 20 seconds)
```

`VERIFICATION.md` says what each checker establishes, `AI_INDEX.md` maps each claim to its proof and evidence, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide the boundary: is $4/7\in\mathcal C$? This needs a derivative estimate directly against $\|NL\|$, or a family beating the linear term without the exponential gap that Proposition S rules out for Hermite families.
2. The global problem: concavity for every symmetric log-concave input at a fixed noise level (Luo's Problem 10.1).
3. Rényi entropies and mixtures of three or more copies, which may have different thresholds.
4. The true size of the concavity neighbourhood near $4/7$; the radius here is far from optimal.
