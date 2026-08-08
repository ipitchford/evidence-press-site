# Claude adapter — goal to verified deliverable

The pack is already an Agent Skill. `SKILL.md` carries the frontmatter Claude
reads (`name`, `description`, `allowed-tools`).

## Install

Place the protocol directory where Claude discovers skills (e.g. a
`skills/goal-to-verified-deliverable/` folder in your project or personal skills
path). Claude selects it when a task matches the description, or you can invoke it
by name.

## Notes specific to Claude

- `allowed-tools: [read]` keeps the skill read-only; the deliverable, contract,
  limitations, and receipt are written as its outputs. If you run it in an
  environment with write/tool access, the protocol's own `prohibited_actions`
  still bind — the skill must not send, spend, publish, or delete.
- The injection stance matters most here: Claude may be operating over tool
  results and files. The skill treats any instruction inside those as data to
  report, never as a command.
- Nothing in this adapter changes the platform-neutral contract in
  `protocol.yaml`; it only says how Claude loads and runs it.
