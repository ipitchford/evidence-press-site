## Summary

Can one spreading event reveal a tightly connected group when the network itself is hidden? This candidate gives a mathematical yes under a specific random-network model. It uses the times at which vertices become infected; identifying the recovered group also requires their labels.

The rule looks for unusually fast stretches of infection and chooses the widest qualifying stretch. A hidden dense group can create such a burst even when its size is below the square root of the population. The guarantee concerns a limit as the network grows, not every finite network.

**The practical qualification is substantial:** all twelve planted cases in the recorded small pilot failed. Eight were structurally unable to improve on the empty answer because the minimum allowed window was larger than twice the hidden group. These failures are preserved, not tuned away.

## Summary for specialists

Edges are independent: probability $\xi\in(0,1]$ within a fixed set $S$ of size $s$, and $p=d/n$ otherwise. The source is uniform and independent. Transmission clocks have known rate one, and the full infection sequence is observed. The method assumes the background degree $d$ is known but does not use $s$ or $\xi$.

Writing $L=\log n$, scan intervals $(k,k+w]$ with $w\ge\lceil L^3\rceil$, finite endpoints, and

$$t_{k+w}-t_k\le\frac{w}{d(k+w)L}.$$

Choose the widest accepted interval, breaking ties by the earliest start. For $d=L^2$, the original theorem gives consistent detection and relative recovery for $s=\lfloor n^\alpha\rfloor$, $1/3<\alpha<1$.

The strengthened theorem permits arbitrary deterministic $s\le n$ and known $d$ satisfying

$$\frac dL\longrightarrow\infty,\qquad \frac{ndL^2}{s^3}+\frac{dL^2}{s}\longrightarrow0.$$

With probability tending to one, uniformly over placements of $S$,

$$|\widehat S\triangle S|\le1+\frac{2s}{\sqrt L-1},\qquad |\widehat S|/s\longrightarrow1.$$

Under the null the output is empty with probability tending to one. For $d=L^2$, the stronger sufficient size condition is $s\gg n^{1/3}L^{4/3}$. This is not an optimal boundary, and it does not include the bare cube-root endpoint.

## Technical account

The argument separates two tasks. First, on a simultaneous external-degree event, infections outside the planted set have a controlled counting-process intensity. An exponential tail bound applies to every candidate interval before any interval is selected. Thus a rapid interval cannot contain many background vertices; selecting it afterwards does not invalidate the bound.

Second, a coupling with an ordinary random graph bounds the index of first entry into the hidden group. Once entered, all internal cuts are large with high probability, so the remaining planted vertices are reached quickly. Background growth is bounded over a deterministic time horizon, without conditioning on unusually fast completion. This produces a long accepted interval as a witness. The widest observable interval must be at least as long and therefore misses few planted vertices.

The general-background extension replaces fixed logarithmic slack in this proof with a slowly diverging auxiliary sequence. The auxiliary sequence depends on the theorem's parameters but is never used by the estimator. The original scan and adverse pilot remain unchanged. The proof explicitly includes $s=n$ and retains the final infection in each stopped interval count.

## Evidence, assurance and limitations

