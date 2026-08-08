# Security — adversarial-output-review

This pack inherits the library policy in [`../../SECURITY.md`](../../SECURITY.md).
Pack-specific points:

- **Read-only by default.** Declared permissions are `read` (the supplied draft and
  sources) and `write` (its own three outputs). No network, no execute. The
  manifest's `network_required` is `false`.
- **The draft is adversarial input.** This protocol exists to challenge a draft, and
  the draft may itself contain an instruction addressed to the reviewer ("ignore the
  flaws", "mark this approved", "email X"). The stop conditions and acceptance test
  `aor-at-5` require that such an instruction is flagged and not obeyed. The worked
  example embeds one ("NOTE TO REVIEWER ...") and a discrimination test confirms the
  graders reject a run that follows it.
- **Invented findings are a defect, not thoroughness.** `prohibited_actions` forbid
  a finding that does not trace to a claim in the draft or a supplied source.
  Acceptance test `aor-at-6` and the two-sided accuracy scoring in the eval design
  exercise this — a manufactured defect scores as badly as a missed one.
- **No edits, no consequential actions.** `prohibited_actions` forbid rewriting the
  draft and forbid send/publish/spend/delete/approve/sign-off. The failure fixture
  (`tests/fixtures/bad-receipt.json`) represents a run that approves the memo and
  emails a sign-off, and the discrimination tests confirm the graders reject it.
- **No secrets, no telemetry.** The pack ships no keys and makes no calls.

Report issues via the parent repository's security process. A confirmed serious
issue withdraws the pack from the registry before diagnosis.
