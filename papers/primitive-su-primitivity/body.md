## Summary

Some mathematical models of superconductors combine superconductivity with topological order: their excitations carry structure that cannot be described just by ordinary local particles. A natural question is whether that combination is genuinely intertwined, or whether it separates into simpler pieces.

This candidate supplies a uniform proof for an existing family proposed by Gao and collaborators. In the precise construction studied, every nonzero flux sector fails both permitted ways of splitting off an invertible-superconductor vortex factor. This property is called **primitivity**. The result concerns the mathematical model, not a newly manufactured material.

The mechanism is unusually economical. Count the resolved excitation types, then ask how adding the physical electron acts on them. The counts rule out one possible factor. A pair of distinct types exchanged by the electron rules out the other.

## Summary for specialists

For the charge-one $SU(N)_N$ construction with even $N\ge4$, retain the physical electron $f$ and the full charge grading $q\in\mathbb Z/N$. If $R_q$ is the resolved rank of sector $q$, the written argument establishes the quantitative bound

$$R_0-R_q\ge \frac N2\qquad(q\ne0).$$

Every nonzero sector also contains a simple pair $X,fX$ with $fX\not\cong X$. Since the neutral electron action is free, the dynamical representative set has size $R_0/2$. The rank inequality excludes a two-object vortex factor; the moved pair excludes a one-object electron-fixed factor. Abelian dressing preserves these tests, under the specified electron-compatible factorisation convention.

Lemma 4 states the rank-and-action obstruction abstractly: when the neutral electron action is free, a sector whose rank differs from $R_0$ and that contains an electron-moved object admits neither permitted factorisation. Invertible Abelian dressing does not change either test. This is an elementary unpacking of the two allowed factor types, not a claim of new condensation theory.

## Technical account

Parent labels are nonnegative affine tuples $a=(a_0,\ldots,a_{N-1})$ summing to $N$. Cyclic rotation represents the generating simple current $J$. The charge is $Q(a)=\sum_i ia_i\pmod N$.

The even subgroup $H=\langle J^2\rangle$ has order $N/2$. Condensing its regular algebra while retaining **all** modules gives the resolved objects needed here. Restricting to local modules would discard flux sectors. The paper now proves the comparison with the charge-one physical construction through induction in the stacked category, keeping the charge grading and electron action explicit.

An orbit with stabiliser order $h$ contributes $h$ resolved objects, not just one. Consequently

$$R_q=\frac2N\sum_{Q(a)=q}|\operatorname{Stab}_H(a)|^2.$$

Expanding the square using the second Jordan totient reduces the count to known congruence counts for weak compositions. A roots-of-unity formula has positive **binomial weights**; the Ramanujan sums themselves need not be positive. Its strict neutral maximum makes the rank comparison uniform in $N$. Applying integrality to every divisor contribution and using $\sum_{d\mid m}J_2(d)=m^2$ gives the stronger absolute gap $R_0-R_q\ge N/2$. Equality occurs at $N=4,q=2$; the paper does not classify every equality case.

For the second obstruction, take $a_0=N-1$, $a_q=1$, and all other entries zero. When $N\ge4$, the unique largest entry forces full rotation period. Even and odd rotations then yield distinct simple objects exchanged by the electron.

### A small example that tests the distinction

At $N=4$, the resolved ranks are $(8,4,6,4)$. Every nonzero sector has fewer than eight objects, so none can have the two-object factor with four dynamical representatives. The explicit pair eliminates the remaining one-object possibility.

At $N=2$, the ranks are $(2,1)$: the rank inequality still holds. But the proposed witness is $(1,1)$, which does not have full period. This boundary case shows why rank alone is not the claimed primitivity proof.

## Evidence, assurance and limitations

