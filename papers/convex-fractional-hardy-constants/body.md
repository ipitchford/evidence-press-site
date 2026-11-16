## Summary

**In one sentence.** Among all convex regions, a thin slab has the smallest fractional Hardy constant; so, in the simplest case $p=1$, every convex region keeps at least a fraction $2^{-s}$ of the half-space constant, the constants of all convex regions share one small-order limit, and constants below the half-space value are attained, for example on every ball.

**The everyday idea.** A Hardy inequality says that a function which is zero outside a region cannot stay large near the region's edge without paying for it in "roughness". The best constant in the inequality measures how strongly the edge forces this. In the classical version, where roughness is measured by the derivative, every convex region has the same best constant as a flat half-space: a convex edge, seen from close by, looks flat.

**The fractional version.** Replace the derivative by a long-range comparison of the function's values at every pair of points. For $0<s<1$ and $p\ge1$, with $u$ extended by zero outside the region $\Omega$ and $d_\Omega$ the distance to its boundary, the best constant $\mathfrak h_{s,p}(\Omega)$ is the largest $\mathfrak h$ with

$$\iint_{\mathbb R^N\times\mathbb R^N}\frac{|u(x)-u(y)|^p}{|x-y|^{N+sp}}\,dx\,dy$$

$$\ge\ \mathfrak h\int_\Omega\frac{|u|^p}{d_\Omega^{\,sp}}\,dx$$

for all such $u$. Energies of this kind describe jump processes and nonlocal equations, and at $p=1$ they measure the *fractional perimeter* of sets. Now the shape matters. Bianchi, Brasco and Zagati showed that every convex region still has the half-space constant when $sp\ge1$ or $p=2$, and left the remaining cases open. Bianchi, Stefani and Zagati treated $p=1$: an interval does strictly better than a half-line, every convex region keeps at least half of the half-space constant, and they asked two questions in dimension two and higher: what happens as $s\to0$, and is the best constant actually achieved by some function?

**What is proved.**

| What | In plain terms | Where |
|---|---|---|
| Slabs are extremal | For every $p\ge1$, no convex region has a smaller constant than the slab $\mathbb R^{N-1}\times(0,1)$; its constant is the interval constant times an explicit angular factor | Theorem 3.1 |
| Sharp universal bound at $p=1$ | Every convex region keeps at least $2^{-s}$ of the half-space constant, and this cannot be improved; the old factor was $1/2$ | Theorem 4.1 |
| Small-order limit | $s\,\mathfrak h_{s,p}(\Omega)\to2N\omega_N/p$ as $s\to0$, the same for every convex region; this answers the first question | Corollary 4.3, Theorem 5.1 |
| Attainment | On a bounded region with $C^1$ boundary, any constant strictly below the half-space value is achieved by some function, for every $p\ge1$ | Theorem 7.3 |
| Examples | At $p=1$: every ball and every bounded planar convex $C^1$ region, answering the second question for them; for $p$ slightly above 1 with $sp<1$: balls, planar convex regions, the interval and rounded long boxes | Corollary 7.5, Table 1 |

The improvement over the old factor is $2^{1-s}$: about 1.99 at $s=0.01$, 1.41 at $s=1/2$ and 1.007 at $s=0.99$. To our knowledge the examples for $p>1$ are the first attained constants on convex domains in the regime that Bianchi, Brasco and Zagati left open; for $p=2$, by contrast, every convex region has exactly the half-space constant, which is never attained.

**The idea of the proof.** The double integral is sliced into lines in every direction (the method of rotations). On each line the exact one-dimensional constant of an interval applies, with the distance measured along the line; a supporting plane of the convex region turns that distance into the distance to the boundary, and averaging over directions produces the angular factor. Functions that are long and flat along a slab show that nothing better is possible. For attainment, a minimising sequence can fail to converge only by piling up at the boundary, where the region looks like a half-space; that costs at least the half-space constant, so a strict gap below it forces convergence. The gaps come from explicit trial sets: the whole region at $p=1$, and, for $p>1$, a comparison between different $p$ due to Bianchi, Stefani and Zagati.

