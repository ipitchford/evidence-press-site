## Summary

**In one sentence.** Among all shapes, the regular simplex makes the ratio of two negative-exponent Riesz capacities as large as possible exactly when the smaller exponent is at least 2; below 2, splitting one of its corners does better.

**The quantity.** Pick two points of a set at random, independently and from the same distribution, and measure the distance between them. If you may choose the distribution, how large can you make the average of the distance raised to a power $r$? Call that largest average $M_r(K)$ for the set $K$, and put $C_r=M_r^{1/r}$ so that the answer is again a length. Three cases give a feel for it. For $r=1$, $M_1$ is the largest possible mean distance. For $r=2$, $M_2$ is twice the largest variance a distribution on $K$ can have, and it is fixed by the smallest ball containing $K$. As $r$ grows, $C_r$ approaches the diameter. For sets in ordinary space, $C_r$ is known as the Riesz capacity with the negative exponent $-r$.

**The question.** Each $C_r$ is a length, so the ratio of two of them, at exponents $s<t$, ignores size and measures only shape. In 2024 Clark and Laugesen asked which shapes make such ratios as large as possible, and conjectured two answers: two points make $C_t/C_s$ largest, and for $2\le s<t$ the corners of a regular simplex (an equilateral triangle in the plane, a regular tetrahedron in space) make $C_s/C_t$ largest.

**What is proved.** Both conjectures hold. With $\gamma=1/s-1/t$, on every compact metric space

$$\frac{C_t}{C_s}\le 2^{\gamma},$$

and for compact sets in $\mathbb R^n$ when $2\le s<t$

$$\frac{C_s}{C_t}\le\Big(\frac{n}{n+1}\Big)^{\gamma}.$$

Neither is entirely new. The short argument for the first was already posted publicly in a GitHub issue on 27 October 2026, six days before the first version of this paper, and much of the second follows from a 2022 theorem of Davies, Lim and McCann on attractive–repulsive particle energies. The paper makes that overlap exact and finds a wedge of exponents near $s=2$, in dimension three and higher, where only its own argument applies.

**What is new.** The threshold $s\ge2$ in the second conjecture is exactly right. For every $s<2$, in every dimension $n\ge2$, splitting one corner of the regular simplex into two nearby points increases $C_s/C_t$. So the regular simplex is optimal if and only if $s\ge2$. The paper also finds the sharp lower bound for $M_s$ when $0<s<1$ in terms of how far the set is from a pair of points, and proves that nearly extremal sets are close to two points or to a simplex, with the best possible rates. At $s=2$ the simplex bound is a finite-exponent form of Jung's classical theorem on the smallest ball containing a set.

**How sure we are.** Every result has a written proof. Three scripts check the formulas and inequalities exactly or to high precision on many examples; they are sanity checks, not proofs.

## Summary for specialists

$(K,d)$ compact metric, diameter $D$; $E_r(\mu)=\iint d^r\,d\mu\,d\mu$, $M_r=\max_\mu E_r$, $C_r=M_r^{1/r}$ ($=\mathrm{Cap}_{-r}$ for Euclidean $K$ in the Clark–Laugesen convention); $0<s<t$, $\gamma=1/s-1/t$, $c_n=n/(n+1)$.

- **Two-point bound:** $C_t/C_s\le2^\gamma$, equality iff $M_s=D^s/2$ (Theorem 1) *(proof; argument previously public)*
- **Off-diagonal interpolation:** for a $k$-atom $s$-maximiser with weights $w$, $C_s/C_t\le(1-\sum w_i^2)^\gamma\le((k-1)/k)^\gamma$ (Lemma 3) *(proof)*
- **Simplex bound:** $C_s/C_t\le c_n^\gamma$ for compact $K\subset\mathbb R^n$, $2\le s<t$, with equality cases (Theorem 2); at $s=2$, $M_t\ge c_n^{1-t/2}2^{t/2}R^t$ with $R$ the circumradius, giving Jung's theorem as $t\to\infty$ (Corollary 4) *(proofs)*
- **Relation to Davies–Lim–McCann:** Theorem 2 at $(s,t)$ follows from simplex minimality of $\mathcal E_{t,s}$ over compactly supported measures; this fails on a wedge $W_n$ of exponents ($2\le s<\beta_n$ and $s<t<\alpha_{\Delta n}(s)$), with the uniform measure on $S^2$ as an explicit witness (Proposition 5, Example 6) *(proof)*
- **Exact threshold:** for $n\ge2$, $0<s<2$, $t>s$, a vertex-split simplex $K_h$ with $n+2$ points has $C_s/C_t>c_n^\gamma$ for small $h$; hence the regular simplex maximises $C_s/C_t$ iff $s\ge2$ (Theorem 7, Corollary 8) *(proof)*
- **Sharp profile and stability:** for $0<s<1$, $M_s/D^s\ge\Phi_s(\rho/D)$ with $\rho$ the Hausdorff distance to a diametral pair, sharp for every $\rho$ via three-point spaces, and Hausdorff stability with exponent $1/s$ (Theorem 11, Corollary 12); at $s=1$ an exact profile with optimal exponent $1/4$ (Theorem 13); simplex-support stability with optimal exponent $1/2$ (Theorem 14) *(proofs; constants not optimised)*
- **Ball remark:** $\mathrm{Cap}_q(K)/\mathrm{Cap}_{-2}(K)\le\mathrm{Cap}_q(\overline B_1)/\sqrt2$ for $q<n$ (Proposition 15) *(proof; classical corollary)*

