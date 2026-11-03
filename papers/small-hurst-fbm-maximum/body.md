## Summary

**In one sentence.** As fractional Brownian motion becomes very rough, its expected maximum over a unit of time grows like $\sqrt{2/H}$, where $H$ is the Hurst parameter.

**The setting.** Fractional Brownian motion is the standard model of a random path whose roughness can be tuned. One number, the Hurst parameter $H$ between 0 and 1, sets the roughness. At $H=1/2$ the path is ordinary Brownian motion, the classic model of a random walk in continuous time; smaller $H$ gives a more jagged path whose ups and downs nearly cancel from one instant to the next. Very rough paths are not a curiosity. Rough-volatility models in finance describe market volatility with $H$ around $0.1$, and as $H$ approaches zero these paths approach the log-correlated fields studied in probability and mathematical physics.

**The question.** How high does such a path climb, on average, between time 0 and time 1? Call that average maximum $M_H$. It is known exactly only for $H=1/2$ and $H=1$. Earlier work showed that $M_H$ grows like $1/\sqrt H$ as $H$ shrinks, and pinned the constant in front between $1.128$ and $1.695$. In 2022 Bisewski, Dębicki and Rolski conjectured that $\sqrt H\,M_H$ settles to a definite limit.

**What is proved.** It does, and the limit is $\sqrt2\approx1.414$:

$$\lim_{H\to0}\sqrt H\;\mathbb E\sup_{0\le t\le1}B_H(t)=\sqrt2 .$$

The reason is that a very rough path behaves like a branching tree of independent random choices, one level of branching per scale, and the maximum of such a tree can be computed. The same idea gives a dimension law ($\sqrt{2s}$ on an $s$-dimensional regular space, so $\sqrt{2d}$ on a cube in $d$ dimensions), the same constant for the all-time maximum of a path pulled down by a constant drift, and an explicit bound $M_H\le\sqrt{3\log2/H}$ that holds for every $H$.

**What it means for simulation.** A computer sees a path only at grid points. The paper finds exactly how much of the maximum a uniform grid of $n$ points captures as $H\to0$: the fraction depends only on $c=H\log n$, through an explicit curve. The grid captures half of the maximum when $H\log n=1/2$, 90% when $H\log n\approx2.11$, and all of it only as $H\log n\to\infty$. So the number of points needed grows exponentially in $1/H$, and a fixed grid misses almost all of the maximum of a very rough path.

**How sure we are.** Every limit and bound has a written proof, and three scripts check the finite constructions exactly and evaluate the bounds numerically. The limits converge slowly: at $H=0.1$ the true $M_H$ lies between about $2.43$ and $3.50$, well below $\sqrt{2/H}=4.47$.

## Summary for specialists

Standard fBm on $[0,1]$: $\mathbb E(B_H(t)-B_H(s))^2=|t-s|^{2H}$, $B_H(0)=0$; $S_H=\sup_{[0,1]}B_H$, $M_H=\mathbb ES_H$; natural logarithms.

- **Small-Hurst limit:** $\sqrt H\,M_H\to\sqrt2$ and $\mathbb E|\sqrt H S_H-\sqrt2|^p\to0$ for every $p<\infty$; $\sqrt{2/H}-O(\sqrt{\log(1/H)})\le M_H\le\sqrt{2/H}+O(H^{3/2})$ (Theorem 1) *(proof)*
- **Explicit bounds:** $M_H\le\sqrt{3\log2/H}$ for all $0<H\le1$; Pickands' constant $\mathcal H_H\le(29.86H)^{1/(2H)}$ for $0<H\le1/2$ (Corollary 3); $(b(b+1))^{-H}\mathbb ES_{b,(b+1)^{-H}}\le M_H\le\mathbb ES_{b,b^{-H}}$ for every $b\ge2$ (Lemma 4) *(proofs)*; Table 1 evaluates these at $H\in[0.005,1]$ *(numerical, about $\pm0.005$)*
- **Dimension law:** if $\lambda_Hd^H\le d_{X_H}\le\Lambda_Hd^H$ on a compact Ahlfors $s$-regular $(K,d)$ with $\lambda_H,\Lambda_H\to1$, then $\sqrt H\,\mathbb E\sup_KX_H\to\sqrt{2s}$, with a quantitative form (Theorem 5); every such space carries such fields (Corollary 6); for compact $K\subset\mathbb R^d$ and Lévy fBm, $\limsup\le\sqrt{2\,\overline{\dim}_BK}$ (Proposition 7) *(proofs)*
- **Drift:** $M_H-1\le\mathbb E\sup_{t\ge0}(B_H(t)-t)\le M_H+4.083$ for $H\le1/2$ (Theorem 8) *(proof)*
- **Sampling:** for any $N$-point deterministic set, $\mathbb E\max\le\sqrt{\log N}$ (Proposition 9); for the grid $\{i/n\}$ with $H\log n\to c$, $\sqrt H\,\mathbb E\max_iB_H(i/n)\to F(c)$ with $F(c)=\sqrt c$ for $c\le1/2$ and $\sqrt2(1-\tfrac12e^{1/2-c})$ for $c\ge1/2$ (Theorem 11); quasi-uniform nets in Ahlfors $s$-regular $K$ give $\sqrt s\,F(c/s)$ (Theorem 13) *(proofs)*; Table 2 compares Monte Carlo grid maxima with $F(H\log n)/\sqrt H$ *(Monte Carlo)*
- **Conjectures:** a second-order term of order $H^{1/6}$ for the comparison tree, $S_H-M_H\Rightarrow N(0,1/2)$, and polynomial-cost adaptive sampling (Section 10) *(not proved)*

