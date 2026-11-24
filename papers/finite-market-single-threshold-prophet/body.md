## Summary

**In one sentence.** When a seller posts one fixed price to buyers who arrive in random order, this candidate gives the exact share of the best possible outcome that the price can guarantee at every market size, for buyers whose values follow different distributions, and proves a conjecture of Arnosti and Ma about tuning that price to how often the stock sells out.

**The everyday problem.** A seller has $k$ identical items and faces $n$ buyers who arrive one at a time in random order. Each buyer's value comes from a known distribution, and buyers can differ. The seller posts one price before anyone arrives, never changes it, and sells to the first $k$ buyers who will pay it. The same rule describes one hiring bar for $k$ posts, or one quality cut-off for $k$ slots. The yardstick is a *prophet* who sees every value in advance and keeps the best $\ell$ of them; both sides are compared per place filled. The question is how large a fraction of the prophet's value one fixed price can guarantee, whatever the buyers' distributions.

**Why it matters.** One posted price is simple, treats every buyer alike, gives nobody a reason to wait, and can be tuned from data: a seller who does not know every buyer's distribution can adjust the price until one market statistic hits a target, such as how often all the stock sells (the *stockout probability*) or the average fraction of stock sold (the *utilisation*). Real markets of this kind have tens of buyers, not thousands, so finite market sizes are where the targets are actually set.

**What was known.** For very large markets with $k=\ell$, Arnosti and Ma (Operations Research, 2023) showed that a well-chosen fixed threshold guarantees

$$\gamma_k=1-\frac{e^{-k}k^k}{k!},$$

about 63% for one item and 73% for two, and that no fixed threshold does better. Their rule targets the utilisation. They conjectured that targeting the stockout probability at $\mathbb P(\mathrm{Pois}(k)\ge k)$ also guarantees $\gamma_k$. Exact answers for finite markets were known only when all buyers share one distribution (Arnosti; Jiang, Ma and Zhang) or when the arrival order is adversarial. Molina, Gast, Loiseau and Perchet (SODA 2025) found the large-market value when the seller's and the prophet's capacities differ ($k\ne\ell$), for buyers with one common distribution, and asked whether it extends to buyers who differ.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| Exact finite guarantees | For every $n>\max(k,\ell)$ and buyers who may differ: the exact worst-case value of the best price that may use every distribution, of a price tuned to a stockout target, and of a price tuned to a utilisation target; also for buyers with one common distribution, and the boundary cases $k=n$ or $\ell=n$ | Theorem 2.1, Propositions 2.4–2.6 |
| The Arnosti–Ma conjecture | True for every number of items and every market size. As the paper records, Arnosti and Ma's own Lemma 1 combined with the crossing lemma below already yields it; the finer finite results need more | Corollary 3.1 |
| Molina et al.'s question | Yes for fixed thresholds, in the large-market limit: their constant holds for buyers who differ | Corollary 3.1 |
| A ranking of targets | Tuning utilisation to the right finite target loses nothing against knowing every distribution. Tuning the stockout probability loses a tiny amount of order $1/n^2$, about $0.030/n^2$ for two items. Buyers who differ cost of order $1/n$ compared with buyers who are alike, about $0.18/n$ for two items | Proposition 2.4, Corollaries 3.2 and 3.3 |

**A concrete case.** Three buyers, two items ($n=3$, $k=\ell=2$): the best fixed price guarantees 79.1% of the prophet's value, exactly $(\sqrt{21}-3)/2$; the best stockout target guarantees 78.7%; and if every buyer's value has the same distribution the guarantee rises to 85.2%, exactly $23/27$.

**Idea of the proof.** Compare the number of buyers who clear the price with a binomial or Poisson count that has the same stockout probability. Their distribution curves cross exactly once, at the stockout level, and that single crossing bounds both the fraction of stock sold and each buyer's chance of being served. Applying the comparison to each buyer's count of qualifying *rivals* makes the finite values exact. For the matching upper bound, one market of ordinary buyers plus one rare, very valuable buyer defeats every possible price at once, and every random mixture of prices too.

**Limits.** One anonymous fixed price; independent values; random arrival order (or the stated mixtures with an adversarial order); worst-case guarantees, so typical markets do better; the hard cases rely on a rare, very valuable buyer. The proof of the conjecture is short once the crossing lemma is in hand. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks only.

## Summary for specialists

Values $V_1,\dots,V_n$ are independent with laws $G_i$ and arrive in uniformly random order; a static threshold $(t,h)$ accepts the first $k$ qualifiers (ties qualify with a common coin $h$). Let $W$ be the expected accepted total divided by $k$ and $H$ the expected sum of the $\ell$ largest values divided by $\ell$. Write $b=\ell$, $m=n-1$ and $B_m(p)$ for a binomial count with $m$ trials. Put

$$u(d)=\frac{\min(d,k)}{k},$$

$$a(d)=\min\Big(1,\frac{k}{1+d}\Big),$$

