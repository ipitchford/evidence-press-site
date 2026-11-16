## Summary

**In one sentence.** When a random process made of continuous wiggles and sudden jumps is pinned to finish at a chosen point, the strongest possible dependence between its two coordinates is the largest of three numbers, and exact jump times matter only through the jumps the two coordinates share; this candidate answers, in that operator form, a question asked by Chang and Chen.

**The question.** *Maximal correlation* measures how much one random object can tell you about another, using any functions of them, not just straight-line relationships. It is $0$ exactly when the two are independent and $1$ when they share something exactly. A two-dimensional *Lévy process* $Z=(X,Y)$ is random motion with a Gaussian part (continuous wiggles) plus jumps. Chang and Chen (The Annals of Applied Probability, 2026) showed that the maximal correlation of the two coordinate paths is the larger of the Gaussian correlation and a constant $\mathrm{Op}(\nu)$ computed from the jump law $\nu$. In their Section 6, Problem 1, they asked what happens for a *Lévy bridge*: the same process conditioned to end at a given point $z$.

**Why pinning is different.** Pinning the end destroys independence over time, so the earlier argument does not apply, and it can create dependence that the jump law does not show. Take independent jumps on the two sides and Gaussian wiggles with correlation $0.2$. Before pinning, the coefficient is $0.2$. After pinning both ends, each jump count is tied to its own Gaussian endpoint, and those endpoints are correlated, so the two counts become dependent: in the example of Section 6.3 the coefficient exceeds $0.997$.

**What is new.** The answer is a reduction to the jump configurations, not a closed formula.

| Result | In plain terms | Where |
|---|---|---|
| Bridge formula | The coefficient is the largest of three numbers: the Gaussian correlation; how dependent the two unordered lists of jump sizes are; and the norm of an operator that counts jumps the coordinates make at the same moment. Exact jump times matter only through which jumps are shared | Theorem 2.1 |
| One-cut principle | Keep the jump sizes and record which jumps occur before one fixed time: nothing is lost. With two different cut times the shared-jump and Gaussian terms shrink by an explicit factor and the size term stays the same | Corollary 2.2 |
| Computable cases | Without common jumps the size term is the maximal correlation of the two jump totals, and pure-jump coordinates become independent; for a pure-jump process with finitely many nonnegative whole-number jump vectors both terms are norms of finite matrices | Propositions 5.1 and 5.2 |
| Chang and Chen's examples | Their compound-Poisson Examples 2–4, pinned, have coefficient $1$ at every endpoint at which the second coordinate jumps, and $0$ otherwise | Corollary 5.4 |
| A check on the old formula | Without pinning, the same machinery gives an independent proof of Chang and Chen's formula on every finite time horizon | Proposition 5.3 |
| Hidden matchings | The engine: a correlation identity for random marks attached to the classes of a hidden random matching. Chang and Chen's labelled random-subset theorem (their Theorem 1.5) is essentially the case where the matching is visible | Theorem 3.1, Remark 3.3 |

The formula holds for almost every endpoint; for every endpoint when the Gaussian covariance is positive definite, where the bridge is the standard one (Proposition 4.2); and at every atom of the endpoint law. Infinite jump activity is allowed.

**Idea of the proof.** Given the jump sizes, the jump times behave like independent uniform clocks, except that a shared jump gives the same clock to one jump on each side. An analysis of variance of functions of these clocks, with an incidence inequality, shows that a statistic using several shared clocks can never do better than one that uses a single clock. That leaves the Gaussian parts, the jump sizes, and the single-clock statistics, which are governed by the common-jump operator.

**Credit.** The question is Chang and Chen's. The fixed-overlap (Krawtchouk) spectrum and the "random elements in common" construction behind the shared-shock example are due to Diaconis and Griffiths (2012). Before pinning, the shared-shock pair belongs to the class of bivariate Poisson processes characterised by Griffiths and Milne (1978).

