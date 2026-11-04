## Summary

**In one sentence.** For the complex weight $(1-t^2)^\alpha e^{\mathrm{i}xt}$ on $[-1,1]$, every even-size Hankel determinant is strictly positive, for every exponent $\alpha>-1$ and every real frequency $x$. So the even-degree orthogonal polynomials used to build quadrature rules for oscillatory integrals always exist.

**Prior claim (please read).** A ResearchGate preprint by J. M. Ashfaque, dated 24 July 2026 ([researchgate.net/publication/410769119](https://www.researchgate.net/publication/410769119)), claims that the Lyu–Zhou recurrence formulas follow from a discrete Painlevé IV identification. That is an earlier public claim on the two conjectures proved in Section 7 of this paper. Its rewriting of the Lyu–Zhou difference equations is correct. Its key determinant formula (Proposition 3.1) fails as printed, at odd and even sizes, and no constant index shift or phase repairs it, though the difference formula in its proof is correct with the standard last-column shift. It gives no construction or degree computation for the Lyu–Zhou polynomials, so it does not prove the conjectures. This release claims the first complete proofs *known to us* of Lyu–Zhou Conjectures 2.5 and 2.7, not the first claim. The preprint does not state the positivity theorem or the 2008 degree results.

**The problem, in plain terms.** Integrals of rapidly oscillating functions, such as $\int_{-1}^1 f(t)\,e^{\mathrm{i}xt}\,dt$ for large $x$, defeat ordinary numerical rules: the number of points needed grows with the frequency. One family of remedies (complex Gaussian quadrature and numerical steepest descent) moves the work into the complex plane and builds a Gaussian-type rule from polynomials that are "orthogonal" with respect to the oscillatory weight itself. Because that weight is complex rather than positive, the usual guarantee that such polynomials exist is lost. A polynomial of degree $N$ exists exactly when an $N\times N$ determinant of moments, the Hankel determinant $D_N^{(\alpha)}(x)$, is not zero. So the existence question is a question about where these determinants vanish.

**What was known.** Celsus, Deaño, Huybrechs and Iserles (2022) proved that, for the flat weight ($\alpha=0$), the even-size determinants never vanish at any real frequency. Milovanović, Cvetković and Marjanović (2008) proved existence at all degrees, but only at special frequencies (zeros of a Bessel function) and for rational parameters, and they conjectured degree formulas for the associated polynomial determinants. In 2026 Lyu and Zhou kept those restrictions and conjectured explicit formulas for the recurrence coefficients.

**What is proved.** Every even-size determinant is strictly positive for every $\alpha>-1$ and every real $x$. Every complex zero of every determinant is simple. Odd sizes behave differently: every odd-size determinant has infinitely many real zeros, so the odd-degree polynomials really do fail to exist at infinitely many frequencies. The same tools prove the 2008 degree formulas and give complete proofs of the Lyu–Zhou recurrence formulas in their stated ranges, matching all 18 polynomials they list. A Bessel–Jacobi identity, combined with an unrefereed preprint, settles one case of a critical-length conjecture from computer-aided geometric design.

**What is not proved.** Existence only: an even-degree polynomial existing does not by itself give distinct quadrature nodes, nonzero weights or good numerical conditioning. The general critical-length conjecture is open, and the one case settled here depends on an unrefereed preprint.

**How sure we are.** Every result has a written proof. A script with pinned arbitrary-precision and symbolic packages tests the formulas and conventions at finite sizes; the statements for all sizes rest on the proofs. Review was internal and AI-assisted; this is not peer review.

## Summary for specialists

Notation: $\mu_j^{(\alpha)}(z)=\int_{-1}^1t^j(1-t^2)^\alpha e^{\mathrm{i}zt}\,dt$, $D_N^{(\alpha)}(z)=\det[\mu_{i+j}^{(\alpha)}(z)]_{i,j=0}^{N-1}$, $\lambda=\alpha+\tfrac12$, $u=z^2$.

| Result | Statement | Status before |
|---|---|---|
| Theorem 1.1 | $D_{2r}^{(\alpha)}(x)>0$ for all $r\ge1$, $\alpha>-1$, $x\in\mathbb R$ | $\alpha=0$ only (Celsus et al. 2022) |
| Lemma 2.1, Corollary 2.3 | No common zeros of $D_N,D_{N+1}$; all complex zeros simple | $\alpha=0$ adjacent case |
| Proposition 3.5, Corollary 4.1 | Odd sizes have infinitely many real zeros; explicit first endpoint correction | — |
| Theorems 5.1, 6.1 | $\deg_u H_n=\lfloor n^2/4\rfloor$; generic $\deg_u V_n=n(n+1)/2$; leading coefficients | Conjectured 2008 |
| Theorems 7.2, 7.4 | Lyu–Zhou Conjectures 2.5 and 2.7 in their stated ranges | Conjectured 2026; earlier claim by Ashfaque (Proposition 3.1 fails) |
| Corollary 8.3 | Critical length $j_{7/2,1}$ for $\operatorname{span}\{x^j\cos x,x^j\sin x:0\le j\le3\}$ | Conditional on Kounchev–Render (unrefereed) |

- **Continuation in $\alpha$.** Starting from $\alpha=0$, a zero of $D_{2r}$ could appear only by passing through a real zero at finite frequency or arriving from infinity. The Pearson identity rules out the first (a real zero would be a common zero of adjacent determinants, or a multiple zero); the uniform large-frequency expansion rules out the second.
- **Uniform endpoint expansion.** A one-variable endpoint lemma with constants uniform on compact exponent intervals, and an exact reduction showing the determinant is a finite sum of products of such integrals, so no multivariable remainder occurs.

## Technical account

**Pearson identity.** The weight satisfies a first-order differential relation in $t$, which gives a Toda-type identity linking $D_{N-1}$, $D_N$, $D_{N+1}$ and the frequency derivative of $D_N$. At a common zero of adjacent determinants the identity forces all determinants to vanish, which is impossible at frequency zero; the same identity shows that every zero is simple.

**Endpoint expansion.** For large real $x$ the moments are dominated by the endpoints $t=\pm1$, each contributing an expansion in powers of $x^{-1}$ with phase $e^{\pm\mathrm{i}x}$. Splitting the moments by endpoint and reducing the determinant exactly to a finite sum of products of one-variable endpoint integrals gives the leading term of $D_{2r}$, a positive constant times $x^{-2r(\alpha+r)}$, uniformly for $\alpha$ in compact sets. For odd sizes the leading term oscillates in sign, which produces infinitely many real zeros.

**Polynomial determinants and recurrences.** At the special frequencies of the 2008 paper the moments are polynomials in $\lambda$ and $u$. The endpoint expansion fixes the degree and leading coefficient of the Hankel polynomials; an exact shifted-numerator calculation and a valuation argument at $\lambda=0$ (a Laguerre measure plus a unit atom) give the Lyu–Zhou recurrence formulas.

**Classical and new.** The $\alpha=0$ theorem, Pearson and Toda identities, and Bessel-function asymptotics are earlier work and are credited. Within a bounded literature search, no earlier statement of even-size positivity for general $\alpha$ and no earlier complete proof of the Lyu–Zhou formulas were found; the earlier Ashfaque claim is disclosed above.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/oscillatory-gegenbauer-even-hankel-positivity.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 22-page manuscript.
- **Checks.** `verify.py` (mpmath 1.3.0, SymPy 1.14.0) checks an independent moment formula, even determinants at sample parameters, Selberg values at the origin, the $\alpha=0$ closed form, tail constants, the Toda identity, the formal degrees and leading coefficients, shifted numerators, Conjecture 2.5 residuals, Conjecture 2.7 reduced cases, the exceptional specialisations, a symmetric-measure counterexample and the failure of the earlier preprint's formula. These are finite checks of formulas and conventions, not checks of the theorems for all sizes.
- **Controls and replay.** Every check raises explicitly (no `assert`), so Python's `-O` flag does not disable it, and a negative control confirms that a corrupted formula is rejected. From a fresh copy the script reproduced its retained output with and without `-O` in about a second.
- **Review.** Internal AI-assisted reviewer roles, a separate-model adversarial review and audit, and a clean replay led to one revision round, which rewrote the uniform endpoint expansion, strengthened the prior-claim disclosure, flagged the conditional corollary and replaced `assert` statements; a re-review found no open correctness issue. None of this is peer review or independent reproduction.
- **Limitations.** Existence only: no claim about distinct nodes, nonzero weights or conditioning. Odd degrees can fail. The general critical-length conjecture is open, and Corollary 8.3 depends on an unrefereed preprint. The literature search was dated and bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Numerical analysts building complex Gaussian or steepest-descent quadrature | Even-degree rules for Jacobi-type oscillatory weights exist for every exponent and frequency | Existence only; node distinctness and conditioning are not established |
| Specialists in orthogonal polynomials and Painlevé-type recurrences | Proofs of the 2008 degree conjectures and the Lyu–Zhou recurrence formulas | An earlier claim exists; check Section 9 |
| Researchers on critical lengths in geometric design | One case of the Carnicer–Mainar–Peña conjecture | Conditional on an unrefereed preprint |
| Research agents | Machine-readable claims, an agent index and replayable checks | The checks test formulas at finite sizes; the theorems rest on the proofs |

## Why the problem matters

A quadrature rule that adapts to oscillation can compute integrals at a cost that does not grow with the frequency, which matters in wave scattering, signal processing and boundary-element methods. Those rules rest on the existence of the underlying orthogonal polynomials. Knowing that the even-degree ones always exist, for the whole Gegenbauer family of endpoint behaviours, removes a gap that earlier work could close only at special frequencies.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
python -m pip install -r requirements.txt            # mpmath 1.3.0, SymPy 1.14.0
python -I -B verify.py --output my_results.json      # about 1 s
python -O -I -B verify.py --output my_results_O.json # same result: no assert statements
```

`AI_INDEX.md` maps each result to its section and evidence, `REVIEW_SUMMARY.md` records how each review item was handled, `novelty_report.md` records the sources inspected, and `competing_claim_audit.md` gives the exact checks of the earlier preprint.

## The most valuable next projects

1. Prove that the even-degree polynomials have simple zeros and nonzero quadrature weights for every $\alpha$ and $x$.
2. Establish interlacing of the real zeros of odd-size determinants.
3. Settle the critical-length conjecture for $n\ge4$, and certify the rank-three case independently of the unrefereed input.
4. Study conditioning of the resulting quadrature rules as the frequency grows.

## What is in the evidence package

The manuscript (PDF and LaTeX source); `verify.py` with its retained output `verification_results.json` and pinned `requirements.txt`; the bibliography (`refs.bib`) with the Crossref and arXiv records it was copied from; the novelty report, the competing-claim audit, `target.yaml` and the public review record; `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text is CC0-1.0; code is MIT. This remains an unrefereed candidate.
