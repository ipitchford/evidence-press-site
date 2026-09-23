## Summary
Imagine a chain of compartments exchanging material with their neighbours. We know where material enters, where it can leak out, and which compartments we can observe. The transfer and leak rates are unknown. Does the placement of those inputs and observations leave some rates impossible to distinguish, even with ideal data?

This candidate gives a complete placement rule for **generic local structural identifiability** on a labelled bidirected chain. It applies to any chain length and any prescribed input, output and leak sets within the stated model. Local identifiability permits finitely many distant alternatives; it does not mean a unique global answer or reliable estimation from noisy data.

## Summary for specialists
Let $n\ge2$, with independently unknown positive transfers $p_i=A_{i+1,i}$ and $q_i=A_{i,i+1}$, and independently unknown positive leaks exactly at the prescribed set $L$. The diagonal is the negative total outflow. Input and output sets $I,O$ are nonempty; their coordinate selectors and gains are known. The mathematical data are the full labelled transfer matrix $C_O(sI-A)^{-1}B_I$.

Write $W=I\cup O$ and let $r(E,F)$ be the maximum number of pairwise strictly disjoint closed intervals joining vertices of $E$ to vertices of $F$. The necessary source condition is
$$r(W,L)=|L|.$$
It is sufficient when the port hulls overlap. Otherwise reflect labels, preserving input/output roles, so $b=\max I<a=\min O$. The main theorem supplies ordered counts with three thresholds:
$$
\begin{aligned}
S(I)+U(O^{\rm rev})&\ge n-1 &&(L=\varnothing),\\
A_*+B_*+c&\ge n-1 &&(\min L<a),\\
S(I)+C_*&\ge n-1 &&(\min L\ge a).
\end{aligned}
$$
The nonempty-leak cases also require the source condition. Here $c=r(I,L)+r(O,L)-r(W,L)$; the manuscript defines every recurrence, including flag timing and the augmented seed. Raw counts must not be capped prematurely. The equality $\min L=a$ belongs to the augmented case.

## Technical account
Jacobi symmetrization separates spectral changes from source-coordinate ambiguity. A Green-matrix interval-rank rule determines how many independent leak sources the ports can distinguish. Polynomial constraint spaces then supply universal upper bounds and matching constructions within each prescribed physical parameter family.

The difficult regime needs an interface constraint that changes how the output count grows. Its first contribution is one extra direction, but later updates are inclusive. With $n=7$, $I=\{1\}$, $O=\{5,6,7\}$ and $L=\{7\}$, the final augmented count is five, equal to the ordinary count rather than one larger. The threshold is six, so the model is generically locally unidentifiable.

The proof uses fixed-stiffness cofactor arguments, pinned boundary families and a scalar-lifting determinant estimate. It keeps universal upper bounds separate from boundary constructions that establish lower bounds. Jacobi, Green-function, continuant and spectral-perturbation tools are classical; the proposed contribution is their all-placement classification in the dependent-diagonal physical family. The cover depicts the seven-compartment placement schematically, not measured data.

## Evidence, assurance and limitations
The manuscript supplies a written all-length proof. The public replay compares 288,368 saved development placements with the unchanged classifier, verifies four exact reduced-system minor certificates and rejects four deliberately invalid inputs or certificates. Normal and optimized Python agree. Twenty selected physical-rank evaluations were also rerun using two supplied constructions at two primes. Larger campaigns reported in the supplied reviews were not regenerated in full.

A nonzero minor supplies a lower bound. Repeated sampled rank deficiency does not prove a generic upper bound. Model-mediated editorial roles are internal review; neither their agreement nor archive hashes establish formal verification or external journal peer review. Historical priority remains unestablished after a bounded source comparison.

The result assumes ideal full transfer information. Unknown sensor gains, inadequate excitation, measurement noise, parameter sharing, unlabelled compartments and missing edges require separate analysis. The criterion does not settle global uniqueness or practical estimation accuracy.

## Relationship to earlier work
Ahmed and collaborators identify the multiple-input/output catenary classification problem in their published Section 6. The singleton-input/output bidirected-tree criterion of Bortner and collaborators is a predecessor recovered by this candidate. Related path/cycle and free-matrix-entry results have different hypotheses; the manuscript compares them explicitly rather than treating their titles as evidence of a gap. Ovchinnikov, Pogudin and Thompson supply the transfer-coefficient interpretation for this strongly connected model class.

## Who should care, and why
| Audience | Potential use | Required caution |
|---|---|---|
| Structural-identifiability researchers | Scrutinize a proposed arbitrary-placement classification | Written all-length proof still needs unaffiliated specialist review |
| Compartment-model developers | Detect structural ambiguity before estimating rates | Check labels, gains, independence, leaks and ideal-data assumptions |
| Experimental-design researchers | Use a structural feasibility condition as one design input | Conditioning, noise and informative excitation are additional problems |
| Algebraic and spectral theorists | Study the augmented cofactor and interface mechanism | Classical tools and the new classification must remain distinguished |

## Why the problem matters
Estimation cannot recover a continuously ambiguous parameter from ideal data, however sophisticated the optimizer. A placement criterion can reveal that obstruction before numerical fitting. Conversely, passing a structural test only removes one obstacle: it does not guarantee stable or globally unique recovery. The candidate makes this first question inspectable for arbitrary chains without requiring a fresh large symbolic Jacobian for each placement.

## How to inspect or reproduce the recorded checks
Download and extract the versioned evidence archive. With Python 3.10 or later:
```sh
python3 replay.py > /tmp/catenary-replay.json
python3 -O replay.py > /tmp/catenary-replay-optimized.json
cmp replay-results.json /tmp/catenary-replay.json
cmp replay-results.json /tmp/catenary-replay-optimized.json
shasum -a 256 -c MANIFEST.sha256
```
Read Theorem 1 and the proof dependency map before following the appendices. Review the source-to-physical-model argument separately from the executable checks. The package records the exact original review coverage and the subsequent editorial repairs.

## The most valuable next projects
Independently scrutinize the family-preserving cofactor and perturbation arguments. Determine global identifiability degrees for placements that pass the local test. Study robust design with noise and uncertain gains. Extend the placement analysis to graphs beyond paths while retaining the true physical parameter dependencies.

## What is in the evidence package
PDF, TeX and Markdown manuscripts; the unchanged placement classifier; saved finite tables and exact certificates; a portable replay and expected results; original review responses and frozen internal editorial records; claim, source, environment and licence records; and a complete file manifest. Original prose and data are CC0, original code MIT. Supplied third-party review text and code are not redistributed or relicensed.
