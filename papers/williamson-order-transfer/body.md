## Summary

A numerical method for rotations should keep its answers on the space of rotations. Exponential updates can do that, but replacing an ordinary update by an exponential one can destroy accuracy: matrix products depend on their order.

This paper identifies a structured exception. For Williamson low-storage Runge–Kutta methods, the specified exponential lift preserves classical order through six, regardless of the number of stages. Zero and negative coefficients and repeated stage times are allowed. A further result gives three additional tests sufficient for order seven; whether those tests follow automatically remains open.

## Summary for specialists

For every finite real Williamson list with classical order $1\le p\le6$, the left-multiplication recurrence
$$
Z_i=U_iZ_{i-1}+hF(Y_{i-1}),\qquad
Y_i=\exp(V_iZ_i)Y_{i-1}
$$
has consistency order at least $p$. The key identity is
$$
t_m(u,v,\ldots,v)=\frac{1}{m!}b^TR_v^{m-1}u,\qquad
R_v=(b^Tv)I-\operatorname{diag}(Av)+\operatorname{diag}(v)A.
$$
It holds at every tensor length, without dividing by coefficients. The order-seven criterion adds three explicit tensor identities to classical order seven; it is not an unconditional extension.

## Technical account

The proof has three layers. A row induction proves the repeated-tail identity. Polarisation and shuffle equations then determine the required ordered tensors through weight six. Finally, replacing tableau operations by integration identifies the resulting classical-moment polynomials with the exact-flow coefficients.

The fourth-order argument is also written in ordinary tableau notation, providing a short entrance before the tree formalism. Six small integer matrices make the finite uniqueness step inspectable. At weight seven, three elementary-vector families retain a free direction; the extra scalar tests eliminate those directions.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/williamson-order-transfer.txt) is available for reading.

The universal statement rests on the written proof. Exact checks cover 197 ordered-tree coefficients, rational identities, stage prefixes, finite ranks and a noncommuting-matrix orientation control. Normal and optimised replay reject deliberately corrupted inputs.

Separate implementations within this coordinated workflow are not independent external reproduction. There is no proof-assistant formalisation or external specialist peer review. The result does not cover arbitrary classical Runge–Kutta methods, establish the existence of a method at a prescribed stage count, or compare stability regions, error constants or runtime.

## Relationship to earlier work

Bazavov posed the transfer question; Lystad's all-stage third-order result is prior work. Owren supplies the ordered-series framework. The present candidate's contribution concerns the higher orders, the all-length contraction identity and the conditional next-order criterion, within a bounded literature search rather than an exhaustive priority determination.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Geometric integration researchers | Reuse classical order conditions for the stated lift | Multiplication convention is essential |
| Numerical software developers | Identify candidate low-storage geometric methods | Performance and stability require separate tests |
| Researchers extending the theorem | Inspect three explicit order-seven defects | Their automatic vanishing is not proved |

## Why the problem matters

Preserving a geometric constraint and preserving approximation order are different requirements. A structural implication can remove repeated derivations of extra order conditions without pretending to establish every practical property of a numerical scheme.

## How to inspect or reproduce the recorded checks

Start with the manuscript's fourth-order proof, then read the general reduction. In the repository, run `python3 -B code/replay.py` and `python3 -B -O code/replay.py`. The launcher records the actual child interpreter modes and rejects source changes during replay. The code README explains each checker and its scope.

## The most valuable next projects

Determine whether the three order-seven tests follow from the Williamson recurrence and classical order conditions. A useful alternative is an exact coefficient-level counterexample. Separately, compare concrete methods' error constants and stability without confusing those measurements with the transfer theorem.

## What is in the evidence package

The standalone manuscript, exact coefficient certificates, generators, separate checkers, mutation controls, the conditional order-seven calculation, claim and assurance records, source references, environment instructions and an agent-readable index are linked through the repository.
