## Summary

**The question.** Many methods that rebuild an image from blurred, noisy or incomplete measurements alternate two steps. One step nudges the image towards agreement with the data. The other cleans up noise with a *denoiser*. These are called plug-and-play (PnP) methods. A popular denoiser is a kernel smoother such as non-local means, which replaces each pixel with a weighted average of similar pixels. The weights are Gaussian in the distance between patches and are normalised so that each row sums to one. In 2025, Sinha, Kumar, Athalye and Chaudhury noted that such iterations seem to converge in practice, but that they "have not yet found a formal proof or a counterexample".

**What was found.** The answer depends on size. Assume the usual conditions:
- the similarity graph is connected;
- every point has self-weight one;
- the data step treats a constant image consistently.

Under those conditions, both standard iterations (PnP-ISTA and PnP-ADMM) are **always stable for problems with up to three points**, at every allowed step size. **At four points they can fail.** The paper gives explicit Gaussian weights and a fixed, entrywise-positive blur for which both iterations slowly diverge at any chosen step up to one half, and it maps exactly where this happens (the banner's left panel). A twelve-point example shows the same for a convolution blur, but only for very small steps. If self-weights are allowed to differ, failure starts at three points.

**How big is the effect? Tiny.** Errors grow by at most about $1.7\times10^{-5}$ per iteration (the banner's right panel). Tenfold growth would need $10^5$–$10^6$ iterations, while real runs use 20–500. The weak links that cause it have affinities of only $10^{-8}$–$10^{-6}$, which practical implementations usually round to zero. Rounding them to zero is not a cure either, because it disconnects the graph, and the disconnected limit is also unstable. So the result shows that **no blanket step-size guarantee exists**. It does not show that real imaging pipelines are diverging.

**What to do about it.** The cause is a similarity graph that is almost split into pieces and averages unequally across them. Two remedies are proved. Scale the step size with the denoiser's *mixing gap* $g$, which measures how well its averaging spreads. Or use a symmetrised denoiser, which is safe at every allowed step under a mild condition.

**Status.** This is an anonymous, AI-assisted, unrefereed candidate. It was checked by internal AI-assisted review only, not by peer review or independent reproduction.

## Summary for specialists

Let $W=D^{-1}K$ with $D=\operatorname{diag}(Ke)$, and let $B=A^{\mathsf T}A\succeq0$. The two iteration matrices are

$$
P(t)=W(I-tB),\qquad R(t)=I-W+(I+tB)^{-1}(2W-I).
$$

"Stable" means Schur stable. The class is: $K$ symmetric, nonnegative and irreducible, with $K_{ii}=1$ and $K_{ij}\le1$, and $Be=be$ with $b>0$.

| Result | Status |
|---|---|
| $n\le3$: $P(t)$ and $R(t)$ are stable for all $0<t<2/\rho(B)$ (Theorem 1(a)). The proof reduces to Banerjee–Chaudhury Theorem 1.3 via the positive doubly stochastic $S=W+\tfrac13e(e^{\mathsf T}-e^{\mathsf T}W)$. | proved |
| $n=4$: with a fixed strictly positive SPD stochastic $A$, $B=A^2$ and a fixed stationary $\pi$, each $0<t\le1/2$ has a Gaussian $K_t$ with $\kappa_2(K_t)<19.22$ and a real eigenvalue $>1$ (Theorem 1(b)). | proved; exact certificate |
| Exact classification on $[0,10^{-4}]\times(0,2)$: unstable iff $\Delta(\epsilon,t)<0$. Here $\epsilon_{\rm crit}\approx1.6947\times10^{-5}$, the first loss is $T_-(\epsilon)=\tfrac{968750}{133}\epsilon+O(\epsilon^2)$, and $t^*\approx0.5313$ along $\epsilon=t/10^5$ (Theorem 4). | proved; exact certificate (Appendix C) |
| Positive circulant $A_c\in\mathbb R^{12\times12}$: unstable exactly for $0<t<t_c=1.9157074941\ldots\times10^{-4}$ along $\epsilon=t^2$ (Theorem 3). | proved; exact certificate (Appendix C) |
| Stable whenever $t\rho(B)<\min\{2,g/(\sqrt{\kappa_\pi}-g)\}$, and the order $g$ is sharp within the family (Theorem 2, Section 8.3). | proved |
| Without unit diagonals, a reversible positive kernel fails at $n=3$ (Theorem 5). | proved |
| Symmetric $W$ with $\sigma(W)\subset(-1,1]$ is stable iff $\ker(I-W)\cap\ker B=\{0\}$ (Theorem 6, Corollary 1). | proved; extends Athalye et al. (2023) |

The kernel is chosen for each step and then held fixed. By Banerjee–Chaudhury Theorem 1.1, every fixed primitive kernel is stable for sufficiently small steps.

## Technical account

**The mechanism.** Take two groups of points joined by a very weak link of strength $\epsilon$. Vectors that are nearly constant on each group decay only slowly under averaging, at a rate of about the mixing gap $g\approx\tfrac{31}{26}\epsilon$. The data step acts on the difference between the two group levels through an *oblique compression* of $B$. This map averages each group with its own stationary weights, but assigns levels to vertices in a different way. When those weights are unequal, the compression need not be positive definite. In the four-state family its slow eigenvalue is $c=-133/812500$. The slow mode is then damped by about $\tfrac{31}{26}\epsilon$ and amplified by about $|c|t$, and the iteration becomes unstable once $t$ exceeds about $6109\,g$. In dimension three, the identity (6)–(7) shows that $W$ can be completed to a strictly positive doubly stochastic matrix with the same quotient, which rules this out.

**What is new and what is not.** These are known and cited:
- the low-dimensional stability argument (Banerjee and Chaudhury's Theorem 1.3);
- the $L^2(\pi)$ spectral-gap technique behind Theorem 2;
- the Jury, Bernstein and Sturm certification methods;
- the spectral-norm argument behind Theorem 6 (Athalye, Chaudhury and Kumar, 2023).

To the best of a bounded search, the following are new:
- the positivity identity (6)–(7);
- the sharp dimension four for this class;
- the explicit Gaussian family with a fixed positive forward operator and its exact classification;
- the order-$g$ obstruction;
- the certified circulant family;
- the three-state reentrant family;
- the extension of Athalye et al. to non-stochastic, indefinite symmetric denoisers.

The broad Banerjee–Chaudhury conjecture was disproved first, in S. Patel's online post. That post uses signed Hessians and a zero diagonal, which fall outside this class.

**Exact certificates.** The characteristic polynomials of $P$ and $R$ factor into a constant mode, an antisymmetric mode and a quadratic. Lemma 1, the degree-two Jury test, reduces Schur stability to sign conditions. Appendix C does three things:
- It prints the quadratic factors.
- It summarises the strictly positive Bernstein coefficients of every side condition on the box.
- It gives the Sturm counts and rational isolating intervals for $\epsilon_{\rm crit}$, $t^*$ and $t_c$.

The coefficient files carry SHA-256 hashes. A standard-library checker re-verifies everything from those files alone.

## Evidence, assurance and limitations

- **Proofs.** Every theorem has a written proof. Theorem 1(a) also has a self-contained argument that does not depend on the cited theorem.
- **Exact computation.** Theorems 1(b), 3 and 4 rest on exact rational certificates. Their decisive data are printed, so a reader can check them from the paper and three small files.
- **Replay and controls.** A replay driver reruns every verifier from a clean copy and compares the records. Eight corrupted certificates are each rejected, among them a flipped Bernstein sign, a shifted isolating interval and a changed polynomial coefficient.
- **Review.** The candidate went through a five-perspective internal review, AI-assisted correctness audits by a different model before and after revision, a targeted proof audit and a verification re-review. The final round's points were fixed before publication:
  - certificate data printed in the paper;
  - the post-threshold range restricted to the Gaussian domain;
  - a condition added to the symmetric-denoiser claim;
  - credit to Athalye et al. (2023);
  - a corrected digit in $t_c$.

  None of this is peer review, independent reproduction or formal verification.
- **Limits.**
  - The instability is minute and uses minute affinities, and no imaging experiment is reported.
  - Four-point instability is certified only for $0<t<t^*$.
  - The convolution window is $0<t<1.92\times10^{-4}$.
  - Theorem 2's constant is conservative by a factor of about 8,600.
  - Liu, Xing and Sun (2021) was read in abstract only.
  - The literature search was bounded, and no priority is claimed.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Imaging and inverse-problems researchers | Use gap-scaled step sizes, or symmetrised kernels, with linear kernel denoisers. Avoid claiming uniform convergence guarantees for row-normalised kernels. | The failure is structural and extremely slow, and no natural-image experiment is reported. |
| Optimisation and matrix theorists | A sharp dimension threshold for products of non-commuting averaging and data operators. Oblique compression is the obstruction. | The results cover the stated class only. Large steps in dimension four and $Be\le\rho(B)e$ remain open. |
| Research agents and tool builders | Exact coefficient files and a standard-library checker that can be re-verified mechanically. | The checker takes the stored polynomials as given. Their link to the matrices rests on the symbolic scripts and the written derivation. |
| Interested non-specialists | An example of how a method that "always works in practice" can still lack a guarantee, and of how small the gap can be. | Candidate status: this is not established consensus. |

## Why the problem matters

Convergence guarantees decide which step sizes practitioners can trust without tuning. A proof that kernel PnP is always stable would have licensed any admissible step. This counterexample shows that no such guarantee exists. It also identifies what a correct guarantee must depend on: the denoiser's mixing gap, or the denoiser's symmetry. Because the effect is so small, the paper is also a reminder that "no guarantee" and "fails in practice" are different statements.

## How to inspect or reproduce the recorded checks

Download the archive from the DOI or check out tag `v1.0.0-candidate`. Then:

```text
sha256sum -c SHA256SUMS
python3 -I -B check_certificates.py        # standard library; prints the Appendix C hashes
python3 -I -B negative_controls.py         # 8 corruptions must be rejected
pip install sympy==1.13.3 && python3 -I -B replay_all.py   # every verifier, about 40 s
```

The expected outputs are in `certificate_check_output.txt` and `verification_output.txt`, and the recorded runs are in `REPLAY_RECEIPT.md`.

## The most valuable next projects

1. **Independent recheck.** Recheck Appendix C in independent software or a proof assistant.
2. **Large steps.** Find whether any irreducible unit-diagonal Gaussian kernel on four points is unstable at a step in $(t^*,2)$.
3. **Patch geometry.** Try to realise the near-disconnected, unequal-weight geometry with natural-image patches and a search window, and measure the worst growth at a given mixing gap.
4. **Constant-preserving assumption.** Decide whether the dimension-three stability survives the weaker condition $Be\le\rho(B)e$, which arises in super-resolution.

## What is in the evidence package

The GitHub release and the Zenodo record hold:
- the 28-page PDF;
- the full archive: the Markdown source of the manuscript, standard-library exact verifiers, the sympy certificate scripts, the Appendix C coefficient files and checker, the replay driver, negative controls, CI, SHA-256 sums and the pre-revision audit notes;
- the machine-readable records `CLAIMS.json`, `AI_INDEX.md`, `ASSURANCE.md`, `RESEARCH_GATES.json` and `REVIEW_SUMMARY.md`.
