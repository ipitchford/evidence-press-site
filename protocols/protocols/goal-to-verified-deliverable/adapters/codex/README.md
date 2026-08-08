# Codex adapter — goal to verified deliverable

OpenAI describes Agent Skills as the authoring format for reusable ChatGPT and
Codex workflows, so this pack's `SKILL.md` is usable directly.

## Install

Add the protocol directory to the location Codex reads skills from. Codex can
invoke it by name or select it when the task matches its description.

## Notes specific to Codex

- Codex often runs with a working directory and shell. The protocol's
  `permissions` grant `write` only to its own outputs; its `prohibited_actions`
  forbid deleting or overwriting files that are not the named outputs. Honour
  those even though the runtime could do more.
- No network is required. If you wire in optional tools, declare them and state
  how the protocol degrades without them (see `optional_tools` in
  `protocol.yaml`).
- The contract is platform-neutral; this file only covers Codex loading and
  sandbox behaviour.
