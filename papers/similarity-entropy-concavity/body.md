## Summary

**In one sentence.** A widely used diversity measure that knows some outcomes are alike can, in rare cases, fall when two populations are pooled; this candidate gives an exact test for when that can happen, shows that four outcomes are always safe while five can fail, and bounds how large a failure can be.

**The problem.** Ecologists, forecasters and machine-learning researchers often measure the diversity or uncertainty of a distribution in a way that knows some outcomes are alike: two closely related species count as less diverse than two unrelated ones. A similarity matrix $K$ records how alike each pair of outcomes is, from 0 (unrelated) to 1 (identical). For a distribution $p$, the *typicality* of outcome $i$ is $(Kp)_i$, its expected similarity to a random draw. The standard measure of this kind, the order-one similarity-sensitive entropy of Leinster and Cobbold,

$$H_K(p)=-\sum_i p_i\log (Kp)_i,$$

averages minus the log of each outcome's typicality. With $K$ the identity it is ordinary Shannon entropy. Users expect it to behave like Shannon entropy: pooling two communities should not lower diversity, and learning something should not, on average, raise uncertainty. Mathematically, both statements say that $H_K$ is *concave*. Diversity partitions in ecology, information-gain criteria for experimental design and the GAIT divergence in machine learning all rely on it.

**What was known.** Concavity can fail. Gallego Posada and co-authors (GAIT) proved it for two outcomes and conjectured it whenever $K$ is positive definite and satisfies the multiplicative triangle inequality $K_{ik}\ge K_{ij}K_{jk}$. Bavaud showed failures without the triangle inequality and asked for exact conditions. Miller refuted the conjecture with an 18-outcome example satisfying both conditions and asked for the least number of outcomes at which concavity can fail. In ecology, a claim that the higher orders of the Ricotta–Szeidl family are concave was later acknowledged by Ricotta, Szeidl and Pavoine to rest on a faulty proof.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| A finite test | For any similarity matrix: merge identical rows, check one positive definiteness condition and one matrix per outcome. The test says exactly whether pooling can ever lower the entropy | Theorem 1 |
| Four is safe, five can fail | For positive definite similarities satisfying the triangle inequality, every matrix on four outcomes is safe (an exact computer-checked certificate), and a five-outcome example built on the complete bipartite graph $K_{2,3}$ fails. This answers Miller's question | Theorem 4 |
| Safe families | Ultrametric similarities, such as those read from a dendrogram, are always safe, as are Laplace kernels on a line; on weighted trees the test runs in linear time, and a star with equal edges needs at least 13 outcomes to fail | Corollary 2, Proposition 8, Corollary 9 |
| How big a failure can be | If $K$ is positive semidefinite or satisfies the triangle inequality, an observation can raise expected entropy by at most half the log of the number of outcomes. Over positive semidefinite similarities the exact worst case is $\tfrac12\log n-\log\log n+\log2-1$ plus a vanishing term | Theorem 10 |
| A safe substitute | Bavaud's effective entropy, which is always concave, lies between one half and all of $H_K$ under either condition | Proposition 12 |
| Only Rao is always safe | Among indices that average a rarity function of typicality, only Rao's quadratic entropy is concave for every positive definite metric similarity; a published recommendation that orders two and above are safe must be narrowed to order two | Theorem 14, Corollary 15 |
| Paired variables | Joint entropy under a product similarity is subadditive for every joint law only in degenerate cases | Theorem 13 |

**Four is safe, five can fail.** Put five outcomes in two groups, of two and three. Give similarity $a$ to pairs in different groups and $a^2$ to pairs in the same group. This matrix is positive definite for $a<1/\sqrt2$ and satisfies the triangle inequality. Learning which group the outcome came from should not raise expected entropy, but for $a=12/17$ it raises it by about 0.0003 nats. The failure persists throughout a window of edge similarities of width about 0.033, just below the positive definiteness threshold, and the exact test finds no failure on a grid of smaller values.

**The idea.** Measure a change in the distribution by the *relative* changes it causes in the typicalities, instead of by the change in probabilities. In those coordinates the curvature of $H_K$ depends linearly on the distribution, so it is enough to check the corners of the probability simplex: one matrix per outcome. For four outcomes, every four-point distance can be written as a sum of "cuts", and the corner conditions become seven polynomials whose coefficients are all positive.

