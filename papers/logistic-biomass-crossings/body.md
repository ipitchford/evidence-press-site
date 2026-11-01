## Summary

Picture a species living in a handful of habitat patches: ponds, woodland fragments or reefs. Each patch has its own growth rate and its own carrying capacity, the population it would settle at if left alone. With no movement, the total population is simply the sum $S$ of those carrying capacities. Now let individuals migrate between the patches along a fixed network, and turn up one dial, the overall migration intensity $\beta$, which scales every migration rate at once.

Migration can leave the total equilibrium population $B$ a little **above** $S$ (migration helps the population as a whole) or a little **below** it (migration harms it). As the dial turns, the population can switch between these two states. Each switch is a **crossing**. Ecologists have studied this comparison since the 1970s. Arditi, Lobry and Sari (2015) showed that two patches allow at most one crossing. In 2022 Elbetch, Benzekri, Massart and Sari found three crossings with three patches, and wrote that a proof that three is the most "would certainly be desirable", together with bounds for more patches.

This release answers both requests:

- **Three is not the most; five is.** An explicit three-patch network crosses five times. This is checked in exact arithmetic, and no three-patch network can cross six times.
- **More patches, more crossings, but not without limit.** With $n$ patches there are at most $2^n-3$ crossings, and at least $n+2$ are possible. So the maximum is 1 for two patches, 5 for three and between 6 and 13 for four.
- **Crossings force peaks.** The five-crossing network has at least three separate peaks of total population as migration increases.

**The effects are tiny.** Between crossings the total differs from $S$ by at most about 3.3 parts per million, and the example needs one migration rate about 430 times smaller than the largest. The results show what this standard model allows; they are not a claim about real populations or a guide to management.

## Summary for specialists

Consider $\dot x_i=x_i(r_i-\alpha_ix_i)+\beta(\Gamma x)_i$ with $\alpha_i=r_i/K_i$, where $\Gamma$ is an irreducible Metzler matrix with zero column sums (conservative migration, asymmetry allowed). Let $B(\beta)$ be the total of the unique positive equilibrium and $S=\sum_iK_i$. A threshold is $\beta>0$ with $B(\beta)=S$, and $N(n)$ is the largest number of thresholds among $n$-patch models with $B\not\equiv S$.

- **Theorem 6.** $N(3)=5$. With $r=(7/3,1,2)$, $K=(1,3,1)$ and $\Gamma=M/138159$, where $M$ has rows $(-142772,18802,138159)$, $(82292,-25042,321)$ and $(60480,6240,-138480)$, the thresholds are $\beta=\tfrac{46053}{252320},\tfrac{5117}{6400},\tfrac{6579}{2912},\tfrac{6579}{1640},\tfrac{168861}{27680}$, all transverse. Nearby three-patch models also have five crossings.
- **Theorem 9.** For every $n\ge2$, either $B\equiv S$ or there are at most $2^n-3$ thresholds. No genericity assumption is needed. **Proposition 10** adds that the orders of vanishing at $\beta=0$ and at all thresholds sum to at most $2^n-2$.
- **Theorem 12.** For every $n\ge3$ some $n$-patch model has at least $n+2$ crossings and $\lceil(n+2)/2\rceil$ strict local maxima of $B$. An exact four-patch certificate gives $N(4)\ge6$.
- **Corollary 7.** In the example, $B>5$ on $(0,\beta_1)\cup(\beta_2,\beta_3)\cup(\beta_4,\beta_5)$ and $B<5$ on the complementary intervals, so $B$ has at least three strict local maxima. Also $B'(0)=44/138159$ and $B(\infty)=5-1.246\times10^{-3}$.

## Technical account

**Three patches, by hand.** Summing the equilibrium equations removes the migration term, because the columns of $\Gamma$ sum to zero. At a threshold the equilibrium therefore satisfies two scalar conditions, $\sum_i x_i=S$ and $\sum_i x_i(r_i-\alpha_ix_i)=0$. These define an ellipse through $K$ in the plane of total mass $S$. Parametrising the ellipse by lines through $K$, an equilibrium needs $f(x)+\beta g(x)=0$ with two vectors in a two-dimensional plane, which is a collinearity condition. Clearing denominators gives a binary quintic, so there are at most five thresholds unless the quintic vanishes identically, which forces $B\equiv S$.

**The example is built backwards.** Choose five points on the ellipse, at line parameters $t=\tfrac12,1,2,3,4$, and ask that each be an equilibrium for some intensity. The conditions are linear in the six off-diagonal migration rates and the reciprocals of the five intensities. The solution is unique up to one common factor (Remark 8), and it happens to make every rate positive. The quintic then factors as a constant times $(2t-1)(t-1)(t-2)(t-3)(t-4)$, and the exact derivatives $B'(\beta_k)$ alternate in sign.

