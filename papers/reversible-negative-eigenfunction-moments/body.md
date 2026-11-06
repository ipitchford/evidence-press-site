## Summary

An average can be perfectly balanced even when large positive and negative observations contribute very differently. This paper asks how unequal those contributions can become when a random process is **reversible** and its next observation is expected to reverse a fixed fraction of the current value.

The answer is an exact limit, valid for every real power at least two. A process with just two states reaches that limit, so no smaller universal coefficient can work. The same argument also produces an obstruction to mapping one graph into another while preserving its edges.

Here is the smallest example. Give the two states values $1$ and $-1/2$. From the positive state, always move to the negative state. From the negative state, return or stay with equal probabilities. In equilibrium the states occur with probabilities $1/3$ and $2/3$.

| Contribution | Positive state | Negative state |
|---|---:|---:|
| Signed average | $1/3$ | $-1/3$ |
| Cubic magnitude moment | $1/3$ | $1/12$ |

The average cancels, but the cubic moments have ratio **four**. That is exactly the theorem's bound when the expected next value is minus one half of the current value.

This is an unrefereed, AI-assisted mathematical candidate. Its universal claims rest on written proofs, not a numerical search.

## Summary for specialists

For an exchangeable pair $(X,Y)$ with finite relevant moments and $\mathbb E[Y\mid X]=-rX$, $0<r\le1$, Theorem 2.1 proves, for every real $p\ge2$,

$$
\mathbb E X_+^p\le r^{1-p}\mathbb E X_-^p,
\qquad
\mathbb E X_-^p\le r^{1-p}\mathbb E X_+^p.
$$

The coefficient is sharp for each $r,p$. Over all admissible parameters and pairs, the exact positive-exponent range is $\{1\}\cup[2,\infty)$; the excluded exponents have reversible-chain counterexamples. Equality for nonzero eigenfunctions of finite irreducible reversible chains has an explicit two-value sign-lumped characterization.

The trace version applies to negative eigenmatrices of positive, unital, trace-self-adjoint maps. A strict-colouring Schur multiplier then gives, for nonzero real symmetric zero-diagonal $A$ supported on $G$,

$$
\chi_{\mathrm{sv}}(G)\ge1+
\max\left\{\frac{\mathcal E_p^+(A)}{\mathcal E_p^-(A)},
\frac{\mathcal E_p^-(A)}{\mathcal E_p^+(A)}\right\}^{1/(p-1)}.
$$

Thus $G\to H$ with a finite simple edge-transitive target implies that the displayed energy-ratio term is at most $\lambda_{\max}(H)/|\lambda_{\min}(H)|$. The graph contribution is **$p>2$**: the square-energy endpoint is known, including a stronger ordinary-vector bound. The strict parameter equals $\vartheta(\overline G)$; it is not the ordinary vector chromatic number.

## Technical account

The mechanism has four steps. First, a pointwise inequality compares the two signs and powers of two real numbers. Its extra terms contain the regression defect $Y+rX$. Second, taking expectations cancels those terms under exact negative regression and exchangeability.

Third, an orthonormal eigenbasis of a matrix exposes a reversible transition kernel inside the positive map: $K_{ij}=\operatorname{Tr}(E_i\Phi(E_j))$. Positivity makes its entries nonnegative, unitality gives row sums one, and self-adjointness gives symmetry. The scalar theorem therefore controls the positive and negative spectral parts.

Finally, a strict vector colouring has the same prescribed inner product on every edge. Its Gram matrix defines a Schur multiplier with an **exact** negative eigenmatrix identity. A colouring of the target pulls back along a graph homomorphism, making an energy imbalance an obstruction to that map's existence.

The paper also records elementary consequences: complex Hermitian matrices, quantitative bounds for a controlled regression or eigenmatrix residual, and connected nonempty 1-walk-regular targets. The last uses an established least-eigenspace colouring construction. None is presented as a separate major priority claim.

## Evidence, assurance and limitations

The package separates analytic proofs, exact finite arithmetic and floating-point exploration. The five-state counterexample at $p=3/2$ has a rational transition matrix, an exact eigenpair and strict rational comparison bounds. A separate 728-point scalar grid is numerical evidence with a tolerance, not interval certification of all real parameters. Targeted guard tests check that selected invalid inputs are rejected.

Internal AI-assisted checking is not unaffiliated reproduction, external specialist review, editorial peer review or formal verification. The bounded literature search found no identical all-$p>2$ strict-vector result in its inspected sources; it does not guarantee historical priority. The target question is identified by arXiv version 5 because the final publisher full text was not accessible for comparison.

Two boundaries are especially important. The stronger **ordinary-vector conjecture remains unresolved here**: edge inequalities do not supply the exact eigenmatrix identity used in the proof. And the reversible-chain counterexamples below two **do not classify graph counterexamples**. Residual bounds require a rigorous error norm before they can certify numerical data.

## Relationship to earlier work

Guo and Spiro establish the square-energy homomorphism bound. Coutinho, Spier and Zhang establish a stronger ordinary-vector square-energy bound, including signed adjacency matrices. Elphick, Tang and Zhang give all-exponent bounds for projective rank and pose the homomorphism question addressed here. These graph parameters cannot simply be substituted for one another.

The extension here combines a sharp negative-regression moment argument with strict colourings for all real $p>2$. The least-eigenvalue projector construction for targets is inherited from spectral vector-colouring theory, including Godsil and colleagues' 1-walk-regular formulation.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Spectral graph theorists | Use higher spectral moments to obstruct graph homomorphisms. | The strict-vector conclusion is not the ordinary-vector conjecture. |
| Probability researchers | Compare the positive and negative moments of reversible negative eigenfunctions. | Exact regression and the stated moment assumptions matter. |
| Matrix and operator researchers | Transfer the scalar estimate through positive maps, including controlled residuals. | Positivity, unitality and trace self-adjointness are required; numerical errors need rigorous bounds. |

## Why the problem matters

A graph homomorphism preserves the connections that matter, but finding or excluding one can be difficult. Spectral information gives a different route: a mismatch between the source's positive and negative energies and the target's spectrum can rule the map out. This result supplies a whole range of such tests beyond the known square-energy case. It does not claim that every exponent improves every graph's bound or that the tests constitute a faster general algorithm.

## How to inspect or reproduce the recorded checks

Start with Theorem 2.1 and its two-state extremiser, then inspect the exact five-state construction in Section 3. Follow Section 4 for the scalar-to-matrix step and Sections 5–6 for the graph application.

In the source package, read `VERIFICATION.md` before running `verify_reversible_moments.py` and `test_guards.py`. The verification record specifies the commands, accepted inputs and numerical tolerance. Optimized Python checks guard against relying on removable assertions. Repeating these finite checks tests those artifacts; it does not independently prove the universal theorem.

## The most valuable next projects

The main mathematical target is the ordinary-vector conjecture for $p>2$, where the current exact-identity argument stops. A distinct project is to classify the graph exponents below two, rather than infer that answer from general reversible chains. For applications, carefully certified graph examples could show when an intermediate exponent adds an obstruction beyond the familiar endpoints.

## What is in the evidence package

The standalone manuscript contains definitions, proofs, equality analysis, counterexamples, matrix reductions and graph consequences. `CLAIMS.md` and `RELATED_WORK.md` separate new claims from inherited inputs and unresolved questions. The executable checker, guard tests and verification record expose the finite checks. Assurance, provenance, environment and licence records explain the package's status. No private review is needed to read or check the mathematics.
