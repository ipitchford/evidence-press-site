#!/usr/bin/env python3
"""Exact algebraic teaching benchmark after Thommen (2026), Sec. IV.

Original EP implementation; MIT. No simulation or external dependencies.
Monomials are (rational coefficient, integer power of dimensionless u).
Generator signatures are (birth rate, coefficient of y in death rate).
"""
from fractions import Fraction as F
import json
from pathlib import Path
import sys
import unittest


def validate(model):
    if set(model) != {'birth', 'death'}:
        raise ValueError('two channels required')
    for coefficient, exponent in model.values():
        if coefficient <= 0 or type(exponent) is not int or exponent < 0:
            raise ValueError('positive coefficients and nonnegative integer powers required')


def generator(model, u):
    validate(model)
    if u <= 0:
        raise ValueError('u must be positive')
    return tuple(F(c) * u**p for c, p in (model['birth'], model['death']))


def mean_monomial(model):
    validate(model)
    k, a = model['birth']
    gamma, b = model['death']
    return F(k)/gamma, a-b


def require_equal(left, right):
    if left != right:
        raise ValueError('claimed equality is false')


A = {'birth': (F(3), 1), 'death': (F(2), 0)}
B = {'birth': (F(3), 1), 'death': (F(2), 1)}


class Benchmark(unittest.TestCase):
    def test_reference_generator_all_states(self):
        # Equality of coefficients, not a finite sample of y values.
        require_equal(generator(A, F(1)), generator(B, F(1)))

    def test_repeated_reference_conditions_do_not_separate(self):
        for repetitions in (1, 2, 100):
            self.assertEqual([generator(A, F(1))]*repetitions,
                             [generator(B, F(1))]*repetitions)

    def test_mean_and_elasticity(self):
        # For m(u)=c*u**p, d log(m)/d log(u)=p exactly.
        self.assertEqual(mean_monomial(A), (F(3, 2), 1))
        self.assertEqual(mean_monomial(B), (F(3, 2), 0))

    def test_second_condition_separates_fixed_pair(self):
        for u in (F(1, 2), F(2), F(3)):
            self.assertNotEqual(generator(A, u), generator(B, u))
            ca, pa = mean_monomial(A)
            cb, pb = mean_monomial(B)
            self.assertNotEqual(ca*u**pa, cb*u**pb)

    def test_condition_specific_refit_can_hide_difference(self):
        # This deliberately changes the maintained model, not the fixed-pair result.
        for u in (F(1, 2), F(1), F(2), F(3)):
            refitted_B = {'birth': B['birth'], 'death': (F(2)/u, 1)}
            self.assertEqual(generator(A, u), generator(refitted_B, u))

    def test_reject_false_claims(self):
        with self.assertRaises(ValueError):
            require_equal(generator(A, F(2)), generator(B, F(2)))
        with self.assertRaises(ValueError):
            require_equal(mean_monomial(B)[1], 1)

    def test_domain_boundary(self):
        with self.assertRaises(ValueError):
            generator(B, F(0))
        with self.assertRaises(ValueError):
            generator({'birth': (F(3), 1), 'death': (F(0), 1)}, F(1))

    def test_machine_record_matches_exact_algebra(self):
        record = json.loads(Path(__file__).with_name('benchmark.json').read_text())
        self.assertEqual(record['elasticities'], {'A': 1, 'B': 0})
        self.assertEqual(record['referenceCondition'], 1)
        self.assertEqual(record['parameterPolicy'], 'fixed-across-conditions')
        self.assertEqual(record['sourceVersion'], '2609.17031v1')


if __name__ == '__main__':
    print('EP exact-algebra benchmark; Python', sys.version, flush=True)
    unittest.main(verbosity=2)
