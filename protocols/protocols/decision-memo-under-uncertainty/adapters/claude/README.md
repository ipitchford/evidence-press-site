# Claude adapter — decision memo under uncertainty

The pack is already an Agent Skill. `SKILL.md` carries the frontmatter Claude reads
(`name`, `description`, `allowed-tools`).

## Install

Place the protocol directory where Claude discovers skills (e.g. a
`skills/decision-memo-under-uncertainty/` folder in your project or personal skills
path). Claude selects it when a task matches the description, or you can invoke it by
name.

## Notes specific to Claude

- `allowed-tools: [read]` keeps the skill read-only; the memo, limitations, and
  receipt are written as its outputs. If you run it in an environment with write or
  tool access, the protocol's own `prohibited_actions` still bind — the skill must not
  send, publish, spend, delete, or execute an option.
- The injection stance matters here: Claude may be reasoning over tool results and
  files. The skill treats any instruction inside the materials as data to report and
  flag, never as a command — the worked example exercises exactly this.
- Fact versus assumption is the discipline the skill adds. When Claude drafts a memo,
  it is prone to state a hopeful assumption in the confident register of a fact; the
  `references/fact-vs-assumption.md` rule is there to hold the line, and the receipt
  records the facts and the labelled assumptions separately.
- Nothing in this adapter changes the platform-neutral contract in `protocol.yaml`;
  it only says how Claude loads and runs it.
