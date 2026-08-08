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
- **No-tool synthetic testing.** Offline tests expose no external tools and are
  designed to have no real side effects; this is a bounded test policy, not an OS
  sandbox. The separate development runner may call the named model API but does
  not grant the model external-action tools.
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

## First company-trial boundary

The no-install formative starter is deliberately narrower than the general pack
format. The feasibility tools additionally require a facilitator with Node 18+
and structured-file competence, but no connection to an agent runtime:

- use invented or irreversibly de-identified materials first;
- do not enter customer, employee, health, financial, credential, legal-case or
  commercially sensitive data into an agent merely because the trial page is
  local—the chosen agent product may still transmit it;
- record the agent product, account/data settings, destination, retention and
  deletion route before any trial input is used;
- keep all trial actions read-only and require a named human reviewer before an
  output informs work;
- record affected people, incident contact, rollback and stop authority; and
- treat prompt injection, unsupported claims, omitted obligations and accidental
  disclosure as reportable trial events, including near misses.

The static site itself sends no form data and loads no third-party scripts,
fonts, analytics or images. Browser-generated plans remain on the device unless
the user deliberately downloads or copies them. That says nothing about the
separate data practices of the agent product used for the trial.

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

This candidate has no remote reporting channel. Record a finding privately with
the maintainer and do not place secrets, personal data or exploit payloads in a
public issue. Before publication, the repository must add an authenticated
private disclosure route (for example, a repository security advisory). A
confirmed critical issue triggers candidate withdrawal first, diagnosis and
re-release second.
