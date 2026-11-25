## Summary

**In one sentence.** This candidate proves the Rotaru–Patrinos–Glineur conjecture: for the difference-of-convex algorithm and for proximal gradient with a constant stepsize, the conjectured worst-case bounds on the step after $N$ iterations hold for every $N$, and they are attained.

**The everyday problem.** Many optimisation problems split into a "nice" smooth part and a simple but awkward part, such as a sparsity penalty or a constraint ($F=\varphi+h$), or into a difference of two convex functions ($F=f_1-f_2$). Two workhorse methods handle them. The **difference-of-convex algorithm** (DCA) replaces the subtracted function by its tangent at the current point and minimises what remains. The **proximal gradient method** takes a gradient step on the smooth part and then applies the proximal map of the awkward part; it is a special case of DCA. Neither method can tell you how far you are from the answer. What you can see is how far the method moved in its last step, $x_j-x_{j+1}$; for proximal gradient the scaled step $(x_j-x_{j+1})/\gamma$ is called the **gradient mapping**, and a small step is the usual stopping test. So the practical question is: after $N$ iterations, how small is that step guaranteed to be, and which constant stepsize makes the guarantee best?

**What was known.** For plain gradient descent the exact answer is known for every constant stepsize and every curvature regime (Rotaru, Glineur and Patrinos, *Mathematical Programming*, 2026). For DCA, Rotaru, Patrinos and Glineur sorted the one-step behaviour into six regimes, proved bounds for any number of iterations in part of the parameter range (their Theorems 1–3), and conjectured the exact answer everywhere: in effect, "the awkward part costs nothing extra". The conjecture reappears in Rotaru's 2026 thesis, whose table of open problems lists both missing pieces: proofs in the remaining region, and matching worst-case examples.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The conjecture holds | All three of its inequalities hold for every number of iterations, with a possibly nonsmooth first function | Theorems 3.1–3.2, Corollary 3.3 |
| The bounds are exact | Explicit worst-case problems attain them, including nonconvex problems that are bounded below, also in the regimes where only upper bounds had been proved | Section 9 |
| Against the initial gap | Measured against the distance to the optimal value, a nonsmooth proximal term makes short steps worse by an exact amount, but not long steps | Theorem 3.4, Corollary 3.5 |
| Proximal gradient | The thesis's proximal-gradient version of the conjecture holds in a correctly normalised form, including weakly convex proximal terms | Theorem 3.6 |
| Best constant stepsizes | With a convex proximal term, the best constant stepsizes known for gradient descent stay best for proximal gradient (convex, strongly convex and sufficiently nonconvex smooth parts) | Theorem 3.7 |

**A concrete number.** For convex problems the best constant step is about $1.6/L$ at $N=2$, $1.75/L$ at $N=5$ and $1.9/L$ at $N=20$, where $L$ bounds the curvature of the smooth part. Compared with the textbook step $1/L$, it improves the worst-case guarantee by a factor of about $1.48$, $1.68$ and $1.88$, approaching $2$.

**Credit.** The smooth certificates and the worst-case data are those of Rotaru, Glineur and Patrinos; the conjecture is Rotaru, Patrinos and Glineur's; the upper bounds in the regions marked "proved" in Table 1 of the paper are theirs. New here are the proximal transfer, the cancellations, the crossover repair, the terminal modification of the worst-case data and the consequences above.

**The idea of the proof.** The gradient-descent proof is a weighted sum of inequalities between iterates one and two steps apart. An exact identity shows that the proximal step adds extra terms to this sum. A few of them have the wrong sign, but each is cancelled by a matching positive term from the neighbouring block. At the one iteration where the proof changes form (the *crossover*), a square that the gradient-descent proof throws away is kept and completed. The worst cases are the known gradient-descent ones with the last point adjusted.

**Limits.** Constant stepsizes only, and worst-case guarantees: typical problems behave better. The smooth part must have bounded curvature. The residual-gradient versions of the conjecture in the thesis, short steps for weakly convex proximal gradient and time-varying stepsize schedules remain open. Overshooting the best stepsize is costly: 2% too long loses a factor of about 5 at $N=20$, while 2% too short loses only about 2%, so err on the short side when $L$ is uncertain. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks.

## Summary for specialists

Normalise by the strong convexity $a$ of $f_1$: with $f_2$ of curvature between $m$ and $M$, put $\rho=m/a$, $\eta=M/a$, so the iteration is $x_{j+1}=\operatorname{prox}_h(\nabla b(x_j))$ with $b=f_2/a$. Let

