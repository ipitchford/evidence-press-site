## Summary
A point in a network can have no strictly better center nearby and still fail to be a center. This candidate constructs median graphs where the first strict improvement is extremely far away relative to cube dimension. It answers a proposed dimension-linear locality question negatively.

## Summary for specialists
For every odd $d\ge3$, an explicit finite median graph of cube dimension $d$ has a noncentral origin with exact first strict eccentricity improvement distance $2F_d-1$. A transfer proposition realizes the minimum integer $\ell_1$ separation norm of any strictly feasible sign system as that graph distance. Alon–Vũ's threshold-weight theorem then gives the lower bound $d^{d/2}2^{-(2+o(1))d}$ for every sufficiently large $d$.

For binary corner profiles on integer grids, a determinant argument supplies an upper bound $d^{d/2+1}$. Consequently the extremal logarithm is $(1/2+o(1))d\log_2d$. That upper bound is restricted to the corner-profile model.

## Technical account
In the integer box $[-N,N]^d$, the distance from $x$ to corner $Ns$ is $dN-s\cdot x$. Thus improving the maximum distance to selected corners requires every corresponding dot product to be positive. Integer threshold representations can force the first feasible vector to have very large norm.

An alternating AND/OR function yields an exact Fibonacci example with a self-contained proof. Long pendant paths at selected corners make their far endpoints determine ordinary eccentricity; the paths preserve the median property and cube dimension. The stronger all-dimensions estimate uses established work of Alon and Vũ. The threshold-weight theorem itself is not a new result of this release.

The cover is a schematic grid-and-pendant-path composition, not a full drawing of a high-dimensional example or numerical evidence.

## Evidence, assurance and limitations
The written proofs establish the proposed mathematical result. The exact checker audits eight finite Boolean instances, excludes closer improving grid vertices in dimensions three and five, and checks every distinct triple in the complete 51-vertex example. Normal and optimized Python runs include three negative controls.

This remains an unrefereed candidate. Producer replay and internal model-mediated editorial reports do not establish unaffiliated reproduction, journal peer review, formal verification or historical priority. A supplied separate checker was rerun locally, but its authorship and unaffiliated status are unverified.

Strict decrease matters: in the smallest example an equal-value move of length two permits a later improvement of length one. No running-time lower bound for arbitrary algorithms follows. Cube dimension is not graph order, and the constructed graphs can be large.

## Who should care, and why
| Audience | Potential use | Required caution |
|---|---|---|
| Graph theorists | Test radius-unimodality conjectures against explicit median graphs | General median-graph upper bounds remain open here |
| Threshold theorists | Translate integer-weight lower bounds into graph locality | The cited weight theorems are prior work |
| Algorithm researchers | Identify limits of immediate-descent certificates | Plateau moves and global algorithms remain available |

## Why the problem matters
A local optimality test is useful only when its inspection radius is justified. These examples show that the proposed radius cannot scale linearly with cube dimension, or even as any fixed-base exponential. The result clarifies what a local certificate can promise; it does not undermine established global eccentricity algorithms.

## How to inspect or reproduce the recorded checks
Download and extract the versioned evidence archive. With standard-library Python, run:
```
python3 verify.py --output replay.json
python3 -O verify.py --output replay-optimized.json
```
Compare both outputs with `verification.json`, then check `MANIFEST.sha256`. Read Sections 2–4 for the universal proofs, and the primary Alon–Vũ source for the external theorem. Finite replay is not a substitute for those arguments.

## The most valuable next projects
Determine upper bounds for all median graphs, study plateau-permitting movement, and reduce graph order while retaining large strict-improvement distances. An unaffiliated proof review and separate reimplementation would strengthen assurance without changing the current status retrospectively.

## What is in the evidence package
The package includes PDF, Markdown and TeX manuscripts; the exact verifier and expected output; claim and source records; internal editorial reports; the response to the supplied review; licence boundaries; and a complete file manifest. Original prose and data use CC0, and original code uses MIT. Cited papers and supplied third-party review files are linked or described, not relicensed or redistributed.
