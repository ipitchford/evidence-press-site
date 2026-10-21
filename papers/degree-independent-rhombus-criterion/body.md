## Summary

This page explains, in order: what real stability and rhombus inequalities are, what Brändén proved and what the AIM problem asks, what this release claims in three variables, why the higher-dimensional question has no single answer, and what has and has not been checked.

**The objects.** A polynomial in several variables is *real-stable* if it never vanishes when every variable is given a positive imaginary part. Real-stable polynomials connect complex zero geometry to combinatorics, probability and discrete convexity. For a homogeneous polynomial in three variables $x,y,z$, the coefficients can be laid out in a triangular array, one entry for each monomial $x^{\alpha_1}y^{\alpha_2}z^{\alpha_3}$ of the given degree. Four neighbouring entries form a small *rhombus*, and a *rhombus inequality* says that the product of the two coefficients at the obtuse corners is at least a fixed factor times the product at the acute corners.

**The question.** Petter Brändén proved in 2010 that a positive ternary homogeneous polynomial of degree $d$ is real-stable if every rhombus quotient is at least $2(d-1)$. That sufficient factor grows with the degree. AIM Problem 1.1 on total positivity asks whether the factor can be replaced by an absolute constant, and then asks what happens in more than three variables.

**What is claimed.** This anonymous, unrefereed candidate argues that the fixed factor $3$ works in every degree. It also shows why the higher-dimensional part of the problem cannot be answered by simply reusing the same words: three natural extensions lead to three different boundaries.

- *Coordinate faces only:* imposing the rhombus inequalities on every three-coordinate face is not enough in four or more variables, however large the factor.
- *A strict uniform exchange margin:* one precisely defined strengthening is impossible to satisfy at all on positive full-support quadratics.
- *Normalized $M$-concavity:* this meaningful formulation fails from seven variables onward, by a limit argument built on a known obstruction from the Fano matroid, and remains open in four, five and six variables.

**Status.** An anonymous, unrefereed candidate prepared with AI assistance. The universal claims rest on the written 12-page paper; the programs replay identities, exact instances and bounded searches. There has been no independent reproduction, formal verification, external specialist review or peer review, and the constant $3$ is not claimed to be optimal.

## Summary for specialists

Let

$$
P(x,y,z)=\sum_{\alpha_1+\alpha_2+\alpha_3=d} a_\alpha
x^{\alpha_1}y^{\alpha_2}z^{\alpha_3}, \qquad a_\alpha>0.
$$

For distinct $i,j,k$ and $\eta\in\Delta_{d-2}^m$, the coordinate-face rhombus quotient is $Q_{\eta;i,j\mid k}=a_{\eta+e_i+e_k}a_{\eta+e_j+e_k}/(a_{\eta+2e_k}a_{\eta+e_i+e_j})$; for $m=3$ these are the three orientations of the elementary hive rhombi, with Brändén's numerator and denominator orientation (Brändén 2010, Figure 2 and Theorem 14).

| Claim unit | Conclusion | Evidence status |
|---|---|---|
| Ternary degree dependence (Theorem 1) | If every elementary hive-rhombus quotient is at least $3$, then $P$ is real-stable; the constant is independent of $d$ and not claimed optimal | Candidate universal proof; producer replay and internal controls passed |
| Coordinate-face extension (Theorem 2) | For every $m\ge4$ and every $q>0$ there is a positive homogeneous quadratic with all coordinate-face quotients at least $q$ that is not real-stable | Explicit symbolic quadratic family |
| Uniform one-exchange margin (Proposition 6) | The stated global symmetrised multiplicative axiom is inconsistent on positive full-support quadratics for $m\ge4$ and $q>1$ | Formal quantifiers plus three-pairing maximum argument |
| Normalized $M$-concavity | Fails to force stability for every $m\ge7$ via finite positive families converging to the Fano obstruction; $m=4,5,6$ unresolved here | Prior-art obstruction plus closure argument; bounded search is non-probative |
| Historical novelty | No matching result found in the recorded search | Bounded uncertainty; not a priority claim |

The three higher-dimensional formulations do not exhaust every possible quantitative stability condition: the release is a taxonomy of failures for three specified extensions, not a theorem excluding every higher-dimensional criterion.

## Technical account

**Normalization by a quadratic baseline.** Fix $q>1$ and write $h(\alpha)=\log_q a_\alpha$, $h_0(\alpha)=-\sum_i\binom{\alpha_i}{2}$ and $g=h-h_0$. Across each elementary rhombus the obtuse sum of $h_0$ exceeds the acute sum by exactly one, so the condition $Q\ge q$ is equivalent to the ordinary hive inequalities for $g$. The residual hive extends to a concave function on the simplex.

