# Pre-randomization screening-log boundary

Keep the screening log separate from the assignment, participant-status,
observation, follow-up, and summary files. It is an access-restricted operational
record, not a pilot outcome dataset, and is never passed to `pilot-*.js` tools.

Record only what is needed to account for recruitment before randomization:

- a screening-only code, not the randomized participant ID;
- approached date and eligibility result;
- one coded reason for ineligibility, decline, or no response; and
- consent date only for people who proceed to randomization.

Do not record worker-performance notes or sensitive free text. Store contact or
consent information separately under the approved access and retention rules.
Delete the screening log on its approved schedule. Once the participant list is
frozen, only randomized IDs enter `participant_status`; never encode a person
screened out beforehand as randomized attrition.