## Technical account

**Why the answer is $\sqrt2$.** Measure separation on the logarithmic scale $u=H\log(1/|t-s|)$. Two times at separation $e^{-u/H}$ have increment variance $e^{-2u}$, and $[0,1]$ contains about $e^{u/H}$ disjoint pieces of that length. As $H\to0$, fBm therefore looks like a hierarchical Gaussian field with branching rate $1/H$ per unit of $u$ and accumulated variance $\tfrac12(1-e^{-2u})$. For hierarchical fields with a concave variance profile, each scale contributes $\sqrt{2\times\text{branching rate}\times\text{variance rate}}$ to the maximum (the continuous random energy model of Bovier and Kurkova), so $M_H\approx\int_0^\infty\sqrt{(2/H)e^{-2u}}\,du=\sqrt{2/H}$. On an Ahlfors $s$-regular space the branching rate is $s/H$, giving $\sqrt{2s/H}$.

**How the proof makes it rigorous.** fBm is not hierarchical. The proof builds two explicit Gaussian trees, the $b$-ary discounted branching random walk $X_{b,r}(w)=\sum_j\sigma_jZ_{w|j}$ with $\sigma_j=\sqrt{(1-r^2)/2}\,r^{j-1}$. A $b$-adic coding map from the tree onto $[0,1]$ gives a tree that dominates fBm in canonical distance; a separated-digit coding into base $b+1$ gives one that is dominated. Sudakov–Fernique comparison (including an infinite-index version, Lemma A.2) turns these into upper and lower bounds; normal-maximum asymptotics for the trees and a careful order of limits ($H\to0$, then $b\to\infty$) give $\sqrt2$, and Borell–TIS concentration gives $L^p$ convergence. A useful structural fact is that every geometric distortion constant $C$ enters only as $C^H\to1$, which is why the first-order constants are robust and the dimension law needs only Ahlfors regularity.

**Grids.** A grid with $n=e^{c/H}$ points stops the hierarchy at depth $u=c$, and the unspent variance $e^{-2c}/2$ sits at the leaves as independent noise. For $c\le1/2$ that leaf noise dominates and the grid behaves like $n$ independent $N(0,1/2)$ variables, with maximum about $\sqrt{\log n}=\sqrt{c/H}$. For $c>1/2$ the variance profile with its terminal jump must be replaced by its least concave majorant, which gives the second branch of $F$. The proof embeds finite trees with an unspent leaf variance into the grid from both sides and applies the Bovier–Kurkova CREM theorem.

