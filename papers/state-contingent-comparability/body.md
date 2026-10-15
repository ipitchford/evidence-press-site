## Summary

Paying less is not always enough to pass a rule about *when* payments occur. A debt contract can reduce every payment and still have a shorter discounted duration than a reference contract. If an acceptance rule imposes present-value, programme-period and duration tests as three separate vetoes, that duration test can reject the lower-payment contract.

The paper makes the conflict exact. One construction passes at both endpoint states but fails at every interior state. A perturbation makes both endpoints pass strictly and leaves an interior failure, ruling out the idea that the example is only a boundary-equality accident.

The practical mathematical question is then: if a payment must be fixed before every state variable is observed, how large can it be while passing the declared rule in every indistinguishable state? The answer is the intersection of exact statewise intervals. In the new two-variable example, an oblique trigger changes both the cap and the constraint that determines it.

## Summary for specialists

Fix old candidate and reference claims, positive discount factors, a programme window, a piecewise-affine new-service map and a fully declared acceptance rule. On every reachable trigger region, relative present value and programme service are affine. After clearing positive denominators, the duration comparison is quadratic. Linear and quadratic minima over the bounded rational polytopes used here therefore admit finite facewise certificates, including singular restrictions.

The componentwise payment order does not imply the separate duration order. If a positive payment $c_t$ at date $t$ is removed from a stream with present value $V$ and duration $D$, the duration change has the sign of $D-t$: removing a payment later than the current duration shortens duration. The paper develops the corresponding finite and differential identities and gives a necessary-and-sufficient threshold condition for a duration veto to accept all componentwise reductions in the declared setting.

For scalar payment design, each state supplies an exact feasible interval. A decision based on an observation must use the intersection of all intervals in that observation class. In a nonproportional family with old candidate claims $100$ at year one and old reference claims $80$ at year two, the new candidate has payments $p$ at year one, $20$ at year three and $10$ at year five. The new reference has $20$ at year one, $40$ at year four and an uplift $\lambda$ at year six when $u+v\geq1$.

At zero discount, the off-trigger upper bounds are

$$
p\leq45,\qquad p\leq25,\qquad p\leq50,
$$

from present value, programme service and duration respectively. Hence the sharp off-trigger cap is $25$. On trigger they become

$$
p\leq45+\frac{5\lambda}{4},\qquad p\leq25,
\qquad p\leq\frac{750-10\lambda}{15+\lambda},
$$

for $0\leq\lambda<75$. Programme service binds until $\lambda=75/7$; duration binds after that. At $\lambda=20$, the sharp on-trigger cap is $110/7$. Because $p$ is chosen before $v$ is observed, a single robust choice must respect the smaller cap.

## Technical account

### What is being compared

For cash flows $c_t$ at dates $t$ and positive discount factors $d_t$, the paper uses

$$
V(c)=\sum_t d_t c_t,
\qquad
D(c)=\frac{\sum_t t d_t c_t}{V(c)}.
$$

Programme service is the undiscounted sum over a declared programme window. Each quantity is normalised against fixed old candidate and reference claims before comparison. The principal screen requires the new candidate to be no more onerous than the new reference on each coordinate separately. This screen is a mathematical input; it is not inferred from the phrase “comparability of treatment”.

That distinction is load-bearing. The Paris Club's public methodology permits substitution among indicators and includes institutional judgement. A rule that trades present value against duration can rank the same contracts differently from three separate vetoes. The paper analyses the latter rule so that its consequences are explicit, not because it claims that the rule is universally appropriate.

### Why lower payments can have lower duration

Duration is an average of payment dates weighted by discounted payments. Removing an early payment moves the average later; removing a late payment moves it earlier. Therefore a contract obtained by reducing every payment need not have at least as much duration extension as the original stream.

The endpoint construction makes this failure visible without relying on a plot. Its cleared duration numerator is an exact polynomial with zeros at both endpoints and the wrong sign throughout the interior. The strict perturbation changes the endpoints from equality to acceptance while preserving an interior rejection. The figure is explanatory; factorisation and sign analysis prove the claim.

### Exact region-by-region verification

Triggers partition the state space into reachable regions with explicit equality ownership. Within a region, payments are affine in the state variables. Positivity of the old and new present values allows duration denominators to be cleared without changing inequality directions. The resulting degree is at most two.

The producer enumerates each polytope face, restricts the quadratic, checks vertices and stationary points, and retains exact rational witnesses and coefficients. The separate checker does not import the producer or optimiser. More importantly, it does not trust the domain stored in a certificate: it reconstructs all 16 model domains and 10 trigger regions from `data/contracts.json`, then checks 48 minima and 252 coefficient-determining identities. A self-consistent certificate shortened to an easier domain is rejected.

The producer is dimension-general for the bounded rational polytopes it accepts. The checker deliberately covers only the one- and two-dimensional certificates shipped here. That is an assurance boundary, not a missing dependency.

### Information changes what is implementable