**Limits.** The size term and the common-jump term are operator norms. There is no general elementary formula for them; they are computed explicitly only in the cases listed above. No claim is made at exceptional endpoints: whether the formula holds at every endpoint for pure-jump bridges such as gamma or stable bridges is open. Pinning can raise or lower the coefficient, and no general comparison is proved. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks only.

## Summary for specialists

Fix $T>0$ and a two-dimensional Lévy process $Z=(X,Y)$ with Gaussian covariance $\Sigma$ and Lévy measure $\nu$. Let $\rho_G=|\Sigma_{12}|/(\Sigma_{11}\Sigma_{22})^{1/2}$ (zero if a variance vanishes), let $\mathbb P_z$ be the law of the path on $[0,T]$ given $Z_T=z$, and let $U,V$ be the unordered lists (point measures) of nonzero jump sizes of $X$ and $Y$.

- **Size term.** $c_0(z)=R_z(U,V)$, the maximal correlation of the jump-size lists under $\mathbb P_z$.
- **Common-jump term.** $c_1(z)$ is the norm of the operator $C_{1,z}$ from $L^2(\mu^Y_z)$ to $L^2(\mu^X_z)$ defined by the measure $\kappa_z$ that counts common jumps $(U,\Delta X_t,V,\Delta Y_t)$; $\mu^X_z,\mu^Y_z$ are the pointed-list measures. Its test functions are not centred.
- **Theorem 2.1** *(proof)*: for terminal-law almost every $z$,

$$R_z(X,Y)=\max\{\rho_G,\,c_0(z),\,c_1(z)\},$$

  with no finite-activity, finite-variation or moment assumption; at every $z$ for the posterior construction, in particular for the standard bridge when $\Sigma$ is positive definite, and at every atom of the law of $Z_T$.
- **Corollary 2.2** *(proof)*: with $\mathcal A_s=(U,U_s,G^X_s)$, $\mathcal B_s=(V,V_s,G^Y_s)$ and the Brownian-bridge correlation $\theta(s,t)$, one has $R_z(\mathcal A_s,\mathcal B_s)=R_z(X,Y)$ for every $0<s<T$, and

$$R_z(\mathcal A_s,\mathcal B_t)=\max\{c_0,\,\theta c_1,\,\theta\rho_G\}.$$

- **Theorem 3.1** *(proof)*: for independent marks attached to the classes of a hidden random partial matching between observed sets with arbitrary static side information, $R=\max\{R(\text{static}),\|\mathcal K\|\}$ with $\mathcal K$ the averaged matching operator. Example 3.2: a hidden swap has $R=1/\sqrt2$, the revealed matching $R=1$.
- **Section 5** *(proofs)*: finite matrices at lattice endpoints (Proposition 5.1); $c_1\equiv0$ and $c_0(z)=R_z(J^X_T,J^Y_T)$ without common jumps (Proposition 5.2); unconditioned $c_1^\circ=\mathrm{Op}(\nu)$ and $c_0^\circ\le\mathrm{Op}(\nu)$ (Proposition 5.3); pinned Chang–Chen examples (Corollary 5.4).
- **Examples** *(Section 6)*: in a four-type pure-jump bridge $c_0=q$ and $c_1=\sqrt{q/2}$ with $q=4c/(1+4c)$, so the dominant term switches at $c=1/4$ and neither jump term can be dropped; in the shared-shock Poisson bridge pinning can also lower the coefficient (for $m=1$, $R_z\le1/\sqrt n$); with $\rho=1/5$, jump size $8$ and endpoint $(4,4)$, the pinned coefficient lies strictly between $0.997457967473837283247$ and $0.997457967473837283251$ (Appendix A), against $0.2$ before pinning.

