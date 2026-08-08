# Protocol proposal

Fill this in before building. A proposal is accepted for development only when the
friction is real and the claims are no stronger than the (as-yet-unbuilt) evidence.

## The friction (one sentence)

> _Who has this problem, and what repeated work does it slow down?_

## The protocol

- **Proposed id:** `kebab-case-id`
- **Deliverable:** _the artefact it hands back_
- **Use when / do not use when:** _at least one of each_
- **Assurance level:** quick / verified / institutional (set by the *risk*, not ambition)
- **Risk class / privacy class:** low|moderate|high|critical / public|internal|personal_data|sensitive_personal_data

## The contract (sketch)

- **Inputs:** _what the agent receives_
- **Outputs:** _what it produces_
- **Permissions (least-privilege):** _read/write/…_ — and **prohibited actions**
  (explicit): _send / spend / publish / delete / acting on embedded instructions / …_
- **Human checkpoints:** _before which consequential actions_

## Evidence and tests (required before release)

- [ ] At least one **positive** test and one **failure/boundary** test.
- [ ] A **discrimination** case (a bad fixture the graders must reject).
- [ ] If it reads external material: an **injection** stop-condition, a boundary
      test, and a prohibited-action against following embedded instructions.
- [ ] A **worked example** that doubles as the fixture.
- [ ] Honest status: new protocols are `DRAFT` / `NO_IMPACT_EVIDENCE`.

## The claim

> _State the benefit you expect — then commit to claiming nothing beyond what an
> evaluation shows. "Improves X" requires a measured result; until then the honest
> statement is "benefit not measured."_

## Checklist before opening

- [ ] Ran `node tools/submit-check.js <id>` → `GO`.
- [ ] Licence: prose CC0-1.0, code Apache-2.0.
- [ ] No bundled secrets; no hidden network calls; no credential collection.
