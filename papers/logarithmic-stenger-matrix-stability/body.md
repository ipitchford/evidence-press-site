## Summary

**What an integration matrix is.** Many numerical methods never integrate a function directly. They sample it at $n$ chosen points, fit the polynomial through those samples and integrate the polynomial instead. The result, read off at the same points, is a matrix times the vector of samples. That matrix is an *integration matrix*. It sits inside spectral solvers for differential equations, Frank Stenger's Sinc methods for convolutions, and the collocation Runge–Kutta methods used for stiff time stepping.

**Why the signs of its eigenvalues matter.** These methods work only if every eigenvalue of the matrix has a positive real part. For example, a convolution method evaluates a Laplace transform at $1/\lambda$ for each eigenvalue $\lambda$, and a linear solve becomes singular when a decaying test problem meets an eigenvalue with negative real part. A matrix with this property is called *positive stable*.

**What was conjectured.** Stenger conjectured that integration matrices are always positive stable when the points are the nodes of Gaussian quadrature. In 2019 Walter Gautschi and Ernst Hairer tested this for many weight functions. They found that it can fail, and they stated five more precise conjectures (5.1–5.5) about exactly when it holds. Two of them concern the weight $x^\alpha[\log(1/x)]^m$ on $(0,1)$, which is used for integrands with a logarithmic singularity.

**What was found.** For that logarithmic weight there are two matrices: $U_n$ integrates from $0$ and $V_n$ integrates to $1$.

- **Forward ($U_n$).** It is positive stable at every size exactly when $\alpha \le 1$. For any $\alpha > 1$ it eventually fails, and the number of bad eigenvalues grows without limit.
- **Reverse ($V_n$).** For $m > 1$ it eventually fails. For $m \le 1$ it is positive stable at every size when $\alpha \ge m/2 - 1$. Gautschi and Hairer conjectured that at $m=1$ it is positive stable for *every* $\alpha > -1$. An exact calculation shows that at $\alpha=-9/10$ the $13\times13$ matrix $V_{13}$ has two eigenvalues with negative real part. That disproves this clause of their Conjecture 5.3 as worded.
- **Why the number one.** After rescaling, the small eigenvalues approach the zeros of a classical special function, a Kummer function. Its zeros move into the unstable half-plane exactly when the exponent passes one. The same idea answers the first-threshold questions in Conjectures 5.1, 5.2 and 5.5 for Jacobi and Laguerre weights: the range in 5.2 is sharp, the first thresholds in 5.1 and 5.5 exceed one, are finite from degree five on and tend to one, and so the uniform reading of 5.5 is false.

**Why it matters to users.** The paper gives a simple rule of thumb. Forward integration is positive stable at every degree for $\alpha \le 1$, which includes the common Gauss–log nodes $(\alpha,m)=(0,1)$. Avoid $\alpha > 1$ forward and $m > 1$ reverse. At $m = 1$, reverse integration is positive stable for $\alpha \ge -1/2$; below $-1/2$, exact counterexamples occur for several tested exponents, and the classification at every degree remains a conjecture. The counterexample itself is tiny in practice: its spurious growth over unit time is about $e^{0.003}$.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Every theorem has a written proof, and every stated eigenvalue count is proved by exact rational arithmetic that can be rerun. There has been no external peer review or independent reproduction. Whether $\alpha=-1/2$ is the exact reverse boundary at $m=1$ remains an open conjecture.

## Summary for specialists

Let $p_n$ be the monic orthogonal polynomial for $w_{\alpha,m}(x)=x^\alpha[\log(1/x)]^m$ on $(0,1)$, $\alpha>-1$, $m>0$, with zeros $x_1<\dots<x_n$ and cardinal polynomials $\ell_j$. The *restricted* Stenger matrices of Gautschi and Hairer are
$$
(U_n)_{ij}=\int_0^{x_i}\ell_j(t)\,dt,\qquad (V_n)_{ij}=\int_{x_i}^1\ell_j(t)\,dt .
$$
The weight fixes the nodes; the integrals themselves are unweighted. Put $F_\gamma(z)={}_1F_1(1;\gamma+1;-z)$.

