# Provenance and ownership boundary

## Source lineage

The public predecessor was built from the `protocols/` subtree of the Evidence
Press repository and is currently bound by the live site's
`/api/build.json` to commit
`64531077fc707b03c762877ed97d01369163ddd9`.

The `0.2.0-candidate.1` review proceeded in two bounded stages:

1. the committed subtree at
   `e42b97f65d4ea09e26bfe21360fac1cbebd38726` was extracted into a standalone
   history-preserving checkout for adversarial review and repair; and
2. the reviewed methodological, schema, validation and release-control changes
   were selectively applied to the Evidence Press host branch
   `codex-productivity-protocols-v0.2`.

The integration deliberately retains the host branch's later house-style builder,
generated art, external browser script and pack-specific `scripts/` directories.
It does not copy the standalone candidate's unrelated visual shell over the live
site. Pre-existing untracked planning files in the host repository were not
modified.

## Publication boundary

The public site still represents the predecessor until a maintainer explicitly
authorises a guarded deployment and exact readback. A local build, passing test,
candidate ledger or Git branch is not a publication.

Two controls serve different purposes:

- the host `PUBLISHED.json` prevents an ordinary Evidence Press deploy from
  dropping any already-published release or protocol URL; and
- the protocol candidate ledger pins exact generated pages, records, archives,
  starter files and provenance for review before any future deployment.

The standard host deploy now calls the composite builder so `/protocols/` cannot
be omitted accidentally. The deploy command itself remains a maintainer action.

## Licensing carried forward

Protocol prose and templates are offered under CC0-1.0; protocol software and
validators are offered under Apache-2.0, as recorded in `LICENSE`. Reused
Evidence Press design and build material remains subject to its source licence.
No third-party company data or fabricated participant observation is included.

## Assurance limits

Git history establishes file lineage, not authorship independence, originality,
correctness, utility, field safety or acceptance. The predecessor's negative
evaluations are retained because they are relevant evidence, but their findings
remain bound to the exact versions, task sets, models and graders that produced
them. The current candidate contains no realised company-impact evidence.
