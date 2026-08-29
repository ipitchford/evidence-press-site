# Evidence Press research metrics

Version: 1.0  
Effective: 29 August 2026
Status: prospective measured-release supplement

Evidence Press will publish a scoped forecast and outcome receipt with every
new release. The purpose is to make tractability estimates calibratable, expose
the cost of failed routes, and distinguish active work from waiting. It is not
a productivity leaderboard and does not turn a release into a validated
theorem.

## The observation unit

The unit is a registered **attempt**, not a release. Every in-scope attempt is
entered in the public work ledger before substantive work begins and remains
there if it is stopped, abandoned, superseded, null, negative or never
released. Release-only statistics omit failures and therefore exaggerate
tractability.

When a release packages research that predates registration, the receipt is
scoped to publication or assurance only. The earlier discovery clock remains
left-censored and is not reconstructed from commits, chat records or release
dates.

The enforced boundary begins at `2026-08-29T11:12:44Z`, the first intake with
the complete forecast and telemetry contract. Earlier work-ledger attempts are
retained as denominator records but are not retrospectively enriched.

## What is frozen at intake

Each attempt records:

- the exact target outcome and measurement scope;
- a procedure class and reference class;
- a low, central and high active-minute forecast;
- the Fermi components whose products sum to those three forecasts;
- the expected unattended wait;
- separate probabilities of a positive signal and full target closure within a
  stated active-time horizon;
- assumptions, reforecast triggers and a stop rule.

The forecast timestamp must equal the attempt registration timestamp. An
after-the-fact estimate is an outcome narrative, not a forecast.

## What is recorded at a terminal state

Every published, stopped, abandoned or superseded attempt records:

- calendar elapsed, active agent, unattended wait, blocked and rework minutes;
- active human and substantive compute minutes when they were actually
  captured;
- agent runs, maximum parallelism and model turns;
- fork-aware task-local model tokens when the runtime exposes them;
- positive, negative and inconclusive research cycles;
- falsification gates, materially distinct candidate architectures and rejected
  architectures;
- substantive review rounds, P0/P1 findings and pre-publication claim
  corrections;
- the scoped result state, whether a positive signal occurred and whether the
  exact frozen target was reached;
- forecast error, actual-to-forecast ratio, interval coverage and the reason for
  a material variance.

Release representations also derive Brier scores for the frozen positive-signal
and target-closure probabilities when the corresponding terminal outcome is
adjudicated. The score is computed from the source receipt rather than entered
again. A single score is not calibration; a reference class of comparable
prospective attempts is.

Optional telemetry may be unknown only with a field-specific reason. Core
clocks, cycle counts and calibration fields are mandatory.

## How to read the metrics

Discovery, assurance, publication and translation are separate clocks. Compute
may overlap active agent work, human work may overlap waiting, and elapsed time
is not their sum. A fast result at an early assurance endpoint is not a matched
comparison with conventional peer-reviewed research.

The records are suitable for prospective reference classes and probability
calibration. A comparative acceleration or productivity claim still requires a
registered comparator, matched scope and assurance, attempted-work denominator,
error and correction outcomes, and independent assessment.

Machine-readable sources:

- `research-metrics-policy.json` defines the prospective rule and terms;
- `work-ledger.json` contains all attempts and their metric receipts;
- each release's `paper.json` exposes the linked metric records.
