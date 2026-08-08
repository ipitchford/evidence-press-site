# Deploying Productivity Protocols into evidencepress.org

The subsystem mounts at `/protocols/` through the host repository's composite
build. The main `build.js` also owns the Evidence Press `/productivity/` programme
page; `protocols/build-protocols.js` remains responsible for the protocol subtree.
The two outputs are composed and checked as one publication candidate.

## The integration

[`integrate.sh`](integrate.sh) composes the two builders and mounts the result:

1. `node build.js` — the main site → `dist/`
2. `node protocols/tools/verify-all.js --no-build` — validate source and emit
   ignored, source-bound receipts. The guarded deploy and CI set
   `REQUIRE_COMMITTED_MANIFESTS=1`, which also refuses regenerated manifests that
   differ from Git; an ordinary local review build may leave that unset
3. `node protocols/build-protocols.js` — the subsystem → `protocols/dist/`
4. `node protocols/tools/test-starter-kit.js` — extract the generated starter
   into a fresh temporary directory and rerun its 31 pilot controls there
5. copy `protocols/dist` → `dist/protocols/`
6. `node tools/merge-protocols-sitemap.js` — fold the `/protocols/` page URLs into
   the main `dist/sitemap.xml` (idempotent), so crawlers using `/sitemap.xml`
   discover them directly.

The merged `dist/` then serves the whole site with `/protocols/` included and in
the main sitemap. Verify locally with `python3 -m http.server 8080 -d dist` and
open `/protocols/`. The repository's guarded `./tools/deploy.sh` calls this
composite build with the clean source commit pinned by `protocols/PUBLISHED.json`,
then runs both the protocol byte-integrity gate and the publication-preservation
gate. An ordinary deploy therefore cannot silently rebuild different protocol
bytes or omit already-published pages.

## Exact two-commit release shape

Protocol pages embed their Git source identity, while their publication ledger
contains hashes of those generated pages. To avoid a circular commit:

1. Commit every build-affecting input, checker, schema, test and document as
   clean commit **A**; build and review its exact bytes.
2. Add and commit only `protocols/PUBLISHED.json` as control commit **B**.
3. From clean B, `./tools/deploy.sh` rebuilds the protocol subtree with
   `PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT=A`. The override is fail-closed: A must
   be an ancestor, the worktree must be clean, and every A…B change must be the
   protocol ledger itself.
4. The deploy wrapper requires exact ledger parity before Cloudflare is called.

The current dirty candidate ledger is review evidence only and is deliberately
refused by the guarded deploy command.

## Deploy — a maintainer decision, not done here

The final step is **not** run by the build agent:

```bash
wrangler pages deploy dist
```

Deploying publishes to the live public site (`evidencepress.org`). It is
outward-facing and is left as an explicit maintainer action. This candidate has
been prepared and verified on the local candidate branch only; it has not been
deployed. Remote creation or branch publication is outside this document's
evidence boundary.

## What was verified vs left to the maintainer

- **Verified here:** the composite integration has been run locally, the protocol
  subtree mounts at `/protocols/`, published-page preservation is checked, and
  representative desktop/mobile pages have been reviewed. Generated `dist/` is
  ignored build output, not source evidence.
- **Left to the maintainer:** review and commit the candidate, run the guarded
  workflow from a clean committed source tree, perform the final live-readback
  comparison, and decide whether to deploy.

## Source and generated-output boundary

The host branch intentionally contains changes both inside `protocols/` and in
the root site generator, CI and publication-preservation ledger. `dist/` and
`protocols/dist/` are regenerated candidates. They are checked by the release
tools but should not be used as substitutes for reviewed source or public
readback. Nothing in `integrate.sh` performs a deployment.
