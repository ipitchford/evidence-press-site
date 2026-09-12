"""Bounded editorial diagnostics, not a verifier of the universal theorem.

Requires SymPy 1.14.0. Uses explicit ideal reductions, not leading powers,
to test nilpotence. No external source code is imported or executed.
"""
import itertools
import json
from math import comb
import sympy as s


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def nilpotence_exponents(basis, variables, bound):
    return [next((k for k in range(1, bound + 1)
                  if basis.reduce(v**k)[1] == 0), None) for v in variables]


x = s.symbols('x')
control = s.groebner([x*x-x], x, domain=s.QQ)
require(control.is_zero_dimensional, 'negative control must be zero-dimensional')
require(nilpotence_exponents(control, [x], 20) == [None],
        'non-nilpotent control accepted')
positive = s.groebner([x*x], x, domain=s.QQ)
require(nilpotence_exponents(positive, [x], 2) == [2], 'positive control rejected')

z = s.symbols('z')
rows = []
for m, n in [(1, 1), (1, 2), (2, 2), (1, 3), (2, 3), (3, 3), (1, 4), (2, 4)]:
    aa, bb = s.symbols(f'a1:{m+1}'), s.symbols(f'b1:{n+1}')
    variables = aa + bb
    a = z + sum(v*z**(i+2) for i, v in enumerate(aa))
    b = z + sum(v*z**(i+2) for i, v in enumerate(bb))
    composed = s.Poly(s.expand(a.subs(z, b)), z)
    coefficients = [composed.nth(j+1) for j in range(1, m+n+1)]
    basis = s.groebner(coefficients, *variables, order='grevlex', domain=s.QQ)
    require(basis.is_zero_dimensional, f'positive dimension: {m,n}')
    leading = [p.LM(order=basis.order).exponents for p in basis.polys]
    bounds = [min(t[i] for t in leading if t[i] > 0 and
                  all(t[j] == 0 for j in range(len(variables)) if j != i))
              for i in range(len(variables))]
    dimension = sum(not any(all(u >= v for u, v in zip(t, lead)) for lead in leading)
                    for t in itertools.product(*(range(k) for k in bounds)))
    require(dimension == comb(m+n, m), f'wrong quotient dimension: {m,n}')
    exponents = nilpotence_exponents(basis, variables, dimension)
    require(all(k is not None for k in exponents), f'not nilpotent: {m,n}')
    rows.append({'m': m, 'n': n, 'dimension': dimension,
                 'nilpotenceExponents': exponents})

print(json.dumps({'status': 'PASS', 'scope': 'eight small exact coefficient ideals only',
                  'sympy': s.__version__, 'negativeControlRejected': True,
                  'positiveControlAccepted': True, 'cases': rows}, indent=2))
