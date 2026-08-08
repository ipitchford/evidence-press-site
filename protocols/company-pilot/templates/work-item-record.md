# Work-item record

Complete immediately after one item. Use IDs and coded categories only; do not
paste source documents, agent transcripts, names, emails, or free-text worker
performance notes into the outcome dataset.

- participant ID: [P...]
- work-item ID: [W...]
- sequence: [MAP/MPA/AMP/APM/PMA/PAM]
- period: [1/2/3]
- arm: [manual/agent_without_protocol/agent_with_protocol]
- task-block ID and task ID: [B... / T... from the frozen assignment]
- roster status: [planned/started/completed/missing/withdrawn/stopped_for_safety]
- intercurrent event: [none or one coded category]
- missing reason: [not_missing or one coded reason]
- active participant effort: [minutes or null]
- elapsed time: [minutes or null]
- correction cycles after first submission: [integer or null]
- blinded quality ratings: [rater ID, five component integers, recomputed total]
- material-error count: [integer or null]
- cognitive burden: [1 low – 7 high, or null]
- would adopt this method for similar work: [true/false/null]
- help requests: [integer or null]
- optional facilitator active support: [minutes or null; measured zero if self-guided]
- approver/checker active time: [minutes or null]
- measured model/tool cost: [USD or null; do not treat unavailable as zero]
- contamination detected: [true/false/null]
- protocol adherence: [not_applicable/full/partial/none/unknown/null]
- safety events: [none or coded incident IDs, category, severity, stopped work]

Create every row from `planned_work_items` before work begins. Never delete a
row when an item is missing, stopped, or withdrawn: set the status and coded
reason, and use null for unobserved outcomes.

The participant timer includes reading, prompt preparation, checking, and
correction. Facilitator and approver/checker time remain separate. Total human
resource minutes are derived as the sum of all three and are never entered by
hand. Quality score is the mean of valid rating totals. Accepted output is
derived from the frozen quality threshold, material-error limit, severe-safety
rule, and completed status; do not store either derived value in the dataset.
