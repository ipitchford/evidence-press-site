"""EP local follow-up replay. Run beside ep.json and extracted arXiv source/."""
import ast, hashlib, json, platform, subprocess, sys, tempfile
from pathlib import Path

root = Path(__file__).resolve().parent
anc = root / 'source/anc'
ep = json.loads((root/'ep.json').read_text())
paper = json.loads((anc/'counterexample.json').read_text())
def require(ok, message):
    if not ok: raise RuntimeError(message)
def edges(es): return sorted(tuple(sorted(e)) for e in es)
raw = [tuple(map(int,l.split())) for l in (root/'ep.edgelist').read_text().splitlines() if l.strip() and not l.startswith('#')]
require(edges(raw)==edges(ep['edges'])==edges(paper['edges']), 'graph mismatch')
require(ep['formula_signed_integers']==paper['clauses_signed_1_based'], 'clause mismatch')
module=ast.parse((anc/'paper_audit.py').read_text())
clauses=next(ast.literal_eval(n.value) for n in module.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='clauses' for t in n.targets))
require(clauses==ep['formula_signed_integers'], 'enumeration clause mismatch')
print('IDENTITY: all 75 labelled edges and all 20 ordered signed clauses match EP v4.0.0-rc1', flush=True)
print('ENVIRONMENT:',sys.version,platform.platform(),flush=True)
def run(args, success=True):
    p=subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
    print('COMMAND:', 'python3 '+' '.join(map(str,args)))
    print(p.stdout+p.stderr, end='')
    require((p.returncode==0)==success, 'unexpected exit status')
    return p.stdout
run([anc/'verify_structure.py',anc/'counterexample.json'])
for flags in ([],['-O']):
    out=run([*flags,anc/'check_dom15_certificate.py',root/'ep.edgelist',anc/'dom15.tree'])
    require('nodes=893049 branches=223262 leaves=669787 maxdepth=15' in out,'certificate counts')
with tempfile.TemporaryDirectory() as tmp:
    tree=(anc/'dom15.tree').read_bytes()
    for name,data in [('truncated',tree[:-1]),('trailing',tree+b'\0'),('bad-magic',b'X'+tree[1:])]:
        path=Path(tmp)/name; path.write_bytes(data)
        run([anc/'check_dom15_certificate.py',root/'ep.edgelist',path],False)
out=run([anc/'paper_audit.py'])
require('VERIFIED: every dominating set has size at least 16' in out,'enumeration failed')
print('SHA256:')
for path in [root/'arxiv-source.tar',root/'ep.edgelist',root/'ep.json',anc/'counterexample.json',anc/'check_dom15_certificate.py',anc/'verify_structure.py',anc/'paper_audit.py',anc/'dom15.tree',Path(__file__)]:
    print(hashlib.sha256(path.read_bytes()).hexdigest(),str(path.relative_to(root)))
print('PASS: EP local replay only; no formal or unaffiliated exact-release verification claimed.')
