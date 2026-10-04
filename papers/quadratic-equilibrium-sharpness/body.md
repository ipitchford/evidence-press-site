## Summary

How many different steady states can a small reaction system support under the same rate constants? This candidate gives an exact answer to a sharpness question: **three species and five quadratic reactions can have four distinct positive equilibria**. Each equilibrium has a nonsingular Jacobian, so the example avoids a count created only by a degenerate coincidence.

The construction extends to every number of species $n\geq2$. A network with $n+2$ reactions attains $n+1$ positive nondegenerate equilibria. The central step realizes a polynomial family already constructed by Phillipson and Rojas as an admissible mass-action network. Products have integer coefficients, and reaction rates are positive rational numbers.

Here, **quadratic** limits the number of reactant molecules in each reaction to two; it does not impose that limit on the products. These are mathematical reaction networks, with no claim of experimental chemical realization. Four equilibria also need not mean four stable states: one explicit example has two locally attracting equilibria and two saddles.

## Summary for specialists

For every integer $n\geq2$, the manuscript constructs a quadratic $(n,n+2,n)$ mass-action network with exactly $n+1$ positive equilibria, all nondegenerate. The three entries count species, reactions and stoichiometric rank. It verifies distinct sources, full source rank and a strictly positive stoichiometric-kernel vector, so the networks satisfy the hypotheses of Banaji–Feliu's Theorem 5.5. They attain its upper bound and answer the attainment question in Remark 5.8.

The all-dimensional realization has reactions

$$
\varnothing\longrightarrow\sum_i b_iX_i,\qquad X_1\longrightarrow\varnothing,
$$

$$
X_i+X_{i+1}\longrightarrow2X_i\quad(1\leq i<n),\qquad2X_n\longrightarrow3X_n,
$$

where $b_i=15\cdot16^{n-i-1}$ for $i<n$ and $b_n=1$. The manuscript gives positive rational rates and an invertible equation map to the Phillipson–Rojas chain. A second parameter choice has a self-contained analytic root-count proof.

Two three-species examples add more specific information: an inflow-free network with maximum product molecularity ten and an exact one-rate window, and a reciprocal family whose $N=7$, $K=145$ member has two sinks and two saddles, each saddle with one unstable direction. No global molecularity optimum or global phase portrait is claimed.

## Technical account

### Turning a known polynomial chain into reactions

Arbitrary quadratic equations need not describe a mass-action network: consuming a species requires that species to appear among the reactants. The realization chooses reaction vectors that satisfy this constraint while preserving the earlier polynomial system's positive roots.

The adjacent transfers make the equilibrium flux balances telescope. After reversing the species order and positively scaling the earlier equations, call them $G_1,\ldots,G_n$. The chemical vector field is

$$
f_i=G_{i+1}-G_i\quad(i<n),\qquad f_n=-G_n.
$$

This constant row transformation is invertible. It preserves the equilibrium set and Jacobian nonsingularity, yielding the chemical sharpness result from the established maximal-root theorem. It does **not** preserve dynamics or stability; the stated two-sink result is checked separately in the original chemical vector field.

### Four crossings in a reciprocal example

The cover illustrates the network

$$
\varnothing\to42X+Y+6Z,\quad X\to\varnothing,\quad2Y\to3Y,
$$

$$
X+Z\to2X,\qquad Y+Z\to2Z,
$$

with rates $(1/7,7,7/145,1,1/7)$ in that order. Its positive equilibrium equations reduce bijectively to

$$
H(t)=\frac{(t+1)^2(t+49)^2}{t(t+7)^2}=145,\qquad t>0.
$$

The exact curve crosses the horizontal level four times. The plot uses a logarithmic horizontal axis; the crossings mark equilibria, not four attracting states. Clearing the positive denominator gives the quartic

$$
P(t)=t^4-45t^3+568t^2-2205t+2401.
$$

Its symmetry under $t\mapsto49/t$ makes the count transparent. With $q=t+49/t$, the equation becomes $q^2-45q+470=0$. Both $q$-roots exceed $14$, and each yields two distinct positive values of $t$. The manuscript supplies the positive concentration reconstruction, the original Jacobian calculation and exact local stability analysis.

### A smaller product complex, with no inflow reaction

The following alternative uses products of molecularity at most ten:

| Reaction | Rate constant |
| --- | ---: |
| $X\to\varnothing$ | $1$ |
| $Y\to6X+4Z$ | $1$ |
| $2X\to6Y+4Z$ | $1$ |
| $2Z\to4Y$ | $2/3137$ |
| $Y+Z\to\varnothing$ | $1$ |

Its scalar equilibrium polynomial is

$$
Q(t)=-3137t^4+9411t^3-10183t^2+4709t-784.
$$

The signs at $0,1/2,5/7,1,5$ alternate. The four intervals between them therefore contain four distinct roots; degree four gives exhaustiveness and simplicity. Each root reconstructs one positive equilibrium through

$$
x=\frac{5-t}{2(7t+1)},\qquad y=\frac{(5-t)(t+1)}{2(7t+1)^2},\qquad z=\frac{14}{t+1}.
$$

Replacing the fourth rate by $1/L$ gives exactly four positive nondegenerate equilibria precisely when

$$
1568<L<\frac{117649}{75}.
$$

This is a complete one-parameter window for the displayed family, not a classification of all quadratic networks or all their rate choices.

