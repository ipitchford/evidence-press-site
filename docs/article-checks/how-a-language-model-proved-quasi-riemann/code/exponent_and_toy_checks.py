"""Exponent bookkeeping and a toy illustration for the quasi-Riemann write-up.

Part A re-derives, in exact rational arithmetic, the exponents quoted from the
OpenAI papers (11/12 amplification, the affine powers C(s), the Siegel-zero ratio)
and the generic k-th-power amplification exponent 1 - 1/(2k).

Part B is a toy experiment over the ordinary integers with quadratic (Jacobi)
symbols. It is NOT the OpenAI argument (which works with sextic symbols over
Z[omega]); it only illustrates two structural facts the argument relies on:
  1. rows u that are perfect powers reproduce the target sum A_1, so an L^2
     bound for the whole family bounds A_1 (amplification);
  2. for coefficients with no cancellation, those power rows alone exceed the
     'optimal large sieve' size D*H, so any such family bound must use the
     arithmetic of the Mobius function, not just the size of the coefficients.
Run: python -I exponent_and_toy_checks.py <out_json>
"""
import json
import sys
from fractions import Fraction as F

import numpy as np

out = {}

# ---------------- Part A: exact exponent arithmetic ----------------
def amp_exponent(k, theta=F(0)):
    """Exponent e with A_1 << D^e from |A_1|^2 << D*H/Y + D^2/Y^2,
    H = D^(1+theta), Y = H^(1/k)."""
    a = 1 + (1 + theta) - (1 + theta) / k      # exponent of D*H/Y
    b = 2 - 2 * (1 + theta) / k                # exponent of D^2/Y^2
    return max(a, b) / 2

A = {}
A["paper2_prime_extract_terms_at_theta"] = {
    # paper2 eq. (prime-extract): D^{11/6+5θ/6} + D^{5/3-θ/3}
    "theta=1/10": [str(F(11, 6) + F(5, 6) * F(1, 10)), str(F(5, 3) - F(1, 3) * F(1, 10))],
}
A["amplification_exponent_k6_theta0"] = str(amp_exponent(6))
A["amplification_exponent_k6_theta_1/10"] = str(amp_exponent(6, F(1, 10)))
A["paper2_stated_exponent_formula_check"] = str(F(11, 12) + F(5, 12) * F(1, 10))
A["generic_1_minus_1_over_2k"] = {k: str(amp_exponent(k)) for k in (2, 3, 4, 6, 12)}
# C(s) margins from the 7/8 paper
A["C_I(11/12)=11/12-2/3"] = str(F(11, 12) - F(2, 3))
A["C_II(7/8)=7/8-11/16"] = str(F(7, 8) - F(11, 16))
# margins table in Section 11 of the 7/8 paper: smallest margin
margins = {"intermediate rows": F(1021, 25000), "unresidued principal w": F(1, 40),
           "remaining principal z": F(1, 1200), "small rows": F(43, 300)}
A["smallest_part_I_margin"] = min(margins, key=margins.get) + " = " + str(min(margins.values()))
A["smallest_margin_as_decimal"] = float(min(margins.values()))
# Siegel-zero paper: U = N^{4/3}, size bound log N = (3/4) log U
A["siegel_size_over_divisibility"] = str(F(3, 4))
A["siegel_generic_inert_log_density"] = str(F(1, 2))
A["siegel_no_contradiction_without_exceptional_zero"] = F(1, 2) < F(3, 4)
# Sixth-power rows vs optimal large sieve: H^{1/6} D^2 versus D H, H=D^{1+θ}
A["power_rows_exceed_DH_iff_theta_lt"] = str(F(1, 5))
# the sextic -> quadratic twist after reflection: chi^{-1} chi^{-2} = chi^{-3} = chi^3 (mod 6)
A["twist_exponent_mod6"] = (-1 - 2) % 6
out["A"] = A

# ---------------- Part B: toy quadratic experiment over Z ----------------
D, H = 4000, 8000
# odd squarefree n <= D and mobius
mu = np.ones(D + 1, dtype=int)
sqf = np.ones(D + 1, dtype=bool)
is_p = np.ones(D + 1, dtype=bool); is_p[:2] = False
primes = []
for p in range(2, D + 1):
    if is_p[p]:
        primes.append(p)
        is_p[p * p::p] = False
        mu[p::p] *= -1
        sqf[p * p::p * p] = False
mu[~sqf] = 0
ns = [n for n in range(1, D + 1, 2) if sqf[n]]
# sanity: density of odd squarefree integers is 4/pi^2
assert abs(len(ns) / D - 4 / np.pi ** 2) < 0.02, (len(ns), D)
# prime factor lists
spf = list(range(D + 1))
for p in primes:
    for m in range(p, D + 1, p):
        if spf[m] == m:
            spf[m] = p
def factor(n):
    fs = []
    while n > 1:
        p = spf[n]; fs.append(p); n //= p
    return fs
u = np.arange(1, H + 1)
leg = {}
for p in primes:
    if p == 2:
        continue
    t = np.zeros(p, dtype=np.int8)
    sq = {(x * x) % p for x in range(1, p)}
    for r in range(1, p):
        t[r] = 1 if r in sq else -1
    leg[p] = t[u % p]
# Jacobi symbol (u/n) for odd squarefree n is the product of Legendre symbols
rows = {}
def family(coeff):
    acc = np.zeros(H, dtype=float)
    for n in ns:
        c = coeff(n)
        if c == 0:
            continue
        sym = np.ones(H, dtype=np.int8)
        for p in factor(n):
            sym = sym * leg[p]
        acc += c * sym
    return acc
A_mu = family(lambda n: int(mu[n]))
A_one = family(lambda n: 1)
target_mu = int(sum(int(mu[n]) for n in ns))
target_one = len(ns)
is_square = np.array([int(round(np.sqrt(x))) ** 2 == x for x in u])
def summarise(Au, target):
    tot = float(np.sum(Au ** 2))
    sq = float(np.sum(Au[is_square] ** 2))
    return {
        "target_A1": target,
        "mean_square_total": tot,
        "mean_square_from_square_rows": sq,
        "share_from_square_rows": sq / tot,
        "total_over_DH": tot / (D * H),
        "number_of_square_rows": int(is_square.sum()),
        # amplification: |A_1|^2 <~ (square-row mass)/(#square rows), a crude proxy
        "mean_|A_v2|^2_over_square_rows": sq / int(is_square.sum()),
        "|A_1|^2": float(target) ** 2,
    }
out["B"] = {"D": D, "H": H, "number_of_odd_squarefree_n": len(ns),
            "mobius_coefficients": summarise(A_mu, target_mu),
            "constant_coefficients": summarise(A_one, target_one)}
json.dump(out, open(sys.argv[1], "w"), indent=2, default=str)
print(json.dumps(out, indent=2, default=str))