## Technical account

**Two points.** Put mass $1/2$ on each end of a diameter: this gives $M_s\ge D^s/2$. Pointwise, $d^t\le D^{t-s}d^s$, so $M_t\le D^{t-s}M_s$. Combining, $C_t^t\le D^{t-s}M_s\le (2M_s)^{(t-s)/s}M_s$, which rearranges to $C_t/C_s\le2^\gamma$. Clark and Laugesen's Lemma 18, Björck's Theorem 7 and Hille (1966) contain the two ingredients; the GitHub issue cited in the paper wrote out the same two steps.

**Simplices.** Björck (1956) showed that for $s\ge2$ some $s$-maximiser in $\mathbb R^n$ has at most $n+1$ atoms. On the off-diagonal pairs of such a measure, Hölder's inequality with exponents $t/(t-s)$ and $t/s$ gives $M_s\le a^{1-s/t}M_t^{s/t}$ with $a=1-\sum w_i^2\le n/(n+1)$, which is the simplex bound; equality forces equal weights and equal distances. Below $s=2$ Björck's support theorem is unavailable, and the threshold theorem shows that this is not a defect of the method.

**Why the simplex fails below two.** Replace one vertex $v_0$ of a regular simplex by two points $v_0\pm he$, with $e$ orthogonal to $v_0$. The pair now contributes energy of order $h^s$ at exponent $s$, but only of order $h^t$ at exponent $t$, while every other change is of order $h^2$. When $s<2$ the $h^s$ gain dominates, so for small $h$ the split set raises $C_s/C_t$ above the simplex value $c_n^\gamma$. The proof bounds the Taylor remainders explicitly, so "small $h$" is quantified.