A statewise cap is not automatically an implementable cap. If a payment is fixed after observing $u$ but before observing $v$, it must work for every later state compatible with that observation. The exact rule is

$$
I_{\mathrm{implementable}}(u)
=\bigcap_{v\,\text{compatible with }u} I(u,v),
$$

where each $I(u,v)$ is the complete statewise feasible interval. Empty intersections are incompatibility results, not optimisation failures. The oblique-trigger family is deliberately simple enough that the change in the binding constraint can be seen algebraically.

## Evidence, assurance and limitations

The evidence consists of the self-contained proof, declared rational inputs, exact certificates, an independently written low-dimensional checker, regression tests and scientific figures derived from the exact formulas. Normal and assertion-disabled Python runs pass for the producer, checker and tests. The checker verifies 48 exact minima, 252 identities, 16 domains, 10 trigger regions and both scalar intervals. The regression suite includes a domain mutation that must fail.

These checks are coordinated producer-side assurance. The separate implementation reduces shared-code risk but does not create organisational independence. No unaffiliated researcher has rerun the complete package; no proof assistant has formalised the argument; and no external specialist or journal has accepted it.

The financial interpretation has a separate ceiling. All cash flows in the examples are constructed common monetary units. The package does not authenticate bond documents, side letters, discount conventions, programme dates or institutional preferences. It does not estimate market value, sustainability, welfare or a country's treatment of creditors. Changing the rule, information timing or admissible state set can change the answer.

## Relationship to earlier work

State-contingent sovereign instruments, transparent triggers, caps and floors are established topics; the paper does not claim to invent them. Discounted cash-flow duration and its sensitivity are classical. The information restriction is an elementary specialisation of adjustable robust optimisation: a decision may depend only on information available when it is made. Facewise exact optimisation and real-algebraic decision procedures are also established machinery.

The contribution claimed here is narrower: a coherent exact analysis of a declared comparability screen, an explicit duration-veto pathology, complete scalar bounds in the retained examples, and inspectable input-to-certificate binding. The strongest counterassessment is that these ingredients and constructions are too elementary for a major theoretical contribution. The release preserves that significance uncertainty instead of translating internal checking into an external quality rating.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Sovereign-debt and contract researchers | Diagnose when payment amount, timing and information assumptions lead to different admissible sets. | The screen and cash flows are stipulated, not validated institutional inputs. |
| Robust-optimisation researchers | Inspect an exact small-dimensional instance of nonanticipative interval intersection and trigger-region certification. | The method is an application of established robust-decision ideas, not a new general algorithm. |
| Reviewers of computational mathematics | Audit how model inputs, region ownership and certificate domains are bound before numerical claims are accepted. | Implementation-diverse producer checks are not unaffiliated reproduction. |
| Readers evaluating restructuring claims | Ask which rule, dates, discount factors and information set make a claimed comparison true. | The release supplies diagnostic questions, not legal, policy or country advice. |

## Why the problem matters

Words such as “lighter”, “longer” and “comparable” can hide different mathematical orderings. When a rule uses several vetoes, an apparently conservative change can improve one coordinate and worsen another. Exact bounds make that conflict visible and show which assumption is responsible. They also prevent a payment chosen with limited information from being justified using a state variable that was not yet observable.

## How to inspect or reproduce the recorded checks

Start with the definitions and the payment-removal identity in the paper. Then inspect `data/contracts.json`, which declares every shipped model. `input-lock.json` binds the model and calculation files used to create `results/certificates.json`.

From a clean extraction with Python 3.10 or later, run:

```sh
python3 -B code/verify.py
python3 -B -O code/verify.py
python3 -B code/check_certificates.py
python3 -B -O code/check_certificates.py
python3 -B code/test_revision.py
python3 -B -O code/test_revision.py
python3 -B code/check_manifest.py
```

The first six commands are read-only checks. `python3 -B code/verify.py --write` is a generator for a changed model and therefore changes release identity; it is not a verification command. The AI index maps every claim and limitation to its public evidence. The accessible HTML and Markdown carry the same definitions, equations and scope as the PDF.

## The most valuable next projects

1. Perform an unaffiliated reconstruction of the duration-removal theorem, strict-endpoint construction, oblique-trigger family and source-to-domain bridge.
2. Formalise the low-dimensional theorem and interval calculations in a proof assistant, keeping financial interpretation outside the formal claim.
3. Specify an authenticated public contract corpus and a genuinely applicable acceptance rule before attempting any country or institutional application.
4. Compare separate-veto and substitution-permitting rules under the same cash flows, information timing and declared welfare criterion.

## What is in the evidence package

The version-bound archive contains the 27-page self-contained paper; accessible Markdown and HTML; exact model data; producer, checker and regression code; certificates and benchmarks; three scientific figures; structured claims, sources, licences, provenance and assurance records; an AI index; and the full response to the supplied version-2 audit. The response preserves traceability but is not needed to understand or verify the result. The checksum manifest binds every distributed file except itself.
