## Summary

O-01d0 asks whether four explicit weighted-homogeneous polynomials have no common weighted-projective zero for every index $n\ge 6$. It is a sharply stated internal gate in the Lewis--Perry--Straub route toward the Polydegree programme. This anonymous, unrefereed release does **not** prove or falsify O-01d0.

What it does is make the surviving route unusually explicit. A fixed-index theorem explains why one empty integral polar fibre controls a complete-intersection deformation. The lower arithmetic obstruction is compressed to triple coprimality for three consecutive members of a one-variable Hermite family $J_A$. Exact lemmas then control incidence, multiplicity, two boundary fibres, and an $A\mapsto A+20$ derivative connection.

The release also preserves four failed proof architectures rather than hiding them. Bounded scalar transfer, a canonical monic polynomial-remainder tail, degree-at-most-twelve projective transfer, and the claim that every structural window prime works for the upper determinant are all rejected by exact counterevidence.

> **Candidate status:** Anonymous · unrefereed · O-01d0 open and unfalsified · internal `PASS_WITH_NOTES` · producer-side replay passed · no independent reconstruction, formal verification, external specialist review, editorial peer review, novelty, priority, target-conjecture, or impact claim.

## The exact statement

With $\deg x_i=i$, define

$$
h_j=\frac{1}{j+1}[z^j](1+x_1z+x_2z^2+x_3z^3+x_4z^4)^{-j-1}
$$

and

$$
I_n^0=(h_n,h_{n+1},h_{n+2},\partial_{x_2}h_{n+1}).
$$

O-01d0 is the all-index assertion that $I_n^0$ is primary to the irrelevant ideal, equivalently

$$
\operatorname{Proj}\!\left(\mathbb Q[x_1,x_2,x_3,x_4]/I_n^0\right)=\varnothing
\qquad(n\ge6).
$$

The label is local to this research programme. Resolving it would discharge a concrete transversality interface, but this release does not claim that O-01d0 alone proves Furter's R(3), the Polydegree Conjecture, the Strong Factorial Conjecture, the two-dimensional Jacobian Conjecture, or the quartic Hessian conjecture in dimension four.

## Technical account: what is established

### A fixed-index polar fibre controls its deformation

For

$$
C_n=(h_n,h_{n+1},h_{n+2},\partial_{x_2}h_{n+1}-\lambda\partial_{x_2}h_n),
$$

finite-dimensionality of the special fibre implies that the four displayed generators form a regular sequence and the quotient is finite free over $k[\lambda]$ of rank

$$
\rho_n=\frac{(n-1)n(n+1)(n+2)}{24}.
$$

Properness transports emptiness from one integral special fibre to characteristic zero; it does not transport lengths, syzygies, or other stronger data. The shipped characteristic-$32003$ producer records give fixed-index consequences at $n=21$ and $25$. The $n=29$ source and transcript are sealed and bound by hashes, but the expensive calculation is not rerun by this release.

### The lower block becomes a one-variable triple-gcd problem

After exact row operations and factorial normalization, lower-block surjectivity becomes

$$
\gcd_{\mathbf F_p[y]}(J_A,J_{A+5},J_{A+10})=1
$$

for explicit hypergeometric-polynomial sections $J_A$ in a structural prime corridor. The paper proves:

- a single resultant pencil detects triple incidence;
- a bordered multiplication determinant selects whether two pairwise incidences occur at the same root;
- every structural triple gcd is squarefree;
- the confluent initial forms hold uniformly;
- the critical fibre and first infinity-collision fibre can be avoided jointly; and
- an exact fifth derivative connects the $A+20$ section to the $A$ section, with a five-column reciprocal boundary.

Squarefree does not mean coprime. The uniform triple-coprimality theorem is still missing.

## What failed—and why that matters

Four precise shortcuts were tested early enough to fail cheaply:

1. The minimum degree of a scalar $A\mapsto A+20$ connection grows on the audited staircase, rejecting a uniformly bounded low-degree transfer.
2. The canonical five-step monic polynomial-remainder tail recovers neither required lower section on every audited structural case.
3. The prescribed projective-transfer system has zero nullspace through degree twelve in all eight audited residue classes over two exact finite fields.
4. The upper determinant is zero at $(d,p)=(101,1741)$ and $(203,4019)$, disproving the claim that every structural window prime works.

The fourth result does **not** kill the p-adic strategy. It replaces an unnecessarily strong theorem with the narrower obligation that each $d$ admit at least one prime that works simultaneously for the lower and upper blocks.

