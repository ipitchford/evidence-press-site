## Summary

Picture a species spread over a patchy landscape: larvae in a reef system, seeds on a hillside, or animals in a set of connected habitats. Each individual stays put for a while, then leaves at some rate and lands anywhere in the landscape with equal chance. Good patches support many individuals and poor patches few. A long-standing question in spatial ecology asks how the **total** population at equilibrium depends on that movement rate.

In 2021 Xueli Bai and Fang Li studied exactly this "well-mixed pool" model. They proved that the total population has a single peak as the movement rate varies, provided habitat quality varies by less than a factor of about 1.6. They then asked in print whether the total could ever have more than one peak.

This release answers yes, and more:

- **Any number of peaks.** For every number N there are habitats whose total population has at least N separate peaks as the movement rate changes. The habitats can be smooth, can improve steadily from one end to the other, and can be arbitrarily close to uniform when quality is averaged over area.
- **The mechanism is simple.** A tiny patch of very rich habitat barely changes average quality. But it adds a small bump to the total population at a movement rate comparable to its richness. Patches of very different richness add bumps at very different rates, so each one makes its own peak.
- **Three quality levels are the minimum.** A habitat with only two quality levels always has exactly one peak. An exact three-level example has two.

**The peaks are real but tiny.** In the exact three-level example the first peak rises only about 0.08% above the dip that follows it. In a second example, where the best habitat is only about 14.2 times better than the worst, the left peak sits within 0.0001 of the dip and is about 10⁻³² high. It disappears if the numbers are nudged slightly. The result is **qualitative**. It shows that several peaks are mathematically possible, and that a few observations at different connectivity levels cannot safely be extrapolated. It does not show that such peaks would be visible in a field census.

## Summary for specialists

Let $\theta=\theta_{m,d}$ be the positive solution of $d(M-\theta)+\theta(m-\theta)=0$ on $(0,1)$ with $M=\int_0^1\theta$. This is the uniform nonlocal dispersal model (1.11) of Bai and Li, and $M_m(d)$ is the total population.

- **Theorem 1.** For every $a>0$ and $N\ge1$ there are $m_j\in C^\infty([0,1])$ with $m_j>0$, $m_j'>0$ and $\int m_j=a$, such that $d\mapsto M_{m_j}(d)$ has at least $N$ distinct strict local maxima. Moreover $m_j\to a$ in every $L^p$, $1\le p<\infty$, but not uniformly. The rich patches shrink in area, not in height, and the contrast exceeds $2^{N-1}$.
- **Theorem 2.** The increasing step function with values $\tfrac1{20},\tfrac{25}{12},\tfrac{329}{10}$ on measures $\tfrac{2405}{3504},\tfrac5{16},\tfrac1{876}$ satisfies $M(3)=1$, $M'(3)=0$ and $M''(3)=\tfrac{6042635}{1975192401}>0$. It therefore has at least two strict local maxima, and so does every rearrangement. Smooth strictly increasing resources that are $L^1$-close to it, with values in a fixed compact range, keep a nondegenerate minimum near $d=3$ and two strict maxima. The exact identities are not claimed for them.
- **Theorem 3.** A two-level resource $a<b$ has $\operatorname{sgn}M'(d)=\operatorname{sgn}(a+b-2d)$, so it has a single maximum at $d=(a+b)/2$.
- **Proposition 4.** A three-level resource with contrast $14173319160000/999994960001\approx14.1734$ has two strict local maxima. This is certified exactly and by two interval traps. The optimal three-level contrast therefore lies in $[1.618,\,14.1734]$.

## Technical account

Uniform mixing reduces the problem to one scalar closure: $M=\mathbb E\,\Phi(m,d,M)$, where $\Phi$ is the positive root of the local quadratic. The curve depends only on the distribution of resource values, so any arrangement gives the same curve. Implicit differentiation gives $M'=\mathbb E[(M-\theta)/A]/D$ and a formula for $M''$, where $A=\theta+dM/\theta$ and $D=\mathbb E[\theta^2/A]/M>0$. A pairwise identity shows that two resource values push the population up exactly when $d$ is below their average. This proves Theorem 3.

For Theorem 1, take a background $a$ and give rare atoms of size $r_i$ the weights $\varepsilon r_i^{-2}$. To first order in $\varepsilon$, the population excess over the mean resource is $\varepsilon\sum_i r_i^{-2}g_{r_i}(d)$, with an explicit algebraic kernel $g_r$. The rescaled kernel $r^{-2}g_r$ peaks near $d\approx r/2$ and vanishes at fixed $d$ and at $d=r$. Widely separated levels therefore give separated humps. Each hump defines a *trap*: a population value that is larger in the middle than at both ends. A uniform first-variation estimate carries the traps to the nonlinear curve. Analyticity then turns each trap into a strict local maximum. $L^1$ continuity carries them through mollification, and scaling fixes the total resource. The classical ingredients are the scalar reduction, the implicit function theorem and resource concentration (credited to Bai, Li and Zhou). The new ingredients are the separated-kernel construction and its transfer to the nonlinear curve.

