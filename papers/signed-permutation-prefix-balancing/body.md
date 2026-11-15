## Summary

**In one sentence.** Five fixed lists of numbers force a running total to reach $5/2$ in every even dimension from four up, so in dimension four the best possible balancing constant for this problem is exactly $5/2$; deciding on the fly, $5/2$ cannot be beaten in any dimension from four up, and from dimension eight it cannot even be reached.

**The everyday problem.** Lists of numbers arrive one after another. Each list has $n$ entries, every entry between $-1$ and $1$. You keep a running total, entry by entry. Before adding each list you may do two things: flip all its signs, and shuffle its entries into any order. What you may not do is reorder the stream. The goal is to keep every entry of every running total as close to zero as possible, and the score is the largest absolute entry ever seen. Think of $n$ workers sharing a stream of jobs, each job a list of loads: you may rotate who takes which part of a job, and you may run a job "in reverse", and you want no worker ever to be far out of balance.

**Why it matters.** This is a member of the *vector balancing* family: Spencer's "six standard deviations" theorem, Steinitz-type problems about running totals, and online discrepancy, where each choice must be made before the next item is seen. With sign flips alone, the best guarantee grows like $\sqrt n$. Allowing the shuffles changes the scale completely. In October 2026 Niles-Weed, Sadovsky and Shkrob ([arXiv:2610.02127](https://arxiv.org/abs/2610.02127)) proved that $3-2/n$ always suffices, even when every choice is made on the fly, recorded an example showing that $2$ cannot be beaten, and asked for the exact best constant. The problem, the upper bound $3-2/n$ and the lower bound $2$ are theirs.

**What is new here.** Write $C_n^{\mathrm{off}}$ for the best constant when the whole stream is known in advance, and $C_n^{\mathrm{on}}$ for the best constant when each choice is made on the fly by a deterministic strategy.

| Result | In plain terms | Where |
|---|---|---|
| Five lists force $5/2$ | In every even dimension $n\ge4$, five fixed lists make some running total reach $5/2$, whatever flips and shuffles you choose | Theorem 3.1 |
| Dimension four settled | Since $3-2/4=5/2$, the best constant in dimension four is exactly $5/2$, both offline and on the fly | Corollary 4.3 |
| On the fly, every dimension | You cannot stay below $5/2$ in any dimension $n\ge4$, odd ones included | Proposition 5.2 |
| On the fly, above $5/2$ | From dimension $8$ you cannot even stay at $5/2$ (for example, at least $5/2+1/4096$ when $n=8$); from dimension $52$ the forced level is at least $161/64=2.515625$ | Theorem 5.4, Corollary 5.5 |
| Dimension three | On the fly, at least $13/6$, from a computer-checked strategy certificate | Proposition 6.1 (computer-assisted) |

**The five lists.** In dimension four they are $v_1=(-1,-1,-1,1)$, $v_2=\tfrac12(1,1,1,1)$, $v_3=(-1,-1,1,1)$, $v_4=(1,1,1,1)$ and $v_5=(-1,-1,1,1)$.

The first list puts three entries at $-1$ and one at $1$ (after a choice of sign and order, which does not matter). If the half-list is added downwards, three entries sit at $-3/2$ and the next list, which has two entries $-1$ whichever way it is flipped, must push one of them to $-5/2$. So it goes upwards. The third list must then pull the one entry at $3/2$ back down, the fourth list is forced upwards, and that leaves three entries at $3/2$ against only two entries $-1$ in the last list, so some entry reaches $5/2$.

**The key idea.** Every lower bound is a counting argument: a list with exactly $h$ entries equal to $-1$, whatever its sign, can rescue at most $h$ entries that are already in danger. For the on-the-fly bounds above $5/2$ the new tool is the *plateau amplification lemma*. Once two or more entries of the running total are tied at the maximum, the adversary presents a short sequence of lists, each with a few entries $1$ and a small negative number everywhere else, the negative number doubling each time. Every way of placing them pushes the maximum a little higher. Reaching such a plateau at $5/2$ takes four lists.

**Limits.** Whether $5/2$ can be beaten when the whole stream is known in advance is open, and so is whether $3-2/n$ is exactly right in every dimension (it is for $n=2$ and $n=4$). The $5/2$ obstruction is about running totals: for the five lists above, the final total alone can be kept to $3/2$. The margins above $5/2$ are tiny except for the $161/64$ bound. Odd dimensions have only the on-the-fly bound. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computer checks only.

## Summary for specialists