**Limits.** Failures are rare and usually tiny: the five-outcome example fails in a window of width about 0.033 and by about 0.0003 nats, and none of 2000 seeded random five-outcome examples failed, which is a numerical observation rather than a certificate. The worst case nevertheless grows with the number of outcomes. The four-outcome step rests on an exact computer certificate, not a conceptual proof. Several equivalences, between concavity, nonnegative expected information gain and proper scoring, were already noted by Miller and by GAIT and are credited to them. The asymptotic statements converge slowly. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computation only.

## Summary for specialists

$K\in[0,1]^{n\times n}$ is symmetric with unit diagonal; $q=Kp$; $H_K(p)=-\sum_{p_i>0}p_i\log q_i$. PD and PSD mean positive definite and semidefinite; MTI is $K_{ik}\ge K_{ij}K_{jk}$, equivalently $K=e^{-d}$ for a metric $d$ when entries are positive. $L$ is the matrix obtained by merging identical rows, of order $m$, and $D(z)=\mathrm{diag}(z)$. For a random posterior $P$ with mean $p$, $G=\mathbb E H_K(P)-H_K(p)$.

- **Theorem 1** *(proof)*: $H_K$ is concave on the simplex if and only if $L$ is PD and each vertex matrix

$$T_j=L^{-1}D(Le_j)+D(Le_j)L^{-1}-e_je_j^{\top}$$

  is PSD, $1\le j\le m$. Then $H_L$ is strictly concave, and equality in a nontrivial mixture holds exactly when the class masses agree.
- **Corollary 2** *(proof)*: if $L^{-1}$ has nonpositive off-diagonal entries and nonnegative row sums, $H_K$ is concave; this covers every ultrametric similarity and Laplace kernels on the line.
- **Theorem 4** *(proof with exact certificate)*: (a) every MTI similarity of order at most four has concave entropy; (b) $K_{2,3}(a)$, with $a$ across parts and $a^2$ within, is PD and MTI for $a<1/\sqrt2$ and not concave for $a=12/17$. Five is the least order at which PD and MTI fail to guarantee concavity.
- **Proposition 8, Corollary 9** *(proof)*: on weighted trees one explicit matrix decides concavity in linear time; an equal-edge star with $m$ leaves is concave exactly when $m\le 2(1+a)/(a(1-a))$, whose minimum $6+4\sqrt2$ gives 13 states for the least failing star.
- **Theorem 10** *(proof)*: if $K$ is PSD or MTI, then $H_K(p)\ge\tfrac12\mathbb E H_K(P)$, hence $G\le\tfrac12\log n$. Over PSD similarities, $\sup G$ equals

$$\tfrac12\log n-\log\log n+\log2-1$$

  up to an $o(1)$ term, attained by binary observations; over PD tree similarities with fair binary observations the factor $\tfrac12$ is asymptotically optimal.
- **Theorem 13** *(proof)*: $H_{K\otimes L}(P)\le H_K(p)+H_L(r)$ for every joint law exactly when one factor is the all-ones matrix, or one is a partition with at least two classes and the other entropy is concave.
- **Theorem 14, Corollary 15** *(proof)*: among $\sum_ip_i\phi((Kp)_i)$, only $\phi(x)=b-cx$ with $c\ge0$ is concave for every PD MTI similarity, and order seven suffices to test it; in the Ricotta–Szeidl family only order two is safe, with six-state failures for every other order.
- **Theorem 16** *(proof)*: on a standard Borel space $H_K$ is concave if and only if every finite restriction is.

**Known and new.** The Hessian of $H_K$ is from GAIT; the equivalence of concavity with nonnegative expected information gain, with nonnegative GAIT divergence and with proper tangent scoring is noted by Miller and GAIT; the sign argument behind Corollary 2 is Miller's identity, and ultrametric inverses are Stieltjes matrices by Bavaud; positive definiteness of four-point metric spaces is due to Meckes, and $K_{2,3}$ is the classical five-point space whose similarity matrix becomes singular at $a=1/\sqrt2$ (Leinster, Meckes). New here, within a literature search of limited scope: the vertex test, the exact minimum, the tree test, the quantitative bounds on $G$, the subadditivity and rarity classifications, and the reduction to finite restrictions.

