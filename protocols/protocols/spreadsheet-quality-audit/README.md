# Spreadsheet quality audit

**Check a supplied spreadsheet or table for formula errors, unit mismatches,
missing data, internal inconsistencies, and suspicious values — each finding
located to a cell and rated.**

| | |
|---|---|
| Protocol id | `spreadsheet-quality-audit` |
| Version | `0.1.1` |
| Kernel | Verified Agent Work `0.1.0` |
| Assurance level | Verified |
| Risk class | Moderate |
| Privacy class | Internal |
| Protocol assurance | see the pack's `RECEIPT.json` |
| Productivity evidence | `NO_IMPACT_EVIDENCE` (benefit not yet measured) |
| Licence | CC0-1.0 (prose) · Apache-2.0 (code) |

## 1. What problem does this solve?

A spreadsheet you are about to act on may carry a total that does not add up, a
line that does not follow its own formula, a column that mixes pounds and dollars,
a blank cell that quietly breaks a calculation, or a value that is simply
implausible. This protocol audits the table for those problems, locates each one to
a specific cell or row, and rates it — so the sheet can be checked against itself
rather than trusted.

## 2. Who is it for?

Anyone who has been handed a table and needs its arithmetic, units, and internal
consistency checked before relying on it: individuals sanity-checking a budget or a
data extract, and teams that want a located, rated, source-traceable list of what is
wrong with a shared spreadsheet.

## 3. What does a successful result look like?

Three things handed back together: the **audit** (a table of findings, each typed as
a formula error, unit mismatch, missing data, inconsistency, or suspicious value,
each with a cell location, a severity, and an explanation that shows the failing
check), an honest **limitations** section, and a compact **receipt**. Every finding
points at the table; a row that recomputes correctly is left unflagged.

## 4. What information does the agent receive?

The table you supply, plus optional context that steers what to check (which columns
should total, what units apply). Nothing else — it works only from what you provide,
and the context never becomes a finding on its own.

## 5. What can the agent change?

Only its three outputs, written to the working area. It reads your table and writes
the audit, limitations, and receipt. It does not touch the source spreadsheet: the
audit locates and rates problems, it never corrects them, and the receipt records
`source_modified: false`.

## 6. Where must a person approve?

Nothing is required at this risk level. One checkpoint is offered: before the sheet
is changed, deleted, or discarded on the strength of a finding, since a "suspicious"
value may be correct in a context the table does not carry.

## 7. How long and how much does it normally cost?

The audit is a set of read-and-check passes over the table — recompute the formulas,
compare the units, find the blanks, cross-check the totals, flag the outliers — so
cost scales with the size of the table. The protocol adds a fixed overhead — the
contract, the per-class passes, the checks — in exchange for a located, rated audit.
This describes the mechanism; it is not a measured saving, and the pack does not
claim one.

## 8. What has actually been tested?

The pack ships positive, failure, and prompt-injection **structural tests** whose
graders run against the worked example, checked mechanically and reproducibly. What
has **not** been done: a live comparison of real work with and without the protocol.
That is why `productivity_evidence` is `NO_IMPACT_EVIDENCE`. The pack does not claim
a benefit it has not measured.

## 9. What can go wrong?

A clean row can be flagged in error (mitigated by recording consistent rows
explicitly and by test `sqa-at-6`); an instruction hidden in a cell can be obeyed
(mitigated by the injection stop condition and test `sqa-at-5`); the source can be
edited instead of merely reported on (mitigated by the no-modify rule, the write
scope, and the `source_modified` flag); and a correct-but-unusual value can be
called an error (mitigated by the evidence boundary and low severity for
uncorroborated suspicion). Full list in [`protocol.yaml`](protocol.yaml) under
`failure_modes`.

## 10. How is it installed or used?

Three editions:

- **Copy-and-run** — no install. Paste [`adapters/generic-chat/prompt.md`](adapters/generic-chat/prompt.md)
  into any capable chat agent with your table.
- **Downloadable skill** — install [`SKILL.md`](SKILL.md) and this directory into a
  skills-compatible environment (Claude, Codex). See [`adapters/claude/`](adapters/claude/)
  and [`adapters/codex/`](adapters/codex/).
- **Local agent** — see [`adapters/local-agent/`](adapters/local-agent/) for a
  minimal, model-neutral runner.

## Honesty note

This README states how the protocol *works*, not that it *helps*. Any claim that it
improves your work would require an evaluation this pack has not yet run. Until then,
the honest statement is: benefit not measured.
