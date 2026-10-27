## Summary

**What resetting is.** Many random processes are sent back to a home position from time to time. A searcher returns to base, an animal returns to its nest, a queue is emptied by a catastrophe, an insurer's reserve is restored by a capital injection. The simplest model lets the process wander freely and resets it at the ticks of a random clock that ticks, on average, $\lambda$ times per unit time. Physicists introduced this model because resetting can make a search faster; probabilists study it because it is one of the simplest processes whose long-run behaviour is a balance between wandering and returning.

**The question.** Watch such a process for a fixed window of time, starting from its long-run state. Suppose that during the window it climbed unusually high, above some level $u$. Where is it at the end of the window? Dębicki, Hashorva and Michna (2026) studied this for Brownian motion. They found how rare such a high peak is, and how rare it is to have a high peak *and* finish above a level proportional to $u$. For the natural question "high peak, and finish above zero" they guessed the form of the answer and gave upper and lower bounds on its constant, but left the constant itself open (their Remark 3).

**What was found.**

- **Two stories, and only two.** Once the peak is high, essentially every path follows one of two stories. Either the clock has not ticked since the peak, and the process ends just below its peak; or it has ticked, and the process ends at an ordinary level near home, as if the peak had never happened. Every other story is exponentially rarer still.
- **Explicit odds.** The paper gives the odds of the two stories exactly. For standard Brownian motion with one reset per unit time on average, watched for one unit of time, they are about $53:47$ in favour of "no reset yet".
- **The peak's overshoot is memoryless.** How far the peak went above $u$ is exponentially distributed and independent of everything else, with mean $1/\beta$, where $\beta$ is the decay rate of the long-run distribution.
- **One error bound for every question.** The approximation comes with an explicit error that is the same for every question one could ask about the endpoint, including questions that move with $u$, such as "does it finish within $1$ of $u$?". This uniformity, and the description of the whole conditional path, are what is new.
- **The constant in Remark 3.** For Brownian motion the result gives the missing constant in closed form, and shows that both bounds of Dębicki, Hashorva and Michna are strict. With one reset per unit time on average, a window of length one and home at zero, the constant is $C_1=1.32858\ldots$, strictly between their bounds $0.921$ and $1.736$.

**Scope.** The results hold for a broad family of random processes that can jump down but never up ("spectrally negative Lévy processes"). This covers Brownian motion with or without drift, and the classical model of an insurer's surplus, which drifts up with premiums and jumps down with claims. Processes with upward jumps are not covered, and the paper explains why the method fails for them.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Every theorem has a written proof. The leading constants come from a standard calculation, and the paper says so; the new content is the uniform error bound, the conditional path law and the extensions. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