| Result | Status |
|---|---|
| Endpoint limits: $Q_n^U(z/n^2)\to F_\alpha(z)$ and $Q_n^V(z/n^2)\to F_m(z)$ locally uniformly, where $Q_n^U,Q_n^V$ are the normalised characteristic polynomials; each limit zero $\zeta$ attracts an eigenvalue with $n^2\lambda_n\to\zeta$ (Theorem 2.1) | proof |
| $U_n$ is positive stable for every $n$ iff $-1<\alpha\le1$ (any $m>0$); for $\alpha>1$ the unstable count tends to infinity; the first threshold satisfies $\theta_n(m)>1$ and $\theta_n(m)\to1$ (Theorem 2.2, Corollary 2.3) | proof |
| $V_n$: for $m>1$ the unstable count tends to infinity for every $\alpha>-1$; for $0<m\le1$ and $\alpha\ge m/2-1$, stable at every $n$ (Theorem 2.4(i)–(ii)) | proof |
| $V_{13}$ at $m=1$, $\alpha=-9/10$ has exactly two eigenvalues in $\{\operatorname{Re}\lambda<0\}$ and none on the axis (Theorem 2.4(iii)) | exact certificate |
| Jacobi $y^a(1-y)^b$ and Laguerre $x^ae^{-x}$: all-degree boundary $a\le1$, unstable counts diverge for $a>1$ (Theorem 6.1). Conjecture 5.2: positive stable at every degree iff $\beta\le1$ (sharp). Conjecture 5.1 (Jacobi-exponent reading): first thresholds $>1$, finite for every $n\ge5$, $\to1$; whether the fixed-degree stable set is an interval is not decided. Conjecture 5.5: thresholds $>1$, finite for $n\ge5$, $\to1$, so its uniform reading is false (Corollary 6.2) | proof |
| Sections of the exponential series: for every $n\ge5$, $E_n(w)=\sum_{j\le n}w^j/j!$ has a zero with $\operatorname{Re}w>0$ (Lemma 6.3; possibly classical, no priority claimed) | proof |
| Symmetric Jacobi, $n=5$: $U_5$ positive stable iff $a<9$ (Proposition 6.4) | proof with exact polynomial identity |
| Collocation Runge–Kutta methods with these nodes are not A-stable for large $n$ when $\alpha>1$, $m\ge1$ (Corollary 2.5) | proof |
| Reverse onset degrees at $m=1$: first unstable $n=13,15,17,22$ for $\alpha=-9/10,-4/5,-7/10,-3/5$; none to $n=30$ at $-11/20$ (Table 5) | exact instances |
| At $m=1$, $V_n$ is stable for every $n$ iff $\alpha\ge-1/2$ (Conjecture 7.1) | open |
| Growth $\operatorname{Re}(1/\lambda_n)=n^2\{\operatorname{Re}(1/\zeta)+o(1)\}$ (Corollary 5.2) | proof; tabulated values numerical |

For the clause-by-clause verdicts on Conjectures 5.1–5.5, both under the *uniform* reading (one threshold for all $n$) and the *degree-dependent* reading of Gautschi and Hairer's tables, see Table 1 of the paper.

## Technical account

**An exact identity.** Integration followed by reduction modulo $p_n$ is a companion matrix in a scaled monomial basis. This gives $\det(\lambda I-U_n)=\tfrac{p_n(0)}{n!}Q_n^U(\lambda)$ with $Q_n^U(\lambda)=\sum_k p_n^{(k)}(0)\lambda^k/p_n(0)$, and the mirror identity for $V_n$ at $x=1$. This recovers Proposition 6.1 of Ait-Haddou and Alselami (2023).

**The stable side.** If $Q_n^U(\lambda)=0$, the polynomial $f=\sum_k\lambda^kp_n^{(k)}$ vanishes at $0$ and satisfies $f-\lambda f'=p_n$. Gaussian quadrature applied to an auxiliary weight $r=(1-x)w/x$ turns this into an energy identity for $\operatorname{Re}(1/\lambda)$. Its sign is fixed when $r'<0$, which holds exactly for $\alpha\le1$. The same mechanism goes back to Csordas, Charalambides and Waleffe (2005) and Charalambides (2010). Ait-Haddou and Alselami's Theorem 5.1 already covers $-1<\alpha\le0$; the new positive range here is $0<\alpha\le1$.

