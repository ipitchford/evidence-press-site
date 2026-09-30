## Summary

Imagine enlarging a quantum magnet while asking how much energy its first excitation costs. That cost can shrink towards zero as the system grows. A **uniform spectral gap** is a positive lower bound that does not shrink with size.

This candidate gives such a bound for a particular spin-2 model on the kagome lattice—the familiar pattern of corner-sharing triangles. The proposed guarantee is greater than **0.0051**, with energy measured in the paper's edge-projector normalisation. It is a conservative lower bound, not a prediction of the exact physical gap.

The key move is to change how neighbouring local blocks are compared. A pair-only test is too weak. Grouping two blocks before comparing them with a third gives a stronger route from finite calculations to all permitted lattice sizes.

## Summary for specialists

For the undecorated spin-2 AKLT Hamiltonian $H=\sum_e P_e$, where $P_e$ is the orthogonal total-spin-four projector, the candidate proves

$$\Delta_* = \frac{11(2-\sqrt3)(59-3\sqrt{313})}{3360},$$

$$\operatorname{gap}(H)\geq\Delta_*>\frac{51}{10000}.$$

The theorem covers every rectangular kagome torus with periods $m,n\geq3$ and every nonempty finite union of complete down-star edge sets. It does **not** cover arbitrary induced open patches. No square-lattice gap, local topological quantum order or perturbative stability conclusion is asserted.

## Technical account

Each nine-site down-star has a weighted local Hamiltonian and a ground-space projector. Three stars meet around an up triangle, forming a 21-site union. Exact singlet-polynomial maps describe their ground spaces. Branch symmetries split the problem into smaller invariant sectors.

The certificate checks 15 pair sectors, 35 grouped triple sectors and four weighted-block sectors. The largest matrix has order 11,524. Within each triple sector, the pair being grouped is specified explicitly; there is no unsupported claim that one fixed grouping works globally.

The local estimates yield

$$\mu_3\geq\frac{73-\sqrt{313}}{80}>\frac23,$$

$$\gamma_0\geq\frac{11(2-\sqrt3)}{42}.$$

Counting how blocks and intersecting pairs occur in hubs then gives $\operatorname{gap}(H)\geq\gamma_0(3\mu_3-2)$. This written local-to-global step is as important as the numerical checks.

For a concrete audit point, the paper's all-antisymmetric worked sector has an 83-dimensional zero-magnetisation space and a seven-dimensional common range. A rank-seven correction is enough to test the required nontrivial overlap bound. An all-rational check accepts the squared threshold $1/20$ and rejects the stronger threshold $3/100$.

## Evidence, assurance and limitations

The input tensors and coordinate changes are exact integer or rational objects. Numerical factors are only candidates. Acceptance requires bounds on **every entry** of the factor residual, including construction, rounding and conversion errors. Successful floating-point Cholesky factorisation alone does not count as proof.

The full driver rebuilt the inputs and passed all 20 stages on macOS ARM64 and in a fresh Linux CI run. The supplied review's earlier Linux/OpenBLAS replay is a separate reported record. Separately written small-system checks provide implementation diversity, but do not reimplement all 54 large validation tests. These are producer-coordinated checks, not unaffiliated reproduction or formal verification.

The written model-to-tensor correspondence and the documented conventional binary64/BLAS error model remain trust boundaries. The old proposed bound 0.0407 and its random-filter route are not certified by this release. The current theorem does not use that filter.

## Relationship to earlier work

Guo, Pomata and Wei examined the natural kagome cover, but its pair overlap exceeded the $1/6$ threshold. This candidate retains the cover and changes the sufficient local inequality. It does not claim that the earlier failed pair test succeeded.

Weighted finite-size arguments, projector compression and verified residual methods have substantial antecedents. Lemm–Sandvik–Wang treat the different hexagonal spin-3/2 model; Rai and colleagues give a broader hierarchy of local positivity certificates. The contribution claimed here is the specific grouped, symmetry-reduced kagome construction and its executable acceptance pipeline—not the invention of those general methods or superiority over a tested hierarchy.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Mathematical physicists | Audit a finite route to a uniform two-dimensional quantum gap | Preserve the exact model, normalisation and boundary family |
| Verified-numerics researchers | Inspect rational input construction and full-residual positivity checks | The software/hardware arithmetic contract is not formally verified |
| Tensor-network researchers | Reuse the branch decomposition and sector-level comparison | Numerical exploration alone does not establish the accepted inequalities |

## Why the problem matters

A size-independent gap is a structural statement about the low-energy spectrum, not merely a small-system simulation. Two-dimensional quantum systems are difficult because their state spaces grow rapidly. A finite certificate can make the proposed proof inspectable without asking readers to diagonalise an entire macroscopic lattice.

The result alone supplies neither an experimental observation nor a general theorem about all kagome materials. It concerns this explicitly defined AKLT Hamiltonian.

## How to inspect or reproduce the recorded checks

Start with the repository's [AI index](https://github.com/ipitchford/kagome-aklt-spectral-gap/blob/v0.3.1-candidate/AI_INDEX.md), then the manuscript and `ASSURANCE.md`. Verify the manifest before replaying in a separate working copy: the driver replaces generated receipts.

```sh
python tools/verify_manifest.py
python -m pip install -r requirements.txt
python code/replay.py
```

A C++17 compiler, GMP development libraries and at least 4 GiB of free memory are also required. On Homebrew installations, make the GMP include/library paths available to the compiler. Only `PASS_FULL` denotes a complete run. Quick mode deliberately omits the 50 hub checks and is not enough to verify the theorem. The observed macOS run took about six and a half minutes; this is not a runtime guarantee.

## The most useful next check

A second implementation should start with the worked 83-dimensional sector, comparing the exact coordinates, common-range rank and residual enclosure before scaling to the larger sectors. Agreement on that example would test more than another invocation of the same replay script, while still falling short of an independent verification of the whole theorem.

## What is in the evidence package

The archive contains the scientific paper and standalone LaTeX, exact constructors, deterministic checker, full execution logs and receipts, semantic negative controls, pinned Python requirements, claim/dependency ledger, AI index, source comparison and current review-response matrix. Original prose and data are CC0-1.0; original code is MIT. Private supplied reviews are retained outside the public payload, with input hashes recorded.