Inputs are sequences $v_1,\dots,v_m\in[-1,1]^n$; a play chooses $\varepsilon_i\in\{\pm1\}$ and $\sigma_i\in S_n$, with prefix sums $s_k=\sum_{i\le k}\varepsilon_i\sigma_i(v_i)$ and score $\max_k\|s_k\|_\infty$. $C_n^{\mathrm{off}}=\sup_V\min_{\text{plays}}\max_k\|s_k\|_\infty$; $C_n^{\mathrm{on}}$ is the infimum over deterministic online strategies. Always $2\le C_n^{\mathrm{off}}\le C_n^{\mathrm{on}}\le3-2/n$ by [NSS, Theorem 9 and Remark 3].

- **Theorem 3.1** *(proof)*: for $n=2h$, $h\ge2$, $1\le b\le h-1$, the input $v_1=((-1)^{[2h-b]},1^{[b]})$, $v_2=\tfrac12\mathbf 1$, $v_3=v_5=((-1)^{[h]},1^{[h]})$, $v_4=\mathbf 1$ forces $\|s_k\|_\infty\ge5/2$ for some $k$. So $C_n^{\mathrm{off}}\ge5/2$ for even $n\ge4$.
- **Corollary 4.3**: $C_4^{\mathrm{off}}=C_4^{\mathrm{on}}=5/2$. Proposition 4.2 re-derives $C_n^{\mathrm{on}}\le3-2/n$ with a mean-and-range strategy, specialising the NSS argument.
- **Lemma 5.3** *(plateau amplification, proof)*: if $\|s\|_\infty\le t$ and at least $k+1$ coordinates equal $t$, set $K(s)=\sum_{j\notin P}(\lceil t+1-s_j\rceil-1)$. If $Nk>K(s)$, the inputs $u_i=(1^{[k]},(-\epsilon_i)^{[n-k]})$ with $\epsilon_i=2^{i-1}\cdot2^{1-N}$ force sup norm at least $t+2^{1-N}$.
- **Theorem 5.4** *(proof)*: if $q\ge2$, $m\ge q+2$, $2m\le n$, $N(q-1)>2(n-q)$ and $N(m-q-1)>n+2q$, then $C_n^{\mathrm{on}}\ge\tfrac52+2^{1-N}$. For $n\ge8$ take $q=2$, $m=4$, $N=2n-3$. The least $N(n)$ is $13,15,17,18$ for $n=8,\dots,11$, then $10$ at $n=12$, $9$ at $16$, $8$ at $20$ and $7$ at $32$.
- **Corollary 5.5**: $C_n^{\mathrm{on}}\ge161/64$ for every $n\ge52$ and for $n\in\{32,36,40,41,44,45,48,49,50\}$; $N(n)\ge7$ always.
- **Proposition 5.2**: $C_n^{\mathrm{on}}\ge5/2$ for every $n\ge4$. **Proposition 6.1** *(computer-assisted)*: $C_3^{\mathrm{on}}\ge13/6$.
- **Remark 5.7**: a randomised online strategy reaches $\tfrac52+2^{1-N}$ with probability at least $1/3$ against a uniformly chosen one of three fixed sequences.

## Technical account

**The five-vector obstruction.** The vectors $v_3$ and $v_5$ are *balanced*: with either sign they have exactly $h$ entries $-1$ and $h$ entries $+1$. After $v_1$ and a choice of frame, adding $v_2$ downwards puts $2h-b>h$ coordinates at $-3/2$, so $v_3$ must create $-5/2$. Upwards, the $b$ coordinates at $3/2$ each need a $-1$ from $v_3$, leaving

$$s_3=\bigl((-\tfrac32)^{[h-b]},(\tfrac12)^{[h+b]}\bigr).$$

Then $v_4=\mathbf 1$ must go upwards, giving $h+b$ coordinates at $3/2$, and $v_5$ has only $h$ entries $-1$ to protect them. The argument counts entries, so it covers every permutation at every step. Exhaustive enumeration confirms it for even $n\le10$ and every $b$, finds the exact optimum $5/2$ for the dimension-four input, and shows its final sum alone can be kept to $3/2$.

**The opening.** Lemma 5.1 presents $w_q=((-1)^{[n-q]},1^{[q]})$, then $\tfrac12\mathbf 1$, then either $\mathbf 1$ or the balanced $B_m=((-1)^{[m]},0^{[n-2m]},1^{[m]})$, adapting to the player. Within four vectors the state either has $q$ coordinates at $5/2$ with deficit sum $\sum_j(5/2-s_j)=2(n-q)$, or at least $m-q$ coordinates at $5/2$ with deficit sum $n+2q$.

**Amplification.** In Lemma 5.3 the step sizes satisfy $\epsilon_i-(\epsilon_1+\dots+\epsilon_{i-1})=2^{1-N}$. A minus sign would push some plateau coordinate to $t+2^{1-N}$, so every step must use the plus sign and send its $k$ entries $1$ to coordinates outside the plateau. Coordinate $j$ can absorb at most $\lceil t+1-s_j\rceil-1$ of them, which totals $K(s)$; so $Nk>K(s)$ entries cannot all be absorbed. When all coordinates lie in $t+\mathbb Z$, $K(s)=n(t-\bar s)$: only the plateau size and the mean matter.