**Classical and new.** Hierarchical Gaussian maxima (Derrida's GREM, the CREM of Bovier and Kurkova), Gaussian comparison and concentration, and the discounted branching random walk are classical, and the paper does not claim them. Within a bounded literature search, the new elements are the identification of the vanishing-exponent limits for fBm and for Gaussian snowflake metrics, the exact grid crossover $F$, and the explicit bounds that come with the proofs.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/small-hurst-fbm-maximum.txt) is available for reading.

- **Proofs.** Every theorem, corollary, lemma and proposition has a written proof in the 28-page manuscript; Appendix A states the Gaussian comparison inequalities used.
- **Exact checks.** `verify.py` runs 79,850 exact rational checks of the original finite constructions (tree covariances, separated-digit gaps, grid rounding, binary grouping) and 65,526 for the revision (Lemma 4 codings, harmonic-set spacing), plus nine floating-point checks of closed-form diagnostics. Every check raises an error on failure, so the checks stay active under Python's `-O` flag. These are checks of small instances; they corroborate, and the theorems rest on the proofs.
- **Numerical tables.** `brackets.py` evaluates the rigorous fixed-$H$ comparisons of Lemma 4 by iterating a distributional recursion on a grid (Table 1). It brackets the known values at $H=1/2$ and $H=1$, and an independent recomputation during review agreed to within $10^{-4}$ at $H\ge0.1$; entries are accurate to about $\pm0.005$ but are not interval certificates. `simulate_grid.py` simulates grid maxima exactly by circulant embedding with a fixed seed (Table 2). Neither table is part of any proof.
- **Replay.** All three scripts were rerun under `-I -B -O` from a fresh copy of the package; every JSON and CSV output matched the shipped file byte for byte.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review and an audit of the new proofs by a separate model, a line-by-line proof audit and a clean replay led to one revision round; no reviewer or audit found a mathematical error, and a re-review found no remaining critical or major issue. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The main results are first-order limits, and they converge slowly: at $H$ between $0.05$ and $0.2$, simulated grid maxima lie 17–42% below the first-order values, and the theorem describes how the captured fraction scales with $H\log n$, not the level of the maximum at moderate $H$. Whether $\sqrt{2/H}-M_H$ tends to zero is open. The second-order term, the fluctuation law, adaptive sampling and optimal designs are conjectures or open problems. The literature search was dated and bounded, with no author enquiry.

## Relationship to earlier work

Borovkov, Mishura, Novikov and Zhitlukhin (2017, 2018) proved bounds of the right order, with upper constant $1.695$; Bisewski (2023) raised the lower constant to $2/\sqrt\pi\approx1.128$; and Bisewski, Dębicki and Rolski (2022) recorded these bounds and conjectured that the limit exists. Theorem 1 confirms the conjecture and identifies the constant inside that window. For the drift problem, the ratio form of the limit already follows from Bisewski, Dębicki and Mandjes (2021) together with Theorem 1; the new content is the additive bound with an explicit constant. On sampling, Borovkov and Zhitlukhin (2018) proved a normal limit with mean $\sqrt{\log n}$ for grid maxima when $H(\log n)^2\to0$, a regime inside $H\log n\to0$, and Makogin (2016) documented the failure of fixed grids at small $H$; Theorem 11 extends the first-order mean up to $c=1/2$ and finds the crossover beyond it, while their fluctuation result is finer than anything proved here. Mukeru and Mulaudzi (2026) conjectured $M_H=1/(H\sqrt{2\pi})$ for all $H$; its $1/H$ order was already incompatible with the known bounds.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| People simulating rough processes, for example rough volatility with $H\approx0.1$ | How grid size must grow with $1/H$ to see the running maximum, and explicit and numerically evaluated bounds for the maximum itself | The grid law is a limit as $H\to0$; at practical $H$ use the fixed-$H$ tables, which are numerical, not certified |
| Probabilists working on Gaussian extremes | The sharp first-order constant, a dimension law for snowflake metrics, and a worked example of tree comparison with $C^H\to1$ robustness | Second-order terms and fluctuations remain conjectural |
| Researchers on log-correlated and $H\to0$ fields | A first-order bridge between fBm maxima and branching-random-walk and CREM maxima | Different normalisations; the $H=0$ field limits do not by themselves identify the continuum maximum |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

The expected maximum is the simplest summary of how far a random path can wander, and for fractional Brownian motion it had resisted exact description away from two special values of $H$. Knowing its leading behaviour as $H\to0$ answers a question posed in 2022, connects fBm to the well-understood theory of hierarchical Gaussian fields, and tells anyone who simulates very rough paths how fine a grid must be before the simulated maximum means anything.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root, with Python 3.11 or later:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -m venv env && env/bin/pip install -r requirements.txt    # numpy 2.3.5, scipy 1.17.0, matplotlib 3.10.8
env/bin/python -I -B -O verify.py                                  # exact checks, a few seconds
env/bin/python -I -B -O brackets.py brackets_results.json          # Table 1, one to five minutes on one core
env/bin/python -I -B -O simulate_grid.py simulate_grid_results.json # Table 2, under a minute
```

The scripts write their outputs next to themselves, so work in a copy. `AI_INDEX.md` maps each claim to its location in the paper and its evidence, and `review/REVIEW_SUMMARY.md` lists the objections raised in review and how each was resolved.

## The most valuable next projects

1. Prove the second-order term: is $\sqrt{2/H}-M_H$ of order $H^{1/6}$, and does it tend to zero?
2. Prove that $S_H-M_H$ converges in law to $N(0,1/2)$.
3. Determine how many adaptively chosen evaluations are needed to capture a fixed fraction of the maximum; the paper conjectures polynomially many in $1/H$.
4. Certify Table 1 with interval arithmetic.
5. Find the small-$H$ limit for compact sets that are not Ahlfors regular, such as $\{0\}\cup\{1/n\}$.

## What is in the evidence package

The paper (PDF, Markdown source and generated LaTeX) with its two figures; `verify.py`, `brackets.py` and `simulate_grid.py` with their retained outputs; the dated literature audit (`prior_art/`); a rating-free summary of the internal review (`review/`); the superseded first version and its working notes (`history/`); the bibliography as BibTeX from Crossref and arXiv records; `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text, data and figures are CC0-1.0; code is MIT.
