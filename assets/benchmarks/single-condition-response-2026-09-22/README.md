# Complete single-condition dynamics need not identify a response

Dated teaching benchmark: 22 September 2026. Attribution: Quentin Thommen,
[arXiv:2609.17031v1](https://arxiv.org/abs/2609.17031v1), Sections III-V,
particularly equations 14-21. The arXiv submission is dated 15 September;
the manuscript's internal date is 16 September. This benchmark implements the
published example; it is not a new theorem or a claim of priority.

## Exact pair and assumptions

Let u>0 be a dimensionless chemostat concentration with reference value 1.
Keep k>0 and gamma>0 fixed across conditions. Y is a nonnegative integer count.
Both models have birth rate k*u. A has death rate gamma*y; B has gamma*u*y.
Chemically, U catalyses production in both models and removal only in B.
The environmental powers are (1,0) and (1,1), respectively.

The observation consists of the internal-state process, not independently known
chemical incidence. At u=1 both generators are exactly

    L f(y) = k [f(y+1)-f(y)] + gamma*y [f(y-1)-f(y)].

The death term is absent at y=0. These nonexplosive immigration-death chains
therefore have identical path laws at the reference condition when started
with the same initial distribution. This is stronger than equal means or
equal compressed summaries. It does not mean every environmental condition
has been observed.

For a positive immigration rate lambda and death coefficient d, the stationary
law is Poisson(lambda/d): its probabilities satisfy detailed balance
pi(y)*lambda = pi(y+1)*d*(y+1). Hence the means here are k*u/gamma and k/gamma.
Their logarithmic elasticities are 1 and 0. For B, changing u rescales time;
stationary insensitivity alone says nothing about a feedback mechanism.

## What the controls establish

- Negative: more observations at u=1 cannot separate identical path laws.
- Positive: at any u>0 with u!=1, the death coefficients differ by gamma*(u-1),
  and the stationary means differ by (k/gamma)*(u-1). Thus exact observations
  at a second condition distinguish this fixed pair.
- Assumption failure: if B is allowed a different fitted gamma_B=gamma/u at
  each condition, equality with A is restored. That changes the admitted model
  class; it does not contradict the fixed-parameter positive control.
- Hostile checks reject a false equal-generator claim at u=2 and the false
  elasticity 1 for B. Zero environmental concentration is explicitly excluded.

The code compares generator coefficients for all y, not a truncated state
space. It represents means as rational monomials and computes elasticity from
the exponent. The written identities above justify arbitrary positive k,
gamma and u; the rational test cases are regression controls, not an exhaustive
proof over real parameters. Finite noisy data require a separate power or
likelihood analysis. Two conditions do not identify every unrestricted model.

## Use in the two EP syntheses

For Aggregation Without Sufficiency, the observation map can send an entire
environment-indexed model to its reference generator. The collision then
concerns environmental continuation, not loss from compressing trajectories.
This does not strengthen the elementary factorisation theorem.

For When a Unique Answer Is Not an Identified Answer, selecting which channel
depends on u selects a response from the reference-data equivalence class.
The Selector Ledger should record whether that restriction comes from chemical
evidence or an assumption, and which new observation would distinguish it.

Neither connection empirically validates an Aggregation Licence or Selector
Ledger, nor upgrades their archived assurance. The broader preprint, including
its separate linear-noise approximation argument, is not certified by this
benchmark. The full manuscript was read for scope; no complete-paper reproduction
or external specialist review is claimed.

## Reproduce

Download [benchmark.py](benchmark.py) and [benchmark.json](benchmark.json) into
one directory, compare them against [SHA256SUMS](SHA256SUMS), and run:

```sh
python3 benchmark.py
python3 -O benchmark.py
```

The tests use standard-library unittest and explicit exceptions, so optimized
Python does not disable the checks. [Captured output](replay-output.txt) records
the local interpreter and both runs. [Machine-readable record](benchmark.json).
The source-paper PDF hash is retained in [source-check.txt](source-check.txt);
the paper itself is not redistributed.

Original prose and metadata: CC0-1.0. Original benchmark code: MIT, copyright
2026 Evidence Press contributors; see [LICENSE](LICENSE). Source-paper rights
remain with its rights holders.