**Parity pairing without a degree-sized loss.** To compare neighbouring coefficient rows $A_{k-1},A_k,A_{k+1}$ of the univariate slice $P(1,1,z)$, the products in $A_{k-1}A_{k+1}$ are separated by the parity of two indices. In the even class the midpoint is a lattice point and the penalty exponent is $R_t=2(t^2-t+1)$; in the odd class the midpoint lies on an elementary edge and the exponent is $S_t=2t^2+1$. Each parity class has an injective midpoint parametrization, so no multiplicity factor that grows with the degree is introduced. The penalties form two convergent theta-type sums,

$$
C_0(q)=\sum_{t\in\mathbb Z}q^{-2(t^2-t+1)},\qquad
C_1(q)=\sum_{t\in\mathbb Z}q^{-(2t^2+1)},
$$

and at $q=3$ their elementary geometric majorants fit strictly under the coefficients in one quarter of a square:

$$
C_0(3)<\frac14, \qquad C_1(3)<\frac{5}{12}<\frac12.
$$

This yields Hutchinson's strict coefficient inequality $A_k^2>4A_{k-1}A_{k+1}$ for every interior row, so each slice has only real negative zeros. The method works for any $q>1$ with $C_0(q)\le1/4$ and $C_1(q)\le1/2$; no claim is made that this implicit threshold is sharp.

**From slices to stability.** Positive rescaling of a variable leaves every rhombus quotient unchanged, which gives real-rootedness of the three interior one-variable families. On boundary edges, concavity gives $c_r^2/(c_{r-1}c_{r+1})\ge q^2\ge9>4$, so Hutchinson's criterion handles the boundary families too. Brändén's published slice-and-boundary lemma (Brändén 2010, Lemma 13) then converts these real-rootedness statements into ternary real stability. The load-bearing chain is

$$
Q\ge q\ \Rightarrow\ g\ \text{is a hive}\ \Rightarrow\ \text{midpoint bounds}\ \Rightarrow\ \text{theta-sum bound}\ \Rightarrow\ \text{slice log-concavity}\ \Rightarrow\ \text{real stability}.
$$

**The higher-dimensional mechanisms.**

- *Coordinate faces.* With $\varepsilon=\tfrac14$ and $\delta=1/(16q)$, the quadratic $P_m=\delta\sum_i x_i^2+\sum_{i<j}b_{ij}x_ix_j$ with $b_{12}=b_{34}=1$, $b_{13}=b_{14}=b_{23}=b_{24}=\varepsilon$ (and $b_{ij}=1$ when an index is at least $5$) has every coordinate-face quotient at least $\varepsilon^2/\delta=q$. Its four-variable restriction has a small eigenvalue $\delta+\tfrac14$ on $v=(1,1,-1,-1)$, which produces an explicit zero with all coordinates in the upper half-plane. Coordinate-face control misses genuinely four-coordinate interactions.
- *Uniform strict exchange.* For four distinct indices, the three pairings $X=a_{12}a_{34}$, $Y=a_{13}a_{24}$, $Z=a_{14}a_{23}$ would each have to be beaten by a factor $q>1$ by one of the others; whichever is largest cannot be. The proposition rules out this global one-exchange axiom only, not additive margins, support-dependent factors or other quantitative versions of $M$-concavity.
- *Normalized $M$-concavity.* Using the Fano matroid's bases (with added loops) and Brändén's distance lemma, the family $a_\alpha(s)=q^{h_0(\alpha)+s\,d_{J_m}(\alpha)}$ satisfies the normalized condition for every $s>0$ and converges coefficientwise to the Fano basis-generating polynomial, which is not real-stable (Brändén 2007). Multivariate Hurwitz then forces nonstability for all large $s$, for every $m\ge7$. The Fano obstruction is prior work; the release's scoped step is the finite-positive family and limit corollary.

## What was checked and replayed

The release package performs deterministic producer-side checks rather than claiming that finite computation proves the universal theorem.

- Python in normal and optimized modes replays the midpoint identities, theta bounds, exact rational counterexample instances, Fano distance checks and semantic mutations (a reversed rhombus orientation, a changed parity penalty, a changed $\delta$, a changed block witness and a shifted index). The release run uses maximum degree $80$ and maximum variable count $20$.
- C++ exactly enumerates 880 declared $M$-convex supports in $\Delta_3^4$ before running a bounded long-double grid scan. `NO WITNESS` from that scan is explicitly non-probative.
- Digest-pinned, network-disabled containers rebuild the 12-page PDF and reproduce exact fresh Python, PDF and architecture-specific C++ bytes.
- Concordance checks bind load-bearing statements across TeX, Markdown, DOCX and PDF. Inventory tests reject an extra file, a corrupted byte, an altered receipt and an altered generated artifact.
- Public GitHub Actions replayed the frozen commit successfully, and the ZIP, PDF and checksum sidecar downloaded from GitHub and Zenodo match local bytes.

## Evidence, assurance and limitations

The written manuscript is the evidence for the universal mathematical claims. The finite programs audit identities, indexing, representative exact instances and bounded searches. They do not replace the proof, and they do not computationally verify the cited analytic theorems.