**Any number of patches.** The threshold equilibria are common zeros of $n$ quadrics on a hyperplane of projective space. When the common zero set is finite, Bézout's theorem gives exactly $2^n$ solutions counted with multiplicity. Two contributions never correspond to thresholds: the zero-migration point, with length at least 1, and a point at infinity, with length at least 2 because the conservative matrix is singular. This leaves $2^n-3$. If the zero set is not finite, the migration matrix is perturbed towards a star network whose zero set is finite. Each physical threshold survives the perturbation by Rouché's theorem in a small disc. Bézout's theorem, Rouché's theorem and properness of the family are classical and credited; the new content is their application to this threshold count.

**Lower bounds.** Attach a new patch to an existing network with very slow migration. The old crossings persist, and at very high intensity the total tends to a perfect-mixing value that can be placed on either side of the new $S$. Choosing it opposite to the last sign adds one crossing per patch.

## Evidence, assurance and limitations

- **Proofs:** every theorem has a written proof. The three-patch bound also has an elementary direct proof.
- **Exact certificates:** two separately written standard-library scripts certify the five thresholds, equilibria and derivatives of the example in rational arithmetic. A third certifies seven alternating signs of $B-S$ for the four-patch example using exact rational boxes. The checkers raise errors instead of using `assert`, so they remain valid under optimised Python.
- **Replay:** all scripts were rerun from a clean extraction of the frozen archive, in normal and optimised mode, with identical outputs and byte-identical receipts. GitHub CI repeats this on Linux. Twelve semantic negative controls tamper with thresholds, equilibria, rates, capacities and certificate data, and each must be rejected; all are.
- **Review:** internal AI-assisted review only. It comprised a five-role first round, an outside-model adversarial review, a re-review and proof audit of the revision, and a targeted audit of Proposition 10. No reviewer found an error in the theorems. There has been no external peer review, no independent reproduction and no formal verification.
- **Effect size and robustness:** the excursions are a few parts per million (numerical), and no perturbation radius for the five-crossing regime is certified.
- **Priority:** the source question and the two Arditi–Lobry–Sari papers were read in full. Several other comparisons were read through abstracts and indexed sections. No earlier crossing bound was found, but the search was bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Analysts of patch and metapopulation models | A complete answer for three patches, a universal bound and a construction for lower bounds | The exact value of $N(4)$ and the growth of $N(n)$ are open |
| Theoretical ecologists | A rigorous reason why "migration helps" or "migration harms" can flip repeatedly as connectivity changes | The effects in the example are a few parts per million |
| Conservation and connectivity modellers | A caution against extrapolating the sign of the migration effect from one or two connectivity levels | Qualitative only; the model assumes logistic growth and fixed migration |
| Research agents | Machine-readable claims, exact rational witnesses and replayable checkers | The certificates confirm the examples, not the general theorems |

## Why the problem matters

Whether linking habitats increases or decreases total abundance is a recurring question for corridors, fragmentation and stocking. The two-patch picture suggests a simple rule with a single switch from beneficial to detrimental migration. This paper shows that the rule fails with only three patches: the sign of the effect can change five times as connectivity grows. It also places a firm upper limit on how often it can change. The companion release on uniform global dispersal found many peaks of total population; here the general network model gives several peaks with just three patches.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3:

```sh
shasum -a 256 -c SHA256SUMS
python3 -B -I -O verify_exact.py            # five exact thresholds, derivatives, B'(0), B(∞)
python3 -B -I -O independent_audit.py       # separately written check
python3 -B -I -O four_patch_certificate.py  # seven alternating signs, N(4) ≥ 6
python3 -B -I -O negative_controls.py       # 12 tampered inputs must be rejected
```

To check one threshold by hand, take $\beta_1=46053/252320$ and $x=(85/83,\,250/83,\,80/83)$. The entries sum to $415/83=5$, and $x_i(r_i-\alpha_ix_i)+\beta_1(\Gamma x)_i=0$ in each patch. `AI_INDEX.md` maps every result to its evidence.

## The most valuable next projects

1. Determine $N(4)$, which lies between 6 and 13, and decide whether $N(n)$ grows linearly or exponentially in $n$.
2. Decide whether symmetric migration, $\Gamma=\Gamma^\top$, can give five crossings with three patches.
3. Find how large the excursions between crossings can be, and certify a perturbation radius for the five-crossing regime.
4. Obtain specialist review of the intersection-theory bound and its multiplicity version.

## What is in the evidence package

The package contains:
- the 13-page manuscript (PDF and LaTeX) and its figure with the underlying curve data;
- three exact standard-library checkers, their data files and the independent audit receipt;
- the mpmath generator of the four-patch certificate data and the plotting script, with pinned dependencies;
- the semantic negative controls, a curve comparer and the CI workflow;
- the revision response (rating-free), the dated novelty audit and frozen targets;
- the claim, status, assurance, provenance and research-gate records, and the citation audit;
- an agent index, licences (CC0-1.0 for text and data, MIT for code) and SHA-256 manifests.
