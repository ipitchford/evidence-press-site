# Checks behind “How did a language model prove a quasi-Riemann hypothesis?”

Supporting material for the Evidence Press article at
`/articles/how-a-language-model-proved-quasi-riemann/`. State of the record:
10 October 2026; `openai/math` at commit `fd4aeeb` (7 October 2026, still the
head of its main branch on 10 October).

These are producer-side screens and recomputations. They are not an
independent verification of the theorem, which rests on Comparator and
Lean-kernel runs by third parties cited in the article.

## Contents

| Path | What it is |
|---|---|
| `code/lean_closure_audit.py` | Walks the `import` closure of the Lean solution module and scans for `sorry`, `admit`, `axiom`, `native_decide`, `implemented_by`, `extern`, `unsafe`, `opaque` and custom syntax |
| `code/exponent_and_toy_checks.py` | Exact-rational recomputation of the exponents quoted from the papers, plus the toy quadratic-symbol experiment over the integers |
| `code/crosscheck_claims.py` | Mechanical check that each numeric claim in the article matches the logs and repository files |
| `logs/audit_*.json`, `logs/audit_*.txt` | Output of the closure audit (2,924 modules; 486,483 non-comment lines; zero flagged constructs) |
| `logs/exponent_and_toy_checks.*` | Exponent arithmetic and toy-experiment results |
| `logs/crosscheck_claims.json` | Result of the claim cross-check against the published article text (all pass) |
| `logs/comparator_configs.txt` | The Siegel, Dirichlet and Hecke Comparator challenge statements and configurations, excerpted from `openai/math` (Apache License 2.0) |
| `logs/doi_checks.txt`, `logs/repo_commit.txt` | DOI resolution checks and the repository commit record |
| `research_notes/` | Working notes on the ten released reasoning summaries and on reception and provenance, with source-status labels |

Raw text captured from news, social-media and question-and-answer sites during
the research is not reproduced here; the article cites those sources directly.

## Rerunning

```sh
git clone --depth 1 --filter=blob:none --sparse https://github.com/openai/math.git repo
cd repo && git sparse-checkout set --no-cone '/README.md' '/history.md' '/lean/OAI/*' '/lean/ComparatorChallenges/*' '/preprints/The-Quasi-Riemann-Hypothesis-*/*' '/preprints/Uniform-exclusion-of-Landau-Siegel-zeros-October-1-2026/*'
cd ..
python -I code/lean_closure_audit.py repo/lean OAI.NumberTheory.DirichletL.Nonvanishing logs/audit.json
python -I code/exponent_and_toy_checks.py logs/exponent_and_toy_checks.json
python -I code/crosscheck_claims.py . repo ../../../articles/how-a-language-model-proved-quasi-riemann/body.md
```

The cross-check needs `pdfinfo` (Poppler) for page counts. On 10 October 2026
the closure audit and the toy computation were rerun from a fresh clone at
`fd4aeeb` and reproduced the logged results exactly.

The static audit reads source text; it does not run Lean, Comparator or a proof
kernel.