The supplied review was actioned point by point. A producer-coordinated five-role review and bounded confirmation reached `PASS_WITH_NOTES`. Those are internal editorial records, not authenticated unaffiliated specialist review. Public availability, deterministic replay, independent rerun, independent reimplementation, formal verification, specialist review, editorial peer review, novelty and priority remain distinct assurance dimensions.

**Limitations and what remains open.**

- The normalized $M$-concavity cases with four, five and six variables remain open.
- The constant $3$ is sufficient in the candidate proof but is not claimed optimal.
- The three higher-dimensional formulations do not exhaust every possible quantitative stability condition.
- The Fano non-stability obstruction is prior work; the release's scoped step is the finite-positive family and limit corollary.
- The paper does not identify the coefficients with a probability measure, so it derives no strongly Rayleigh, negative-dependence or sampling consequences; those would need additional hypotheses.
- No authenticated unaffiliated reconstruction, proof-assistant formalization, external specialist review, journal peer review or historical-priority adjudication is attached.
- A bounded novelty search cannot establish that the result is new or first. It did not include an exhaustive MathSciNet or zbMATH audit, non-English formula search, author inquiry or external specialist report.

## Who should care, and why

The release is aimed at researchers in stable and Lorentzian polynomials, matroid half-plane properties, hives, tropical and discrete convexity, and negative-dependence theory. It may also be useful to reviewers interested in a compact example of how one ambiguous higher-dimensional question can be split into separately falsifiable formulations.

| Reader | Potential use | Principal caution |
|---|---|---|
| Stable- and Lorentzian-polynomial researchers | A degree-free local criterion for ternary stability and a short dependency chain to audit | Candidate proof only; the constant is not claimed optimal |
| Discrete-convexity and matroid researchers | A precise comparison of three higher-dimensional rhombus readings, with the open cases $m=4,5,6$ handed off | The Fano obstruction is prior work |
| Probability and negative-dependence readers | A stability criterion that may feed later applications | No probability-measure or strongly Rayleigh consequence is derived here |
| Reviewers and verification practitioners | A named, ordered list of steps to challenge, and digest-pinned replay | Replay checks identities and instances, not the universal proof |

## Why the problem matters

A degree-independent local criterion would turn a growing global stability test into a uniform family of small coefficient comparisons. That is the content of the ternary claim: the factor needed no longer depends on how large the polynomial's degree is.

The dimensional boundary matters just as much. "Rhombus log-concavity" has a canonical triangular meaning in three variables, but no single automatic meaning in higher dimension. A useful answer must state which extension is being tested before claiming either success or impossibility. Modern Lorentzian-polynomial theory places homogeneous real-stable polynomials inside a broader class governed by $M$-convexity, and $M$-concavity by itself does not supply stability; the higher-dimensional results make that distinction concrete for three specific readings.

## How to inspect or reproduce the recorded checks

Start with the PDF for the complete arguments; the reviewer-oriented dependency map in the paper lists the steps to check in order (the rhombus orientation, the two penalty identities, the counting behind the theta-sum bound, the use of Hutchinson's criterion, and the hypotheses of Brändén's Lemma 13). In the archive, `SOURCE_BRIDGE.md` maps every imported theorem to its exact use, `CLAIMS.json` separates the five claim types, and `OPEN_PROBLEMS.md` gives an executable handoff for the unresolved normalized dimensions.

Docker with the platform images listed in `ENVIRONMENT.txt` is required. From the repository root:

```sh
./run_all.sh /tmp/rhombus-replay
```

The script pulls immutable images first, then builds and replays with networking disabled, a read-only repository mount and a read-only container root, and checks the stored receipts. The GitHub Actions run linked in the assurance panel is the public clean-checkout replay. `MANIFEST.sha256` is the complete 59-file package inventory, while the release-level `SHA256SUMS` binds the downloadable ZIP and PDF.

## The most valuable next projects

1. **Independent reconstruction.** An unaffiliated reconstruction of the parity pairing and stability bridge is the first mathematical priority.
2. **The open dimensions.** Attack the normalized $m=4,5,6$ cases through the support enumeration and coefficient-search interfaces in `OPEN_PROBLEMS.md`; the smallest searched but unsettled case is $(m,d)=(4,3)$.
3. **Formalization.** A proof-assistant development should separate the elementary theta estimates from the imported stability-preserving steps, making the source bridge mechanically explicit.

## What is in the evidence package

- **Paper:** the canonical 12-page PDF contains the complete proofs and bibliography, with TeX source and Markdown and DOCX access derivatives.
- **Archive:** the ZIP contains source, accessible derivatives, structured claims, source maps, review records, verification programs, receipts, licenses and the complete manifest.
- **Repository:** the annotated tag fixes the reviewed source and public CI workflow.
- **Zenodo:** the version DOI archives the same ZIP, PDF and checksum sidecar.
- **Licensing:** original prose and data are CC0-1.0; original code, tests and workflows are MIT; third-party works are cited but not redistributed.
