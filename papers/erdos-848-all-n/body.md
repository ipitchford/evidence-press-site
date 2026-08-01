## Summary

A number is *squarefree* if no perfect square bigger than one divides it: 10 is squarefree, 12 is not (it is divisible by 4). Erdős and Sárközy asked a deceptively simple question. Pick numbers between 1 and $N$ so that whenever you multiply two of your picks together and add one, the result is *never* squarefree. How many numbers can you pick?

There is a natural strategy: take every number that leaves remainder 7 when divided by 25. Multiply two such numbers and add one, and the result is always divisible by 25 — never squarefree. This gets you roughly $N/25$ picks, and Erdős asked whether you can do meaningfully better. Recent breakthrough work showed that for all *sufficiently large* $N$ you cannot. But "sufficiently large" leaves infinitely many actual values of $N$ unresolved.

This release establishes the complete answer: for every $N$ from 1 upwards, the maximum is exactly $\lfloor (N+18)/25 \rfloor$. The gap between "small" and "sufficiently large" is bridged by five overlapping verification regimes — exact certificates up to a hundred million, structural and exact-rational arguments through $2.64 \times 10^{17}$, and an explicit analytic theorem beyond that.

## Summary for specialists

Let $f(N)$ be the largest size of $A \subseteq \{1, \ldots, N\}$ such that $ab+1$ is nonsquarefree for all $a, b \in A$, including $a = b$. Erdős problem 848 asks for $f(N)$ and whether the residue-class construction $\{n \equiv 7 \pmod{25}\}$ is optimal. van Doorn proved $|A| \leq (0.108\ldots + o(1))N$; Sawhney resolved the problem for all sufficiently large $N$, with the stronger structural statement that any near-extremal set lies in $\{n \equiv 7\}$ or $\{n \equiv 18\} \pmod{25}$.

This release claims $f(N) = \lfloor (N+18)/25 \rfloor$ for *every* positive integer $N$, via five overlapping ranges: exact finite colouring certificates with compact endpoint induction for $1 \leq N \leq 100{,}000{,}006$; exhaustive structural decomposition for $10^8 \leq N \leq 10^9$; exact-rational short-shift envelopes to $10^{12}$; exact-rational rank envelopes to $2.64 \times 10^{17}$; and Sothanaphan's explicit-threshold theorem beyond. Each regime overlaps its neighbours, and the whole is replayed by a Python framework with semantic mutation testing and sanitizer controls, plus a standalone C++ verifier for the certificate range.

The weight of novelty is in the middle ranges: the envelope arguments are bespoke, and independent scrutiny should start there and at the hand-off to the analytic threshold.

## Technical summary

Write $f(N)$ for the extremal size. The claimed identity $f(N) = \lfloor (N+18)/25 \rfloor$ is equivalent to two statements for every $N$: the residue construction achieves $\lfloor (N+18)/25 \rfloor$ (immediate — the count of $n \leq N$ with $n \equiv 7 \pmod{25}$), and nothing does better. The release discharges the second statement in five overlapping regimes.

For $1 \leq N \leq 100{,}000{,}006$ the release ships exact finite colouring certificates: combinatorial data assigning to each interval a witness structure whose validity implies the bound, compressed as a colouring-delta binary and replayed by a standalone C++ verifier, with a compact induction closing the endpoints. For $10^8 \leq N \leq 10^9$ an exhaustive structural decomposition reduces to the certified lower range. From $10^9$ to $10^{12}$, and again from $10^{12}$ to $2.64 \times 10^{17}$, the argument switches to exact-rational "short-shift" and "rank" envelopes — monotone bounding functions whose coefficients are exact rationals, so the comparisons are replayable without floating point. Beyond $2.64 \times 10^{17}$, Sothanaphan's explicit-threshold theorem (an external, pinned PDF with recorded SHA-256) takes over, resting in turn on Sawhney's structural resolution for large $N$.

Every regime overlaps its neighbours, so the composite claim has no uncovered interval — *if* each regime is sound. The envelope arguments in the middle ranges are the bespoke component; the replay framework subjects them to semantic mutations (deliberate perturbations that must fail) and sanitizer controls, but they have had no external scrutiny.

