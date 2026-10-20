## Summary

When many updates share a busy processor, how old is the freshest information that has actually finished? Counting jobs does not fully answer that question.

This paper shows that very short jobs determine the leading freshness scale near saturation. Two service laws can give the same stationary queue-population distribution yet different rates of information ageing. The result includes a limiting probability law and every positive moment, with a further extension for slowly varying corrections such as logarithmic factors.

## Summary for specialists

Consider a stationary, lossless M/G/1 queue with egalitarian processor sharing. Arrivals are Poisson, service requirements have a fixed finite mean $m$, obsolete jobs remain in service, and the monitor keeps the greatest delivered generation timestamp.

If the service CDF satisfies $G(x)\sim cx^\beta$ at zero, put $\alpha=\beta/(\beta+1)$ and $\kappa=((\beta+1)m/c)^{1/(\beta+1)}$. Then
$$
(1-\rho)^\alpha A_\rho\Rightarrow
\kappa X^\alpha E^{1-\alpha},
$$
where $X,E$ are independent unit-mean exponential variables. Every positive real moment converges. A regularly varying lower-end CDF of positive index admits the analogous limit under the manuscript's integral-defined normalization. No finite service second moment is required.

## Technical account

The proof turns the age event into a first-completion question. An auxiliary queue retains fresh arrivals indefinitely, giving an exact survival product. A monotone coupling controls departures from the old population, while stationarity makes that population nearly constant on the shorter freshness time scale. A uniform tail bound permits convergence of all positive moments.

For example, lower-end powers one, two and three give age exponents one half, two thirds and three quarters. These are asymptotic exponents, not finite-load error estimates. With exponential service, the leading mean-age coefficient is $\pi/(2\sqrt2)$ in the scale $1/(\mu\sqrt{1-\rho})$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/processor-sharing-freshness.txt) is available for reading.

The limit and moment statements are analytic theorems. Fresh bounded checks cover finite rational means, scale algebra, a logarithmic diagnostic and a small stationary simulation. Larger historical simulations are preserved as historical evidence and were not rerun for publication. Their finite-load bias is not hidden by the asymptotic result.

There is no guarantee for any chosen finite load, no finite-buffer theorem, and no result here for cancellation, non-Poisson arrivals, an atom at zero, a positive minimum service requirement or zero-index lower-end regular variation. The global stochastic comparisons in the paper use exponential service. Internal AI checking is not external specialist review, independent external reproduction or formal verification.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Queueing researchers | Distinguish population insensitivity from freshness sensitivity | The service law is fixed as load increases |
| Information-age researchers | Use a full distributional limit rather than only a mean | Freshest-delivered timestamps are essential |
| System designers | Identify short-job behaviour as a relevant modelling feature | The theorem is not a finite-load design guarantee |

## Why the problem matters

Queue length and information freshness measure different things. A model can hide service-distribution differences in one statistic while exposing them strongly in another. The distinction matters whenever old updates continue consuming capacity.

## How to inspect or reproduce the recorded checks

Read the model definition before the limit theorem, then follow the three proof tasks identified in the manuscript's guide. The repository README gives the bounded fresh replay commands and separates those receipts from `evidence/historical/` simulations. Computational agreement does not substitute for the tail and uniform-integrability arguments.

## The most valuable next projects

Obtain controlled finite-load error bounds, test cancellation policies separately, or examine lower endpoints outside positive-index regular variation. Each changes a genuine boundary of the present model; additional simulations alone do not extend the theorem.

## What is in the evidence package

The self-contained manuscript, fresh bounded checks, historical simulation records, claim map, source audit, assurance statement, environment requirements and agent-readable index are linked from the research repository.