The scientific evidence is a written probabilistic argument. Supplied review and targeted internal checking are not external specialist certification, editorial peer review or a proof-assistant verification. Fresh internal checking passed seven finite tests in normal and optimized Python, plus byte-identical replay of all sixteen recorded pilot outcomes in normal Python, including the negative cases. The [replay receipt](https://github.com/ipitchford/delayed-cascade-recovery/blob/v1.1.0-candidate/REPLAY_RECEIPT.md) records scope and commands. Finite tests cannot prove the asymptotic theorem.

The pilot used two null cases and two cases at each of three planted-size exponents for each of $n=1000$ and $n=3000$. All sixteen outputs were empty: four correct null outputs and twelve failed recoveries, each with relative error one.

| Population | Exponent | Planted size | Minimum window | Empty outputs |
|---:|---:|---:|---:|---:|
| 1,000 | 0.40 | 15 | 330 | 2/2 |
| 1,000 | 0.60 | 63 | 330 | 2/2 |
| 1,000 | 0.85 | 354 | 330 | 2/2 |
| 3,000 | 0.40 | 24 | 514 | 2/2 |
| 3,000 | 0.60 | 121 | 514 | 2/2 |
| 3,000 | 0.85 | 902 | 514 | 2/2 |

If the minimum window is $m>s$, every nonempty output has relative error at least $m/s-1$. In the eight runs at exponents 0.40 and 0.60 this exceeds one, so no observations could make the frozen rule beat the empty answer. At exponent 0.85 the observed planted burst still missed the threshold. Reused seeds across different settings mean the sixteen cases should not be pooled as mutually independent trials.

No useful finite-size power, exact recovery, optimal threshold, unknown-rate calibration, noisy timestamps or missing observations is established. The theorem averages over the specified graph, source and clocks; it does not hold uniformly over arbitrary realized networks.

## Relationship to earlier work

Dreveton, Mürmann and Thiran's 2026 preprint supplies the closest model and important first-entry and population-dependent growth comparisons. Those ingredients are credited, not presented as discoveries here. Their theorem works for fixed exponent above one half and estimates background and internal densities. In the overlapping $d=(\log n)^2$ setting, their error guarantee is of order $(\log n)^3$ in probability, sharper than this candidate's bound of order $s/\sqrt{\log n}$.

The residual advance is the combination of simultaneous contamination control, delayed-burst reasoning and an observable widest-window rule in a smaller sufficient size regime. It is not a blanket improvement over the earlier method. Results for a bounded number of separated high-degree vertices concern a different hidden structure and do not supply an impossibility theorem for this growing adjacent group.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probabilists | A bounded single-cascade recovery argument and explicit sufficient density–size conditions | Written proof candidate, not a sharp threshold |
| Statistical-inference researchers | A selection-safe approach to detecting collective bursts | Known background and clock scale; complete observations |
| Network practitioners | A clear distinction between asymptotic identifiability and finite-size usefulness | The recorded pilot supplies no successful recovery |

## Why the problem matters

Often a spreading process is visible while the contacts beneath it are not. This model asks what information can survive that loss of access. The theorem suggests that collective internal connectivity can leave a recoverable timing signature under explicit assumptions. It does not establish an epidemic-detection tool or validate the random-network model for a particular application.

## How to inspect or reproduce the recorded checks

Begin with the paper's model, estimator and two theorems. Check that the proof uses known $d$ and rate-one clocks, and distinguish the latent witness from the observable selection rule. Then consult the [replay instructions](https://github.com/ipitchford/delayed-cascade-recovery/blob/v1.1.0-candidate/REPLAY_RECEIPT.md), [environment record](https://github.com/ipitchford/delayed-cascade-recovery/blob/v1.1.0-candidate/ENVIRONMENT.txt) and [agent-readable index](https://github.com/ipitchford/delayed-cascade-recovery/blob/v1.1.0-candidate/AI_INDEX.md) to reproduce the frozen pilot and inspect finite scanner checks.

Expect the preserved pilot to fail in all twelve planted cases; a replay that silently replaces these outcomes is not reproduction. Tests of indexing, tie-breaking, shortest paths or corrupted fixtures validate those finite implementation details, not the universal probability limit.

## The most valuable next projects

The most useful next step is a separately specified finite-size rule with justified calibration and genuinely informative success and failure regimes. Other distinct projects are unknown-background estimation, timestamp noise, sharper error guarantees and matching lower bounds. None is required to pretend the current candidate is stronger than it is, and none has been completed here.

## What is in the evidence package

The package brings together the mathematical manuscript, the frozen pilot and its negative outcomes, review responses, source comparisons, scoped checking records and an agent-readable claim map. The [final replay record](https://github.com/ipitchford/delayed-cascade-recovery/blob/v1.1.0-candidate/REPLAY_RECEIPT.md) gives exact commands and coverage; the [review response](https://github.com/ipitchford/delayed-cascade-recovery/blob/v1.1.0-candidate/review-response.md) maps the revisions. Historical review conclusions apply to the version they inspected; new extension checks remain internal. Archive availability, code replay and mathematical correctness are separate facts.