**Limits.** The constant of a particular region is not computed. The interval constant for $1<p\ne2$ and $sp<1$ is unknown. Whether every convex body in three or more dimensions has a strict gap, and hence attains its constant, is open. Regions with corners, such as polygons, are not covered by the attainment theorem. The ranges in $p$ are sufficient conditions from particular trial sets, not exact transitions. This is an unrefereed candidate; its assurance is internal AI-assisted review and numerical checks, not peer review. The half-space and interval constants, the open questions and the comparison between different $p$ are due to Bianchi, Brasco, Stefani and Zagati, and the slicing method follows Loss and Sloane and Bianchi, Brasco and Zagati.

## Summary for specialists

Write $q=sp$, $\kappa_{s,p}=\mathfrak h_{s,p}((0,1))$ for the interval constant, $\omega_N$ for the volume of the unit ball and

$$C_{N,q}=\tfrac12\int_{\mathbb S^{N-1}}|\theta\cdot e|^q\,d\theta$$

$$=\pi^{(N-1)/2}\,\frac{\Gamma((1+q)/2)}{\Gamma((N+q)/2)}.$$

The half-space constant is $\mathfrak h_{s,p}(H_N)=C_{N,q}\Lambda_{s,p}$ (Bianchi–Brasco–Zagati for $p>1$, Bianchi–Stefani–Zagati for $p=1$, where $\Lambda_{s,1}=4/s$), and $\kappa_{s,1}=2^{2-s}/s$.

- **Theorem 3.1** *(proof)*: for $p\ge1$ and every proper open convex $\Omega\subset\mathbb R^N$, $\mathfrak h_{s,p}(\Omega)\ge C_{N,sp}\,\kappa_{s,p}$, with equality for the slab; long boxes approach it. The method is that of Bianchi–Brasco–Zagati (Theorem 6.6, $p=2$) and Loss–Sloane; the sharp universal statements are new in a bounded search.
- **Theorem 4.1** *(proof)*: for $p=1$, $2^{-s}\le\mathfrak h_{s,1}(\Omega)/\mathfrak h_{s,1}(H_N)\le1$ for convex $\Omega$, and $2^{-s}$ is optimal. The factor $1/2$ of Bianchi–Stefani–Zagati came from letting $p\to1$ in a supersolution bound.
- **Theorem 5.1** *(proof)*: for each fixed $p\ge1$, $\sup_\Omega|s\,\mathfrak h_{s,p}(\Omega)-2N\omega_N/p|\to0$ as $s\to0$, over all convex $\Omega$. The upper half follows from Maz'ya–Shaposhnikova by a fixed test function; the uniform lower half is new.
- **Propositions 6.1, 6.2 and 6.5** *(proof)*: strict gaps $\mathfrak h_{s,p}(\Omega)<\mathfrak h_{s,p}(H_N)$ for balls ($N\ge2$) and bounded planar convex domains at $p=1$, and, for $q<1$, for balls when $p<p_B(q)$, bounded planar convex domains when $p<p_P(q)$ and the interval, slabs and rounded long boxes when $p<p_0(q)$, with $1<p_P<p_B\le p_0<2$. The ball ratio uses Bianchi–Stefani–Zagati Proposition 4.8; the passage to $p>1$ uses their comparison $\mathfrak h_{s,p}\le\mathfrak h_{sp,1}$. The planar argument fails for $N\ge3$ (Remark 6.3).
- **Theorem 7.3** *(proof)*: for $p\ge1$ and bounded $\Omega$ with $C^1$ boundary, $\mathfrak h_{s,p}(\Omega)<\mathfrak h_{s,p}(H_N)$ implies that the infimum is attained in the natural energy space, and normalised nonnegative minimising sequences converge along subsequences. The proof localises at the boundary (Lemma 7.1) and uses the Brezis–Lieb lemma. The closest analogue is Dieb–Temgoua (regional quadratic energy, $C^{1,1}$, $s>1/2$).