**Known and new.** Chang and Chen's Theorem 1.2 (unconditioned processes) and Theorem 1.5 (labelled random subsets) are theirs; the Hoeffding/analysis-of-variance domination of higher-order terms for random subsets goes back to Madiman and Barron and to Chang and Chen's Section 5.2, and Guo and Zhang give the binomial overlap coefficients. The clock description of jumps is Kallenberg's representation of processes with exchangeable increments, together with Poisson marking (Last and Penrose). The bivariate-Poisson literature (Griffiths and Milne; Griffiths, Milne and Wood; Diaconis and Griffiths) treats unpinned processes and fixed overlaps. New here, within a literature search of limited scope: the hidden-matching identity with arbitrary observed side information, its application to pinned Lévy paths, the one-cut principle and the computable cases. Chang and Chen's sequel (arXiv:2512.15135) answers a different question from their Section 6.

## Technical account

**From paths to clocks.** Section 4 writes a pinned Lévy path, given its unordered jump sizes, as a deterministic function of the sizes, independent uniform clocks for the jumps (shared for a common jump), and independent Gaussian bridges (Lemma 4.1, through Kallenberg's canonical representation and Poisson marking). For infinite activity the compensated small jumps are reconstructed in $L^2$ from the sizes and clocks. The bridge law is identified with the standard Doob $h$-transform bridge at every endpoint when $\Sigma$ is positive definite (Proposition 4.2).

**Hidden-matching identity.** Section 3 treats an abstract model: observed static data $(U,V)$, a hidden random partial matching $\Pi$ between their occurrences, and independent decorations (here, clocks) attached to each matching class. Conditioning on the static data, a Hoeffding decomposition splits any square-integrable function into canonical kernels of each degree. Only kernels whose decorations are matched by $\Pi$ can correlate, and an incidence inequality bounds every degree-$r$ cross term by the norm of the averaged matching operator $\mathcal K$ times the norms of the two kernels; single-decoration statistics attain that norm, so degree one dominates. A random-labelling lemma (Lemma 3.4) handles occurrences with equal marks, and paired decorations give the two-cut statement (Proposition 3.5).

**Computable cases.** Without common jumps each jump-size list is conditionally independent of everything on the other side given its own jump total, so by the submultiplicativity of maximal correlation only the two totals carry dependence; if a Gaussian variance vanishes, a total is fixed by the endpoint and the coordinates are independent. For finitely many lattice jump vectors the posterior over count vectors is finite, so both operators are finite matrices. Without pinning, the Mecke equation and a Fock-space representation give $c_1^\circ=\mathrm{Op}(\nu)$ and $c_0^\circ\le\mathrm{Op}(\nu)$, recovering Chang and Chen's formula.

**The certified value.** In Section 6.3 the posterior over the two jump counts concentrates on $(0,0)$ and $(1,1)$ as the jump size grows; for $\rho>0$ the zero-indicators become nearly equal, and at jump size $8$ their correlation is $\tanh(10/3)$ up to an exponentially small tail. Appendix A bounds the discarded part of the infinite operator with directed interval arithmetic and proves the two-sided enclosure.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/levy-bridge-maximal-correlation.txt) is available for reading.

