## Summary

A restricted Boltzmann machine has two layers of binary variables. Its standard alternating sampler redraws one whole layer from the other, then redraws the second layer. How many such sweeps are needed before the distribution has largely forgotten its starting point?

This candidate gives a uniform logarithmic bound when **both interactions and biases are nonnegative**. It allows unequal layers, arbitrary graph degrees and heterogeneous interactions that can be as small or as large as desired, provided each parameter is finite. For a million vertices, the displayed bound guarantees total-variation distance at most $0.01$ after 30 complete sweeps. That is a mathematical upper bound, not a measured runtime: a sweep updates every vertex and evaluates its conditional probability.

The result removes the positive minimum interaction in a question posed by Feng, Guo and Yang, and strengthens the rate from polylogarithmic to logarithmic. The proof's key step uses the fresh randomness of the previously updated layer, rather than demanding a small worst-case influence from every deterministic configuration.

An added disjoint-edge example proves that logarithmic dependence on system size is necessary in this model class. It also has an exact distance formula and a narrowly scoped cutoff statement. Neither establishes that the universal contraction constant is optimal, or that every model in the class has cutoff. The manuscript remains an unrefereed candidate with internal checks.

*Banner:* the two layers show the update order within one sweep. The plotted curve is the theorem's worst-start upper bound for one million vertices, not simulation data; its vertical scale is logarithmic. At 30 sweeps it is approximately $0.00932$. The small layer diagram is schematic, not the million-vertex instance.

## Summary for specialists

For a finite bipartite graph $G=(L\mathbin{\dot\cup}R,E)$ with $n\ge2$ vertices, consider the law on $\{0,1\}^{L\cup R}$

$$
\mu(x)\propto\exp\left\{\sum_{\{u,v\}\in E}J_{uv}x_ux_v+\sum_v\theta_vx_v\right\},
$$

with every $J_{uv}\ge0$ and every $\theta_v\ge0$ finite. Each unordered edge is counted once. A complete sweep of $P$ updates all of $L$ by exact conditional heat-bath draws, then all of $R$. Conditional independence within each layer is part of this update rule.

The main theorem gives, for every starting configuration and integer $k\ge1$,

$$
d_{\mathrm{TV}}(P^k(x,\cdot),\mu)\le
\min\left\{1,\frac n2\left(\frac2e\right)^{2k-2}\right\}.
$$

Consequently, for $0<\varepsilon\le1/2$, a sufficient number of complete sweeps is

$$
k=\left\lceil1+\frac{\log(n/(2\varepsilon))}{2\log(e/2)}\right\rceil.
$$

The constant is independent of degrees, interaction sizes, biases and graph structure. Empty parts, isolated vertices and zero interactions are included. Swapping the labels of the two layers gives the other fixed scan order. This is a bound on the **full joint distribution**, not merely a layer marginal.

The binary convention matters. Writing $x_v=(1+s_v)/2$ gives Ising couplings $K_{uv}=J_{uv}/4$ and fields

$$
h_v=\theta_v/2+\sum_{u\sim v}K_{uv}\ge\sum_{u\sim v}K_{uv}.
$$

Thus this is not a theorem for every ferromagnetic Ising model with merely nonnegative external fields. Nor does it cover arbitrary signed RBMs, approximate conditional updates or arbitrary scans on non-bipartite graphs.

## Technical account

### Average the influence at the right moment

The conditional probability of a one is the logistic function $\sigma(s)=1/(1+e^{-s})$ evaluated at a nonnegative field. It is at least one half. Couple an all-zero-start and an all-one-start chain using the same uniform random numbers; nonnegative interactions preserve their order.

For nonnegative incident weights $w_i$, the proof bounds the sum of logistic increments averaged over independent fair bits $B_j$:

$$
\sum_i\mathbb E\left[
\sigma\left(\sum_{j\ne i}w_jB_j+w_i\right)
-\sigma\left(\sum_{j\ne i}w_jB_j\right)\right]\le\frac2e<1.
$$

The estimate comes from logistic saturation and an elementary product inequality. Its application to the chain needs more care. Condition on the history **before** a layer receives its fresh random numbers. Each discrepancy then depends on its own uniform, while the fair-bit baseline in the corresponding increment uses only the other coordinates. Those quantities are conditionally independent. The proof neither assumes unconditional independence of discrepancies nor makes a discrepancy independent of its own fair bit.

This yields a deterministic row-sum bound of $2/e$ for the recurrence of marginal disagreement probabilities. After the first half-step, each successive layer update contracts the largest such probability. A union bound and the extremal sandwich coupling give the full-distribution estimate. Reversibility of a complete sweep is not needed: each block update already preserves the target law.

### What can and cannot be sharpened

The argument can retain the smaller prefactor $(|L|+(2/e)|R|)/2$. With $d$ positive incident weights, a finite-degree estimate improves the sufficient influence bound to $2(d/(d+1))^{d+1}$. For degrees one and two, direct calculation gives a supremum of one half. These refinements do not establish a sharper degree-independent universal constant: optimality of $2/e$ is not claimed.

### A model-class sharpness witness

Take $m$ disjoint edges, each with interaction $\log3$ and zero biases. Then $n=2m$. The revised paper reduces worst-start full-joint distance after $k\ge1$ sweeps exactly to