$$E_n(z)=\sum_{r=1}^{2n}z^{-r}$$

and $T_n=E_n(\eta)-E_n(\rho)$; let the crossover index $k$ be the last $j$ with $T_j\ge0$, and let $P_N(\eta,\rho)=p\,[N+\hat c\sum_{j\le N}[T_j]_+]$ with $p=(1+\eta)(1+\rho)/(\eta+\rho)$ and $\hat c=(1-\eta)(1-\rho)/(\eta-\rho)$.

- **Theorem 3.1** *(proof)*: if $\eta\le1$, then with $D_N=1+\rho+\min\{E_N(\eta),E_N(\rho)\}$,
$$\tfrac a2\|d_N\|^2\le\frac{F(x_0)-F(x_{N+1})}{D_N},$$
and $\|d_N\|$ is the smallest step; one-dimensional examples attain it.
- **Theorem 3.2** *(proof)*: if $-1<\rho<0$ and $\eta>1$, the same holds for $\min_j\|d_j\|$ with denominator $1+\rho+\min\{P_N,E_N(\rho)\}$, attained in dimension at most three by a lower-bounded objective. **Corollary 3.3** *(proof)* gives part (iii) by time reversal.
- **Theorem 3.4** and **Corollary 3.5** *(proof)*: exact initial-gap bounds with baseline $c(\rho)=1/(1-\rho)$ for $\rho<0$ and $1+\rho$ for $\rho\ge0$, and an interpolating $c_\beta(\rho)$ when $\nabla h$ is $\beta$-Lipschitz.
- **Theorem 3.6** *(proof)*: the three cases of Conjecture 4.6.3 of the thesis, with $\rho=(1-\gamma L_\varphi)/(1+\gamma\mu_h)$ and $\eta=(1-\gamma\mu_\varphi)/(1+\gamma\mu_h)$, for $\mu_h$-convex (possibly weakly convex) $h_0$; Remark 11.1 compares it with the printed normalisation.
- **Theorem 3.7** *(proof)*: for convex $h_0$ and $t=\gamma L\in(1,2)$ the exact proximal-gradient worst case equals the gradient-descent one; for $t\le1$ and $\kappa\ge0$, $1/W_N=1/W_N^{\rm GD}-(1-t)^2$. Hence the optimal constant stepsizes of Rotaru, Glineur and Patrinos (their Propositions 2.13, 2.14 and 2.15(1)) stay optimal.

**Known and new.** Before this paper the upper bound was proved in the regions $\eta+\rho\le0$, $\eta\le1$ with $T_1\le0$, and the nonconvex regime $p_3$ ($T_1\le0$), all by Rotaru, Patrinos and Glineur; exactness for $N\ge2$ rested on numerical performance estimation everywhere. The open region $\eta+\rho>0$, $T_1>0$ matches the open-problem table of the thesis. Bok and Altschuler give general algebraic reductions from gradient methods to composite ones, but their gradient-norm extension needs every converted multiplier to be nonnegative, which fails here; the new step is the cancellation across blocks and the crossover repair.

## Technical account

**Transfer identity (Section 6).** For each pair of iterates the gradient-descent interpolation inequality for $b$ and the subgradient inequality for $h$ combine exactly: applied to DCA iterates, any nonnegative combination of smooth interpolation inequalities equals the same combination plus explicit multiples of the proximal subgradient inequality (identity (6.4), Table 3). The certificate is valid when all proximal multipliers are nonnegative.

**Cancellation (Sections 6–7).** For each distance-two block of the gradient-descent certificate one proximal multiplier is negative, but the preceding block contributes a positive amount on the same arc, and the sum is nonnegative (Lemma 6.1; Table 4 gives the global edge ledger). Endpoint and tail pieces are summed as identities before transfer.

**Crossover repair (Section 7).** At the crossover index $k$, where the gradient-descent certificate switches from distance-two to distance-one form, a negative multiplier remains. The gradient-descent proof discards a nonnegative square there; keeping it and completing it absorbs the deficit (identities (7.7)–(7.9)).

**Exactness (Section 9).** Convex endpoints are attained by one-dimensional quadratics. In the nonconvex case the gradient-descent worst-case data are modified at the last point, so that the extra decrease of the final DCA step is also attained; Lemma 9.1 shows the modified data still come from an admissible function, and Lemma 9.2 shows the data do not depend on the horizon.

