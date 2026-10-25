import json
import os
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cited_reference_check as crc  # noqa: E402


def crossref(title, families, year, typ='journal-article'):
    return json.dumps({'message': {'title': [title], 'author': [{'family': f} for f in families],
                                   'issued': {'date-parts': [[year]]}, 'type': typ}}).encode()


class FakeNet:
    """doi.org/Crossref/DataCite stand-in: records maps DOI -> Crossref body (None = no metadata)."""

    def __init__(self, records, down=False, pdf=None):
        self.records, self.down, self.pdf, self.calls = records, down, pdf, []

    def fetch(self, url, accept='application/json'):
        self.calls.append(url)
        if self.down:
            return -1, b''
        if url.endswith('.pdf'):
            return (200, self.pdf) if self.pdf else (404, b'')
        for prefix in ('https://doi.org/api/handles/', 'https://api.crossref.org/works/',
                       'https://api.datacite.org/dois/', 'https://doi.org/'):
            if url.startswith(prefix):
                doi = crc.normalize_doi(crc.urllib.parse.unquote(url[len(prefix):]))
                break
        if url.endswith('/10.1000/1'):
            return 200, b'{"responseCode": 1}'
        if doi not in self.records:
            return 404, b''
        if prefix.endswith('handles/'):
            return 200, b'{"responseCode": 1}'
        if prefix.startswith('https://api.crossref') and self.records[doi] is not None:
            return 200, self.records[doi]
        return 404, b''


DAVIS = '10.1007/s11228-017-0421-z'
IPCC = '10.1017/cbo9781107415324'
MENSHIKOV = '10.1016/j.spa.2014.03.001'
RECORDS = {
    DAVIS: crossref('A three-operator splitting scheme and its optimization applications', ['Davis', 'Yin'], 2017),
    IPCC: crossref('Climate Change 2013 – The Physical Science Basis', ['Intergovernmental Panel on Climate Change'], 2014),
    MENSHIKOV: crossref('Explosion, implosion, and moments of passage times for continuous-time Markov chains',
                        ['Menshikov', 'Petritis'], 2014),
    '10.48550/arxiv.2501.09272': crossref('Proof of the Casas-Alvero conjecture', ['Ghosh'], 2025, 'posted-content'),
}
BIB = """References
[1] D. Davis and W. Yin. A three-operator splitting scheme and its optimization applications.
    Set-Valued Var. Anal. 25 (2017). doi:10.1007/s11228-
    017-0421-z
[2] M. Menshikov and D. Petritis. Explosion, implosion, and moments of passage times for
    continuous-time Markov chains. Stoch. Proc. Appl. 124 (2014).
[3] S. Ghosh. Proof of the Casas-Alvero conjecture. arXiv:2501.09272 (2026).
"""


def meta(works, **extra):
    return {'slug': 'fixture', 'doi': '10.5281/zenodo.111', 'conceptDoi': '10.5281/zenodo.110',
            'relatedWorks': works, **extra}


