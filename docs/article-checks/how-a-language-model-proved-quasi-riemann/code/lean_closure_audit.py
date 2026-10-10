"""Static audit of the import closure of a Lean module inside the openai/math library.

Usage: python -I lean_closure_audit.py <lean_root> <Module.Name> <out_json>

Walks `import` lines transitively (only modules under the local OAI/ComparatorChallenges
namespace; Mathlib and core are treated as trusted externals), then scans every file in
the closure for constructs that could weaken a kernel-checked proof.
This is a static screen, not a substitute for running Comparator / the Lean kernel.
"""
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
start = sys.argv[2]
out = Path(sys.argv[3])

IMPORT_RE = re.compile(r"^\s*(?:public\s+)?import\s+(.+)$")
# Patterns that matter for soundness or trust.
RISK = {
    "sorry": re.compile(r"\bsorry\b"),
    "admit": re.compile(r"\badmit\b"),
    "axiom_decl": re.compile(r"^\s*(?:private\s+|protected\s+)?axiom\s", re.M),
    "native_decide": re.compile(r"\bnative_decide\b"),
    "ofReduceBool": re.compile(r"ofReduceBool|Lean\.ofReduceBool|trustCompiler"),
    "implemented_by": re.compile(r"implemented_by"),
    "extern": re.compile(r"@\[\s*extern"),
    "unsafe": re.compile(r"\bunsafe\b"),
    "debug_skipKernelTC": re.compile(r"skipKernelTC"),
    "opaque_decl": re.compile(r"^\s*opaque\s", re.M),
    "macro_or_elab_def": re.compile(r"^\s*(?:syntax|macro|macro_rules|elab|elab_rules)\b", re.M),
}

def strip_comments(src: str) -> str:
    # remove nested block comments /- ... -/ and line comments --
    out, i, depth = [], 0, 0
    while i < len(src):
        if src.startswith("/-", i):
            depth += 1; i += 2; continue
        if depth and src.startswith("-/", i):
            depth -= 1; i += 2; continue
        if depth:
            i += 1; continue
        if src.startswith("--", i):
            j = src.find("\n", i)
            i = len(src) if j < 0 else j
            continue
        out.append(src[i]); i += 1
    return "".join(out)

def path_of(mod: str) -> Path:
    return root / (mod.replace(".", "/") + ".lean")

seen, stack, external = set(), [start], set()
while stack:
    m = stack.pop()
    if m in seen:
        continue
    p = path_of(m)
    if not p.exists():
        external.add(m)
        continue
    seen.add(m)
    for line in p.read_text(encoding="utf-8", errors="replace").splitlines():
        mm = IMPORT_RE.match(line)
        if mm:
            for name in mm.group(1).split():
                if name.startswith(("OAI", "ComparatorChallenges")):
                    stack.append(name)
                else:
                    external.add(name)

hits = {k: [] for k in RISK}
total_lines = 0
for m in sorted(seen):
    src = strip_comments(path_of(m).read_text(encoding="utf-8", errors="replace"))
    total_lines += src.count("\n")
    for k, rx in RISK.items():
        for match in rx.finditer(src):
            line_no = src.count("\n", 0, match.start()) + 1
            hits[k].append({"module": m, "line": line_no,
                            "text": src.splitlines()[line_no - 1].strip()[:160]})

ext_top = sorted({e.split(".")[0] for e in external})
report = {
    "start_module": start,
    "local_modules_in_closure": len(seen),
    "noncomment_lines_in_closure": total_lines,
    "external_import_roots": ext_top,
    "risk_counts": {k: len(v) for k, v in hits.items()},
    "risk_hits": {k: v[:40] for k, v in hits.items()},
}
out.write_text(json.dumps(report, indent=2))
print(json.dumps({k: report[k] for k in ("start_module", "local_modules_in_closure",
      "noncomment_lines_in_closure", "external_import_roots", "risk_counts")}, indent=2))
