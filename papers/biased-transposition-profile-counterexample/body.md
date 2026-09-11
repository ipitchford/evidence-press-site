## Summary

An overall count can miss a slow subgroup. In a shuffle where half the cards are selected less often, this candidate uses one event—at least two slow labels are still fixed—to rule out a proposed formula for the transition towards randomness.

At one specified point, that event forces a distance of at least $0.710647716\ldots$ from a random permutation. The conjectured formula predicts $0.681595297\ldots$. The gap is strict. The result concerns the formula in Nestoridi–Yan's arXiv version 1; the established cutoff theorem remains intact.

## Summary for specialists

Let $N$ be even. Half the labels have selection probability $b/N$ and half $(2-b)/N$, for fixed $0<b<1$. Each discrete step samples two labels independently, retains identity self-samples, and transposes distinct labels. At

$$t_N=\left\lfloor\frac{N(\log N-\log6)}{2b}\right\rfloor,$$

the candidate proves

$$\liminf_{N\to\infty,\,2\mid N}d_N(t_N)\ge B_0=\frac32e^{-1/2}-4e^{-3}.$$

The proposed value is $D_0=5/(2e)-13e^{-4}$, and exact arithmetic certifies

$$\frac{29}{1000}<B_0-D_0<\frac{291}{10000}.$$

Thus Conjecture 1.6 in arXiv:2409.16387v1 fails at $s=\log6$ for every fixed slow weight in the stated range.

## Technical account

An untouched slow label remains fixed. At the chosen time, the number of untouched slow labels converges to a Poisson law of mean three. In stationarity, the number of fixed slow labels converges to a Poisson law of mean one half. The difference between the probabilities of having at least two such labels gives the displayed full total-variation lower bound. Returned labels need no joint limit theorem for this argument.

A second proof uses only eleven untouched factorial moments and ten stationary factorial moments. The rational witness $5730077809/8174960640$ exceeds the conjectured value by more than $19/1000$. A general deterministic-subset theorem then produces one-sided Poisson tail bounds for sparse and continuously distributed slow weights.

## Evidence, assurance and limitations

The written argument is the main evidence for the asymptotic claims. Exact arithmetic verifies the strict inequalities and four finite event bounds. An implementation-diverse replay within the package checks eight families on all $8!$ states and all 61 stored times, plus smaller integer and spectral checks. The final suite rejects 23 deliberately corrupted inputs or publication fields.

Five internal editorial roles and one bounded confirmation review inspected frozen packages. The confirmation found no new scientific blocker and required deterministic repairs to publication records and formula correspondence. Those reports are available with their original decisions and subsequent disposition. External review, independent reproduction, formal proof and historical priority remain unestablished.

The general $t_{\rm mix}=t_*+O(n)$ upper bound remains open here. Larger inherited numerical experiments are preserved for provenance and were not fully replayed. The manuscript's article and supplementary dossier are explicitly separated.

## Relationship to earlier work

Nestoridi–Yan's arXiv v1 states the targeted profile conjecture; the official 2025 FPSAC poster restates it. Their proceedings article treats cutoff and spectral results and does not discuss the profile. Teyssier's uniform-transposition profile supplies the classical benchmark. The source audit also records a forthcoming journal listing for Nestoridi–Yan; no public final text was located in the bounded search.

The earlier Evidence Press release on bounded product weights concerns cutoff and a window bound. This candidate addresses a specific profile and uses an observable subset event. Its proof does not depend on the earlier Evidence Press candidate.

## Who should care, and why

| Audience | Potential use | Qualification |
|---|---|---|
| Mixing-time researchers | Inspect a precise profile counterexample and subset lower-bound method. | The replacement profile is unresolved. |
| Sampling researchers | Investigate diagnostics sensitive to slow subgroups. | No guarantee transfers automatically to other chains. |
| Research agents | Reuse exact inequalities, model conventions and replay controls. | Preserve the distinction between finite checks and asymptotic proof. |

## Why the problem matters

A cutoff says that a transition is abrupt; a profile describes its detailed shape. A formula for that shape must survive every observable event. This example shows how a small amount of class information can challenge a prediction suggested by an aggregate statistic.

## How to inspect or reproduce the recorded checks

Extract the versioned archive and run `python3 code/verify_manifest.py` before changing any files. Run `python3 code/verify_exact.py`, then install `requirements-numerical.txt` and run `python3 code/verify_numeric.py --input source_inputs/biased_transposition`. The hostile suite is `python3 code/test_negative_controls.py`; repeat with `python3 -O` to check that optimization does not remove acceptance gates.

`python3 code/verify_claim_surface.py --documents` additionally checks headline formulas and regenerates the TeX and PDF text. This route requires the recorded Pandoc, Tectonic and Poppler tools. Read Section 2 for the event proof and Section 3 for the general subset argument.

## The most valuable next projects

1. Inspect the full proof and pinned source correspondence independently.
2. Determine the correct limiting profile for the two-class walk.
3. Find matching upper bounds for general bounded product weights.

## Who might contribute

Researchers in Markov-chain mixing, random permutations and asymptotic probability can examine the proof and its novelty. Independent verifier runs would add a separate evidence record.

## What is in the evidence package

The archive contains the 13-page candidate paper, six-page audit, Markdown and TeX, code, exact contract, replay reports, internal reviews, complete manifest and component licences. Original prose and research data are CC0-1.0; original code is MIT. Inherited inputs retain their recorded rights and are not relicensed.