class Scratch(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.bib = os.path.join(self.dir.name, 'refs.txt')
        with open(self.bib, 'w') as f:
            f.write(BIB)

    def tearDown(self):
        self.dir.cleanup()

    def run_check(self, works, net=None, manuscripts=None, body='', **kw):
        return crc.check_release(meta(works), body, kw.pop('citations', None),
                                 [self.bib] if manuscripts is None else manuscripts,
                                 net or FakeNet(RECORDS), kw.pop('mode', 'online'), kw.pop('ledger', None),
                                 log=lambda *_: None, **kw)


class DoiExtraction(unittest.TestCase):
    def test_balanced_parentheses_and_sici(self):
        text = ('See (doi:10.1016/0024-3795(92)90407-2), and '
                'https://doi.org/10.1002/(SICI)1097-0258(19980430)17:8<857::AID-SIM777>3.0.CO;2-E. Also 10.1000/xyz.')
        self.assertEqual(crc.extract_dois(text), [
            '10.1016/0024-3795(92)90407-2',
            '10.1002/(SICI)1097-0258(19980430)17:8<857::AID-SIM777>3.0.CO;2-E',
            '10.1000/xyz'])

    def test_url_encoded_and_related_work_derivation(self):
        self.assertEqual(crc.doi_of_related_work({'url': 'https://doi.org/10.1002%2F%28SICI%291097'}), '10.1002/(sici)1097')
        self.assertEqual(crc.doi_of_related_work({'url': 'https://arxiv.org/abs/2501.09272v2'}), '10.48550/arxiv.2501.09272')
        self.assertIsNone(crc.doi_of_related_work({'url': 'https://example.org/paper'}))


class Gate(Scratch):
    def test_correct_reference_passes(self):
        rep = self.run_check([{'citation': 'Davis and Yin (2017), A three-operator splitting scheme and its '
                                           'optimization applications.', 'url': 'https://doi.org/' + DAVIS}])
        self.assertEqual(rep['status'], 'passed', rep['problems'])

    def test_non_resolving_doi_fails(self):
        rep = self.run_check([{'citation': 'Davis and Yin (2017), A three-operator splitting scheme and its '
                                           'optimization applications.', 'url': 'https://doi.org/10.1007/s10957-016-0917-z'}])
        self.assertEqual(rep['items'][0]['status'], 'NOT-RESOLVING')
        self.assertEqual(rep['status'], 'failed')

    def test_doi_resolving_to_unrelated_work_fails(self):
        rep = self.run_check([{'citation': 'Menshikov and Petritis (2014), explosion, implosion and moments for '
                                           'continuous-time Markov chains.', 'url': 'https://doi.org/10.1017/CBO9781107415324'}])
        self.assertEqual(rep['items'][0]['status'], 'MISMATCH')
        self.assertTrue(any('first author' in r for r in rep['items'][0]['reasons']))

    def test_wrong_first_author_and_year_fail(self):
        rep = self.run_check([{'citation': 'Smith (2009), A three-operator splitting scheme and its optimization '
                                           'applications.', 'url': 'https://doi.org/' + DAVIS}])
        reasons = ' '.join(rep['items'][0]['reasons'])
        self.assertIn('first author', reasons)
        self.assertIn('cited year', reasons)

    def test_preprint_later_version_year_is_accepted(self):
        rep = self.run_check([{'citation': 'Ghosh (v2, 2027), Proof of the Casas-Alvero conjecture.',
                               'url': 'https://arxiv.org/abs/2501.09272'}])
        self.assertEqual(rep['status'], 'passed', rep['problems'])

    def test_own_zenodo_doi_is_skipped(self):
        net = FakeNet(RECORDS)
        rep = self.run_check([{'citation': 'This release.', 'url': 'https://doi.org/10.5281/zenodo.110'}], net)
        self.assertEqual(rep['items'], [])
        self.assertFalse(any('zenodo.110' in c for c in net.calls))

    def test_doi_absent_from_bibliography_fails(self):
        with open(self.bib, 'w') as f:
            f.write('References\n[1] Someone. Unrelated. 2020.\n[2] Other. Unrelated too. 2021.\n')
        rep = self.run_check([{'citation': 'Davis and Yin (2017), A three-operator splitting scheme and its '
                                           'optimization applications.', 'url': 'https://doi.org/' + DAVIS}])
        self.assertEqual(rep['items'][0]['status'], 'NOT-IN-BIBLIOGRAPHY')

    def test_bibliography_title_match_with_different_doi_is_reported(self):
        records = dict(RECORDS, **{'10.1016/j.spa.2014.03.999': RECORDS[MENSHIKOV]})
        with open(self.bib, 'w') as f:
            f.write(BIB.replace('Stoch. Proc. Appl. 124 (2014).', 'Stoch. Proc. Appl. 124 (2014). doi:10.1016/j.spa.2014.03.001'))
        rep = self.run_check([{'citation': 'Menshikov and Petritis (2014), Explosion, implosion, and moments of '
                                           'passage times for continuous-time Markov chains.',
                               'url': 'https://doi.org/10.1016/j.spa.2014.03.999'}], FakeNet(records))
        self.assertIn('lists 10.1016/j.spa.2014.03.001', rep['problems'][0])

    def test_title_membership_without_doi_in_bibliography(self):
        rep = self.run_check([{'citation': 'Menshikov and Petritis (2014), Explosion, implosion, and moments of '
                                           'passage times for continuous-time Markov chains.',
                               'url': 'https://doi.org/' + MENSHIKOV}])
        self.assertEqual(rep['status'], 'passed', rep['problems'])
        self.assertEqual(rep['items'][0]['status'], 'OK')

    def test_page_only_needs_reason(self):
        work = {'citation': 'Davis and Yin (2017), A three-operator splitting scheme and its optimization applications.',
                'url': 'https://doi.org/' + DAVIS, 'pageOnly': True}
        self.assertEqual(self.run_check([work], manuscripts=[])['status'], 'failed')
        work['pageOnlyReason'] = 'Reader context for the splitting method; not cited by the manuscript.'
        self.assertEqual(self.run_check([work], manuscripts=[])['status'], 'passed')

    def test_missing_bibliography_fails_closed(self):
        rep = self.run_check([{'citation': 'Davis and Yin (2017), A three-operator splitting scheme and its '
                                           'optimization applications.', 'url': 'https://doi.org/' + DAVIS}], manuscripts=[])
        self.assertIn('bibliography unavailable', rep['problems'][0])

    def test_body_dois_resolve_and_must_be_in_bibliography(self):
        rep = self.run_check([], body='As shown in doi:10.1007/s11228-017-0421-z and 10.9999/not-real.')
        statuses = {i['doi']: i['status'] for i in rep['items']}
        self.assertEqual(statuses, {DAVIS: 'OK', '10.9999/not-real': 'NOT-RESOLVING'})

    def test_citations_json_must_match_verified_related_works(self):
        cits = [{'id': 'c1', 'citingReleaseSlug': 'fixture', 'citedDoi': '10.1112/plms.12429'}]
        rep = self.run_check([], citations=cits)
        self.assertIn('not a verified relatedWorks DOI', rep['problems'][0])

    def test_unreachable_network_is_unverified_not_passed(self):
        rep = self.run_check([{'citation': 'x', 'url': 'https://doi.org/' + DAVIS}], FakeNet(RECORDS, down=True),
                             mode='auto')
        self.assertFalse(rep['online'])
        self.assertEqual(rep['items'][0]['status'], 'UNVERIFIED')

    def test_offline_ledger_fallback(self):
        work = {'citation': 'Davis and Yin (2017), A three-operator splitting scheme and its optimization applications.',
                'url': 'https://doi.org/' + DAVIS}
        ledger = crc.load_ledger(None)
        online = crc.check_release(meta([work], pdfUrl='https://example.invalid/p.pdf'), '', None, [self.bib],
                                   FakeNet(RECORDS), 'online', ledger, log=lambda *_: None)
        self.assertEqual(online['status'], 'passed')
        self.assertIn(DAVIS, ledger['dois'])
        path = os.path.join(self.dir.name, 'ledger.json')
        crc.save_ledger(path, ledger)
        offline = crc.check_release(meta([work], pdfUrl='https://example.invalid/p.pdf'), '', None, [],
                                    FakeNet({}, down=True), 'offline', crc.load_ledger(path), log=lambda *_: None)
        self.assertEqual(offline['status'], 'passed', offline['problems'])
        stale = crc.check_release(meta([work], pdfUrl='https://example.invalid/new.pdf'), '', None, [],
                                  FakeNet({}, down=True), 'offline', crc.load_ledger(path), log=lambda *_: None)
        self.assertEqual(stale['status'], 'failed')


class Emit(unittest.TestCase):
    def test_emit_takes_dois_verbatim_from_bib(self):
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 'refs.bib')
            with open(p, 'w') as f:
                f.write('@article{dy,\n  title = {A three-operator splitting scheme},\n  doi = {10.1007/s11228-017-0421-z},\n}\n'
                        '@book{nodoi,\n  title = {No DOI here},\n}\n')
            out = crc.emit_related_works([p])
        self.assertEqual(out, [{'citation': 'A three-operator splitting scheme',
                                'url': 'https://doi.org/10.1007/s11228-017-0421-z', 'bibliographySource': 'refs.bib'}])


class ChangedReleases(unittest.TestCase):
    def test_changed_slugs_from_git(self):
        with tempfile.TemporaryDirectory() as d:
            def git(*a):
                subprocess.run(['git', *a], cwd=d, check=True, capture_output=True)
            git('init', '-q', '-b', 'main')
            git('config', 'user.email', 'f@example.invalid')
            git('config', 'user.name', 'Fixture')
            for s in ('a', 'b'):
                os.makedirs(os.path.join(d, 'papers', s))
                with open(os.path.join(d, 'papers', s, 'meta.json'), 'w') as f:
                    f.write('{}')
            git('add', '.')
            git('commit', '-qm', 'base')
            git('checkout', '-qb', 'pr')
            with open(os.path.join(d, 'papers', 'b', 'body.md'), 'w') as f:
                f.write('x')
            git('add', '.')
            git('commit', '-qm', 'change b')
            self.assertEqual(crc.changed_slugs(d, 'main'), ['b'])


if __name__ == '__main__':
    unittest.main()
