# Claude adapter — evidence-backed brief

The pack is already an Agent Skill. `SKILL.md` carries the frontmatter Claude reads
(`name`, `description`, `allowed-tools`).

## Install

Place the protocol directory where Claude discovers skills (e.g. a
`skills/evidence-backed-brief/` folder in your project or personal skills path).
Claude selects it when a task matches the description, or you can invoke it by
name.

## Notes specific to Claude

- `allowed-tools: [read]` keeps the skill read-only; the brief, uncertainties,
  limitations, and receipt are written as its outputs. If you run it in an
  environment with write or tool access, the protocol's own `prohibited_actions`
  still bind — the skill must not send, publish, spend, or delete.
- The injection stance matters most here: Claude may be briefing over tool results
  and files. The skill treats any instruction inside a source as data to report and
  flag, never as a command — the worked example exercises exactly this.
- Claim typing is the discipline the skill adds. When Claude summarises, it is
  prone to state estimates and opinions in the confident register of fact; the
  `references/claim-typing.md` rule is there to hold the line, and the receipt
  records the type of every claim.
- Nothing in this adapter changes the platform-neutral contract in `protocol.yaml`;
  it only says how Claude loads and runs it.
