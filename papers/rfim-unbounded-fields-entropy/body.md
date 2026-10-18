## Summary

Imagine a network of tiny magnets. Neighbouring magnets prefer to agree, while each magnet also feels its own local pull. Those local pulls can point in different directions and can be arbitrarily strong. How long does a random sequence of single-magnet updates need to forget its starting configuration?

This candidate proves an entropy-decay bound for the random-field Ising model without putting an upper limit or a tail condition on the local fields. It still requires a precise strong-disorder assumption: small field magnitudes must be sufficiently rare and the magnitudes must be independent. The main theorem uses identical magnitude distributions; a corollary allows different distributions under a common bound on small-field probabilities. The signs may be arbitrary.

The key move is to adapt the proof to the preferred local signs. Edges connecting strongly opposed preferences are not wished away: they remain as interacting pieces that must be controlled separately. The result is about continuous-time dynamics. It does **not** establish the stronger one-step entropy-contraction statement or approximate tensorisation of entropy.

## Summary for specialists

For a finite simple graph with $n\ge2$ vertices and maximum degree at most $\Delta\ge3$, consider

$$
\mu(\sigma)\propto\exp\!\left(\beta\sum_{uv\in E}\sigma_u\sigma_v+\sum_u h_u\sigma_u\right).
$$

Here $\beta>0$ and the finite real field magnitudes satisfy Han's anti-concentration assumptions. The heat-bath kernel $P$ selects one vertex uniformly; the continuous-time generator is $P-I$, so time is measured at **one total attempted update per unit time**, not one update per vertex.

The manuscript defines

$$
\rho_0=\inf_{f>0,\ \operatorname{Ent}_\mu f>0}
\frac{\mathcal E^\mu(f,\log f)}{\operatorname{Ent}_\mu f}.
$$

With field probability at least $1-\Delta c_0/(2n)$, it obtains

$$
\rho_0\ge\frac{1}{2n(1+4\Delta e^{4\beta L})},
$$

and hence a field-strength-independent polynomial lower bound with exponent $1+c$. All constants are explicit in the paper. In particular,

$$
\begin{aligned}
c&=\frac{8\beta\Delta(K_*+1)}{\alpha^*},\\
K_*&=(1+4\Delta e^{4\beta\Delta})^2.
\end{aligned}
$$

For fixed $\beta,\Delta$, the exponent correction tends to zero as the anti-concentration parameter $p_0$ tends to zero. This compares increasingly strong-disorder regimes; it is not an assertion that the exponent improves with graph size for a fixed field law. The displayed definition uses twice Bobkov–Tetali's original normalisation.

The revised proof also removes field-magnitude dependence from the initial-state mixing estimate. A site-covering warm-up, using Wang's last-update argument, gives

$$
\begin{aligned}
t_{\rm mix}(\epsilon)&\le n\log\frac{2n}{\epsilon}\\
&\quad+\rho_0^{-1}\log\frac{2(1+6\beta|E|)}{\epsilon^2}.
\end{aligned}
$$

Thus, on the same field event and for fixed parameters, the continuous-time bound is $O(n^{1+c}\log(n/\epsilon))$ without an additional field-tail assumption. The warm-up is a known mechanism applied here, not a new general mixing principle.

## Technical account

The proof follows an existing localisation architecture, but changes which edge events are revealed. For an edge with a strong endpoint, the chosen common-spin event agrees with that endpoint's preferred sign. Compatible event probabilities therefore stay bounded below independently of the magnitude of the field.

An edge between two strong endpoints of opposite preferred signs cannot use this construction. Such edges remain untilted. At the terminal point, the measure therefore contains interacting components, rather than becoming a product of independent spins. Rewriting these pieces in terms of minority spins gives a repulsive model with small creation odds. Entropic curvature and coupling concentration control those pieces uniformly.

A subcritical disagreement-percolation argument controls correlations along the localisation. Spectral-to-entropic estimates then bound the entropy lost along the process. Finally, a known concavity comparison for heat-bath Dirichlet forms transfers the terminal inequalities through the localisation mixture. The new contribution is the sign-adapted RFIM construction and its residual-component analysis, not a new general mixture inequality.

For mixing from an arbitrary starting configuration, first wait until every site has probably been updated. Comparing each site's last update with the independent-field reference measure bounds the remaining entropy using only the interaction strengths, not the local fields. Entropy decay then controls the rest of the journey to equilibrium.

## Evidence, assurance and limitations

The unrestricted claim rests on a written mathematical proof. The package's finite numerical checks test identities, parameter calculations and small terminal models; they do not establish the theorem for all graphs or fields. Producer replay and supplied analytical review remain internal evidence, not external human peer review or proof-assistant verification.

The bound is qualitative and can have very large constants and exponents. It is not a claim of a competitive practical sampler, a sharp mixing time, or an improvement over every existing bound in every regime. The high-probability conclusion concerns the random field realisation; it does not remove the anti-concentration assumption.

The distinction between continuous-time entropy decay and a one-step discrete-time contraction is essential. The latter and approximate tensorisation remain unproved here.

## Relationship to earlier work

Han supplies the random-field problem, the anti-concentration hypothesis, and the localisation/percolation architecture. The present result is an unbounded-field **Dirichlet-form analogue**, not a complete proof of Han's stronger one-step statement. Chen–Ju–Miao–Yin–Zhang and Chen–Eldan supply the localisation machinery; Erbar–Henderson–Menz–Tetali supply the curvature criterion. The terminal calculation adapts existing low-fugacity methods. Niles-Weed gives an earlier statement of the mixture comparison used in the final transfer.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probability and mathematical-physics researchers | A way to handle strong local biases without a field cutoff | Strong disorder and bounded graph degree remain essential hypotheses |
| Researchers in functional inequalities | Sign-compatible localisation with a controlled non-product endpoint | The result concerns the explicitly defined Dirichlet-form constant |
| Sampling theorists | A field-uniform theoretical route to convergence | Large constants do not promise practical acceleration |

## Why the problem matters

A bounded-field assumption rules out standard distributions such as Gaussian fields. Removing that assumption asks whether large local biases are genuinely an obstacle to convergence or instead an obstacle to a particular proof. This construction separates those issues: strong preferences can help control spins, provided the proof respects their signs and accounts for the edges where preferences conflict.

## How to inspect or reproduce the recorded checks

Read the theorem's assumptions and clock convention first, then follow the localisation, terminal-model and mixture-transfer lemmas. The reproduction guide in the final package identifies the numerical commands, dependencies and their limited scope. Compare the supplied output with a fresh run rather than treating a receipt or a passing script as a proof of the unrestricted theorem.

## The most valuable next projects

The principal unresolved target is the corresponding one-step entropy contraction or approximate tensorisation statement. A second useful direction is to reduce the very loose constants enough to distinguish meaningful parameter regimes. The terminal low-fugacity argument may also be reusable outside this particular localisation, provided its hypotheses are checked rather than inferred from the RFIM application.

## What is in the evidence package

The package contains the self-contained manuscript and source, explicit claim and source maps, replayable supporting checks, and an account of substantive corrections and remaining limitations.