## Technical account

**The vertex test.** Write $F=-H_K$. Its Hessian at $p$, from GAIT, is the quadratic form

$$B_p(v,v)=2\sum_i\frac{v_iw_i}{q_i}-\sum_ip_i\frac{w_i^2}{q_i^2},$$

with $w=Kv$. Positive semidefiniteness on the tangent space of the simplex is equivalent to positive semidefiniteness on all of $\mathbb R^n$. On the reduced matrix, substitute $v=L^{-1}D(q)y$, so that $y$ measures relative changes in the typicalities. Then

$$B_p=y^{\top}\Big(\sum_jp_jT_j\Big)y,$$

which is affine in $p$. It is PSD at every interior law exactly when it is PSD at the vertices. Necessity of positive definiteness comes from a spectral argument on the range of $K$, and strictness from a Cauchy–Schwarz bound by $L\circ L$.

**Four outcomes.** Positive definiteness of four-point metric similarities (Lemma 5) lets the vertex test be written as Schur complements. Every four-point distance is a nonnegative combination of cut semimetrics, so each Schur complement becomes a polynomial in the cut weights. `verify.py` expands all seven such polynomials and checks that every coefficient is positive (Table 1: from 63 to 15,172 terms); `verify_independent.py` repeats the check with a differently normalised matrix. Blocks of zero similarity and identical rows are handled by Lemma 6.

**Five outcomes.** For $K_{2,3}(a)$ the two part averages are $\alpha=(1+a^2)/2$ and $\beta=(1+2a^2)/3$, and the observation that reveals the part changes expected entropy by

$$J=\tfrac12\log\frac{(\alpha+a)(\beta+a)}{4\alpha\beta}.$$

At $a=12/17$ the ratio inside the logarithm is exactly $999949/999364$, so $J\approx 0.00029260$ nats. `check_extensions.py` locates the whole failure interval, from the root $0.673648\ldots$ of an explicit determinant polynomial up to $1/\sqrt2$.

**How large $G$ can be.** A square-moment bound, proved separately under the triangle inequality and under positive semidefiniteness, gives by Jensen's inequality the cross-entropy bound

$$-\sum_iq_i\log(Kv)_i\ge\tfrac12H_K(q)$$

for any laws $q$ and $v$; taking $v=p$ and averaging over the posteriors gives the factor one half. A hub construction, one centre and many mutually unrelated leaves, shows that the PSD bound is sharp up to $o(1)$: its excess is within 0.0059 nats of the expansion at a million leaves. The general upper bound converges slowly (Remark 11).

**Rarity profiles.** Concavity of $\sum_ip_i\phi(q_i)$ for every PD MTI similarity forces $\phi'$ to be constant, which leaves Rao's quadratic entropy among the Ricotta–Szeidl orders. At order three an exact check on the five-state example gives a Jensen gap of exactly $1557/50000000000$, with no logarithms.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/similarity-entropy-concavity.txt) is available for reading.