**Stability.** For $0<s<1$ the extremal sets for a given Hausdorff distance $\rho$ from a diametral pair are three-point spaces, and the resulting profile $\Phi_s$ is explicit and strictly increasing, with $\Phi_s(x)=\tfrac12+x^s/8+o(x^s)$; inverting it gives the $1/s$ rate. At $s=1$ every subset of a diameter segment that contains its endpoints is extremal, so the right measure is the distance to the segment, and the rate is a fourth root (the order was implicit in Grove and Markvorsen's extent–excess estimate; the exact profile and optimality are new). Near the simplex, a polar alignment argument controls the support to within $O(\sqrt\varepsilon)$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/riesz-capacity-ratio-conjectures.txt) is available for reading.

- **Proofs.** Every theorem, corollary, lemma and proposition has a written analytic proof in the 24-page manuscript. Table 1 of the paper separates what is new from what was already known.
- **Exact checks.** `verify_exact.py` uses exact rational arithmetic and the standard library only: 40 deterministic configurations, 120 exact maximisations, 240 ratio inequalities and 35 structural checks.
- **High-precision and randomised checks.** `verify_stability.py` checks the closed forms and asymptotic constants of the stability results in 60- to 400-digit decimal arithmetic (114 checks); `check_stability.py` runs 1,950 seeded randomised spot checks of Theorems 1, 2, 11, 13 and 14, the vertex-split sets of Theorem 7 in dimensions 2 and 3, and Example 6. Every check is an explicit test, so they stay active under Python's `-O` flag, and any failure exits with an error. These are sanity checks on examples; the results rest on the proofs.
- **Replay.** All three scripts and the figure script were rerun under `-I -B` and `-I -B -O` from a fresh copy of the package; every output matched the shipped file byte for byte, and copies with the check helper deliberately inverted failed. GitHub CI reran the checks on Linux with identical receipts.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review and an audit of the new proofs by a separate model, a proof audit and a clean replay led to one revision round, which added the threshold theorem, the sharp profile and the Davies–Lim–McCann comparison. No reviewer found a mathematical error, and the re-review found no open correctness issue. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The literature search was dated and bounded, with no author enquiry. Hille's 1965 paper on transfinite diameters, a 1965 lecture chapter by Hille and Alexander and Stolarsky's 1974 paper could not be read and may bear on these results; no priority is claimed against them. Constants in the stability results are explicit but not optimised; only the exponents are sharp. For $s<2$ the maximising shapes are unknown, and the boundary of the wedge $W_n$ is not known explicitly.

## Relationship to earlier work

Clark and Laugesen (2024 preprint; SIAM Journal on Mathematical Analysis, 2025) set out the capacity-ratio programme, posed the two conjectures and proved the planar simplex case, the planar two-point case for $t\ge2$, the one-dimensional two-point case and the $t=\infty$ edges. Fan (2026) restated the two-point conjecture and supported it numerically, and compared a split tetrahedron with the ball rather than with the simplex. A GitHub issue opened on 27 October 2026 already contains the two-step proof of Theorem 1, which the paper presents as a known short argument. Davies, Lim and McCann (2022) and Lim and McCann (2021) showed that regular simplices minimise attractive–repulsive power energies in large exponent ranges, which implies Theorem 2 outside the wedge $W_n$; Proposition 5 makes this precise. The circumradius argument follows Björck (1956), and the Hölder step appears in Hille (1966) for configurations in a ball. Jung (1901) is the $t\to\infty$ limit of Corollary 4, and Grove and Markvorsen (1995) gave the fourth-root extent–excess order that Theorem 13 sharpens.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on Riesz energies, equilibrium measures and attractive–repulsive particle models | The exact range of exponents where the regular simplex is extremal ($s\ge2$), an explicit competitor that beats it below 2, and explicit stability bounds | Pure mathematics; stability constants are not optimised and the maximisers for $s<2$ are unknown |
| Geometers and metric-space analysts | A metric-space two-point inequality with equality and stability, and a finite-exponent Jung theorem | The two-point argument was already public; the new content is the equality, stability and threshold results |
| People working on maximum diversity or mean-distance problems | Sharp comparisons between power-mean distance energies of a set | Connections are noted in the paper as pointers, not worked out |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

Capacity comparisons go back to Pólya and Szegő, and ratios of capacities are a natural way to ask which shapes are extreme. For negative exponents these capacities are maximal average distance energies, the same objects that govern how particles with attracting and repelling forces arrange themselves. Settling the two conjectures, and showing exactly where the regular simplex stops being optimal, gives a precise map of which configurations are extremal across the exponent plane, with the line $s=2$ as the boundary.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root, with Python 3.11 or later:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -m venv env && env/bin/pip install -r requirements.txt   # numpy 2.3.5, matplotlib 3.10.8
env/bin/python -I -B -O verify_exact.py --output exact.json                 # exact checks, about a second
env/bin/python -I -B -O verify_stability.py --output stability.txt          # high-precision checks, about a second
env/bin/python -I -B -O check_stability.py --output check.json             # randomised checks, a few seconds
cmp exact.json exact_verification.json && cmp stability.txt stability_verification.txt && cmp check.json check_stability_results.json
```

Each script needs an explicit output path, so the shipped receipts are not overwritten. `AI_INDEX.md` maps each claim to its location in the paper and its evidence, and `review/REVIEW_SUMMARY.md` lists the objections raised in review and how each was resolved.

## The most valuable next projects

1. Find the maximisers of $C_s/C_t$ for $s<2$ below the diagonal, where the simplex fails.
2. Describe the wedge $W_n$ explicitly, that is, find $\beta_n$ and $\alpha_{\Delta n}$.
3. Read Hille (1965) and Alexander–Stolarsky (1974) and settle any prior statements.
4. Classify all compact sets attaining equality in the simplex bound.
5. Optimise the constants in the stability theorems, and compare Theorem 14 at $s=2$ with known stability results for Jung's theorem.

## What is in the evidence package

The paper (PDF, Markdown source and generated LaTeX, with its build script) and its parameter-region figure; `verify_exact.py`, `verify_stability.py` and `check_stability.py` with their deterministic receipts; the dated literature audit (`prior_art/`); a rating-free summary of the internal review (`review/`); the superseded first version (`history/`); the bibliography as BibTeX from the Crossref records; `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text and figures are CC0-1.0; code is MIT.