**Dimension three.** Working in units of $1/6$, the script builds $782$ states with ranks and responses such that every sign and permutation either reaches $13/6$ or moves to a state of lower rank. The zero state has rank $11$, so the adversary wins within $11$ vectors. The property is rechecked by enumerating all $3!$ permutations and both signs directly, independently of the fast move generator.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/signed-permutation-prefix-balancing.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 9-page paper except Proposition 6.1, which is a computer-assisted proof by an exact strategy certificate. The paper opens with a plain introduction, a table of known and new bounds and a roadmap. No proof assistant was used.
- **Exact checks.** `verify.py` uses only the Python standard library and exact integer or rational arithmetic, in about one minute. It cross-checks its fast move generator against brute force on $240$ cases, enumerates the five-vector input for even $n\le10$, enumerates every player response to the opening for $8\le n\le16$, plays the full dimension-eight game end to end ($342{,}734$ amplification nodes, no play below $5/2+1/4096$), checks the parameter table and builds and rechecks the dimension-three certificate. These supplement the proofs and do not replace them.
- **Tests that can fail.** Every check raises an error with exit status $1$, so the checks stay active under Python's optimised mode. Changing the expected dimension-four optimum makes the script fail under `python -O`, as it must.
- **Replay.** The script was rerun from fresh copies before release, normally and under `python -O`; its output matched the shipped `verification.json` byte for byte. GitHub CI reruns it and the negative control on every push.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round. It rewrote the introduction for non-specialists, built the bibliography from registry records, defined the offline and online constants per dimension, rewrote the script and added the on-the-fly bound for every $n\ge4$, the plateau lemma for every $n\ge8$ and the dimension-three certificate. A re-review, a proof audit and a second-model audit then found no failing result; two text-level corrections were applied. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The offline constant above $5/2$, offline bounds in odd dimensions and the sharpness of $3-2/n$ are open; bounded searches for longer forcing sequences found nothing and settle nothing. Margins above $5/2$ are tiny except the $161/64$ bound. Attributions rest on a bounded literature search; no follow-up or concurrent work on this variant was found up to 15 November 2026. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in discrepancy theory | The exact constant in dimension four and a reusable plateau amplification lemma for adversary arguments | Offline beyond dimension four, and asymptotically, the constant is not determined |
| Researchers in online algorithms | Lower bounds for online balancing with permutations above $5/2$ in every dimension from eight | Deterministic strategies; the randomised bound holds only with probability at least $1/3$ |
| People building computer-assisted proofs | A compact exact strategy certificate (782 states) for a small adversarial game | Only dimension three; trusts the script |
| Research agents | Machine-readable claims, an agent index and a one-minute exact check | The checks supplement the written proofs |

## Why the problem matters

Balancing problems ask how evenly a stream of demands can be spread when each choice is constrained. Niles-Weed, Sadovsky and Shkrob showed that permutations turn a growing bound into a constant and asked for its exact value. This release settles dimension four, the second nontrivial dimension in which the constant is known, shows that the known upper bound is exact there, and gives the first evidence that on-the-fly balancing in high dimensions needs more than $5/2$.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root (standard-library Python 3.10 or later; `verify.py` writes `verification.json` beside itself, so run a copy from a directory outside the package):

```sh
shasum -a 256 -c MANIFEST.sha256
cp verify.py /tmp/vbal/ && cd /tmp && python3 -O -I -B /tmp/vbal/verify.py
cmp /tmp/vbal/verification.json <package>/verification.json
```

`AI_INDEX.md` maps each claim to its proof and checks, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Is $C_n^{\mathrm{off}}>5/2$ for some $n$? By the plateau lemma it would suffice to find a fixed sequence after which every play within $5/2$ ends with two coordinates tied at $\pm5/2$.
2. Is $C_n^{\mathrm{off}}=C_n^{\mathrm{on}}=3-2/n$ in every dimension? Dimensions three, five and six are the smallest open cases.
3. Is $C_n^{\mathrm{off}}\ge5/2$ for odd $n\ge5$?
4. What is the offline constant for the final sum alone? The five-vector input gives no information there.

## What is in the evidence package

The paper (LaTeX source and PDF); `verify.py` and its recorded output `verification.json`; `explore.py` and `explore_log.txt`, the bounded exploratory searches reported as negative results in Section 7; `refs.bib` from Crossref, DataCite and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflows and a SHA-256 manifest.

See also the earlier Evidence Press discrepancy release on [vector-labelled perfect matchings](/releases/vector-matching-linear-discrepancy/), a different problem.
