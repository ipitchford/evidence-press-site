"""Audit archived seed regeneration separately from rational receipt validity.

Usage: python audit.py --research /path/to/research --out /new/output
Run with numpy==2.3.5. The input is never modified.
"""
import argparse, hashlib, json, math, platform, shutil, subprocess, sys
from collections import Counter
from fractions import Fraction
from pathlib import Path
import numpy as np

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--research', type=Path, required=True)
ap.add_argument('--out', type=Path, required=True)
args = ap.parse_args()
src, out = args.research.resolve(), args.out.resolve()
if out == src or src in out.parents or out.exists():
    raise SystemExit('Output must be new and outside the research input')
out.mkdir(parents=True)
work = out / 'research'
shutil.copytree(src, work, ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
original = json.loads((src/'results/paired_v03.json').read_text())
for name in ['verify_reports_v03.py', 'simulate_v03.py']:
    with (out/(name+'.log')).open('w') as log:
        subprocess.run([sys.executable, '-B', str(work/'src'/name)], cwd=work,
                       stdout=log, stderr=subprocess.STDOUT, check=True, timeout=120)
fresh = json.loads((work/'results/paired_v03.json').read_text())
fresh_rows = {(r['law'],r['replicate']):r for r in fresh['raw']}
rows=[]
for old in original['raw']:
    new=fresh_rows[(old['law'],old['replicate'])]
    targets={v['n']:original['receipts'][v['receipt_id']]['counts']
             for v in old['outcomes'].values() if v['n'] is not None}
    rng=np.random.default_rng(old['seed'])
    p=np.array([Fraction(x) for x in old['probabilities']],float)
    counts=np.zeros(5,dtype=np.int64); n=0; nn=100; comparisons=[]
    while n<old['cap']:
        nn=min(old['cap'],nn)
        counts+=rng.multinomial(nn-n,p); n=nn
        if n in targets:
            actual=[int(x) for x in counts]
            comparisons.append({'n':n,'archived':targets[n],'regenerated':actual,'match':actual==targets[n]})
        nn=max(n+1,math.ceil(n*1.03))
    if len(comparisons)!=len(targets):raise RuntimeError('Saved acceptance off recorded grid')
    rows.append({'law':old['law'],'replicate':old['replicate'],'seed':old['seed'],
                 'outcomes_match':old['outcomes']==new['outcomes'],
                 'archived_counts_match':all(c['match'] for c in comparisons),
                 'receipt_count_comparisons':comparisons,
                 'archived_stops':{k:v['n'] for k,v in old['outcomes'].items()},
                 'regenerated_stops':{k:v['n'] for k,v in new['outcomes'].items()}})
summary={}
for law in original['summary']:
    group=[r for r in rows if r['law']==law]
    summary[law]={'runs':len(group),'outcomes_matching':sum(r['outcomes_match'] for r in group),
                  'saved_receipt_counts_matching':sum(r['archived_counts_match'] for r in group),
                  'archived_summary':original['summary'][law],'regenerated_summary':fresh['summary'][law]}
report={'schemaVersion':1,'scope':'Producer-side seed regeneration audit; not independent review or proof validation',
        'python':platform.python_version(),'platform':platform.platform(),'numpy':np.__version__,
        'bitGenerator':'PCG64 via numpy.random.default_rng',
        'sourceHashes':{p:digest(src/p) for p in ['src/simulate_v03.py','src/verify_reports_v03.py','results/paired_v03.json','requirements.txt']},
        'saved_receipt_replay':json.loads((work/'results/report_checks_v03.json').read_text()),
        'all_saved_outcomes_match':all(r['outcomes_match'] for r in rows),
        'summary':summary,'runs':rows,
        'boundary':'No original archive, seed, count, manuscript or reported result was altered. Cause of disagreement is not inferred from this test.'}
(out/'audit.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:{a:b for a,b in v.items() if not a.endswith('_summary')} for k,v in summary.items()},indent=2))