**Stepsizes (Section 11).** For convex $\varphi$ ($\kappa=0$) the exact reciprocal bound $\Lambda_N(t)$ has three branches:

- $\Lambda_N(t)=t(2N+2-t)$ for $t\le1$;
- $\Lambda_N(t)=1+2Nt$ for $1\le t\le1+\sigma_N$;
- $\Lambda_N(t)=(t-1)^{-2N}$ for $t\ge1+\sigma_N$,

where $\sigma_N$ solves $\sigma^{-2N}=1+2N(1+\sigma)$, and the optimum is $\gamma_N^*=(1+\sigma_N)/L$. The first branch is where the composite class is strictly worse than gradient descent, by $(1-t)^2$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/dca-gradient-mapping-conjecture.txt) is available for reading.

- **Proofs.** The 25-page paper opens with a plain introduction and a table of which parameter regions were proved before, outlines the proof strategy, and gives written proofs of every result; sign verifications and boundary cases are in appendices. No proof assistant was used.
- **Checks.** Eleven scripts check the transfer identity, the local and endpoint identities, the crossover repair, the appendix formulas and complete transferred certificates for selected rational parameters up to $N=12$, in exact SymPy arithmetic. `nonconvex_data.py` rebuilds the modified worst-case data for ten parameter triples (crossover indices $0$ to $12$, horizons up to $20$) and checks every interpolation inequality and the attained value at 50 digits. `extensions.py` recomputes the stepsize table and the sensitivity figures and checks the equality with the gradient-descent bounds on a grid. Optional floating-point diagnostics are included but cited for no number.
- **Tests that can fail.** No check uses `assert`; every script exits with an error on failure, also in Python's optimised mode. Perturbing the attained value by $10^{-20}$, or flipping one sign in a multiplier, makes the corresponding script fail.
- **Replay.** All fourteen scripts were rerun from a fresh copy before release; every result file and log matched the recorded one byte for byte. GitHub CI reruns them on Linux with the same comparison and both failure tests.
- **Review.** Five internal Claude reviewer roles (editor, methodology, domain, perspective and devil's advocate, run as three subagents; two of them wrote independent numerical worst-case computations that matched the constants), the fresh replay with negative controls, one revision round with extensions, then a verification re-review and a proof audit of the new and rewritten proofs. No error was found in a proved statement. No Astra/Codex review took place. Every cited source was obtained and read. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Constant stepsizes and worst-case bounds only; the smooth part must have bounded curvature; the residual-gradient conjectures, short steps for weakly convex proximal gradient and time-varying schedules remain open; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Practitioners running DCA or proximal gradient | Exact worst-case guarantees for the usual stopping test after any number of iterations, and a best constant stepsize that a convex proximal term does not change | Worst-case and constant-step only; overshooting the best step is costly |
| Researchers in performance estimation | A worked transfer of gradient-descent certificates to composite methods despite negative multipliers | Residual-gradient measures need a different endpoint repair |
| Researchers on DC programming | The conjectured exact rates of Rotaru, Patrinos and Glineur, now proved and attained | Smooth subtracted function required |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The scripts check identities and finite instances; the proofs carry the theorems |

## Why the problem matters

Stopping rules decide how long an optimisation method runs, and the step size decides how fast it gets there. Exact worst-case bounds tell a user how many iterations to budget and which constant stepsize to choose, with constants that cannot be improved. Before this work the exact answer was known for gradient descent but only conjectured for the composite methods that are used most in practice, such as sparse regression with nonconvex penalties and constrained problems.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12, from the package root:

```sh
uv run --python 3.12 --with sympy==1.14.0 \
  --with mpmath==1.3.0 --with numpy==2.3.5 \
  python3 -I -B -O run_checks.py --numerical
```

It takes about 20 seconds and must print fourteen lines starting `PASS`; the result files and logs must match the recorded ones (the runner overwrites `results/`, so use a copy to compare). `README.md` explains the comparison policy, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Prove the residual-gradient conjectures of the thesis, where the terminal point carries a proximal subgradient and the endpoint blocks need a different repair.
2. Settle short steps for weakly convex proximal gradient, and with them the full optimal stepsize when the smooth part is mildly nonconvex.
3. Extend the transfer identity to time-varying stepsize schedules in the gradient-mapping measure.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF) and Figure 1 with its data and source (`figures/`, `scripts/make_rate_figure.py`); thirteen verification scripts and the optional diagnostics in `checks/`, the runner `run_checks.py` and the recorded outputs in `results/`; `requirements.txt` and `optional-requirements.txt`; `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
