## Summary

Optimal transport moves one distribution of mass onto another at the least total cost. For the quadratic cost the solution
is a map: every source point is sent to one destination. A natural question is how much that map can change when the target
changes only a little, and the answer is that it can change a great deal more than the target does. For a finite target the
source is cut into cells, one per destination, and a small move of the target can hand whole slivers of source from one cell
to another.

This release gives **exact certificates** for that movement in a planar setting. The source is uniform on a convex polygon
with rational corners; each map comes from the maximum of finitely many planes with rational coefficients. Three things are
computed exactly, in rational arithmetic, with no floating point anywhere:

- how far two maps differ, $F(u,v)=\int_K\lvert\nabla u-\nabla v\rvert^2\,d\rho$;
- the transport distance between their two targets, certified by an exact witness rather than an optimiser's say-so;
- when the second map's coefficients are only known to lie in a box, an upper bound $B$ on $F$ that holds for **every**
  single choice of coefficients in the box, with no assumption that the cells keep their shape or that any mass stays positive.

The bound $B$ can be far too generous. An example supplied by an external reviewer has $B=4$ while the true worst case is
$\varepsilon^2/4$, one four-hundredth at $\varepsilon=1/10$. The release turns this weakness into a theorem: the gap between
$B$ and the truth is at most a constant times the size of the box. Cutting the box into pieces therefore gives a certified
bracket $[\mathrm{LB},\mathrm{UB}]$ around the true worst case, whose lower end is reached by an explicit choice of
coefficients. On the reviewer's example the bracket closes to within $0.12\,\%$ after $256$ pieces.

The result is an unrefereed candidate: short proofs and exact code, replayed by the producer, but not formally verified,
independently reproduced or peer reviewed.

## Summary for specialists

Let $K\subset\mathbb R^2$ be a bounded convex polygon, $\rho$ the uniform probability on $K$, and
$u=\max_i(a_i\cdot x+c_i)$, $v=\max_j(b_j\cdot x+d_j)$ finite affine maxima with rational data. Write $T_u=\nabla u$,
$T_v=\nabla v$, $\mu=(T_u)_\#\rho$, $\nu=(T_v)_\#\rho$, and $F(u,v)=\lVert T_u-T_v\rVert_{L^2(\rho)}^2\ge W_2(\mu,\nu)^2$.

Let the coefficients of $v$ vary independently in a box with radii $(r_{j1},r_{j2},r_{j0})$, and define the envelopes
$U_j,L_j$, the possible-winner set $J(x)=\{j:U_j(x)\ge L_k(x)\ \forall k\}$ and the costs
$M_{ij}=\sum_\ell(\lvert a_{i\ell}-b_{j\ell}\rvert+r_{j\ell})^2$.

**Theorem 2 (envelope).** For every single realisation $\tilde v$ of the box,
$F(u,\tilde v)\le B:=\lvert K\rvert^{-1}\sum_i\int_{C_i}\max_{j\in J(x)}M_{ij}\,dx$, exactly computable by a finite line
arrangement.

**Proposition 3 (adverse family).** On $K=[1,2]\times[0,1]$ with $u=x_1$ and $v_b=\max\{x_1,bx_1+\varepsilon\}$,
$b\in[-1,1]$: $\sup_bF=\varepsilon^2/4$ at $b=1-\varepsilon/2$, both endpoints give $0$, while $B=4$; the two relaxations in
$B$ cost factors $8/\varepsilon^2$ and exactly $2$.

**Theorem 4 (tightness).** With $r$ the largest radius and explicit rational constants $\Lambda,R_K,D_K$,
$0\le B-F(u,v_{\mathrm{nominal}})\le 2r\Lambda+2r^2+4rR_KD_K\,n(n-1)\Lambda/\lvert K\rvert$.

**Theorem 6 (convergent subdivision).** For any finite cover of the box by sub-boxes,
$\mathrm{LB}\le\sup_{\tilde v}F(u,\tilde v)\le\mathrm{UB}$ with $\mathrm{UB}-\mathrm{LB}\le\gamma_{\mathrm{box}}(r_*)$, where
$\mathrm{UB}$ is the largest sub-box envelope and $\mathrm{LB}$ the largest exact $F$ at the probed points; best-first bisection
with pruning returns a valid interval at every budget.

**Theorem 7, Corollary 8 (calibration).** On the three-atom family $u_a=\max\{-x_1,x_1,a\}$,
$v_{a,s,b}=\max\{-x_1,x_1,a+s+bx_2\}$: $F=H(s,b)+(a+s)b^2$ and $W_2^2=\lvert s\rvert+(a+s)b^2$ with an exact dual witness,
the overlap coupling is target-optimal exactly when $\lvert s\rvert\ge\lvert b\rvert$, and the maximum of $F$ over an
admissible rectangle is attained at a corner.

