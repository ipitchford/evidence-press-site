#!/usr/bin/env python3
"""Implementation-diverse exact audit; internal checking, not independent review."""
import importlib.util
import itertools
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('witness', Path(__file__).with_name('check-atlas-witness.py'))
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)
g = json.loads((root / 'data/atlas-research/graph48.json').read_text())
control = json.loads((root / 'data/atlas-research/graph50-control.json').read_text())
witness = [0,2,4,7,8,10,13,14,16,18,21,22,24,26,28]
checker.verify(g, witness, 15)
for bad in ([0], [0,0], [999], witness + [30]):
    try:
        checker.verify(g, bad, 15)
    except ValueError:
        pass
    else:
        raise RuntimeError('corrupt witness accepted')

def direct_count(graph):
    # No clauses and no call to the JS generator or reduction.
    neighborhoods = [{i} for i in range(graph['order'])]
    for u,v in graph['edges']:
        neighborhoods[u].add(v)
        neighborhoods[v].add(u)
    return sum(len(set.union(*(neighborhoods[v] for v in choice))) == graph['order']
               for choice in itertools.product(*graph['maximal_matching']))

counts = [direct_count(g), direct_count(control)]
if counts != [317, 0]:
    raise RuntimeError('direct graph enumeration disagrees: ' + str(counts))
print(json.dumps({'status': 'passed', 'graph48_direct_count': counts[0], 'graph50_direct_count': counts[1],
                  'negative_witness_controls': 4, 'scope': 'internal graph-only audit; no ordinary lower bound from the negative control'}))