the share of places filled and the chance that a qualifying applicant with $d$ qualifying rivals is accepted. Let $U_m(p)$ and $A_m(p)$ be their expectations at $B_m(p)$, and let $p_m(q)$ solve $\mathbb P(B_m(p)\ge k)=q$.

- **Theorem 2.1** *(proof)*: for $n>\max(k,\ell)$ the fixed-stockout value is

$$S_{n,k,b}(q)=\min\{U_n(p_n(q)),\,\beta(q)\},$$

  where $\beta(q)=\tfrac bk A_m(p_m(q))$. The all-static value is $C_{n,k,b}=U_m(p_*)$, where $U_m(p_*)=\tfrac bk A_m(p_*)$, and the identical-law value is $C^{\rm iid}_{n,k,b}=U_n(b/n)$. One instance defeats every threshold and every randomisation over thresholds.
- **Lemma 2.2** *(proof)*: if $X$ is a sum of $s\ge k$ independent Bernoulli variables and $Y$ is binomial or Poisson with $\mathbb P(X\ge k)=\mathbb P(Y\ge k)\in(0,1)$, then $F_X\le F_Y$ below $k-1$, equality at $k-1$ and $F_X\ge F_Y$ above.
- **Proposition 2.4** *(proof)*: the utilisation-calibrated value $R(\nu)=\min\{\nu,\tfrac bk A_m(U_m^{-1}(\nu))\}$ is maximised at $\nu=C_{n,k,b}$, where it equals $C_{n,k,b}$. Propositions 2.5 and 2.6 settle the boundary cases and the identical-law stockout curve.
- **Corollary 3.1** *(proof)*: over all market sizes the stockout value is $\min\{U(\lambda_q),\tfrac bk A(\lambda_q)\}$ for Poisson analogues $U,A$, maximised at $\lambda_q=b$, with value $\tfrac1k\sum_{j=1}^k\mathbb P(\mathrm{Pois}(b)\ge j)$; at $b=k$ this is $\gamma_k$ at the Arnosti–Ma target, for every $k$.
- **Corollaries 3.2 and 3.3** *(proof)*: $C_{n,k,b}-\max_qS_{n,k,b}(q)$ is of exact order $n^{-2}$ with an explicit positive coefficient for $k\ge2$ (and zero for $k=1$); $C^{\rm iid}_{n,k,b}-C_{n,k,b}$ is positive at every $n$ and of order $1/n$ with an explicit coefficient.
- **Section 4** *(proof)*: the theorem holds for weighted rank benchmarks with $b=1/\omega_1$, and for mixtures of uniform and fixed arrival order with $A_m$ replaced by $(1-\rho)A_m+\rho\,\mathbb P(B_m<k)$ (parts 1 and 2); $\rho=1$, $b=k$ recovers Jiang–Ma–Zhang's finite adversarial-order value.

**Known and new.** Arnosti and Ma compare at matched utilisation (their Lemma 2 and Theorem 4) and give the two-coefficient bound (their Lemma 1); with the crossing lemma, that bound already proves their conjecture, which the paper states plainly. The case $k=1$ is the rule of Ehsani, Hajiaghayi, Kesselheim and Singla. Finite values for identical laws with $k=\ell$ are due to Arnosti and to Jiang, Ma and Zhang; the adversarial-order constant to Chawla, Devanur and Lykouris; relative log-concavity of Bernoulli sums to Yu. New here, within a literature search of limited scope: the exact finite values for heterogeneous values, the matching at a common tail probability applied to rival counts, the single hard instance for every threshold, the utilisation and identical-law curves, and the two expansions.

## Technical account

**Two coefficients.** For any threshold, with $e_i=\mathbb E(V_i-t)_+$, the welfare decomposes as $W=t\,\mathbb E u(D)+\tfrac1k\sum_ie_i\,\mathbb E a(D_{-i})$ while $H\le t+\tfrac1b\sum_ie_i$, so $W/H\ge\min\{\mathbb E u(D),\tfrac bk\min_i\mathbb E a(D_{-i})\}$. Lemma 2.2, applied to the full count $D$ with $n$ trials and to each rival count $D_{-i}$ with $m$ trials at matched stockout probabilities, bounds both terms below by the binomial values. For the all-static value, a threshold that equalises the largest rival stockout probability with $\mathbb P(B_m(p_*)\ge k)$ attains the balance.

**One hard instance.** The upper bound uses $m$ ordinary applicants with value one and one rare applicant whose value is $M$ with small probability. The rare value is chosen by a supporting-line inequality $U_m(p)+\theta v(p)\le(1+\theta)C_{n,k,b}$, proved from the monotone likelihood ratio of the binomial family, so that no threshold, and no randomisation over thresholds, beats $C_{n,k,b}$ on that single instance.