## Who should care, and why

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Combinatorial number theorists | An exact all-N determination layered directly on the recent asymptotic resolution — the unusual half of the problem is precisely the finite one. | Referee the envelope arguments; check the hand-off at 2.64 × 10^17 against the threshold theorem's exact hypotheses; test the closed form at accessible N. |
| Researchers on the Erdős problems catalogue | Problem 848 is recorded as resolved for large N; this claims the remaining gap. | Assess whether the evidence justifies updating the problem's status; identify neighbouring problems (such as 844) where the architecture transfers. |
| Certificate and reproducibility engineers | A 75.6 MB package mixing C++ verification, Python replay with mutation testing, and pinned external dependencies. | Replay on independent toolchains; audit the SHA-256-pinned external PDF dependency pattern, which is unusual and worth standardising or criticising. |
| Analytic number theorists | The explicit-threshold layer converts an asymptotic structural theorem into a concrete cut-over point. | Verify or sharpen the 2.64 × 10^17 threshold; a lower verified threshold would shrink the certificate burden by orders of magnitude. |
| AI-assisted mathematics researchers | An AI system is the listed creator of a result that leans, with explicit pinning, on two named human mathematicians' work. | Examine the provenance and attribution model; test whether the claim–evidence index supports genuinely independent re-derivation. |

## The most valuable next projects

### 1. Scrutinise the envelope regimes

The exact-rational short-shift and rank envelopes covering $10^9 \leq N \leq 2.64 \times 10^{17}$ are the least conventional part of the architecture and carry most of the novel risk. An expert reading — or an independent reimplementation of just these ranges — would either expose the weak joint or convert the release's most original contribution into its most trusted one.

### 2. Confirm the analytic hand-off

The composite proof is only as sound as the splice at $2.64 \times 10^{17}$: the pinned threshold theorem must cover all larger $N$ under exactly the normalisation of $f(N)$ used below the splice. Checking hypothesis alignment at a single boundary is a well-posed, bounded task with outsized consequences.

### 3. Shrink the certified range

The certificate range up to $10^8$ exists because the analytic threshold is astronomically high. Any improvement to the explicit threshold propagates directly into a smaller, faster, more auditable package — a rare case where analytic sharpening has an immediate engineering payoff.

## Specialist audience candidates

The natural specialist readers are the mathematicians whose work the release builds on and pins — the authors of the large-N resolution and the explicit-threshold note — together with the maintainers of the Erdős problems catalogue and the community around certified combinatorial computation. This identifies intellectual proximity, not a prediction of endorsement.

The strongest pitch to them is:

> The asymptotic resolution of problem 848 left infinitely many finite cases open; this package claims all of them, with an exact closed form and a replayable certificate chain from N = 1 to the analytic threshold.

## Why the last step matters

Asymptotic resolutions of extremal problems are the norm in combinatorial number theory; exact all-$N$ determinations are rare, because the finite ranges below the analytic threshold are usually astronomically beyond direct computation. The interest of this release — if it survives scrutiny — is architectural: it shows one way to industrialise the unglamorous half of a problem, by stitching certified computation to an explicit analytic bound with no uncovered gap. The same five-regime pattern could plausibly transfer to neighbouring problems.

## How the mathematics was produced

The Zenodo record lists an AI system (OpenAI Codex) as creator, with human research direction and publication management. The release explicitly credits the prior human results it builds on — van Doorn's bound and Sawhney's resolution for large $N$, and Sothanaphan's explicit threshold, which is a pinned external dependency rather than a claim of this release.

## What is in the evidence package

The 75.6 MB deposit contains the manuscript (LaTeX and PDF), the Python replay framework with mutation and sanitizer controls, the C++ verifier `verify_erdos848_to_100006.cpp` with its compressed colouring-delta binary, SHA-256 manifests, and machine-readable claim and assurance indexes (AI_INDEX, STATUS, ASSURANCE, PROVENANCE, REPRODUCIBILITY).