**Setting.** $\xi$ is a spectrally negative Lévy process, not a.s. nonincreasing, with Laplace exponent $\psi$; $N$ is an independent Poisson process of rate $\lambda$; $Y$ is reset to $r$ at the jumps of $N$ and started in its invariant law $r+\xi_{e_\lambda}$. Let $\beta$ solve $\psi(\beta)=\lambda$, $a=\lambda/(\beta\psi'(\beta))$, $M_t=\sup_{s\le t}\xi_s$, $A(t)=a\,e^{-\lambda t}\mathbb E e^{\beta M_t}$ and $D_T=A(T)+\lambda\int_0^TA(s)\,ds$. Let $H_T=\sup_{t\le T}Y_t$ and $b=u-r$.

**Theorem 3.1 (proof).** With $K_T(B)=\lambda\int_0^TA(s)\,\mathbb P_r(X_{T-s}\in B)\,ds$ and $Q_T(dw)=a\beta e^{-\beta w}\,\mathbb P^{(\beta)}(M_T-\xi_T>-w)\,dw$, for every $\gamma>\beta$,
$$
\Big\|\mathbb P(H_T>u,\ Y_T\in\cdot)-e^{-\beta b}\{Q_T(\cdot-u)+K_T\}\Big\|_{\mathrm{var}}\le\Big(\frac{a\beta}{\gamma-\beta}+\lambda T\Big)e^{T\psi(\gamma)-\gamma b}.
$$
The bound is uniform over all Borel sets and holds before projection to the endpoint; since $\psi$ is finite on $[0,\infty)$ the error is $o(e^{-\eta b})$ for every $\eta$.

**Further results.**

| Result | Status |
|---|---|
| Conditional marked path given $H_T>u$: first reset absent with probability $A(T)/D_T$, otherwise at density $\lambda A(s)/D_T$; maximum-tilted pre-reset path; independent $\mathrm{Exp}(\beta)$ overshoot; variation error $2e^{\beta b}R_\gamma/D_T$ (Theorem 5.1) | proof |
| Quantitative overshoot, first-reset and fixed-threshold statements; $\mathbb E[H_T-u\mid H_T>u]\to1/\beta$ for every input; $J_1$ path limit $Y/u\Rightarrow\mathbf 1_{\{s<S\}}$ (Propositions 5.2, 5.3) | proof |
| Driftless Brownian motion: $C_T=e^{\beta r}\big[\Phi(\sqrt{2\lambda T})+\lambda\int_0^T\Phi(\sqrt{2\lambda s})\,p_{T-s}(0)\,ds\big]$; both bounds of Dębicki–Hashorva–Michna Remark 3 strict; closed form at $r=0$ (Corollary 6.1) | proof |
| $D_T=a\,(1+\beta\,\mathbb E^{(\beta)}M_T)$ (Proposition 7.1) | proof; standard tools |
| Bounded-variation inputs $\xi_t=dt-S_t$: the expansion is exact once $u-r\ge dT$ (Corollary 7.2) | proof |
| I.i.d. reset positions $R\sim\rho$ with $\mathbb E e^{\gamma R}<\infty$: leading term $m(\beta)e^{-\beta u}\{Q_T(\cdot-u)+K^\rho_T\}$, initial position tilted by $e^{\beta z}$, first-reset law unchanged, explicit path and mark bounds (Theorem 7.3) | proof |

## Technical account

**Why the first cycle decides.** Two facts drive everything. First, by the Wiener–Hopf factorisation at an independent exponential time, the long-run law of $Y-r$ has an *exactly* exponential right tail, $\mathbb P(Y>r+x)=a e^{-\beta x}$ for $x\ge0$, and its density is dominated everywhere by the exponential continuation $a\beta e^{-\beta x}$. Second, a cycle that starts at a reset has a much lighter fixed-horizon tail (Doob's inequality gives $e^{T\psi(\gamma)-\gamma b}$ for any $\gamma>\beta$). So a high peak is, up to a tiny error, made in the cycle running at time zero, by a path that started high.

**The construction.** Replace the true starting density by its exponential continuation. That changes the measure by a controlled amount (the "continuation error") and drops exceedances in later cycles (the "later-cycle error"); both are bounded in full variation on the path space. Under the exponential starting measure everything is explicit: given the first reset time and the free path, the starting offset is a shifted exponential, which tilts the free path by $e^{\beta M_t}$ and makes the overshoot an independent $\mathrm{Exp}(\beta)$. The no-reset branch becomes the translated profile $Q_T(\cdot-u)$, which is what makes the error uniform over sets that move with $u$; the reset branch becomes $K_T$, which does not move. Spectral negativity is used twice: for the exact exponential tail and memoryless overshoot (upward passage is continuous), and for the finiteness of $\psi$ on $[0,\infty)$, which makes the error smaller than every exponential order.

**What is standard and what is new.** The leading constants, and hence $C_T$, come from the standard first-cycle (renewal) computation of the kind Dębicki, Hashorva and Michna use for their own Theorem 5, combined with classical Wiener–Hopf theory; once the problem is set up that way, computing $C_T$ is not hard. A direct renewal argument gives the leading term for each *fixed* endpoint set but neither a remainder nor uniformity over sets that move with $u$. The explicit uniform total-variation bound, the conditional path law with its quantitative corollaries, bounded-variation exactness and the random-reset extension were not found in the dated, bounded search recorded in the package's `RESEARCH_GATES.json`; that search does not establish priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/spectrally-negative-resetting-extremes.txt) is available for reading.

- **Proofs.** Every theorem has a complete written proof. The proofs do not depend on any computation. No proof assistant was used.
- **Proof audits.** Two AI-assisted proof audits checked the revised manuscript line by line. They found no fatal defect in the endpoint theorem, its remainder, the Brownian constant or bounded-variation exactness. They did find repairable gaps: the random-reset transfer of the path and mark results was stated with a normalisation that would not give a probability law, uniform integrability of the overshoot was asserted rather than proved, and a few statements were imprecise. All were repaired in this version, following the audits' own corrections.
- **Numerical checks.** A closed form against independent quadrature for $C_1$; floating-point reflection-principle brackets (not interval-certified); and an exact-sampling Monte Carlo of the original reset process, which samples each Brownian cycle from the joint law of its endpoint and maximum, so there is no time-discretisation bias. With $4\times10^7$ paths per experiment the simulated probabilities, odds, first-reset law and overshoot agree with the theory within sampling error once $u$ is moderately large; at small $u$ the finite-$u$ effects the theorem bounds are visible.
- **Replay.** `code/reproduce.py` reran every check from a clean copy of the final package. `negative_controls.py` rejects the bounds of Remark 3 as values of $C_1$, rejects the uncorrected random-reset normalisation, and detects tampering with a stored constant.
- **Review.** Internal AI-assisted review in several roles, two AI-assisted proof audits and a verification re-review. A rating-free summary of objections and responses is in the package. This is not peer review, independent reproduction or formal verification.
- **Limitations.** Nothing is proved for upward jumps, renewal (non-Poisson) reset clocks, horizons that grow with $u$, or reset positions that move with $u$. When negative jumps are heavy-tailed the fixed-threshold limits can converge slowly, though the main bound is unaffected. No historical-priority claim is made.

## Relationship to earlier work

This release answers a question posed by Dębicki, Hashorva and Michna (2026) and reproduces their Theorems 5 and 6 as consistency checks. It builds on the physics literature on resetting (Evans and Majumdar; Singh and Pal on extremes; Mori, Majumdar and Schehr on the time of the maximum) and on classical fluctuation theory for spectrally negative Lévy processes (Kyprianou; Kuznetsov, Kyprianou and Rivero). The companion Evidence Press release [*Restart from a quasi-stationary law: the exact constant and the real budget scale*](/releases/levy-qsd-exponential-moments-restart/) uses the same Esscher and Wiener–Hopf toolkit for a different object: it restarts a *simulation* from a quasi-stationary law on an interval, whereas this release resets the *process itself* at Poisson times, with no killing. Neither result implies the other.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probabilists working on resetting and extremes | A uniform, quantitative conditional-extremes theorem with an explicit path law, and a template (exact exponential continuation plus first-cycle localisation) for other regenerative models | Spectrally negative inputs and Poisson clocks only; the leading constants are standard |
| Readers of Dębicki, Hashorva and Michna (2026) | The constant of their Remark 3 in closed form, with strict bounds, and consistency with their Theorems 5 and 6 | Their setting is Brownian; the paper's notation differs and a dictionary is given |
| Physicists studying search and records under resetting | Exact odds that a far excursion is followed by a reset, and the memoryless overshoot | Lévy flights with upward or two-sided heavy jumps are a different regime and are not covered |
| Risk theorists | For a surplus process with resets (recapitalisation), the highest reserve in a window is given exactly above an explicit threshold | Recapitalisation at Poisson times to a fixed level is a modelling assumption |
| Rare-event simulation | The conditional-path sampler is an explicit proposal for simulating paths with a high maximum, exact for bounded-variation inputs | Away from that case it is asymptotically, not exactly, correct |

## Why the problem matters

Conditional extremes ask what a rare event implies about the rest of a system. For resetting processes the answer turns out to be strikingly simple: a far excursion either has just happened and is still visible, or it has been erased by a reset. Knowing the odds and the full conditional law, with an error bound that does not depend on which question is asked, makes the picture usable for simulation, for risk calculations involving both the running maximum and the final state, and as a solvable example of "mixtures of normalisations" in conditional extreme-value theory. It also closes a small open point in a recent paper.

## How to inspect or reproduce the recorded checks

```sh
python3 -B -O negative_controls.py
uv run --python 3.12 --with-requirements requirements.txt python -I code/reproduce.py --out NEW_EMPTY_DIR --pdf
shasum -a 256 -c SHA256SUMS
```

`negative_controls.py` needs only the Python standard library. `reproduce.py` refuses to overwrite the stored evidence; the full Monte Carlo takes several minutes on one CPU and about 2 GB of memory (use `--chunks 2` for a reduced run).

## The most valuable next projects

1. **Upward jumps.** Extend the endpoint theorem to light-tailed upward jumps, where the stationary tail is exponential only asymptotically and the overshoot follows a ladder-overshoot law.
2. **Renewal reset clocks.** Replace the Poisson clock by a renewal clock, including deterministic ("sharp") resetting.
3. **Joint limits in $u$ and $T$.** The error contains $e^{T\psi(\gamma)}$; regimes such as $u=vT$, or a Poisson limit for exceedance counts, are open.
4. **External check.** A specialist in Lévy fluctuation theory or resetting processes could check Section 3 and the random-reset bounds of Theorem 7.3.

## What is in the evidence package

- `levy_reset_extremes.pdf` and LaTeX source: the 19-page manuscript.
- `code/`: the Brownian formulas, independent checks, profile checks, the exact-sampling Monte Carlo, a bounded-variation replicate and the replay driver; `checks/` and `figures/`: their stored outputs.
- `negative_controls.py`: standard-library semantic controls.
- `README.md`, `STATUS.md`, `ASSURANCE.md`, `PROVENANCE.md`, `AI_INDEX.md`, `CLAIMS.json`: summary, status, assurance limits, provenance, agent navigation and machine-readable claims.
- `REVIEW_SUMMARY.md`: a rating-free summary of internal review objections and responses; `RESEARCH_GATES.json`: prior-art searches and limitation triage.
- `CITATION.cff`, `.zenodo.json`, `LICENSES.md`, `SHA256SUMS`: citation, archive metadata, licences (text CC0-1.0, code MIT) and hashes.