Thresholds of Table 1 (sufficient conditions, three decimals):

| $q=sp$ | $p_P$ (planar convex) | $p_B$ (every ball) | $p_0$ (interval, rounded boxes) |
|---|---|---|---|
| 0.10 | 1.023 | 1.047 | 1.479 |
| 0.25 | 1.049 | 1.111 | 1.486 |
| 0.50 | 1.073 | 1.199 | 1.487 |
| 0.75 | 1.069 | 1.264 | 1.467 |
| 0.90 | 1.044 | 1.278 | 1.422 |

## Technical account

**Slicing.** Polar coordinates in $y-x$ write the energy as an average over directions $\theta$ of one-dimensional energies on lines parallel to $\theta$. On each line, $\Omega$ meets the line in an interval (or a half-line, or the whole line), so the one-dimensional inequality holds with constant $\kappa_{s,p}$ and weight the distance to the boundary *along the line*. At a nearest boundary point, a supporting hyperplane with normal $\nu$ shows that this directional distance is at most $d_\Omega/|\theta\cdot\nu|$; inserting this and averaging $|\theta\cdot\nu|^q$ over the sphere gives $C_{N,q}$. At $p=1$ the interval constant $2^{2-s}/s$ is known, and dividing by the half-space constant $4C_{N,s}/s$ gives the ratio $2^{-s}$.

**Small order.** As $q\to0$, both $q\,\kappa_{s,p}$ (bounded below through the Frank–Seiringer constant on the punctured line) and $q\Lambda_{s,p}$ tend to 4, and $C_{N,0}=N\omega_N/2$; this gives the uniform lower bound.

**Attainment.** Take a minimising sequence normalised in the weighted $L^p$ norm. Away from the boundary, compactness holds by the fractional Rellich theorem. Near the boundary, flattening the $C^1$ boundary in small charts and using a partition of unity shows that the mass that escapes to the boundary carries energy at least $\mathfrak h_{s,p}(H_N)$ times that mass, up to an arbitrarily small error. If $\mathfrak h_{s,p}(\Omega)$ is strictly smaller, no mass can escape, and a Brezis–Lieb splitting shows that the weak limit is a minimiser.

**Gaps.** At $p=1$ the region itself is a trial set: its quotient is its fractional perimeter divided by $\int_\Omega d_\Omega^{-s}$. For balls this ratio, divided by the half-space constant, has a closed form $F_N(s)<1$; for bounded planar convex domains, a Jensen argument with $\mathbb E\log|\cos\Theta|=-\log2$ gives a ratio below 1. For $p>1$, the comparison $\mathfrak h_{s,p}\le\mathfrak h_{sp,1}$ turns any $p=1$ gap into a gap for $p$ close to 1, because $\Lambda_{q/p,p}$ decreases in $p$ (Lemma 6.4); the thresholds are where the two sides meet.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/convex-fractional-hardy-constants.txt) is available for reading.