- **Proofs.** Every theorem has a written proof in the 19-page paper, which opens with a plain introduction (the problem, why concavity matters, what was known, the contributions with credit, and a roadmap) and ends with practical guidance, open problems and an AI-use statement. No proof assistant was used.
- **Exact certificates.** `verify.py` produces the four-outcome polynomial certificate and the five-outcome curvature in exact integers and rationals; `verify_independent.py` gives the second certificate with SymPy polynomials over the integers; `verify_mixing.py` checks the ratio $999949/999364$ and a 2050-outcome tree whose fair observation raises entropy by more than $\log 2$.
- **A usable classifier.** `classify.py` implements Theorem 1 in rational arithmetic for any similarity matrix supplied as JSON; `check_classifier.py` tests it against the star thresholds, the five-outcome example and the order-three check.
- **Extensions.** `check_extensions.py` checks the cut decomposition symbolically, the $K_{2,3}$ failure interval, the star minimum, the sign condition on 60 random ultrametric similarities, a seeded experiment in which 0 of 2000 random five-outcome positive definite MTI similarities fail, and the effective ranges of the asymptotic statements (computed with mpmath at 50 digits).
- **Tests that can fail.** No check uses `assert`, so the scripts behave identically in Python's optimised mode. Changing an expected certificate count, the expected Jensen ratio or the expected order-three gap makes the corresponding script fail.
- **Replay.** Every script was rerun from fresh copies before release under Python 3.12, normally and in optimised mode; every exact output was reproduced byte for byte, and the extensions record was byte-identical. GitHub CI reruns the exact checks on Linux as a blocking job with the three failure tests, and runs `check_extensions.py` and the figure as a separate, non-blocking job, comparing exact values exactly and floating-point values to a relative tolerance of $10^{-9}$.
- **Review.** Five internal Claude reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as two subagents. The lead audited the proofs and replayed every script from a clean copy with negative controls. The revision corrected a reversed sign sentence, proved positive definiteness of four-point similarities before using it, split the minimum theorem into its MTI and positive definite parts, stated the factor one half as asymptotic with effective ranges, credited the known equivalences to Miller and GAIT, recorded the Ricotta–Szeidl correction, replaced `assert` with explicit checks and rebuilt the introduction for non-specialists. A re-review and a proof audit of the changed material found no correctness issue. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The four-outcome step is a computer certificate; failures found are small but the worst case grows like half the log of the number of outcomes; the random experiment is uncertified; the asymptotic statements converge slowly. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Ecologists partitioning similarity-sensitive diversity | Check whether a species similarity matrix can make pooled diversity fall below the average, before interpreting beta-diversity; dendrogram-based similarities are always safe | The test needs an exact similarity matrix; in the Ricotta–Szeidl family only order two (Rao's quadratic entropy) is safe for every such similarity |
| Bayesian experimental design | Know when expected entropy reduction can be negative, and use Bavaud's effective entropy as a concave substitute within a factor two | Failures are usually tiny but can grow with the number of outcomes |
| Machine-learning researchers using GAIT-type divergences | The divergence of a given kernel is nonnegative exactly when the test passes; random searches are weak evidence of concavity | The test is exact for finite matrices; continuous kernels need finite restrictions |
| Research agents | Machine-readable claims, an agent index, exact replayable certificates and a classifier for any matrix | The four-outcome certificate is computational; the random experiment is not a proof |

## Why the problem matters

Entropy-like measures earn their place because they behave predictably: mixing never reduces them and information never increases them on average. Similarity-sensitive entropy was introduced so that diversity and uncertainty could respect resemblance between outcomes, and it is now used to split diversity into within- and between-community parts, to score experiments and to compare distributions. Knowing exactly when it keeps the defining property, and how badly it can lose it, tells users which similarity matrices they can trust and turns scattered counterexamples into a decision procedure.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package's `code/` folder, with CPython 3.12 or later. The first four commands need only the standard library; the others need the pinned packages in `requirements.txt`.

```sh
shasum -a 256 -c ../MANIFEST.sha256   # run from the package root instead
python3 -B -O verify.py
python3 -B -O verify_mixing.py
python3 -B -O check_classifier.py
python3 -B -O classify.py five-state.json
python3 -B -O verify_independent.py
python3 -B -O check_extensions.py --output /tmp/extensions.json
python3 -B figure.py
```

Compare each output with the matching file in `results/`; `check_extensions.py` takes about 75 seconds and ends with `ALL CHECKS PASSED`. To test your own similarity matrix, write it as a JSON list of rows (fractions as strings such as `"7/10"`) and run `classify.py` on it. `ENVIRONMENT.txt` records the software and the comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find a structural proof that four outcomes are always safe, perhaps through the cut decomposition.
2. Decide whether a five-outcome failure requires a violation of the pentagonal inequality, as $K_{2,3}$ has.
3. Find the constant term of the worst case for positive definite MTI similarities and the smallest failing weighted tree.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex`, the PDF and its figure); the classifier, certificate, mixing and extension scripts and the example kernel in `code/`, with their recorded outputs in `results/`; `requirements.txt`; `refs.bib` from Crossref, arXiv and PMLR records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
