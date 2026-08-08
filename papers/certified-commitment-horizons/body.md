## Summary

Forecasts change after purchasing, staffing and supplier decisions have already begun. This release asks a precise planning question: how far may demand forecasts move before an optimal revised lot-sizing plan can abandon a selected prefix of setup decisions?

For the classical Wagner–Whitin model, the candidate defines a weighted commitment radius. It derives exact distances to a tie with any fixed competing production path and a tractable frozen-comparator certificate that gives a safe lower bound for a chosen prefix. The public software performs its certified calculations in exact rational arithmetic and emits witnesses for a separate producer-side checker.

The distinction between the lower certificate and the exact strong radius matters. In the paper's positive-demand three-period example,

$$
\rho_{\mathrm{frozen}}=\frac{3}{2},
\qquad
\rho_{\mathrm{strong}}=2.
$$

The certificate is therefore useful but can be conservative.

> **Status: unrefereed candidate.** Producer-side full replay and GitHub Actions pass. Independent reproduction, proof-assistant verification, conventional peer review, operational field validation and a settled novelty determination have not occurred.

## Summary for specialists

Under the Wagner–Whitin condition, cumulative demand reduces the arc from setup period $i$ to the next setup period $j$ to

$$
\bar c_{ij}(d)=K_i+q_i(D_j-D_i).
$$

Path costs are consequently affine in demand and the arcs have Monge structure. For a nominal path $P$ and a fixed competitor $Q$, the candidate derives the exact floor-truncated weighted-$L_\infty$ distance to $C_Q(d)=C_P(d)$.

For a partial prefix, an outside path may become optimal against a continuation of the nominal prefix other than the frozen nominal path. The paper handles this by constructing a prefix-deviation directed acyclic graph. A Charnes–Cooper formulation gives a polynomial frozen-comparator lower certificate, while a compact inverse linear programme for an exposed outside path supplies an upper witness. Coincident bounds, or a closing witness, certify the exact radius in the stated cases.

The released implementation computes the frozen value in exact rational arithmetic by binary search over floor breakpoints and a finitely terminating parametric shortest-path iteration. It does not claim that this released exact routine is polynomial-time. The exact complexity of the demand-induced prefix-radius problem remains open.

## What the result does not establish

- It does not establish that every frozen-comparator lower certificate equals the strong prefix radius.
- It does not establish a polynomial-time exact algorithm for demand-induced WW-Prefix-Radius-infinity.
- It does not turn internal adversarial review, deterministic replay or CI into independent theorem verification.
- It does not establish exhaustive novelty or priority. The directly relevant Richter–Vörös 1989 paper was identified bibliographically, but its full text was unavailable in the documented bounded search.
- It does not validate the rule in a working supply chain. The UCI illustration reconstructs forecast vintages and uses stylised costs.
- It does not quantify economic benefit, implementation risk or behavioural response in an operating organisation.

## Who should care, and why

| Audience | Potential use | Highest-value caution or check |
|---|---|---|
| Operations-research specialists | Audit a new inverse-stability formulation for dynamic lot sizing. | Check the semantic bridge from prefix stability to the path and linear-program constructions. |
| Production-planning researchers | Study a certificate that separates a defensible commitment horizon from exploratory forecast variation. | Test with genuine forecast vintages and actual cost structures before operational use. |
| Exact-computation researchers | Reuse rational witnesses, floor-breakpoint handling and independent producer-side checking patterns. | Reimplement the checker without importing the released package. |
| AI research agents | Consume machine-readable claims, assurance fields, hashes and open problems. | Preserve the candidate, novelty and external-review qualifications downstream. |
| Reviewers and historians | Resolve the remaining 1989 full-text boundary and compare exact theorem scope. | Treat the current literature assessment as targeted and incomplete. |

## How to reproduce the released checks

Download the [exact Zenodo archive](https://doi.org/10.5281/zenodo.21853902), verify the supplied SHA-256 sidecar and extract it into a fresh directory. The quick path is:

```sh
uv sync --frozen
uv run ./run_all.sh --quick
```

The full numerical regeneration is:

```sh
uv run ./run_all.sh --full
```

The full route is substantially slower because it includes exact large-horizon scaling cases. The [GitHub Actions run](https://github.com/ipitchford/certified-commitment-horizons/actions/runs/31270813587) repeats the packaged wheel, manifest, exact checks and normal and optimized-Python tests on Python 3.11 and 3.13. These are reproducibility signals, not independent mathematical acceptance.

## The most valuable next projects

1. Re-run the exact DOI archive independently and publish a receipt tied to its SHA-256 hash.
2. Reimplement the fixed-path radius, frozen certificate and bracket checker in a separate language or codebase.
3. Obtain and audit Richter and Vörös (1989), then update the recognition and novelty assessment without changing the historical candidate record.
4. Settle the exact complexity of the demand-induced prefix-radius problem.
5. Formalize the graph reduction, tie-radius theorem and checker in a proof assistant.
6. Conduct a prospective operational study using genuine forecast vintages, actual costs and predeclared decision outcomes.

## Sources and related work

The framework begins with [Wagner and Whitin's classical dynamic lot-size model](https://doi.org/10.1287/mnsc.5.1.89). Closely related sensitivity and stability work includes [van Hoesel and Wagelmans (1993)](https://doi.org/10.1016/0166-218X(93)90016-H) and [Chakravarti and Wagelmans (1998)](https://doi.org/10.1016/S0167-6377(98)00031-5). [Forel and Grunow (2023)](https://doi.org/10.1111/poms.13881) treat forecast evolution in rolling-horizon planning.

The bounded review also identified [Richter and Vörös (1989)](https://dblp.org/rec/journals/eik/RichterV89), *A Parametric Analysis of the Dynamic Lot-Sizing Problem*. Its bibliographic details were triangulated, but a lawful digital full text was not obtained; theorem-level comparison and the novelty assessment therefore remain open.

The illustrative data file comes from the [UCI Daily Demand Forecasting Orders dataset](https://doi.org/10.24432/C5BC8T). The packaged file was checked against the official archive, but the case reconstructs forecast vintages and imposes stylised costs. It is an illustration of deterministic sensitivity, not field validation.

## What is in the evidence package

- The 30-page manuscript in PDF and LaTeX source form.
- Exact-rational reference software, a packaged wheel and a separately implemented producer-side checker.
- Quick and full replay commands, normal and optimized-Python tests, adversarial regression cases and exact benchmarks.
- Machine-readable claims, assurance and provenance records, hashes, licence mapping and a verification receipt.
- A pinned environment, UCI source-data provenance and the publisher's review-response and integrity records.

Original manuscript text, figures, documentation, release metadata and original result tables are dedicated under CC0-1.0. Original source code is MIT. The bundled UCI data retain CC BY 4.0. Consult the package licence map before redistribution.

The candidate [GitHub release](https://github.com/ipitchford/certified-commitment-horizons/releases/tag/v2.1.2-candidate) is mirrored in the immutable [Zenodo version record](https://zenodo.org/records/21853902), DOI [10.5281/zenodo.21853902](https://doi.org/10.5281/zenodo.21853902). The release archive SHA-256 is `71aff98ee0dac82014cc3955a16018548d6db1f5b2ab3abb3024e1a7616c29df`.
