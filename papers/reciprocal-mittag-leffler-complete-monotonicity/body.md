## Summary

**In one sentence.** The reciprocal $1/E_{\alpha,\beta}$ of the two-parameter Mittag–Leffler function is completely monotone on a strictly larger set of parameters than Garrappa, Gerhold, Popolizio and Simon conjectured in 2025, so their proposed parameter band $\beta\in[\alpha-1,\alpha]$ is not necessary, on either side.

**The problem, in plain terms.** The Mittag–Leffler function $E_{\alpha,\beta}(z)=\sum_{k\ge0}z^k/\Gamma(\alpha k+\beta)$ generalises the exponential. It appears in fractional differential equations, in models of materials with memory ("anomalous relaxation") and in the hitting times of self-similar random processes. A function is *completely monotone* when its derivatives alternate in sign; by Bernstein's theorem it is then the Laplace transform of a positive measure. So when $1/E_{\alpha,\beta}$ is completely monotone, it is (after normalising) the Laplace transform of a probability distribution, which is what makes it usable as a waiting-time or relaxation law. The question is: for which $\alpha,\beta$ does this happen?

**What was known.** For $1\le\alpha\le2$, Garrappa, Gerhold, Popolizio and Simon (2025, Proposition 3) proved complete monotonicity on the band $\alpha-1\le\beta\le\alpha$, with a Bernstein logarithm (their Remark 4(a)); the diagonal $\beta=\alpha$ goes back to Patie (2009). Their Conjecture 25 asserts that for $1<\alpha<2$ the band, complete monotonicity, and a global inequality $|E_{\alpha,\beta}(z)|\ge E_{\alpha,\beta}(\operatorname{Re}z)$ are all equivalent.

**What is proved.**

- **Theorem A (every $\alpha$ between 1 and 2).** For $0<\beta\le\alpha$, $\log[\Gamma(\beta)E_{\alpha,\beta}]$ is a Bernstein function, so every positive power of the normalised reciprocal is the Laplace transform of an infinitely divisible law. This covers the whole triangle $0<\beta<\alpha-1$ *below* the band.
- **Theorem B (near $\alpha=2$).** For $\alpha$ in some neighbourhood of 2, the admissible set is exactly $(0,b(\alpha)]$, where $b$ is analytic, $b(2)=3$ and $b'(2)=1+\tfrac{2\pi\operatorname{Si}(2\pi)}{2I(2\pi)}=2.8276817311\ldots$ with $I(a)=\int_0^a(1-\cos u)\,du/u$. The boundary is where two negative zeros near $-4\pi^2$ collide and become complex. Since $b(\alpha)>\alpha$ for $\alpha$ just below 2, the band also fails *above*.

**What is not proved.** How close to 2 the order must be in Theorem B (no specific pair above the band is certified); the exact answer for other orders, which is left as a conjecture supported by computation; and whether the band is exactly where the global modulus inequality holds.

**How sure we are.** Both theorems have written proofs; two inputs are cited rather than reproved (the hitting-time construction of Garrappa et al. and a theorem on the zeros of $E_{2,\beta}$). Scripts check exact coefficients, the boundary slope to 90 digits, one exactly certified counterexample to the modulus inequality, and a numerical boundary curve. Review was internal and AI-assisted; this is not peer review.

## Summary for specialists

Notation: $Q=\Gamma(\beta)E_{\alpha,\beta}$, $\Phi=\log Q$, $\mathcal C_\alpha=\{\beta>0:1/E_{\alpha,\beta}\text{ CM on }(0,\infty)\}$.

