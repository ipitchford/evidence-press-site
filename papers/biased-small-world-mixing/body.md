## Summary

Adding shortcuts to a ring makes distant places closer, but a random walker can still take a long time to forget its starting point. This candidate asks whether a fixed preference for moving in one direction changes that.

The written proof gives logarithmic mixing in the denser shortcut regime and square-root mixing up to polylogarithmic factors in the sparser one. It covers four explicitly specified ways of measuring time, including a nonlazy discrete walk. These are fixed-weight results, not a theorem about every way of adding drift. The release is an unrefereed candidate.

## Summary for specialists

Fix $\epsilon>0$ and $u>v>0$ independently of $n$. Add each undirected noncycle pair independently with probability $p$, give forward and reverse cycle edges weights $u,v$, and give shortcuts unit weight. The candidate claims, with high probability over the graph, worst-start total-variation mixing at tolerance $1/4$:

$$
p=\epsilon/n:\quad t_{\rm mix}=\Theta(\log n),
$$

$$
p=\epsilon n^{-3/2}:\quad c\sqrt n\log n\le t_{\rm mix}\le C\sqrt n(\log n)^{18}.
$$

The four clocks are the fixed-edge-rate generator $Q$, the rate-one generator $D^{-1}Q$, the lazy kernel $(I+J)/2$, and the nonlazy kernel $J=I+D^{-1}Q$, where $D_{ii}=u+v+d_i$. The invariant law is uniform for $Q$ and proportional to $D_{ii}$ for the other clocks. “Dense” means the denser regime, still with bounded average shortcut degree. The sparse logarithmic exponent is deliberately loose.

## Technical account

The proof separates four obstacles that a shortcut-endpoint calculation alone cannot resolve.

1. **Random spacing:** evenly spaced endpoints can retain a slow phase mode. In the sparse graph, geometric-gap conditioning and adaptive phase bounds supply coercivity across the relevant frequency windows.
2. **Physical time:** crossing duration and destination are dependent. The dense proof controls their joint characteristic kernel, removes the zero-duration atom before inversion, and retains only a stationary second-moment assumption.
3. **Worst starts:** a small average distance does not control exceptional vertices. A simultaneous bound for connected endpoint sets and a clock-potential estimate provide the separate upgrade.
4. **Parity:** continuous-time mixing does not automatically de-lazify a walk. Signed crossing kernels and negative-side resolvents address the nonlazy obstruction.

Trace elimination, resolvent factorisation, Fourier inversion and configuration-model simplicity are established ingredients. The candidate contribution is their model-specific synthesis into the displayed physical, worst-start bounds, not a claim that those elementary identities are new.

## Evidence, assurance and limitations

The seven-page entry-point paper identifies the complete dependency chain; the archive contains the detailed proof modules. Exact rational programs check finite traces, crossing moments, flux identities and resolvent factorizations. Normal, optimised and fresh-extraction replay is supplemented by three deliberately corrupted implementations that the checker rejects.

Those tests do not certify high-probability graph estimates or the asymptotic theorem. The supplied review and five-role producer-coordinated editorial assessment are documented at their actual scope. Unaffiliated specialist validation, formal verification and historical priority remain unestablished. Fixed weights, nonvanishing bias and the sparse polylogarithmic gap are substantive limitations. No performance benefit in deployed networks is measured.

## Relationship to earlier work

The reversible Newman–Watts benchmark has logarithmic-squared mixing. Earlier sparse-cycle bounds, directed-cycle spectral estimates, fixed-shortcut-count theorems and average-start results answer related but different questions. The package compares their models, clocks and starting-state quantifiers explicitly. In particular, a theorem with a fixed number of shortcuts cannot simply be evaluated at a shortcut count growing with the network.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probability researchers | Inspect physical-time and worst-start bridges for a nonreversible random graph | The complete asymptotic proof still needs unaffiliated scrutiny |
| Markov-chain method developers | Test the reusable renewal and parity arguments in other settings | Verify every contraction, moment and clock hypothesis anew |
| Research software reviewers | Reproduce finite identities and challenge checker semantics | Finite replay is not theorem certification |

## Why the problem matters

Graph distance and endpoint expansion are tempting proxies for mixing, but they can miss timing, dependence and parity. This candidate makes those missing steps explicit. Its potential value lies in a checkable route from a random network to the behaviour of the actual walk, rather than a spectral calculation alone.

## How to inspect or reproduce the recorded checks

Download the exact versioned ZIP and its separate replay companion. From a fresh extraction, run `python3 package.py --verify`, then `verify_trace.py`, `verify_nonlazy.py` and `semantic_controls.py`, both normally and with `python3 -O`. The exact checks require only the Python standard library; the producer used Python 3.14.7 and hosted CI checks Python 3.12. The optional NumPy diagnostic is floating-point exploration, not part of the exact evidence.

## The most valuable next projects

First reconstruct the dimension-uniform renewal estimate, adaptive phase bound and simultaneous connected-set bound independently. Then investigate whether the sparse logarithmic gap can be reduced. Extensions to vanishing drift or different weights are new problems with new hypotheses, not already established applications.

## What is in the evidence package

The release includes the formatted paper and source, complete Markdown proof modules, a cross-file notation guide, a theorem-level literature comparison, exact checkers and mutation controls, claim and assurance records, internal editorial reports and responses, licences, a manifest and a separate hash-bound fresh-replay receipt. GitHub and Zenodo carry the same declared release bytes.
