# Release integrity

`tools/check-release-integrity.js` is the read-only release boundary for the
Productivity Protocols static candidate. It answers a narrow question:

> Does this exact `dist/`, and optionally this exact public readback, match the
> reviewed release ledger without a missing, added, renamed, or silently changed
> protocol or company-starter surface?

It does **not** deploy, publish, update the ledger, or contact a host unless a
person supplies `--live` with an explicit URL.

## What is pinned

`PUBLISHED.json` pins:

- the builder-reported full Git commit, tree, commit date, and dirty state;
- the builder version, including a candidate/prerelease suffix;
- the root index, machine-readable registry, and sitemap bytes;
- `/start/index.html` and the versioned
  `downloads/company-pilot-starter-<softwareVersion>.tar` bytes;
- every protocol ID and semantic version;
- both independent status values: protocol assurance and productivity evidence;
- each builder-emitted protocol page and machine-record path and its exact bytes;
- each versioned archive path, byte length, and SHA-256.

The checker also verifies relationships the hashes alone cannot express:

- registry count, uniqueness, ordering, URLs, versions, statuses, and archive
  hashes agree with the ledger;
- all six registry provenance fields (`sourceCommit`, `sourceDate`, `builder`,
  `source_commit_full`, `source_tree`, and `dirty`) agree with the ledger;
- page, archive, machine record, registry, and sitemap inventories are complete
  and contain no unledgered protocol artifact;
- each page contains the registered ID, version, statuses, archive URL, and
  machine-record URL;
- each machine record agrees with its ledger identity and archive manifest;
- each POSIX ustar archive has valid checksums, deterministic ordering and
  source-date mtimes, contains no unmanifested entry, and reproduces every
  manifest file hash;
- the company starter is a non-empty, multi-file, regular-file-only POSIX ustar
  rooted at `productivity-protocols-starter/`, with the company forms, licence,
  pilot schemas and dependency-free facilitator tools under canonical
  traversal-safe paths, deterministic ordering and source-date mtimes;
- the composite build extracts that exact archive into a fresh temporary
  directory and runs its 31 positive/known-bad pilot controls from inside it;
- every starter archive entry exactly matches its generated `start/files/` file
  mirror, while the starter page agrees on the
  versioned URL, SHA-256, bytes, and file count; and
- the sitemap contains exactly the root, starter, kernel, status, and
  protocol-page URLs expected for the configured mount path. An empty
  `base_path` means root-mounted.

The ledger's exact artifact paths are authoritative. Schema identifiers may use
the candidate `/api/v2/` namespace without forcing versioned public routes: the
checker follows the files the current builder actually emitted and the ledger
reviewed. Every emitted `api/v2/*.json` file is checked locally as an exact
generated mirror of its same-named `api/*.json` file. The ledger-derived registry
and per-protocol mirrors are also included in live readback. None is described as
canonical unless a future ledger explicitly makes it so.

## Commands

From the repository root:

```sh
# Production-source gate: requires an unambiguous, clean Git source.
node tools/check-release-integrity.js

# Development only: permits a dirty or non-Git candidate and prints that the
# result is not deploy authorisation. Registry and ledger must still agree on
# the exact dirty/null provenance fields emitted by the builder.
node tools/check-release-integrity.js --candidate

# Exact post-deploy readback. URL_BASE is the mounted site root.
node tools/check-release-integrity.js --live https://example.org/

# The only networked test binds an ephemeral 127.0.0.1 port.
node tests/release-integrity/run.js
```

An origin-only `--live` URL uses `PUBLISHED.json.site.base_path`. A URL containing
a path is treated as the exact mounted base. The checker requests identity
encoding, bypasses caches with the ledger revision, refuses cross-origin
redirects, and compares every pinned response byte with both the candidate and
the ledger. It also reads back the derived `api/v2` JSON mirrors and requires
them to equal their ledgered `api/` counterparts.

There is deliberately no `--record`, `--update`, or `--seal` command. Unknown
options fail before the ledger is read or written.

## The two-commit release shape

The build embeds its Git commit and commit date in HTML and tar metadata. A
ledger containing hashes of those bytes cannot be part of that same commit: its
own addition would change the commit, the build bytes, and therefore its hashes.

Use this bounded sequence:

1. Commit the substantive protocol, company-pilot, and site inputs as commit
   **A**.
2. From clean commit A, run the repository verification and build. Retain and
   review that exact ignored `dist/` (or its CI artifact).
3. Review the output and prepare `PUBLISHED.json` manually from it. Do not infer
   a higher assurance or productivity status during this step.
4. Commit only `PUBLISHED.json` as commit **B**. The checker, ledger schema,
   documentation and tests are build-affecting or gate-defining inputs and must
   already be present in A.
5. From clean B, rebuild with
   `PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT=<full-A-commit>`. The override proves A
   is an ancestor, requires a clean worktree, and refuses every A…B change except
   `PUBLISHED.json`. Run `node tools/check-release-integrity.js`; it requires the
   rebuilt bytes, ledger and registry to agree exactly and to report
   `dirty: false`.
6. If a maintainer later authorises deployment, deploy through the hosting
   repository's guarded workflow, then run `--live` against the mounted URL.
   Record publication status separately after the exact readback; this checker
   never changes it.

A default rebuild at B intentionally produces different build-identity bytes.
The guarded CI/deploy path instead uses the bounded source override above and
has a regression test requiring that clean-B output to be byte-identical to A.

## Failure means stop

A failure is not a request to weaken or regenerate the ledger. It normally means
one of four things:

- production output came from an ambiguous or dirty source, or candidate dirty
  provenance was not recorded explicitly;
- the ledger does not describe this candidate;
- public surfaces disagree with one another; or
- the deployed bytes are missing, stale, transformed, or different.

Reconcile the source and repeat the build. Any intentional release change needs
a new, reviewed ledger revision; the checker will not create one.

## Exact limits

This gate establishes file identity, cross-surface consistency, and bounded Git
provenance. It does not establish that:

- a protocol is useful, usable, safe in every runtime, or followed by an agent;
- an assurance or productivity status was deserved in the first place;
- a claim is true, novel, independently reproduced, peer reviewed, or accepted;
- the ledger itself was competently reviewed or cryptographically signed;
- unpinned assets such as feeds, explanatory kernel/status files, or hosting
  configuration are unchanged;
- every generated `start/files/` file was independently ledgered
  or live-read back (their local bytes are checked against the ledgered tar);
- the explicit live hostname belongs to the intended operator beyond ordinary
  HTTPS validation; or
- a successful local/localhost test is a successful production deployment.

The ledger is a human-reviewed trust root. Someone able to change both output and
ledger can make them agree; repository review, protected history, and the hosting
deployment gate remain necessary controls.
