"""Mechanical cross-check: numeric claims in the article against logs and repository files.
Run: python -I crosscheck_claims.py <checks_dir> <repo_dir> <article_body.md>
<checks_dir> is the folder holding logs/; <repo_dir> is the openai/math checkout."""
import json, re, sys, subprocess
from pathlib import Path
S, R, ARTICLE = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
essay = ARTICLE.read_text()
audit = json.loads((S/"logs/audit_OAI.NumberTheory.DirichletL.Nonvanishing.json").read_text())
toy = json.loads((S/"logs/exponent_and_toy_checks.json").read_text())
readme = (R/"README.md").read_text() if (R/"README.md").exists() else ""
hist = (R/"history.md").read_text()
p78 = (R/"preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/build/paper.tex").read_text()
p1112 = (R/"preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/build/paper2.tex").read_text()
def pages(f): 
    out = subprocess.run(["pdfinfo", str(f)], capture_output=True, text=True).stdout
    return int(re.search(r"Pages:\s+(\d+)", out).group(1))
checks = []
def chk(name, cond, essay_snippet):
    checks.append({"claim": name, "source_ok": bool(cond), "in_essay": essay_snippet in essay})
chk("2,924 modules", audit["local_modules_in_closure"] == 2924, "2,924")
chk("486,483 non-comment lines", audit["noncomment_lines_in_closure"] == 486483, "486,483")
chk("zero risky constructs", sum(audit["risk_counts"].values()) == 0, "none of these constructs appears")
chk("externals", set(audit["external_import_roots"]) == {"Lean","Mathlib","PrimeNumberTheoremAnd","RellichKondrachov"}, "PrimeNumberTheoremAnd and RellichKondrachov")
chk("199 pages", pages(R/"preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf") == 199, "199 pages")
chk("49 pages", pages(R/"preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/paper2.pdf") == 49, "49 pages")
chk("9-page Siegel", pages(R/"preprints/Uniform-exclusion-of-Landau-Siegel-zeros-October-1-2026/paper.pdf") == 9, "nine-page proof")
chk("margin 1/1200 in paper", "1/1200" in p78, "1/1200")
chk("C_I = s-2/3, C_II = s-11/16 in paper", "s-\\frac23" in p78 and "s-\\frac{11}{16}" in p78, "$s-11/16$")
chk("23/24 at theta=1/10", toy["A"]["amplification_exponent_k6_theta_1/10"] == "23/24", "D^{23/24}")
chk("23/12 and 49/30", toy["A"]["paper2_prime_extract_terms_at_theta"]["theta=1/10"] == ["23/12","49/30"], "D^{49/30}")
chk("1/4 and 3/16", toy["A"]["C_I(11/12)=11/12-2/3"] == "1/4" and toy["A"]["C_II(7/8)=7/8-11/16"] == "3/16", "3/16")
c, m = toy["B"]["constant_coefficients"], toy["B"]["mobius_coefficients"]
chk("toy 95.5%", round(100*c["share_from_square_rows"],1) == 95.5, "95.5%")
chk("toy 5.67", round(c["total_over_DH"],2) == 5.67, "5.67")
chk("toy 4.1%", round(100*m["share_from_square_rows"],1) == 4.1, "4.1%")
chk("toy 0.31", round(m["total_over_DH"],2) == 0.31, "0.31")
chk("toy 89 rows, 1.1%", c["number_of_square_rows"] == 89 and round(100*89/toy["B"]["H"],1) == 1.1, "89 square rows")
chk("theta<=1/10 in paper2", "0<\\vartheta\\le1/10" in p1112, "\\vartheta \\le 1/10")
chk("~42% formalised", "~42%" in hist, "42%")
chk("three withdrawn", "withdrawn the following three manuscripts" in hist, "withdrew three Hodge-related papers")
out = {"all_ok": all(x["source_ok"] and x["in_essay"] for x in checks), "checks": checks}
print(json.dumps(out, indent=1))
(S/"logs/crosscheck_claims.json").write_text(json.dumps(out, indent=1))