| Result | Statement | Status before |
|---|---|---|
| Theorem A | $\Phi$ Bernstein for $1<\alpha<2$, $0<\beta\le\alpha$ | Band $[\alpha-1,\alpha]$ only (GGPS25 Prop. 3, Rem. 4(a)) |
| Lemma 2.2 | $F_\gamma(cq)/F_\gamma(q)=\mathbb E[e^{-qT}]$ for seeds $\gamma$ on the band | Implicit in GGPS25 proof of Prop. 3 (displayed for $\gamma=\alpha$) |
| Theorem B | $\mathcal C_\alpha=(0,b(\alpha)]$ near $\alpha=2$; self-decomposable laws | $\mathcal C_2\supseteq(0,3]$ via GGPS25 Rem. 4(b) |
| Section 10 | $b'(2)=1+a\operatorname{Si}(a)/(2I(a))$, $a=2\pi$ | — |
| Corollary 2.3, Appendix | CM holds but $|E(z)|\ge E(\operatorname{Re}z)$ fails for $0<\beta<\alpha-1$; exact certificate at $(3/2,1/4,-60+i)$ | Failure direction from GGPS25 Prop. 14 |
| Section 12 | Numerical double-zero curve on $1.5\le\alpha\le2.5$; Conjecture 12.1 | — |

- **Lowering the parameter.** $E_{\alpha,\beta}=\beta E_{\alpha,\beta+1}+\alpha zE'_{\alpha,\beta+1}$, so $Q_{\alpha,\beta}=F_\gamma+(\alpha/\beta)qF_\gamma'$ with seed $\gamma=\beta+1$ inside the band. If dilation ratios of $F$ are completely monotone, $\log F$ and $qF'/F$ are Bernstein, hence so is $\log(F+bqF')$.
- **Exact boundary.** Inverse Laplace kernel $g$ of $-(\log E)''$: uniform sector asymptotics for small times, nearest real zeros for large times, explicit $\alpha=2$ products for the middle range; necessity above $b(\alpha)$ by Pringsheim's theorem once the nearest zeros are non-real.

## Technical account

**Theorem A.** Garrappa et al. realise $1/F_\gamma$, $F_\gamma=\Gamma(\gamma)E_{\alpha,\gamma}$, as the Laplace transform of a first-passage time of a positive self-similar Markov process without positive jumps (recurrently extended for $\gamma<\alpha$). Optional stopping of the eigenfunction $e^{-qt}F_\gamma(qX_t)$ gives $F_\gamma(cq)/F_\gamma(q)=\mathbb E_c[e^{-qT_1}]$ for every $0<c<1$; this is displayed in their proof for $\gamma=\alpha$ and stated "by the same reasoning" for the rest of the band, and the paper writes the step out. A general lemma then shows that $B=qF'/F$ is Bernstein (as the limit of $(1-F(cq)/F(q))/(1-c)$), that $\log F=\int_0^1B(sq)\,ds/s$ is Bernstein, and that $\log(F+bqF')=\log F+\log(1+bB)$ is Bernstein. With the recurrence this gives every $0<\beta<\alpha-1$.

**Theorem B.** Define $g_{\alpha,\beta}(t)$ as the inverse Laplace transform of $-(\log E_{\alpha,\beta})''$, divided by $t$. Uniform Hankel-contour asymptotics on $[1.9,2.1]\times[0,10]$ give the small-time behaviour $p\,t^{-p}/\Gamma(1-p)-q$; shifting the contour past the zeros nearest the origin gives a sum of exponentials for large times, uniformly even when two zeros coalesce; and at $\alpha=2$ the kernels are explicit theta-type sums, e.g. $g_{2,3}(t)=2\sum_n e^{-4\pi^2n^2t}$, whose strict signs persist by continuity. Positive and decreasing $g$ gives a Bernstein logarithm with a decreasing Lévy density, hence self-decomposability. Near $(2,3)$ the two zeros at $-4\pi^2$ form a double zero; an implicit-function argument gives the analytic curve $b(\alpha)$ where they collide. Above it they are non-real and nearest the origin, so the reciprocal's Taylor series at zero has a non-real nearest singularity, which Pringsheim's theorem forbids for a completely monotone function. A log-convexity bound excludes $\beta\ge10$, and compactness excludes the rest.