- **Proofs.** Every theorem, proposition, lemma and corollary has a written proof in the 13-page paper. The paper opens with a plain introduction and a roadmap, fixes all notation and known constants before use, and ends with open questions and a statement on computations and the use of AI. No proof assistant was used.
- **Numerical checks.** `verify_hardy.py` (mpmath at 30 digits) makes 67 checks: the angular factor against direct quadrature, the interval and ball indicator quotients, the universal constants at $s=1/2$, the ball inequality $2^{-s}\le F_N\le F_\infty<1$ on a grid, the planar ratio, the rectangle quotients from their covariograms, the monotonicity and limits of $\Lambda$ in $p$, the small-order limits and the thresholds of Table 1. These are high-precision but not interval-certified, and they are not part of any proof.
- **Tests that can fail.** The script uses no `assert`, so it behaves identically under Python's optimised mode. Changing the half-space term $2/q$ to $2.01/q$ produces 7 failures and exit status 1.
- **Replay.** The checks were rerun from fresh copies before release under Python 3.12 with mpmath 1.3.0, in normal mode and under `python -O`; both outputs were byte-identical to the recorded output, and the figure regenerated byte for byte. GitHub CI reruns the checks under `-O` against the recorded output, with the negative control, as a blocking job.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay found no error in any theorem and led to one revision round. It added the plain introduction, precise credit for the slicing method and the answered questions, missing references, fuller proofs of the density and limit steps, new checks, and two extensions: attainment for every $p\ge1$ and explicit strict gaps for $p>1$. A re-review, a proof audit and a second-model audit of the new proofs followed. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** No particular region's constant is computed. The interval constant for $1<p\ne2$, $sp<1$ is unknown. Strict gaps for general convex bodies in three or more dimensions, and attainment at corners, are open. The $p$-ranges are sufficient, not exact. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Analysts of fractional Sobolev spaces | A sharp, shape-independent lower bound for Hardy constants of convex domains at $p=1$, and the extremal role of the slab for every $p$ | No particular domain's constant is computed |
| Researchers on nonlocal equations | Boundary-weighted coercivity with explicit constants, and a criterion that guarantees extremal functions | Attainment needs a $C^1$ boundary and a strict gap |
| Geometric analysts (fractional perimeters) | At $p=1$, weighted fractional Cheeger sets exist for balls and planar convex domains | Higher dimensions beyond balls are open |
| Research agents | Machine-readable claims, an agent index, a prior-art record and a replayable check script | The checks confirm numbers; they are not part of the proofs |

## Why the problem matters

Hardy constants control how solutions of nonlocal equations behave at a boundary, and at $p=1$ they become geometric statements about fractional perimeters. Whether convex shape matters, how much, and whether the best constant is achieved were open in exactly the regime where the fractional and classical theories part ways. The slab bound gives a sharp, shape-independent answer to the first two questions at $p=1$, and the attainment criterion turns any strict gap into an existence theorem for extremal functions.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from a directory outside the package, with [uv](https://docs.astral.sh/uv/):

```sh
V=/absolute/path/to/package/verification
shasum -a 256 -c MANIFEST.sha256                       # at the package root
uv run --no-project --python 3.12 --with mpmath==1.3.0 \
  python -I -B -O "$V/verify_hardy.py" --out /tmp/hardy   # about 20 s
uv run --no-project --python 3.12 --with mpmath==1.3.0 --with matplotlib==3.10.8 \
  python -I -B "$V/plot_hardy.py" --out /tmp/hardy
```

`ENVIRONMENT.txt` lists the software used. `AI_INDEX.md` maps each claim to its proof and checks, `PRIOR_ART.md` records the sources and how the results relate to them, `RESEARCH_GATES.json` gives the prior-work boundary, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Prove that every bounded convex body in three or more dimensions has a constant strictly below the half-space value at $p=1$ (Question 8.1), which would give attainment on every bounded convex $C^1$ domain.
2. Decide whether the gap criterion is also necessary, and find the Hardy constants of planar wedges and convex polygons (Question 8.2).
3. Compute the interval constant for $1<p\ne2$ and $sp<1$, which by Theorem 3.1 is the universal convex-domain constant (Question 8.3).
4. Decide whether the slab infimum is attained by a bounded convex domain, and whether the indicator of the ball is a minimiser at $p=1$ (Question 8.4).

## What is in the evidence package

The paper (LaTeX source and PDF); `verification/verify_hardy.py` with its recorded output, `verification/plot_hardy.py` and Figure 1; `requirements.txt` and `target.yaml`; `PRIOR_ART.md`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, figure and data, MIT for code), the CI workflows and SHA-256 sums.