**The unstable side.** The coefficients of $Q_n^U(z/n^2)$ are symmetric functions of $1/(n^2x_j)$, so they depend only on the smallest nodes. Markov's comparison theorem squeezes those nodes between the nodes of two Jacobi weights, whose coefficients are explicit. The limit is $F_\alpha$. At the right endpoint the factor $\log(1/x)^m$ degenerates, and a separate inverse-Christoffel transfer (Lemma 4.2) gives the limit $F_m$. For $\gamma>1$, $F_\gamma$ has infinitely many zeros, all in the open left half-plane (Lemma 5.1), and Rouché's theorem transfers them to eigenvalues.

**Why exponent one is a knife edge.** $F_1(z)=(1-e^{-z})/z$, whose nonzero zeros $2\pi ik$ lie on the imaginary axis. The leading-order limit therefore cannot decide stability at exponent one. The reverse matrices at $m=1$ sit exactly there, which is why their behaviour depends on $\alpha$ at finite degree, and why the counterexample needed exact finite-degree arithmetic.

**The certificate.** For $m=1$ and rational $\alpha$ the moments are rational: $\mu_j=1/(\alpha+j+1)^2$. The coefficients of $p_{13}$ solve a $13\times13$ rational linear system. Their numerators and denominators have up to 321 digits. They give a rational matrix similar to $V_{13}$ without computing any nodes. The Routh array of $Q_{13}^V(-s)$ has all pivots nonzero and signs $(+^{12},-,+)$: two sign changes, so exactly two eigenvalues with negative real part. Numerically, $13^2\lambda\approx-0.000557\pm5.4985i$ and $\operatorname{Re}(1/\lambda)\approx-0.0031$, with eigenvalue condition number about $1.13$.

**What is new, and what is classical.** The characteristic identity, the forward stable side for $\alpha\le0$ and the Jacobi stable side are known (Ait-Haddou and Alselami 2023). Hard-edge scaling at $n^{-2}$ is classical Mehler–Heine territory. What is new here is the instability side for the logarithmic weight, the sharp boundaries, the Kummer-limit explanation of every threshold Gautschi and Hairer observed, the reverse counterexample and the Jacobi/Laguerre threshold answers. The dated literature search found no earlier proof of these spectral statements. That search does not establish priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/logarithmic-stenger-matrix-stability.txt) is available for reading.