## Evidence, assurance and limitations

The claims rest on written analytic proofs, supported by exact symbolic computations, positive reconstruction checks, Jacobian identities and deliberately corrupted negative controls. Finite checks of particular dimensions corroborate the all-dimensional argument; they do not establish its universal quantifier by sampling. The package records the inputs and execution environment for each replay.

The release remains an **unrefereed candidate**. Coordinated agent audits are internal checking. The supplied AI/referee-style assessment and its reported computations have not been authenticated as external specialist review or independent reproduction; its evaluative rating is not an official research assessment. No proof-assistant verification is claimed.

The assumptions allow large products and do not impose conservation, detailed balance or physiological realism. The examples do not establish four stable attractors, global convergence, basin boundaries, a general robustness volume or minimum possible product molecularity. The literature audit is bounded and does not prove historical priority.

## Relationship to earlier work

[Banaji and Feliu](https://link.springer.com/article/10.1007/s00285-026-02429-8) supply the equilibrium bound and explicitly pose its attainment for $n\geq3$. An earlier planar chemical example of [Banaji, Boros and Hofbauer, Remark 38](https://arxiv.org/html/2406.13451v1), attains three equilibria with two species and four reactions.

[Phillipson and Rojas, Theorem 1.6](https://arxiv.org/pdf/1011.4128), already construct the underlying quadratic polynomial chain with the maximal positive-root count. The present contribution is its explicit mass-action realization and the sharpness consequence within the stated reaction-count class. Circuit reductions, maximal-root polynomial systems and the alternating-product mechanism are established prior work, not new abstract fewnomial results here.

The Evidence Press candidates [One model, five steady states](/releases/tcell-exactly-five/) and [One connected region for biochemical multistationarity](/releases/gk-shared-phosphatase-connectedness/) concern related equilibrium questions in different, specified biochemical models. The former counts roots in a two-ligand signalling model; the latter studies connectivity of a parameter region. Neither supplies independent confirmation of this construction.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Chemical reaction network theorists | Explicit witnesses attaining a reaction-count bound | Quadratic sources do not mean bimolecular products |
| Fewnomial and real algebraic geometry researchers | A concrete chemical realization of an extremal polynomial chain | Equation equivalence preserves equilibria, not dynamics |
| Researchers studying multistationarity | Exact examples, local bistability and a one-rate interval to inspect | No experimental or global dynamical conclusion follows |

## Why the problem matters

An upper bound describes a real limitation only if one knows how closely admissible systems can approach it. Abstract polynomial examples can fail the sign and stoichiometric constraints of reaction networks. An explicit realization closes that gap here, showing that the allowed reaction count really can support the maximum number of positive equilibria.

## How to inspect or reproduce the recorded checks

Begin with the manuscript's conventions and direct Phillipson–Rojas realization. Check the reaction vectors and equation transformation before using the earlier root theorem. Then inspect the separate scalar reconstruction and Jacobian arguments for the three-species examples.

From a fresh extraction of the evidence ZIP, install its pinned dependency and run:

```sh
python3 -m pip install -r requirements.txt
python3 verify.py --negative-controls
python3 -O verify.py --negative-controls
python3 classify_supports.py
```

The verifier reports `EXACT_CHECKS_PASS` on success. Compare both runs with the version-specific receipts and inspect the rejected corrupted cases. The included payload receipts and external `archive-replay.json` serve different purposes: the latter binds the final distributed ZIP. Consult `REPLAY_RECEIPT.md` for that distinction and `supplement/PROOF_INDEX.md` for current versus historical arguments.

## The most valuable next projects

1. Obtain an unaffiliated audit of the chemical realization, positive reconstruction and original Jacobian calculations.
2. Determine the minimum product molecularity needed for four positive nondegenerate equilibria in a quadratic three-species, five-reaction network.
3. Study the two attracting equilibria's basins and the intervening saddles in the reciprocal example, with global claims justified separately from local stability.
4. Investigate attainment under additional chemical constraints, such as bounded product size or specified conservation laws.

## What is in the evidence package

The package contains the paper and editable LaTeX source, explicit reaction and rate data, a claim map, analytic supplements, exact verification programs, execution receipts and negative controls. It also includes the prior-art and citation audits, review response, assurance and provenance records, an agent-readable index and component licences. The authoritative manuscript is titled *Sharp positive-equilibrium counts in quadratic mass-action networks with two more reactions than species*.

The [frozen evidence ZIP](https://github.com/ipitchford/quadratic-mass-action-sharpness/releases/download/v1.0.0-candidate/quadratic-mass-action-sharpness-v1.0.0-candidate.zip), [archive replay receipt](https://github.com/ipitchford/quadratic-mass-action-sharpness/releases/download/v1.0.0-candidate/archive-replay.json) and [checksums](https://github.com/ipitchford/quadratic-mass-action-sharpness/releases/download/v1.0.0-candidate/SHA256SUMS) are available in the [candidate release](https://github.com/ipitchford/quadratic-mass-action-sharpness/releases/tag/v1.0.0-candidate) and the [Zenodo record](https://zenodo.org/records/23146115). Fresh extraction passed 678 exact checks with 11 rejected corruption controls; the supplied checker separately passed 1,791 checks. Every public asset was downloaded from both services and matched the frozen bytes.