## Technical account

**Exact overlay and witness.** The cells of $u$ and $v$ are convex polygons obtained by rational clipping; their pairwise
overlaps give a coupling $Q_{ij}$ of the two targets and $F=\sum_{ij}Q_{ij}\lvert a_i-b_j\rvert^2$ exactly. The overlap
coupling need not be optimal between the targets (An, Lei and Gu), so $W_2^2$ is certified separately: a supplied coupling and
dual vectors are checked against the recomputed masses by exact weak duality, and a feasible but non-optimal coupling is
rejected.

**The envelope and its two relaxations.** A plane can win at $x$ under some realisation only if its upper envelope beats every
competitor's lower envelope there; that is the screening set $J(x)$, the same principle as the possible-nearest-neighbour
regions of uncertain Voronoi diagrams. On each coordinate orthant the comparisons are affine, so $J$ is constant on the
interior of each arrangement region and $B$ is a finite sum of rational areas times rational costs. Two things are given
away: the cost $M_{ij}$ maximises the slope distance over the whole box without requiring that the same choice makes $j$
win (winner–slope incompatibility), and different source points may use different box parameters (pointwise independence).
Proposition 3 separates them exactly: $\varepsilon^2/4\le\varepsilon^2/2\le4$.

**Why the gap is linear in the radius.** At a point where the nominal winner has a margin larger than $2rR_K$ over every
competitor of a different slope, $J$ contains only planes with the winner's slope and the excess is $O(r)$. Elsewhere the point
lies in a strip around a tie line between two planes; the strip's width is inversely proportional to the slope separation of
the pair while the cost difference is proportional to it, so each pair contributes $O(r)$ regardless of how close the slopes
are. That cancellation is what makes the constant in Theorem 4 uniform and rational.

**The refinement.** Theorem 2 applies to any sub-box, and Theorem 4 says a sub-box of radius $r$ overshoots the exact error
at its centre by at most $\gamma(r)$. The implementation keeps a best-first heap of sub-boxes, splits the one with the
largest envelope along its widest coordinate, evaluates the exact $F$ at child centres and at the outer endpoint of the split
coordinate (literal points of the box, which supply $\mathrm{LB}$), and never splits a sub-box whose envelope is at most
$\mathrm{LB}$. Any positive tolerance is reached in finitely many splits; exhausting the budget widens the interval rather
than returning a false certificate. Uniform refinement is exponential in the box dimension $3n$.

**Established inputs and new contribution.** Finite affine-max optimality, power-diagram cells, the overlay coupling and
its possible non-optimality, finite Kantorovich duality, the possible-winner screening principle, the scalar function $H$
(a shifted Huber penalty) and the original three-atom example are credited existing material. The contribution is the
complete coefficient-box map-error integral with its tightness and convergence theorems, the $s\neq0$ excess identity with
the coupling-optimality threshold, the adverse example, and an exact, tested, benchmarked implementation. The bounded search
did not locate the tightness bound or the interval certificate; that is a statement about the search, not a priority claim.

## Evidence, assurance and limitations

**Evidence.**
- The paper (11 pages) with complete proofs, and the accessible proof text `PROOFS.md`.
- A standard-library Python implementation in exact rational arithmetic, with a command-line tool whose `--check` mode
  recomputes every recorded field.
- Fourteen test methods: a separately implemented vertex-enumeration geometry for the overlay, 45 exact calibration cases,
  404 adverse-family grid evaluations, the tightness inequality on 108 random boxes, convergence and feasibility of the
  refinement, semantic negative controls (feasible non-optimal coupling, corrupted witnesses) and malformed-input rejections,
  in normal and optimised Python.
- A 65-case benchmark whose exact fields are recomputed by its `--check` mode.
- A producer replay of the frozen files, then a fresh-extraction replay of the archive with an altered-result negative control
  (the receipt is a release asset); CI repeats the replay on Linux.

**Review.**
- Version 0.1.0 (never public) received a same-model internal review and an external review supplied by the publisher, which
  recommended major revisions, found no counterexample and reported an independent exact oracle agreeing with the
  implementation. Every item was actioned; see `REVIEW_RESPONSE.md`.
- The new results of 0.2.0 were sent to a cross-vendor model prompted to refute them. It found no counterexample to
  Theorem 4 and three defects of wording and interface, repaired before freezing; see `STATUS.md`.

**Limitations.**
- No unaffiliated party has rerun the archive; the envelope has no second implementation; nothing is formally verified; no
  specialist or journal has reviewed the work.
