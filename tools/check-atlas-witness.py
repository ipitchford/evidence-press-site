#!/usr/bin/env python3
"""Graph-only witness audit. No SAT reduction and no third-party dependencies."""
import json
import sys

def verify(graph, witness, bound):
    n = graph['order']
    if type(n) is not int or not 1 <= n <= 256:
        raise ValueError('invalid order')
    edges = set()
    for edge in graph['edges']:
        if len(edge) != 2 or any(type(v) is not int or not 0 <= v < n for v in edge) or edge[0] == edge[1]:
            raise ValueError('invalid edge')
        e = tuple(sorted(edge))
        if e in edges:
            raise ValueError('duplicate edge')
        edges.add(e)
    if type(bound) is not int or bound < 0 or not isinstance(witness, list) or len(witness) > bound or len(set(witness)) != len(witness) or any(type(v) is not int or not 0 <= v < n for v in witness):
        raise ValueError('invalid witness')
    chosen = set(witness)
    missing = [v for v in range(n) if v not in chosen and not any(tuple(sorted((v,w))) in edges for w in chosen)]
    if missing:
        raise ValueError('undominated vertices: ' + str(missing))
    return {'valid': True, 'vertices': n, 'size': len(chosen), 'scope': 'ordinary domination upper bound only'}

if __name__ == '__main__':
    try:
        with open(sys.argv[1]) as f:
            receipt = json.load(f)
        if 'attempts' in receipt:
            receipt = next(r for r in reversed(receipt['attempts']) if 'result' in r and r['result']['run'].get('witness'))
        run = receipt['result']['run']
        print(json.dumps(verify(receipt['input'], run['witness'], run['variables'])))
    except (ValueError, KeyError, IndexError, TypeError, StopIteration) as error:
        sys.exit(str(error))