The exact examples are built backwards. First fix $d$, $M=1$ and the equilibrium densities. Then the resource values follow, and the habitat fractions solve a $3\times3$ linear system. For Proposition 4 the curvature at the minimum is only about $1.08\times10^{-21}$, so the paper also certifies the traps $(d_0-10^{-4},\,d_0-10^{-5},\,d_0)$ and $(d_0,\,d_0+10^{-2},\,3.1)$ directly, with rigorous rational square-root enclosures.

## Evidence, assurance and limitations

- **Proofs:** every theorem has a written proof. The load-bearing identities of Theorem 2 and Proposition 4 are certified in exact rational arithmetic by two independently written standard-library scripts. The traps of Proposition 4 are certified by a third. An internal proof audit reproduced them independently in 120-digit interval arithmetic.
- **Replay:** all scripts were rerun from a clean copy of the frozen archive, and the exact receipts matched byte for byte. GitHub CI repeats the replay on Linux. Twenty semantic negative controls must reject perturbed witnesses, reversed trap claims and tampered receipts, and they do.
- **Review:** internal AI-assisted review only. A five-role first round and an outside-model correctness audit were followed by a verification re-review, a targeted proof audit and a second outside-model audit. The final editor fixes were made without another review round. There has been no external peer review, no independent reproduction and no formal verification.
- **Effect size:** the peaks are very shallow. The 14.17 example is quantitatively fragile, although its existence is rigorous.
- **Priority caveat:** two close sources were read only as abstracts. Liang and Zhang (2021) study the equal-patch "identical migration" model, which contains our rational examples. Bai, Li and Shi (2024) survey the area and announce a new monotonicity result. Neither abstract reports multiple maxima, but their full texts were not available. Priority is claimed only within the recorded search.
- **Numerical evidence only:** the plotted curves, the marked maxima and the threshold search. The search is platform-sensitive.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Analysts of nonlocal dispersal and metapopulation models | A complete answer to Bai and Li's question, with a reusable rare-patch mechanism and exact certificates | Uniform mixing only; other kernels and patch graphs are open |
| Theoretical ecologists | A rigorous warning that the total abundance–connectivity curve need not be single-peaked | The peaks are tiny; this is not evidence about real populations |
| Conservation and fisheries modellers | A reason not to extrapolate abundance from one or two connectivity levels | Qualitative only; the model omits dispersal mortality, Allee effects and temporal variability |
| Research agents | Machine-readable claims, exact rational witnesses and replayable certificates | The certificates support specific identities, not the general theorem |

## Why the problem matters

Whether more movement helps or hurts total abundance is a basic question for connectivity management: corridors, barriers, habitat fragmentation and larval exchange. Single-peaked curves allow simple rules, such as "move towards the best rate". This paper shows that even in the cleanest well-mixed model, such rules can fail once the habitat contains rare, very productive patches. Total stock size alone cannot then identify the dispersal rate.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with `uv` installed:

```sh
shasum -a 256 -c SHA256SUMS
for s in audit_meanfield contrast_witness interval_traps resource_fingerprints; do
  uv run python3 -I $s.py --out output        # exact certificates; do not use -O
done
uv run python3 -I negative_controls.py         # 20 controls; corruptions must be rejected
uv run --no-project --with numpy==2.4.6 --with scipy==1.17.1 --with matplotlib==3.11.2 \
  python3 -I plot_population.py --out output
```

To check Theorem 2 by hand, take $d=3$ and densities $\theta=(4/5,4/3,30)$. Then $m_i=\theta_i+3-3/\theta_i$ gives $1/20$, $25/12$ and $329/10$, and $\sum p_i\theta_i=1$. `AI_INDEX.md` maps every result to its evidence.

## The most valuable next projects

1. Read the full texts of Liang and Zhang (2021) and Bai, Li and Shi (2024), and settle priority.
2. Determine the optimal three-level contrast. It lies between 1.618 and 14.1734, and the numerical evidence points to about 14.17.
3. Decide whether $N$ peaks force a contrast that grows with $N$, extending Bai and Li's bound beyond $N=1$.
4. Find peaks of non-negligible relative depth, say 5%, under bounded contrast, or prove that they cannot occur.
5. Test the rare-patch mechanism for convolution kernels close to uniform mixing, for non-complete patch graphs and with dispersal mortality.

## What is in the evidence package

The package contains:
- the 16-page manuscript (PDF and LaTeX) and its two figures;
- four exact standard-library certificates with their JSON receipts;
- the plotting and threshold-search scripts, with pinned dependencies (PEP 723 headers and `requirements.txt`);
- the semantic negative controls and the CI workflow;
- the revision response, the final editor fixes and a rating-free review summary;
- the dated novelty audit and frozen target;
- the claim, status, assurance, provenance and research-gate records, and the citation audit;
- an agent index, licences (CC0-1.0 for text and data, MIT for code) and SHA-256 manifests.

The owner-supplied third-party papers used for checking are cited, not included.