**Limits in the market size.** Letting $n\to\infty$ replaces binomial counts by Poisson counts. The Poisson shift identity gives $kU(\lambda)=\lambda A(\lambda)$, which places the optimum at $\lambda=b$. Second-order expansions of the two branches around their intersection give the $n^{-2}$ stockout cost and the $1/n$ heterogeneity cost.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/finite-market-single-threshold-prophet.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 14-page paper, which opens with a plain introduction (the problem, why it matters, what was known, what is new, a plan) and ends with limits, open questions and an AI-use statement. No proof assistant was used.
- **Exact checks.** `code/verify.py` checks, in exact rational arithmetic, the crossing pattern of Lemma 2.2 on 585 Bernoulli profiles and the welfare decomposition against direct enumeration of values, tie coins and arrival orders on 12 product laws; it also spot-checks the supporting-line inequality on a grid for 650 parameter triples and prints the values table.
- **High-precision checks.** `code/check_additions.py` works at 50 significant digits: the boundary cases (643 calibrated thresholds), the identical-law results, the heterogeneity coefficient by extrapolation at six parameter pairs, and the optimal targets in the table. `code/check_extensions.py` evaluates the order-mixture hard instances at 189 profiles and compares the scaled stockout cost with its coefficient.
- **Tests that can fail.** No check uses `assert`, so the scripts behave identically under Python's optimised mode. Changing the heterogeneity coefficient by 1%, or adding one to the exact welfare identity, makes the scripts exit with failure.
- **Replay.** Every script was rerun from fresh copies before release under Python 3.12 with pinned libraries, normally and in optimised mode; every recorded output was reproduced byte for byte. GitHub CI reruns the scripts on Linux as a blocking job and compares them with the recorded outputs under a declared policy: text outputs token by token with decimal numbers within $10^{-7}$, and the 50-digit results within a relative $10^{-9}$.
- **Review.** Five internal reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as one combined Claude pass; the lead checked every proof step by hand; a 50-digit numerical check and a clean replay followed. No mathematical error was found. The revision rewrote the introduction for non-specialists, added a novelty paragraph crediting Arnosti and Ma's Lemma 1, narrowed the scope of the extensions in the abstract, turned the boundary cases into a proposition, added citations, and added Propositions 2.4 and 2.6, Corollary 3.3 and the table of targets. A re-review and proof audit of the new material found no critical or major issue. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** One anonymous fixed threshold, independent values and random order; worst-case values that hard instances approach but do not attain; the hard instances rely on a rare, very valuable value, so benchmarks that limit dispersion can give larger values. Open: the exact finite value of the expected-demand rule, the stockout cost under order mixtures, and the finite gap to adaptive policies. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Revenue managers and market designers | Exact worst-case guarantees of one posted price for a given market size, and the stockout or utilisation target that achieves them | Independent values, random arrival order and one anonymous price; worst cases, not typical outcomes |
| Researchers on prophet inequalities and online selection | A proof of the Arnosti–Ma stockout conjecture, exact finite values for heterogeneous values, and a tail-matching comparison lemma | Static thresholds only; the conjecture's proof is short once the crossing lemma is in hand |
| Operations researchers who set admission or hiring cut-offs | A ranking of the statistics a single cut-off can be tuned to, with the size of each loss | The guarantees are per place filled, against a prophet who sees all values |
| Research agents | Machine-readable claims, an agent index and replayable checks with negative controls | The checks are finite cases; the proofs carry the general statements |

## Why the problem matters

Posted prices, fixed hiring bars and admission cut-offs are everywhere because they are simple, transparent and hard to game. Prophet inequalities measure what such simple rules give up compared with perfect hindsight. Knowing the exact guarantee at a realistic market size, and which market statistic to tune the price to, turns a large-market limit into a number a manager can use, and shows that a seller who only watches whether the stock sold out loses almost nothing.

## Related Evidence Press releases

- [Limits of online selection with a fixed number of choices](/releases/iid-multiunit-prophet-limits/) studies the same prophet benchmark for adaptive policies and identically distributed values in the large-market limit, a different model from the single fixed threshold here; the paper cites it for the gap between static and adaptive rules.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/), from the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
U="uv run --python 3.12 --with mpmath==1.3.0 \
  python -O -I -B"
$U code/verify.py > verify.txt
$U code/check_extensions.py > extensions.txt
$U code/check_additions.py > additions.json
```

Together the scripts take under a minute. `ENVIRONMENT.txt` lists the software used and the cross-platform comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find the exact finite value of the expected-demand rule, which Arnosti and Ma showed falls short of the best guarantee for up to four items.
2. Measure the cost of a stockout target when the arrival order is partly adversarial.
3. Compare the fixed-threshold values here with the best adaptive policies at finite market sizes, for buyers who differ.

## What is in the evidence package

The paper (LaTeX sources `manuscript.tex` and `secondorder.tex`, and the PDF); the check scripts in `code/` with their recorded outputs in `results/`; the figure and its script; `requirements.txt`; `refs.bib` from Crossref, arXiv and Zenodo records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