- **Proofs.** Every result labelled a theorem, corollary, lemma or proposition has a written proof in the paper.
- **Exact computations.** "Exact" means rational arithmetic with every Routh pivot checked nonzero; it proves the stated count for that one matrix. This covers the $V_{13}$ certificate, every count in Tables 3, 5 and 8, the degree-five Hurwitz identities (checked at 26 rational points, more than the degree requires), the exponential-section Hurwitz minors, Gautschi and Hairer's Table 1 at $\alpha_n+0.001$ (two unstable eigenvalues at all eight degrees) and $\alpha=6/5$, $m=1,2$, $n=1,\dots,30$ (none unstable).
- **Numerical illustrations.** Kummer zeros, growth-law values, the eigenvalue figure and the extended-matrix remark use 60-digit mpmath arithmetic. They are illustrations only; each numerical count was cross-checked against the exact count.
- **Replay.** One verifier, `code/verify_all.py`, replays every exact count, identity and table and writes a deterministic JSON report. A clean replay of the final package in a separate copy reproduced the shipped report byte for byte.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review by a different model (OpenAI gpt-5.6-sol), an adversarial audit of the revision (Claude Opus 5.5) with separately written exact recomputations, a verification re-review, and a further AI-assisted adversarial mathematical audit (OpenAI gpt-6-astra via Codex, 22 October 2026). That audit found no critical or major defect in the central theorems; its six minor findings (two incorrect displayed or local formulas, narrative qualifications and the scope of the replay promise) were fixed, and its suggested strengthening became Lemma 6.3, which removed an earlier restriction to $n\le60$. A rating-free summary of the objections and responses is in the package. This is not peer review, and the recomputations are not independent reproduction.
- **Limitations.** Results are for fixed parameters as $n\to\infty$; there are no uniform onset degrees near $\alpha=1$ or $m=1$, and no complete reverse classification for $0<m\le1$. The reverse boundary $\alpha=-1/2$ at $m=1$ (Conjecture 7.1), monotonicity of the thresholds and interval structure of the fixed-degree stable sets are open. Nothing here applies to the *extended* matrices, which put the weight inside the integrals. The counterexample refutes the clause "for all $\alpha>-1$"; Gautschi and Hairer's own tested values all lie in the proved stable range.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Users of Sinc, spectral-integration and collocation methods with logarithmic nodes | A clear positive-stability range at every degree: forward for $\alpha\le1$, reverse for $m\le1$ with $\alpha\ge m/2-1$ | Results are asymptotic in $n$ for fixed parameters; onset can be beyond $n=30$ just above $\alpha=1$ |
| Researchers on orthogonal polynomials and the Stenger conjectures | Kummer endpoint limits explain every observed threshold; a certified reverse counterexample; Jacobi and Laguerre threshold answers | The reverse boundary at $m=1$ and threshold monotonicity remain open |
| Numerical analysts working on A-stability | Collocation methods on these nodes lose A-stability for large $n$ when $\alpha>1$, $m\ge1$ | No positive A-stability claim is made; $0<m<1$ is not covered |
| Research agents and reproducibility researchers | A single deterministic verifier with exact Routh certificates and labelled numerical sections | Byte identity shows integrity, not that the code encodes the mathematics; check the written reductions |

## Why the problem matters

Stenger's conjecture is a natural question about a tool many methods share. If it held, any Gaussian-node integration matrix could be dropped into a convolution or time-stepping scheme without checking its spectrum. Gautschi and Hairer showed by computation that this is too optimistic and posed sharper conjectures. This work turns most of their observations into theorems, explains why every threshold they tabulated tends to one, and gives the first exact counterexample to a stated clause. It also shows a practical consequence: some collocation Runge–Kutta methods built on such nodes are not A-stable.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.10 or later and mpmath:

```sh
shasum -a 256 -c SHA256SUMS
python3 -B -O code/verify_exact.py   # the V_13 and U_11 certificates, standard library
python3 -B -O code/verify_all.py     # every exact count, identity and table (several minutes)
```

`verify_all.py` writes `results/verify_all.json` with sorted keys, no timestamps and no absolute paths, so repeated runs are byte-identical. No check uses `assert`, so `-O` removes nothing. Start reading with Section 1.1 of the paper (the plain-language overview) and Table 1 (clause-by-clause status); `AI_INDEX.md` maps every result to its evidence.

## The most valuable next projects

1. Prove Conjecture 7.1: at $m=1$, $V_n$ is eventually unstable for every $-1<\alpha<-1/2$. This needs the next term beyond the limit $F_1$, whose zeros are imaginary.
2. Decide whether the thresholds $\theta_n$, $\theta_n^J$, $\theta_n^L$ are monotone in $n$ and whether the fixed-degree stable sets are intervals, as Gautschi and Hairer observed.
3. Give explicit onset degrees or convergence rates for the endpoint limits.
4. Extend the endpoint limits to weights $x^a\ell(x)$ with $\ell$ slowly varying.
5. Treat the extended (weighted-integral) Stenger matrices.

## What is in the evidence package

The manuscript (PDF and LaTeX source with its generated tables and figure), the exact certificates for $V_{13}$ ($\alpha=-9/10$, $m=1$) and $U_{11}$ ($\alpha=3/2$, $m=1$), the single verifier and its deterministic JSON report, the original certificate verifier, a rating-free review summary, claim, status, assurance and provenance records, the dated prior-art record, an agent index, licences (CC0-1.0 for prose and data, MIT for code) and a SHA-256 manifest. The same files are in the GitHub release and the Zenodo record.
