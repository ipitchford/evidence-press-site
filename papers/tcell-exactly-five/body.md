## Summary

The same mathematical signalling model can have several stationary responses under identical ligand conditions. This candidate gives a precise example with **exactly five positive steady states** in the full two-ligand T-cell activation model. All parameters are positive rational numbers, and the chain has 100 phosphorylation steps.

The count follows from a written reduction and exact arithmetic. It concerns possible equilibria of the equations. Dynamical stability and physiological relevance remain unestablished.

## Summary for specialists

For the François model in the Rendall–Sontag formulation, take $N=100$, $\phi=\alpha=\beta=1$, $\kappa=S_T=1$, $b=1/10000$, $\gamma=8/5$, $\nu_1=1/100000$ and $\nu_2=11/500$. The conserved totals are

$$R=1132653/71653,$$

$$L_1=6100061/7165300,$$

$$L_2=1022000/71653.$$

There are exactly five distinct physical positive equilibria in this conservation class. Their scalar roots are simple, and the count persists on an open neighborhood in the eight named shared rates and four conserved totals, with $N$ fixed. Physical positivity includes free receptor, both free ligand pools and inactive phosphatase.

## Technical account

At equilibrium, the free receptor is the unique solution of a strictly increasing balance equation. Thus the two bound totals are fixed independently of phosphatase activity. A positive recurrence reconstructs each concentration chain uniquely from those totals and the phosphatase level. This gives a bijection between physical equilibria and scalar roots in $(0,1)$.

Six exact residual signs alternate, giving at least five roots. Clearing strictly positive denominators yields a degree-201 integer polynomial. Its 202 nonzero coefficients have five sign changes. Descartes' rule gives at most five positive roots, counting multiplicity. The bounds meet, proving exactly five simple scalar roots. Strict coefficient and residual signs persist under small parameter changes.

The search swept positive mixtures of two chain responses with different dissociation rates, then simplified a numerical candidate to rational data. The finite search explains discovery; it is not proof or evidence that 100 steps are necessary.

## Evidence, assurance and limitations

The package contains the proof, complete integer coefficients, rational brackets of width $10^{-12}$ and an original standard-library verifier. Producer replay checks 3,232 original chain-equation residuals, normal and optimized Python execution, and rejection of six corrupted evidence objects. The coefficients also match two supplied audits.

Five differentiated internal editorial roles reviewed the frozen package. The [internal editorial decision](https://github.com/ipitchford/tcell-exactly-five/blob/v0.1.0-candidate/review/EDITORIAL_DECISION.md) records acceptance after minor publication repairs. These model-mediated reports are not external peer review. Supplied reviewer identities and external independence are unauthenticated. No proof-assistant formalization, stability classification, biological validation, smallest-chain theorem, universal upper bound or historical-priority claim is made. The narrower agonist-only higher-multiplicity question remains outside the result.

The [audio transcript](/assets/audio/tcell-exactly-five.txt) is a communication summary. The cover depicts five crossings schematically; its spacing is not a numerical plot of the roots.

## Relationship to earlier work

François and colleagues introduced the phenotypic model with phosphatase feedback and antagonism. Rendall and Sontag developed its equilibrium analysis and small-chain agonist-only results. Bali and Rendall's recent nine-model comparison places negative-feedback multistationarity in a broader modelling context.

The contribution here is the explicit two-ligand witness, exact-five certificate and neighborhood argument. The model, unique-total analysis, recurrence machinery and Descartes' rule are antecedents. A historical question does not establish present-day priority or erase its single-ligand context.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical biologists | A specified higher-multiplicity example and scalar proof route. | The witness is not fitted to biological data. |
| Dynamical-systems researchers | A starting point for bifurcation and stability work. | Scalar simplicity is not full-system hyperbolicity. |
| Exact-computation researchers | An integer certificate tied to original equations. | Arithmetic checks do not formalize the analytic argument. |

## Why the problem matters

Knowing how many equilibria a model permits distinguishes its mathematical capabilities from behaviour seen in a particular simulation. An exact example makes a precise target for structural analysis. Connections to cell behaviour require separate modelling and empirical work.

## How to inspect or reproduce the recorded checks

Download and extract the release archive. With Python 3.10 or later, run from its root:

~~~sh
python3 -S verify_manifest.py
python3 -S verification/check.py
python3 -S -O verification/check.py
python3 -S verification/check.py --negative-controls
~~~

Expected output reports 202 coefficients, six signs, five root brackets, 3,232 original residuals and six rejected corruptions. No third-party Python package is needed. The direct optimized command applies to the mathematical checker itself.

## The most valuable next projects

An unaffiliated proof audit and fresh verifier would add external assurance. Mathematical extensions include reducing the chain length, explaining the turning-point mechanism and finding general count bounds. Full-system stability and physiological calibration are separate projects. The agonist-only question needs its own argument.

## What is in the evidence package

PDF, LaTeX and readable Markdown; original verifier and exact data; claim index, replay receipt and complete manifest; citation and bounded-priority notes; internal editorial reports and responses; and component licences. Supplied third-party reports and programs remain privately preserved with public hashes and attribution. GitHub and the versioned Zenodo record provide the same declared release assets.