$$
\begin{aligned}
d_m(k)=d_{\mathrm{TV}}\bigl(&\operatorname{Bin}(m,\tfrac23-\tfrac83\,16^{-k}),\\
&\operatorname{Bin}(m,\tfrac23)\bigr).
\end{aligned}
$$

The last right-layer update has the stationary conditional law given the left layer. This is why the full-joint distance equals the left-marginal distance; a calculation using only the right count would miss the correct displacement factor.

For each fixed accuracy, the example's mixing time is $\log m/\log256+O_\varepsilon(1)$, with a bounded sweep window. It exhibits cutoff: a sharp transition from far from stationarity to close to it as the number of independent edges grows. The stated Gaussian profile is qualified by integer-time subsequences, avoiding a false continuous profile caused by rounding the sweep number.

This is an elementary application of established product-measure reasoning, not new general cutoff machinery. It proves logarithmic-order necessity, not an optimal leading constant for the universal theorem. The paper also gives a one-edge negative-bias obstruction showing why the sign restriction cannot simply be dropped while retaining a parameter-uniform conclusion.

## Evidence, assurance and limitations

The universal theorem rests on the analytic proof. The supplied reviewer audit checks 29,584 scalar parameter pairs, 480 aggregate-influence weight vectors, 600 conditional-recurrence cases, and 400 finite RBM kernels on two to eight vertices. It checks 4,800 model/sweep combinations; 4,000 of their displayed bounds are below one rather than the trivial cap. These are floating-point diagnostics at recorded tolerances, not exact-arithmetic certificates. Extreme logistic values may saturate numerically.

The additional exact product calculation and finite extension checks have a separate scope from those numerical tests. The public package includes a new standard-library exact verifier and its scoped receipt. The supplied floating-point audit remains private because its redistribution licence was not established; the counts above report producer-side execution, not a publicly replayable certificate. Internal model reviews and separately written code within a coordinated workflow do not constitute unaffiliated reproduction, external specialist peer review or formal verification.

The theorem concerns sampling a specified mathematical model. It does not establish faster training, better predictions or lower elapsed computing time for learned RBMs. The cutoff example does not generalise automatically to arbitrary heterogeneous matrices. No global priority certification is claimed.

## Relationship to earlier work

[Feng, Guo and Yang](https://arxiv.org/abs/2604.00963v2) prove polylogarithmic alternating-scan mixing with a fixed positive minimum on nonzero interactions, then ask about removing that assumption. This is the specific question addressed here; their wider results are not superseded.

[Tosh's 2016 work](https://proceedings.mlr.press/v48/tosh16.html) supplies an established alternating-kernel coupling framework and an RBM logarithmic bound under a norm restriction. [Kwon, Qin, Wang and Wei](https://arxiv.org/abs/2410.08423v1) obtain logarithmic mixing for a homogeneous model and use positive-state logistic saturation in Appendix A, Lemma 21 of the linked preprint. They are not restricted to weak positive interactions. The candidate adds a uniform heterogeneous estimate through averaged influence and fresh-history conditioning, while retaining those precedents.

The disjoint-edge analysis uses standard product-distance and likelihood-ratio ideas; [Chen and Kumagai's product-chain work](https://doi.org/10.1016/j.spa.2018.01.002) provides related context. Update clocks differ across that literature, so its constants must not be substituted for this manuscript's full sweeps.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Sampling theorists | A parameter-uniform logarithmic theorem for heterogeneous nonnegative RBMs | Check the binary convention, both sign restrictions and the conditional-independence argument |
| Researchers using alternating Gibbs samplers | An explicit sufficient sweep count and a distinction between average and worst-configuration influence | A sweep is not constant-cost serial work; exact block sampling is assumed |
| Researchers in mixing and cutoff | A transparent disjoint-edge sharpness example with exact full-joint reduction | It is a standard-product application, not cutoff for the whole RBM class |

## Why the problem matters

A bound whose constants deteriorate with the smallest interaction may say little about a growing family of models with very weak edges. A small-norm criterion can also exclude large positive interactions. Removing both obstacles in this sign-restricted class gives a single sweep guarantee that can be evaluated without inspecting the interaction scale. The mathematical contribution is that uniformity—not a blanket assertion that Boltzmann-machine sampling is easy.

## How to inspect or reproduce the recorded checks

Start with the model and sweep convention, then the aggregate-influence lemma. In the coupling proof, check precisely when the history is conditioned on and why the same-coordinate fair bit is excluded. Trace the different exponents for the two layers before the final union bound. For the sharpness example, verify the one-edge transition, the left-marginal reduction and the integer-time qualification separately.

The public verifier checks exact finite product identities and five semantic negative controls. Compare its reported scope with the receipt; the separately reported private numerical audit is not shipped. Rerunning the public code reproduces its bounded tests, not the universal proof.

## The most valuable next projects

The first priority is specialist scrutiny of the exact uniform theorem and its relationship to more general averaged-coupling results. A separate analytic question is the best possible universal logistic-influence constant. Practical studies could compare conservative sweep counts with measured cost on declared model families, without treating that experiment as proof of the theorem. Extensions to negative biases or interactions require new hypotheses; the paper's obstruction rules out simply removing the bias restriction.

## What is in the evidence package

The manuscript states and proves the general bound and the disjoint-edge refinement. Claim records, prior-art comparisons and the review response preserve the scope and attribution. Verification code, environment details and replay receipts identify the finite checks. An agent-readable index provides entry points for further inspection. The release's resource panel links the exact-version paper, repository and archived package.
