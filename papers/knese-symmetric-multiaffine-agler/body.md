## Summary

A formula can behave safely on ordinary numbers yet fail when those numbers are replaced by commuting operators. This candidate identifies a whole family where that gap disappears: **stable symmetric multiaffine polynomials**, in every finite number of variables.

“Symmetric” means that exchanging variables changes nothing. “Multiaffine” means each variable has power at most one. “Stable” here means that the polynomial never vanishes when all its inputs lie inside the complex unit disk. The result says that reflecting such a polynomial and dividing by the original gives an operator norm bound of one—without an extra factor.

## Summary for specialists

For every finite $n$, let $p\ne0$ be symmetric and multiaffine, with no zeros in $\mathbb D^n$. Using the **actual multidegree**, the quotient $\widetilde p/p$ belongs to the Schur–Agler class:

$$\left\|(\widetilde p/p)(T_1,\ldots,T_n)\right\|\le1$$

for every commuting tuple of strict contractions. Boundary zeros, common factors, complex coefficients and degree drops in the diagonal polynomial are permitted. Constants are treated separately. Double commutativity is not assumed.

## Technical account

The diagonal polynomial determines the symmetric multiaffine polynomial by polarisation. Knese’s criterion reduces the desired operator property to positivity of a specific coefficient matrix. The proposed advance is to prove that positivity automatically throughout the class.

For $m=n-1$, the construction weights permutation-isotypic components by

$$E_m=\sum_{\ell=0}^{\lfloor m/2\rfloor}\frac{P_\ell^{(m)}}{n\binom n\ell}.$$

The weights are not guessed: cancellation forces the successive ratio $\ell/(n-\ell+1)$, with initial weight $1/n$. At $n=4$, the two contributions in the unwanted spin-one block are both $1/16$, with opposite signs. The symmetric component remains.

Equal-diagonal polarisation transfers that identity to **every coefficient equation**, including the full-union equations that the solved recurrence alone would not cover. Unit-circle root projectors produce positive boundary matrices. Finite Clark interpolation handles strictly stable diagonal polynomials; radial approximation admits boundary zeros. Hereditary operator substitution yields the bound without moving operators through unrelated adjoints.

The root-matching formula uses unnormalised vectors. Its positivity is meaningful directly, but its eigenvalues require the stated diagonal normalisation. The paper spells out that distinction.

## Evidence, assurance and limitations

The unrestricted conclusion is a written-proof claim. The package supplies exact rational checks through dimension eight, full-matrix symbolic checks through dimension six, scalar normalisation checks through one hundred, and targeted complex-phase and operator examples. A corrupted-weight control must fail, including under optimised Python.

The supplied model-assisted review found no substantive mathematical defect and recommended minor revisions. The final paper incorporates the requested attribution, explanatory and normalisation changes. This is **not external specialist peer review or formal verification**. Agreement among internal checks does not establish historical priority.

## Relationship to earlier work

Knese supplied the question and coefficient criterion. Earlier work already handles the all-dimensional linear subclass; eventual-denominator results allow enlarged reflection degree, which is not the exact quotient asserted here. Schur–Weyl branching, representation-theoretic scalar polarisation and finite Clark interpolation are inherited methods. The claimed new step is the positive lift and its complete coefficient transfer.

No equivalent general resolution was found within the inspected prior-art boundary. That is a bounded search result, not a guarantee of first-ever priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Several-complex-variables researchers | A proposed resolution of the symmetric multiaffine class question | Read the unrestricted branching and coefficient argument |
| Operator theorists | Explicit positive kernels giving contraction bounds | The polynomial symmetry and multiaffinity hypotheses are essential to this claim |
| Symbolic-computation and formalisation researchers | A compact proof route and finite exact diagnostics | Finite replay is not a formal proof of all dimensions |

## Why the problem matters

Scalar boundedness and operator boundedness are different in several variables. Identifying an entire natural class where stability gives the stronger property clarifies that boundary. The value is a structural theorem and an explicit positive construction, not an asserted engineering application or measured research-speed gain.

## How to inspect or reproduce the recorded checks

Start with the package’s `AI_INDEX.md` and `paper.tex`. Follow Lemma 2, Proposition 3, finite Clark interpolation and the final operator substitution. With Python 3.12 or 3.13 and SymPy 1.14.0, run:

```sh
python3 code/run_checks.py
python3 -O code/run_checks.py
```

The entry point runs in temporary directories, preserves the assertion checks under optimisation and tests rejection of incorrect weights. `VERIFICATION.md` gives exact finite scopes and exclusions.

## The most valuable next projects

An external specialist audit of the representation-theoretic identity and complete coefficient transfer is the most direct next assurance step. Formalising the finite-dimensional algebra would address a different dimension of assurance. A second application of the weighted identity could establish methodological reach beyond this one family; it is not already proved by this release.

## What is in the evidence package

The revised scientific paper and editable LaTeX; three exact checker implementations with a pinned dependency; a single fail-closed replay route; claim and AI indexes; an itemised review response; citation and provenance boundaries; licences and a complete payload manifest. Graphics and synthetic audio explain the result but add no mathematical evidence.