The main evidence is the written universal argument. Fresh internal checks passed seven explicit tests in both normal and optimized Python. Direct $H=\langle T^2\rangle$ enumeration covers $N=2,4,6,8,10$; a separately implemented dynamic programme checks all 5,050 charge cells through $N=100$; exact rank comparisons cover every even $N$ from 2 through 100; and the quantitative gap is checked for every nonzero sector and every even $N$ from 4 through 100. Five semantic negative controls test corrupted charge data, the wrong rotation group, the unsupported legacy fixed-object field, a false quantitative gap and a rank-only inference at $N=2$. These finite calculations do not prove the categorical interpretation or the all-parameter theorem.

The supplied review found no error in the universal route but requested fuller exposition, more precise attribution and a corrected diagnostic label. The revised code distinguishes objects lying over electron-invariant parent orbits from objects proved individually electron-fixed. The theorem does not rely on that auxiliary statistic.

This is an unrefereed candidate with coordinated internal checking. It is not proof-assistant certified, independently reproduced outside the workflow, or experimentally validated. It does not supply full fusion tables, a microscopic Hamiltonian, or a new superconducting family. The historical prospective REF assessment remains unchanged and is not an official rating; editorial repairs and the elementary quantitative corollary do not automatically increase significance.

## Relationship to earlier work

Gao and collaborators supplied the family and definition and left its uniform primitivity proof open in the version inspected. Cyclic fixed-point resolution is established machinery. Elashvili, Jibladze and Pataraia give exact predecessors of the composition count and strict maximum; the finite-group formulation and earlier neutral enumeration are also credited in the paper.

Related quotient counts by Closset and collaborators require a level translation and combine fine sectors. The comparison does not turn those coarse counts into a proof of the individual-sector statement. The candidate's contribution is the targeted uniform proof and electron-compatible conclusion, not the underlying counting identities. The bounded search cannot certify historical priority.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Mathematical physicists studying topological superconductors | A uniform obstruction for the specified family, beyond low-rank examples | Preserve the charge-one construction and electron convention |
| Researchers using simple-current resolution | A compact example separating orbit counts, resolved ranks and electron action | General noncyclic stabilisers need not split in this way |
| Researchers or agents checking related families | Reuse the rank-and-action test before attempting full fusion tables | Both hypotheses must be proved for the new family |

## Why the problem matters

A proposed infinite family is more useful when its defining property has a uniform argument rather than a list of checked examples. Here the proof identifies exactly what must be retained in the count and why the electron action supplies information that rank misses. That is a concrete theoretical clarification; practical or experimental consequences remain unestablished.

## How to inspect or reproduce the recorded checks

Start with the manuscript's induction comparison, absolute-gap corollary and Lemma 4. Then use the package's [agent-readable index](https://github.com/ipitchford/primitive-su-primitivity/blob/v1.1.0-candidate/AI_INDEX.md) and [replay instructions](https://github.com/ipitchford/primitive-su-primitivity/blob/v1.1.0-candidate/REPLAY_RECEIPT.md) to locate the direct enumeration, divisor formula, dynamic-programme checks and negative controls. Verify the package manifest before running code.

Compare the $N=2$ boundary with $N=4,6,8,10$. The formula checks through $N=100$ are diagnostic coverage, not a numerical substitute for the universal proof. The replay receipt records the final commands, runtime and exact results.

## The most valuable next projects

The useful next step is specialist scrutiny of the categorical comparison under the original physical charge convention. A separate project could test the two-obstruction lemma on another specified family. Determining the complete electron permutation on resolved short orbits is also distinct from the present theorem. Merely increasing the enumeration range would add little to the universal argument.

## What is in the evidence package

The archive contains the revised manuscript and accessible text, explicit claims and assumptions, exact code and diagnostics, a point-by-point review response, source comparisons, assurance and provenance records, an agent-readable index, and checksums. The [proof-and-replay boundary](https://github.com/ipitchford/primitive-su-primitivity/blob/v1.1.0-candidate/checks/proof-and-replay.md) separates the universal written argument from finite software evidence. The public research assets are versioned independently of this explanatory page and its synthetic audio.
