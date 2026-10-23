## Summary

**What these methods are for.** Many calculations in physics and applied mathematics produce power series that *diverge*: their terms eventually grow without limit, yet the series still describes a perfectly good function. A large and important class are *Stieltjes series*. They come from functions of the form $f(z)=\int_0^\infty \frac{d\mu(t)}{z+t}$, built from a positive measure $\mu$; such a function is smooth everywhere except along the negative real axis, its *branch cut*. Summation methods turn the divergent series into a sequence of fractions (rational approximations) that converge to $f$. The classical method, Padé approximation, is reliable here partly because of one structural fact: every pole of a standard (diagonal or near-diagonal) Padé approximant lies on the branch cut, where the function itself is singular.

**What was conjectured.** Weniger's *delta transformation* is a newer summation method that is often much faster than Padé approximation on factorially divergent series. In 2026 Riccardo Borghi asked whether it shares the Padé property — whether the denominator of every delta approximant has only negative real zeros, for every Stieltjes series — and described this as a well-grounded conjecture.

**What was found.** The conjecture is false, and the paper says exactly when it holds. The delta transformation has an *order* $k$ and a *shift* $b=n+\beta$ (a starting index $n$ and a parameter $\beta>0$). For every Stieltjes series:

| Order $k$ | Poles guaranteed on the cut? |
|---|---|
| 1, 2 | yes, for every shift |
| 3 | only if $b\le(\sqrt{33}-5)/2\approx0.372$; so the usual choice $n=0$, $\beta=1$ is not safe |
| 4 and above | never: for every shift some Stieltjes series gives poles off the cut |

The stray poles are genuine (they do not cancel against the numerator). For one fixed example they keep appearing: nonreal poles are certified at every order from 3 to 30, and nonreal zeros of the denominator are proved for all large orders.

**Why it matters to users.** The failure is a worst case: the paper also proves that the familiar families — the Euler series, all $\Gamma(\ell+a)$ moments and integer superfactorial moments — keep their poles on the cut at every order and shift. Trouble comes from series of *mixed* character, such as a continuous part plus isolated poles. There, a convergence theory cannot rely on the poles staying on the cut, and real-rootedness should be checked rather than assumed. The paper gives an exact check that anyone can run.

**How sure we are.** Each result carries one of three labels: *proof* (a complete written proof), *certificate* (an exact rational-arithmetic computation) or *numerical* (floating-point illustration only). The headline example is a single cubic polynomial with integer coefficients whose negative discriminant anyone can recompute.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Internal checking was AI-assisted review and AI-assisted adversarial audit, not peer review or independent reproduction.

## Summary for specialists

For a Stieltjes measure $\mu$ on $[0,\infty)$ with infinitely many points of increase and finite moments $\mu_\ell$, the delta denominator of order $k$ is
$$
Q_k(z)=\sum_{j=0}^{k}\frac{h_j}{\mu_{m+j}}\,z^j,\qquad h_j=\binom kj(b+j)_{k-1},\qquad b=n+\beta,\ m=n+1 .
$$
Call $(k;n,\beta)$ *universally safe* if $Q_k$ has only negative real zeros for every admissible $\mu$. Borghi's question (Mathematics 14 (2026) 376, §3.1) and conjecture (§3.3, at $n=0$, shift $1$) concern exactly this property; his $\gamma$ is the paper's $\beta$.

| Result | Status |
|---|---|
| Classification: safe for all shifts at $k=1,2$; at $k=3$ iff $b\le b_c=(\sqrt{33}-5)/2$; never at $k\ge4$ (Theorem 4.1) | proof |
| Realisation lemma: any three consecutive reciprocal-moment coefficients can be isolated by positive measures (Theorem 3.2) | proof |
| The nonreal zeros in the classification are genuine poles (Section 4.3, via accuracy-through-order and a cancellation bound) | proof |
| Explicit examples at $k=3,4$; tail family at $k=5$–$8$ for $n\in\{0,1\}$, $\beta\in\{1/10,1,5\}$ (Table 3) | certificate |
| One explicit measure defeats every shift at $k=4$ for $n=0$ and $n=1$ (Proposition 5.1) | certificate of a polynomial identity in $\beta$ |
| For each fixed $n$, some measure gives genuine nonreal poles at $k=4$ for every $\beta>0$ (Corollary 5.2) | proof |
| Small-scale limit $Q_k(w/k^2)/(b)_{k-1}\to E_\mu(w)$ (Theorem 6.1); by Hurwitz, nonreal zeros of $E_\mu$ force nonreal zeros at all large $k$ (Corollary 6.2) | proof |
| One fixed measure: nonreal denominator zeros for all $k\ge k_0$ (non-effective $k_0$), genuine nonreal poles at every $3\le k\le30$ (Theorem 6.3) | proof plus exact certificate |
| Genuine nonreal poles at every $k\ge3$ for that measure (Conjecture 6.4) | open |
| Positive criteria: real-rooted at every $k$, $n$, $\beta$ if Borghi's $P_k$ is real-rooted, if $(1/\mu_{m+j})$ is a multiplier sequence, or if $\mu_{r-1}\mu_{r+1}\ge4\mu_r^2$ (Theorem 7.2, Corollary 7.3) | proof |
| $Q_k$ real-rooted for every $\beta>0$ iff $P_k$ is real-rooted; a non-integer Jacobi weight gives genuine nonreal poles at $k=4$, $\beta=20$ (Remark 7.4) | proof; certificate |
| Natural families real-rooted in 975 exact Sturm counts at $k=4$–$8$ on a grid of $n$ and $\beta\le5$ | certificate |
| Pole locations, residues and accuracy examples (Section 8) | numerical |

