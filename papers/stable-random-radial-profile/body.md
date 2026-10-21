## Summary

**The question.** Random polynomials have random roots. The question here is whether that randomness disappears when we look at the overall pattern of distances from the origin. For the heavy-tailed coefficients studied in this release, it does not—even when the degree becomes arbitrarily large.

**What was found.** The candidate describes the roots on a fine scale close to the unit circle, measuring distance as $x=n\log|z|$. Their limiting radial distribution has a smooth density, but that density remains random. Smoothness describes the shape of each limiting profile; it does not say that different realizations share the same shape. Each fixed-threshold root fraction can take any value between 0 and 1, and the root-count variance grows like the square of the degree.

**The two extremes.** Two endpoint results clarify the contrast. After taking the degree limit, letting the tail index approach zero makes every fixed-threshold root fraction approach the same uniform random number. Letting the index approach two instead produces the deterministic Gaussian profile. Neither statement is a theorem about degree and tail index varying together.

**Who cares.** Researchers on random polynomials, probability and random analytic functions, for whom the expected root profile was already known but the distribution around it was not.

**Status.** An anonymous, unrefereed written-proof candidate. No formal verification, independent human peer review or exhaustive priority determination is claimed.

## Summary for specialists

Let $P_n(z)=\sum_{k=0}^n R_ke^{i\Theta_k}z^k$, with independent uniform phases, positive i.i.d. moduli, and $\Pr(R>t)=t^{-\alpha}L(t)$ for $0<\alpha<2$. The random probability measures

$$
\mu_n=\frac1n\sum_{P_n(z)=0}\delta_{n\log|z|}
$$

converge in distribution to $\mu_\alpha=D^2\Psi_\alpha$, where

$$
\Psi_\alpha(x)=\mathbb E_\vartheta\log\left|\sum_{j\ge1}\Gamma_j^{-1/\alpha}e^{xU_j+i\vartheta_j}\right|.
$$

The Poisson arrivals and uniform exponent marks remain random; only the phases are averaged out. Almost surely $\mu_\alpha$ has a nonnegative smooth density. At each fixed $x$, the law of $Q_\alpha(x)=\mu_\alpha(({-\infty},x])$ has support $[0,1]$. Its mean is the classical profile

$$
\Phi_\alpha(x)=\frac{e^{\alpha x}}{e^{\alpha x}-1}-\frac1{\alpha x},\qquad \Phi_\alpha(0)=\frac12.
$$

Writing $v_\alpha(x)=\operatorname{Var}(Q_\alpha(x))$, the root-count variance is $n^2v_\alpha(x)+o(n^2)$ with $v_\alpha(x)>0$. The candidate supplies no closed formula for that variance at a fixed interior index.

## Technical account

The proof retains the largest coefficients, controls the omitted terms through their square energy, and averages the retained integer exponent locations over the angular variable. A one-phase estimate controls the singular logarithm without a constant that grows with the number of coefficients. Convexity then transfers locally uniform potential convergence to convergence of the radial measures.

Smoothness requires a separate argument. An arbitrarily large finite block of independent circle-valued summands has sufficient Fourier decay to smooth the logarithmic potential to any prescribed finite order. The independent remainder has compatible smooth versions with controlled moments. This proves samplewise smoothness, not just absence of atoms at individually prescribed thresholds. A smooth density can still vanish on intervals.

For the low-index endpoint, a single extreme coefficient dominates. Under a common Poisson coupling, $Q_\alpha$ approaches $U_1$ locally uniformly almost surely as $\alpha\downarrow0$. The measures lose all mass on finite intervals; on $[-\infty,+\infty]$ the limit is $U_1\delta_{-\infty}+(1-U_1)\delta_{+\infty}$. It is not a probability-measure limit on the real line. The variance tends to $1/12$.

As $\alpha\uparrow2$, normalized extreme energies become diffuse. A conditional Gaussian limit, supplemented by explicit logarithmic uniform-integrability bounds, gives $Q_\alpha\to\Phi_2$ locally uniformly in probability and variance tending to zero.

The banner plots the exact mean profiles for indices one and two; it does not plot simulated random realizations. Its uniform distribution represents the low-index limiting fraction, not a uniform distribution of root locations.

## Evidence, assurance and limitations

This is an **unrefereed written-proof candidate**. The package contains an itemised response to the supplied review, targeted internal audits of the added propositions, source comparisons and diagnostic checks. These checks are not formal verification, external specialist review or unaffiliated reproduction. A finite numerical diagnostic cannot establish an infinite-dimensional convergence theorem.

The model requires independent uniform complex phases and positive regularly varying moduli. The release does not establish the analogous statement for real coefficients, dependent phases or coefficients with an atom at zero. It gives no joint degree/index limit, no rate at the Gaussian endpoint, and no closed random-density or interior-variance formula. The bounded literature search does not prove exhaustive novelty or priority.

## Relationship to earlier work

Ibragimov and Zeitouni obtained the corresponding stable expected-count profile. Feldheim's stationary Gaussian analytic functions provide a structural precedent for random limiting zero measures. Stable analytic limits, conditional phase averaging and Poisson–Dirichlet endpoint mechanisms are established tools, not claimed inventions here.

The proposed contribution is the full microscopic random-measure limit in this isotropic modulus-tail regime, together with samplewise smoothness and the two radial endpoint passages. The direct truncation proof controls the growing angular averaging window; a fixed-compact analytic-function limit alone does not perform that interchange. Heavy tails of the logarithms of coefficient moduli belong to a different regime.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Random-polynomial researchers | A distribution-level description beyond expected root counts | Restricted isotropic complex model; written-proof candidate |
| Probability researchers | A smooth random measure connecting extreme coefficients to stable phase averages | Smoothness does not imply determinism or strict positivity |
| Researchers studying random analytic functions | A direct route from coefficient extremes to averaged zero measures | Endpoint limits are iterated; no joint scaling theorem |

## Why the problem matters

An average profile can hide randomness that survives at macroscopic count scale. Here the expected fraction is explicit, yet the fraction itself remains nondegenerate and the count variance is of order $n^2$. The smoothness result makes the distinction sharper: persistent randomness is not merely a collection of isolated spikes. These are theoretical consequences, not demonstrated engineering or empirical benefits.

## How to inspect or reproduce the recorded checks

Start with the manuscript's main theorem and its hypotheses, then follow the potential-convergence argument. Audit the smoothness proposition and the two endpoint theorems separately: each closes a different obligation. The repository's `AI_INDEX.md` maps claims to proof sections, review records, source checks and replay entry points. Use the supplied environment and verification instructions for diagnostics, preserving their stated scope. With Python 3.13 and the standard library only:

```sh
python code/verify_math.py
python -O code/verify_math.py
python code/check_manifest.py
```

These test finite identities and negative controls, not the unrestricted analytic theorem; the manifest checker requires the final `MANIFEST.json` produced at packaging.

## The most valuable next projects

Find an effective description or computable bounds for $v_\alpha(x)$ at interior indices. Determine which non-isotropic phase laws retain the random-measure limit. A genuinely joint degree/index transition would also require new uniform estimates; it cannot be inferred from the iterated limits already proved.

## What is in the evidence package

The package contains the editable manuscript and PDF, frozen claims, bibliography and prior-art record, an itemised review response, internal extension audits, diagnostic checks, environment information and an agent-facing index. Historical research and review records remain distinguishable from the revised candidate. Audio and cover art explain the result but provide no additional mathematical evidence.