- **Proofs.** Every theorem has a written proof in the 19-page paper. The paper opens with a plain introduction (maximal correlation and its uses, what was known for Lévy processes, why the bridge is different, the main results, relation to earlier work and limits, a roadmap and a notation table) and ends with open questions and an AI-use statement. No proof assistant was used.
- **Exact checks.** `code/verify.py` checks 324 shared-shock Poisson one-cut spectra and 81 hidden-matching laws built from exact rational probabilities; `code/random_marking_checks.py` checks 100 further random matching laws; all residuals are below $10^{-15}$ (declared tolerance $2\times10^{-12}$). `code/check_extensions.py` checks the hidden swap, $40$ labelled models of Chang and Chen's Theorem 1.5, the no-common-jump reduction, the unconditioned formula and the pinned Chang–Chen examples.
- **Certificate.** `code/certify_gaussian_poisson.py` proves the enclosure of Section 6.3 with directed interval arithmetic (mpmath, 80 digits); its output is identical on every platform tested.
- **Tests that can fail.** No check uses `assert`, so the scripts behave identically under Python's optimised mode. Changing the certified upper end, or the hidden-swap value $1/\sqrt2$, makes the script exit with failure.
- **Replay.** Every script was rerun from fresh copies before release under Python 3.12 with pinned libraries, both normally and in optimised mode; every recorded output was reproduced byte for byte. GitHub CI reruns the scripts on Linux as a blocking job and compares them with the recorded outputs under a declared policy: the certificate must match exactly; exact rational laws, counts and strings must match exactly; floating-point singular values and residuals must agree within $10^{-9}$.
- **Review.** Five internal AI-assisted reviewer roles, run as Claude subagents, an adversarial review by a second AI model (Astra) and a clean replay found no mathematical error. The revision round reframed the result as an operator-form answer, explained the relation to Chang and Chen's Theorem 1.5, corrected the scope of the pinned examples, rewrote the introduction for non-specialists, made the scripts robust under optimised mode, and added Propositions 4.2, 5.2 and 5.3, Corollary 5.4 and a bound showing that pinning can also lower the coefficient. A re-review and a Claude proof audit of the new proofs found no gap. The planned Astra audit of the new proofs did not run because of a usage limit. Three sources on bivariate Poisson processes and Krawtchouk polynomials were read in full before release and are credited where used. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The two jump terms are operator norms, explicit only in the computable cases; no claim at exceptional endpoints; every-endpoint statements for gamma or stable bridges, the structure of $c_0$ with common jumps and a general pinned-versus-unpinned comparison remain open. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probabilists working on Lévy processes and bridges | A structural answer to Chang and Chen's Problem 1, a one-cut principle, and a hidden-matching identity that may apply to other conditioned point processes | The jump terms are operator norms; explicit only in the cases treated |
| Statisticians using endpoint-conditioned sampling or pinned paths | A way to decide which features of two coordinate paths carry their dependence, and exact values for finitely many integer jump types or without common jumps | Pinning can raise or lower dependence; no general comparison is proved |
| Researchers on maximal correlation and Lancaster expansions | A worked bridge between random-subset results, Krawtchouk spectra and conditioned Lévy paths | Priority rests on a literature search of limited scope |
| Research agents | Machine-readable claims, an agent index and replayable checks with negative controls | The checks are finite and truncated cases; the proofs carry the general statements |

## Why the problem matters

Maximal correlation is the natural yardstick for how much one random quantity can reveal about another: it appears in information theory, in the simulation of joint distributions, in optimal transformations for regression and in the convergence of data-augmentation samplers. Bridges, that is processes pinned at a final value, arise whenever a path is simulated or inferred given where it ends. This work shows that pinning can manufacture strong dependence out of weakly related parts, and identifies exactly which features of the paths carry it.

## Related Evidence Press releases

No earlier Evidence Press release studies the maximal correlation of conditioned or pinned processes.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/), from the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
U="uv run --python 3.12 --with numpy==2.3.5 \
  --with matplotlib==3.10.8 \
  --with mpmath==1.3.0 python -O -I -B"
for s in verify random_marking_checks \
  certify_gaussian_poisson check_extensions; do
  $U code/$s.py
done
```

Together the scripts take under a minute. `ENVIRONMENT.txt` lists the software used and the cross-platform comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Prove the bridge formula at every endpoint for pure-jump bridges with continuous densities, such as gamma or stable bridges, by showing that the two jump terms vary continuously with the endpoint.
2. Reduce the size term to finitely many scalar statistics when common jumps are present, as Proposition 5.2 does without them.
3. Characterise when the scalar values $X_s,Y_s$ already carry the full coefficient, as they do in the shared-shock Poisson bridge.
4. Work out the short- and long-horizon limits, and decide whether pinning raises or lowers the coefficient on average over endpoints.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the check scripts in `code/` with their recorded outputs in `results/`; Figure 1 and its data in `figures/`; `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