- The implementation is planar with a uniform source and takes the targets as the pushforwards of the supplied potentials;
  it is not a solver for prescribed masses. The proofs do not use the dimension, but no higher-dimensional backend exists.
- The benchmark is a single-machine observation on inputs with at most eight planes.

## Relationship to earlier work

Mérigot, Delalande and Chazal define the $L^2$ distance between maps from a fixed source (the Monge embedding) and, in their
supplement, already show square-root sensitivity with fixed positive atom masses using two rotating atoms; the calibration
here is an exact formula in a different family, not a new observation of that phenomenon. Delalande and Mérigot prove
stability for a fixed source and varying target with exponent $1/6$; Letrouit shows no exponent above $1/3$ is possible for a
uniform source on a suitable open set and conjectures $1/2$ for convex sources; Divol, Niles-Weed and Pooladian give
semi-discrete stability of order $W_2^{1/3}$ for targets that may have different supports. None of these supplies a
certificate for a coefficient box; this release does not supply a new exponent. The three-atom construction is OpenAI's; its
general one-third theorem is neither used nor validated here.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in optimal transport stability | An exact, inspectable calibration of map sensitivity (Theorem 7), an adverse example for envelope methods, and a tightness argument whose strip-cancellation step may transfer to other screening bounds | Unrefereed; planar and uniform; the envelope's conservatism is unbounded in general |
| Validated-numerics and robust-optimisation researchers | A certified interval for a worst case over a coefficient box by bisection with a proved linear rate, in pure rational arithmetic | Exponential in the box dimension; the benchmark covers $n\le8$ planes only |
| Research agents and tool builders | A machine-readable claims file mapping P1–P7 to proofs, functions and tests; a JSON-in, exact-JSON-out tool with recomputation | Producer replay is not independent reproduction; preserve version, DOI and scope |
| Interested non-specialists | Why a small change of target can move a transport map a long way, and how a bound can be true and useless at the same time | Do not treat a candidate as established consensus |

## Why the problem matters

Transport maps are used to compare, interpolate and embed distributions, and in those uses the map is the object that
carries the information. If the map can jump when the target barely moves, every pipeline that relies on it inherits that
sensitivity. The theory settles the exponents only partly (between $1/6$ and $1/2$ for convex sources), and in practice the
coefficients of a semi-discrete potential are rarely known exactly. A certificate that is valid for every coefficient in a
stated box, together with an honest statement of when it is informative and a way to tighten it with a proved rate, is a
small but checkable step toward using these maps with stated error bars.

## How to inspect or reproduce the recorded checks

Download the archive from the Zenodo record or the GitHub release, extract it and run `./replay_archive.sh` with any
CPython 3.10 or later (standard library only; a few seconds for the tests, about a minute for the benchmark recomputation).
It runs the test suite in both Python modes, recomputes the three recorded examples, recomputes the 65 benchmark cases and
verifies the SHA-256 manifest. `AI_INDEX.md` maps every claim to its proof, function and test; `examples/refine.json` is the
adverse family with the refinement switched on, and the README walks through reading its output.

## The most valuable next projects

1. **A polynomial-cost refinement.** Uniform bisection is exponential in the box dimension $3n$. A pointwise cost that
   respects winner–slope compatibility, or a coordinate-wise relaxation with a proved tightening, would make the interval
   certificate useful on generic boxes at modest budgets; Proposition 3 is the test case.
2. **An independent rerun and a second envelope computation.** `replay_archive.sh` is designed for an unaffiliated rerun.
   The tests carry a second geometry only for the overlay; an independently written arrangement integration for the envelope
   would close the main implementation-diversity gap.
3. **Weighted and higher-dimensional backends.** Theorems 2, 4 and 6 do not use the dimension; an exact integration engine
   for polytopes or for piecewise-polynomial densities would extend the certificate where an application needs it.
4. **From target uncertainty to coefficient boxes.** Certified enclosures of the dual intercepts from stated uncertainty in
   target sites and masses would connect the direct box certificate to the inverse semi-discrete problem.

## What is in the evidence package

- The paper (LaTeX source and PDF) and the generated benchmark table macros.
- `transport_cert.py` (overlay, witness check, envelope, baseline, tightness constant, subdivision refinement, calibration
  families), `transport_cli.py`, `test_transport.py`, `benchmark.py`, `verify_manifest.py` and `replay_archive.sh`.
- Recorded example inputs and results; the benchmark record; the producer replay receipt and PDF inspection record.
- Machine-readable claims, the research contract and gates, the prior-art search, the citation audit and sources.
- The internal review of 0.1.0 and its disposition, the response to the external review, the status record with the
  cross-vendor review findings, provenance and licences (CC0-1.0 for prose and data, MIT for code).
