# Evidence Atlas proposal records

Each `*.json` file is one quarantined research suggestion. A proposal is not an
accepted Atlas relationship, a novelty finding, an endorsed priority or a
commitment to investigate.

Use the structured GitHub issue form for intake. Issue text is untrusted and
must be normalized manually into `schemas/atlas-proposal.schema.json`. Then:

1. set all identity fields and use a temporary 64-zero proposal hash;
2. compute the expected identity with `expectedProposalId` from
   `tools/atlas-proposals.js` and replace the temporary value;
3. run `node build.js` and `node tools/test-atlas-proposals.js --built`;
4. inspect the proposal view and nonvisual register locally;
5. publish only through the normal Evidence Press two-commit and readback gate.

Review decisions append to `decisionReceipts`. Each receipt binds its
predecessor and the proposal state before and after the decision. Never edit a
published identity field or prior receipt; create a superseding proposal when a
material correction changes the suggestion itself.