## Bounded positive signal

The largest pair-boundary scan covers structural $A\le3000$ and denominator-valid primes $p<12000$: 405,423 adjacent pairs, with 120 failures. Every failure is linear. The sole triple in that declared scan is $(A,p)=(110,397)$ with factor $y+357$; no nonlinear triple appears. A separate gap-two scan covers 262,948 structural cases below $p=20000$, where all 34 endpoint-pair failures are linear and the middle section kills each one.

Those counts are evidence for choosing the next lemma. They are not evidence that the lemma holds outside the frozen ranges.

## Executable remaining gates

The route closes only if all four interfaces close:

| Gate | Exact obligation | Cheapest decisive event |
|---|---|---|
| Lower Hermite gate | Prove or falsify the pair-content and four-factor support theorem | An explicit late nonlinear factor or a uniform content identity |
| Upper determinant gate | Find one simultaneous good structural prime for every $d$ | A $d$ for which every structural prime fails, or a uniform exceptional-prime bound |
| Multiplier gate | Construct degree- and $(x_3,x_4)$-compatible lifts in both odd residues | A bounded rank obstruction in either residue, or an all-index graded construction |
| Assembly gate | Cover every projective chart and deduce emptiness | A surviving residual-chart point, or a complete chart certificate |

The dependency order is lower and upper arithmetic in parallel, then the two multiplier lifts, then projective assembly. A success at one gate does not silently discharge another.

## Limitations and where it stops

The release does not prove triple coprimality, produce a simultaneous structural prime for every index, construct either all-index multiplier lift, or cover every projective chart. The internal review and confirmation are same-programme editorial controls. They cannot substitute for a specialist reading the proofs, an unaffiliated rerun, a separately authored checker, or peer review. The method-oriented citation audit is not an absolute novelty or priority search.

## Who should care

The release is aimed at researchers in polynomial automorphisms, graded commutative algebra, computational algebra, hypergeometric polynomials, and p-adic or finite-field certification. It may also be useful to computer-assisted-mathematics researchers studying how exact negative results and bounded scans can be packaged without promoting them to a uniform theorem.

## Replay and assurance

The final package passed 12 portable and 6 PassageMath/Sage checks in ordinary and optimized modes; all 18 paired output hashes agree. A quick clean-extraction replay also passed in both modes. Hosted continuous integration runs the portable layer and hostile controls on Python 3.11, 3.12, and 3.13. The deterministic ZIP contains 147 manifest-bound files.

These checks establish that the producer's encoded predicates replay and that the public archives match the reviewed object. They do not establish that the predicates capture every intended mathematical statement or that the written proofs are correct. No unaffiliated rerun, separately authored implementation, formal verification, external specialist review, or editorial peer review is reported.

## Workflow measurement

The publication workflow prospectively froze a Fermi estimate of **180 active minutes**, with a **120–240 minute interval** and **60 additional unattended minutes**, before package recovery began. The decomposition allocated 20 minutes to package selection, 50 to manuscript and claims, 35 to replay/PDF/citations, 35 to review and repair, and 40 to repository/DOI/site work. Earlier research effort was not captured at a single prospective boundary and is not reconstructed. The closeout receipt reports the observed publication-stage elapsed and replay runtimes separately; no matched conventional workflow or acceleration effect is inferred.

## Package map and next review

The [PDF](https://github.com/ipitchford/o01d0-polar-fibre-structural-reductions/releases/download/v0.1.0-candidate/paper.pdf), [deterministic package](https://github.com/ipitchford/o01d0-polar-fibre-structural-reductions/releases/download/v0.1.0-candidate/o01d0-polar-fibre-structural-reductions-0.1.0-candidate.zip), [claim registry](https://github.com/ipitchford/o01d0-polar-fibre-structural-reductions/blob/v0.1.0-candidate/CLAIMS.json), [experiment registry](https://github.com/ipitchford/o01d0-polar-fibre-structural-reductions/blob/v0.1.0-candidate/EXPERIMENTS.json), [public CI](https://github.com/ipitchford/o01d0-polar-fibre-structural-reductions/actions/runs/33170023609), and [Zenodo record](https://doi.org/10.5281/zenodo.22143955) are immutable public anchors.

The highest-value external step is an unaffiliated reconstruction of the Hermite reduction and squarefreeness proof, followed by a proof-or-falsification attempt on the pair-content/four-factor theorem. Any correction should be preserved as a versioned successor rather than overwritten.
