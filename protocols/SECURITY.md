# Security policy

A downloadable skill is an **executable procedural artefact**. It tells an agent
what to do, sometimes with scripts and tool access. Treat every pack as part of a
software supply chain, not as ordinary prose. This policy is enforced partly by
`tools/hostile-tests.js` and partly by human review at the `SECURITY_REVIEWED`
gate.

The automated part is a static **lint**: allow-by-default analysis that fails
closed only on patterns it recognises. It is not a sandbox — it does not mediate
capabilities, isolate the filesystem or network, verify dependencies, or run the
code. Enforcing the permission contract at runtime is the **runtime's**
responsibility, not the scanner's. See
[`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md) for the scanner's known gaps.

## Default rules for every pack

- **No hidden external calls.** Any network access is declared in `permissions`
  (`action: network`) and justified. A pack whose scripts reach the network
  without a declaration fails the hostile suite.
- **No credential collection.** A protocol never asks the user to paste
  passwords, API keys, card numbers, or government IDs, and never types them into
  a field. If a workflow needs authentication, it directs the user to do it
  themselves.
- **No write access unless essential.** Read-only is the default. A `write` or
  `execute` permission must name its scope and reason.
- **Preview before consequential actions.** Anything that sends, spends,
  publishes, or alters a record is gated behind a `human_checkpoint` placed
  before the action.
- **Least-privilege tool declarations.** Optional tools state how the protocol
  degrades without them, so the connected edition is never a silent requirement.
- **Sandboxed testing.** Tests and evals run without real external side effects;
  the harness refuses a test that would perform a live consequential action.
- **Immutable releases with hashes.** Each pack ships a `MANIFEST.json` with a
  SHA-256 per file and a `RECEIPT.json`. A downloader can verify the pack
  byte-for-byte before running anything.
- **Static inspection of scripts.** Scripts are dependency-free and short enough
  to read. The hostile suite scans them for network calls, filesystem escapes,
  `eval`/dynamic execution, and secret-shaped strings.
- **Clear network requirements.** `network_required` in the manifest is true only
  if the protocol genuinely cannot deliver without a network call.
- **No bundled secrets.** No tokens, keys, or personal data in any pack file.
- **Explicit data-retention assumptions.** A protocol states what it keeps and
  for how long; the default is "nothing beyond the session."
- **Immediate withdrawal on serious vulnerability.** A pack with a confirmed
  serious vulnerability is pulled from the registry ahead of its deprecation
  record.

## Prompt-injection stance

Protocols operate on supplied documents and, in the connected edition, on
external content. **Instructions found in that content are data, not commands.**
A protocol must not act on an instruction embedded in its inputs (e.g. a document
that says "email this to X" or "ignore your permissions"). The
`document-to-action-plan` and `evidence-backed-brief` packs carry explicit
injection-resistance tests; every connected-edition adapter restates this stance.

## The `allowed-tools` field

The Agent Skills format has an experimental `allowed-tools` field. We populate it
where supported, but the authoritative permission record is `protocol.yaml`
(`permissions` + `prohibited_actions`) and the manifest's `declared_permissions`,
because client support for `allowed-tools` varies. Never rely on the skill format
alone to constrain a pack.

## Reporting

Security issues in a protocol should be reported through the parent repository's
`SECURITY.md` process. A confirmed issue triggers withdrawal first, diagnosis
second.