## Technical account

**The counterexample.** Take $d\mu=d\delta_1+50\,d\delta_{1/50}+10^{-3}e^{-t}dt$, so $\mu_\ell=1+50^{1-\ell}+\ell!/1000$, with $n=0$ and $\beta=1$. The order-three denominator is proportional to
$$
\widehat Q(z)=1071932365000z^3+1963236457665z^2+966634623774z+54855937892,
$$
whose discriminant is a negative 47-digit integer, so it has a nonreal pair of zeros. Exact Euclidean division gives $\gcd(\widehat P,\widehat Q)=1$, so the pair are genuine poles of $\delta_3$. Numerically the pair sits at about $-0.8832\pm0.0824i$, close to the cut, alongside real poles at about $-0.0650$ and at the branch point $z=0$.

**The mechanism.** Stieltjes moments are constrained, locally, only by log-convexity. One can therefore choose a measure whose moments are enormous at every index of the window except three consecutive ones. Then $Q_k$ is, up to a negligible error, $z^{j-1}$ times the quadratic $h_{j-1}+h_jz+h_{j+1}z^2$, which has nonreal roots exactly when $h_j^2<4h_{j-1}h_{j+1}$. Conversely, if every ratio $h_j^2/(h_{j-1}h_{j+1})$ is at least 4, the classical Hutchinson–Kurtz factor-four criterion forces real zeros for every measure. For the delta weights the top ratio falls below $10/3$ as soon as $k\ge4$; at $k=3$ one of the two internal ratios is below 4 exactly when $b>b_c$: the relevant quadratic discriminant is a positive multiple of $-(b^2+5b-2)$, whose positive root is $b_c$. Appendix A of the paper gives an independent discriminant proof of the safe side that also covers non-strict log-convex moment quadruples.

**Persistence.** The rescaled denominators $Q_k(w/k^2)/(b)_{k-1}$ converge locally uniformly to the entire function $E_\mu(w)=\sum_j w^j/\bigl(j!\,(b)_j\,\mu_{m+j}\bigr)$. If $E_\mu$ has a nonreal zero, Hurwitz's theorem gives nonreal zeros of $Q_k$ at all large $k$. For the counterexample measure a nonreal zero of $E_\mu$ is detected exactly: the Jensen polynomial $g_6$ has two nonreal zeros by an exact Sturm count. Numerically, the nearest zero of $Q_k$ approaches the branch point $z=0$ at rate $k^{-2}$. The argument does not give $k_0$, and it does not exclude cancellation by the numerator at large $k$, so genuine poles are certified only up to order 30.

**The positive side.** Borghi wrote $Q_k$ as a $(k-1)$-fold derivative of $z^{k-1}P_k(z)$, with $P_k(z)=\sum_j\binom kj z^j/\mu_{n+1+j}$, and noted that real-rootedness of $P_k$ gives real-rootedness of $Q_k$ at his normalisation. Every counterexample here has non-real-rooted $P_k$, the case his argument leaves open. The paper extends his scenario to every $n$, $\beta$ and $k$ through an operator identity and a Rolle-type lemma, and adds multiplier-sequence and factor-four criteria. At $n=0$, $\beta=1$ Borghi had already proved real-rootedness for integer superfactorial, Laguerre and integer-difference Jacobi moments; Corollary 7.3 extends these to every $n$, $\beta$ and $k$ with one proof, and covers $\Gamma(\ell+a)$ moments (via Laguerre polynomials, including the Euler series), Beta weights with integer exponent, and log-normal moments with $\sigma^2\ge2\log2$. In the other direction, letting $\beta\to\infty$ shows that $Q_k$ is real-rooted for every shift exactly when $P_k$ is, so Borghi's scenario (ii) does eventually fail at large shifts: the non-integer Jacobi weight $t^{-1/2}(1-t)^{1/2}$ at $n=0$ has genuine nonreal poles at $k=4$, $\beta=20$.

**What is new, and what is classical.** The factor-four criterion (Hutchinson; Kurtz), Pólya–Schur multiplier sequences, Jensen polynomials and Hankel positivity are classical inputs. The order–shift classification, the realisation lemma, the genuineness proofs, the persistence theorem and its certificate, and the extension of the positive cases to all shifts and orders were not found in the paper's literature check; that check does not establish priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/weniger-delta-nonreal-poles.txt) is available for reading.