**Classical and new.** Bernstein-function closure properties, the Hankel contour, Rouché's and Pringsheim's theorems are classical; the band result and the hitting-time construction are Garrappa et al.'s, and the diagonal case is Patie's. Within a bounded literature search, no earlier statement of Theorem A below the band, of the exact interval in Theorem B, or of the boundary slope was found.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/reciprocal-mittag-leffler-complete-monotonicity.txt) is available for reading.

- **Proofs.** Both theorems have written proofs in the 18-page manuscript, which merges two independently written drafts; the lower-parameter theorem replaced a weaker appendix of the boundary draft.
- **Checks.** `verify.py` runs: exact reciprocal coefficients at order two and a 90-digit check of the slope $b'(2)$ (standard library); an exact rational certificate that the modulus inequality fails at $(3/2,1/4,-60+i)$ (standard library); and a 40-digit continuation of the boundary curve (mpmath 1.4.1). These are finite checks, not proofs of the theorems.
- **Controls and replay.** Every check raises explicitly (no `assert`), so Python's `-O` flag does not disable it, and a negative control confirms a corrupted coefficient is rejected. From a copy of the frozen archive the run reproduced its retained output byte for byte with and without `-O`; GitHub CI reruns it on Linux.
- **Review.** Five internal AI reviewer roles, a separate-model adversarial review, one revision round, a re-review and two audits of the new proofs; no open correctness issue remained. None of this is peer review or independent reproduction.
- **Limitations.** The neighbourhood in Theorem B is not quantified. Self-decomposability is proved on the band and near order two, not below the band elsewhere. The numerical curve and Conjecture 12.1 are evidence, not proof. The literature search was dated and bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probabilists and special-function specialists | New infinitely divisible laws from $1/E_{\alpha,\beta}$ below the band; an exact boundary near order two | Theorem B is local in $\alpha$ |
| Modellers using Mittag–Leffler relaxation or waiting-time laws | Parameter ranges where $1/E_{\alpha,\beta}$ is a genuine probability transform | Normalise by $\Gamma(\beta)$; check the stated ranges |
| Researchers on Conjecture 25 | Settles the complete-monotonicity direction; leaves the modulus-inequality equivalence | Conjecture 12.1 is numerical evidence only |
| Research agents | Agent index, machine-readable claims and replayable checks | Finite checks only |

## Why the problem matters

Mittag–Leffler laws are the standard replacement for exponential decay when memory effects matter. Knowing exactly when $1/E_{\alpha,\beta}$ is a probability transform tells modellers which parameter choices give legitimate, infinitely divisible distributions, and it corrects a published conjecture that would have ruled many of them out.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
python -m pip install -r requirements.txt                 # mpmath 1.4.1
python -I -B verify.py --output my_results.json           # a few minutes
python -O -I -B verify.py --output my_results_O.json      # same result: no assert statements
```

`AI_INDEX.md` maps each result to its section and evidence, `REVIEW_SUMMARY.md` records how each review item was handled, and the two novelty reports record the sources inspected.

## The most valuable next projects

1. Certify a concrete pair above the band, such as $(\alpha,\beta)=(1.99,2)$, with interval arithmetic, or quantify the neighbourhood in Theorem B.
2. Prove Conjecture 12.1: $\mathcal C_\alpha=(0,b(\alpha)]$ for every $1<\alpha<2$.
3. Decide self-decomposability below the band away from order two.
4. Settle the remaining equivalence in Conjecture 25, between the band and the global modulus inequality.

## What is in the evidence package

The manuscript (PDF and Markdown source with its build script); `verify.py` and the three check scripts in `code/` with the retained output `verification_results.json`, the boundary-curve data and pinned `requirements.txt`; the bibliography (`refs.bib`) with the Crossref and arXiv records it was copied from; two novelty reports and target files; the public review record; `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text is CC0-1.0; code is MIT. This remains an unrefereed candidate.