- **Proofs.** The classification, realisation lemma, genuineness, limit and persistence theorems and the positive criteria have written proofs. Some steps rest on exact polynomial identities checked by the accompanying code.
- **Exact certificates.** One verifier, `verify_all.py`, uses only Python integers and fractions for every exact claim: the cubic discriminant identity used in the threshold proof (as an identity in $\mathbb Q[b,x,y]$), the weight identities over $\mathbb Q[b]$, the order-three and order-four examples with their gcds, the tail family at orders five to eight, the all-shift identity, Sturm counts and gcds at every order 3 to 30, the Jensen-polynomial certificate and the 975 natural-family counts. Failures raise errors rather than assertions, so the checks stay active under `python -O`. A replay of the frozen release archive into a fresh directory reproduced the shipped `verification.json` byte for byte.
- **Numerical illustrations.** Pole locations, residues, accuracy tables and the scaled-zero trajectory are floating-point computations (mpmath, 60 digits), labelled as such; only nonreal-zero counts and gcd degrees in those sections are exact.
- **Review.** Internal AI-assisted review in several roles, a re-review of the revision and AI-assisted adversarial audits. A rating-free summary of the objections and how they were resolved is in the package. This is not peer review, and the producer-side recomputations are not independent reproduction.
- **Limitations.** Genuine nonreal poles beyond order 30 for the fixed measure are conjectural, and $k_0$ is not effective. The explicit all-shift measure at order four is certified for $n=0$ and $n=1$ only (Corollary 5.2 covers every $n$ by a non-explicit measure). The Weniger–Čížek $K_\nu$ family was tested, not decided. Hutchinson and Kurtz are cited without theorem-level locators. No proof assistant was used; Python execution is in the trust boundary. Nothing here says that the delta transformation fails to converge.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Users of sequence transformations for divergent series | Do not assume that delta approximants of order three or more keep their poles on the cut; check real-rootedness exactly for the data at hand | The failure is a worst case over measures; the common moment families are proved safe; large shifts are no protection when Borghi's $P_k$ is not real-rooted |
| Researchers on convergence of Levin-type transformations | A complete finite-order classification, a persistence mechanism and positive criteria to build a convergence theory on | Genuine poles beyond order 30 and the Laguerre–Pólya characterisation of $E_\mu$ remain open |
| Readers of Borghi (2026) | A precise account of where the conjecture fails — always in his scenario (ii) — and an extension of his positive cases | The refutation is of the conjecture as posed, for every Stieltjes series |
| Research agents and exact-computation users | A small standard-library verifier with deterministic output and labelled numerical side sections | Byte identity shows integrity, not that the code encodes the mathematics; check the written reductions |

## Why the problem matters

Convergence proofs for Padé approximants to Stieltjes series rest on the fact that their denominators are orthogonal polynomials, so every pole is simple, lies on the cut and has a positive residue. Faster Levin-type methods such as the delta transformation have no such structure, and whether their poles also stay on the cut is the natural first question for any convergence theory. This release answers that question completely at every fixed order, shows that the answer turns on a classical coefficient test, and separates the worst case from the well-behaved families that practitioners usually meet.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3 (exact sections need only the standard library; the numerical sections need mpmath):

```sh
python3 -B -O code/verify_all.py OUTDIR   # all exact certificates and numerical illustrations, a few minutes
python3 -B -O negative_controls.py        # the checks reject corrupted claims and data
shasum -a 256 -c SHA256SUMS
```

Compare `OUTDIR/verification.json` with `results/verification.json`. To check the headline by hand, compute the discriminant of the cubic $\widehat Q$ above (it is negative) and the gcd of $\widehat P$ and $\widehat Q$. To test your own data, use the exact Sturm counter `real_root_count` in `code/verify_all.py`. `AI_INDEX.md` maps every theorem to its evidence.

## The most valuable next projects

1. Recompute the order-three counterexample and the order 3 to 30 certificates in independent exact software.
2. Prove Conjecture 6.4: genuine nonreal poles at every order for the fixed measure, including non-cancellation at large orders.
3. Characterise the measures for which $E_\mu$ lies in the Laguerre–Pólya class, and decide whether this is sufficient for real-rootedness at all large orders.
4. Decide the Weniger–Čížek $K_\nu$ family, and treat other Levin-type weights such as Levin's $t$ and $u$ transformations.

## What is in the evidence package

The manuscript (PDF and LaTeX source, with the pole figure), the single verifier `verify_all.py` and its deterministic output `verification.json`, semantic negative controls, a rating-free review summary, claim, status, assurance and provenance records, an agent index, licences (CC0-1.0 for text and data, MIT for code) and SHA-256 manifests. The same files are in the GitHub release and the Zenodo record.
