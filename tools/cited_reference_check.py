#!/usr/bin/env python3
"""Cited-reference gate for Evidence Press release pages.

Every external DOI on a release page must (a) resolve at doi.org, (b) carry
Crossref/DataCite metadata whose title, first-author surname and (where cited)
year match the page's citation text, and (c) appear in the manuscript's own
bibliography, unless the related work is explicitly marked page-only context:

    {"citation": "...", "url": "https://doi.org/...",
     "pageOnly": true, "pageOnlyReason": "why the page, not the paper, cites it"}

The release's own DOI and concept DOI are skipped. Standard library only, so the
same file is vendored into the site repository as tools/cited_reference_check.py.

Usage:
  cited_reference_check.py check --meta papers/S/meta.json [--body papers/S/body.md]
      [--citations dist/api/citations.json] [--manuscript refs.bib|paper.tex|paper.pdf ...]
      [--network auto|online|offline] [--ledger LEDGER.json] [--write-ledger] [--json OUT]
  cited_reference_check.py check --site-root SITE --slug S [...]
  cited_reference_check.py changed --site-root SITE --base origin/main [...]
  cited_reference_check.py emit-related-works --manuscript refs.bib

Exit status: 0 all references verified, 1 any reference failed, 2 usage error.
Failures are never downgraded: unreachable registries in online mode, or DOIs
missing from the ledger in offline mode, are UNVERIFIED and fail the gate.
"""
import argparse
import datetime
import difflib
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

UA = 'EvidencePressCitedReferenceCheck/1.0 (+https://evidencepress.org)'
LEDGER_SCHEMA = '1.0'
STOP = set('a an the of and in on for to with by from at as is are its via into or over under between using'.split())
TITLE_MIN = 0.75
BIB_TITLE_MIN = 0.8
DOI_START = re.compile(r'10\.\d{4,9}/')


# ---------- text normalisation ----------

def norm(s):
    s = unicodedata.normalize('NFKD', s or '')
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r'<[^>]+>', ' ', s)              # JATS/MathML markup in registry titles
    s = re.sub(r'\\[a-zA-Z]+', ' ', s)          # LaTeX commands
    s = s.lower().replace('ß', 'ss').replace('ø', 'o').replace('ł', 'l').replace('æ', 'ae')
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()


def tokens(s):
    return [t for t in norm(s).split() if t not in STOP and len(t) > 1]


def containment(needle, haystack):
    """Fraction of needle's content words present in haystack."""
    need = tokens(needle)
    if not need:
        return 0.0
    have = set(tokens(haystack))
    return sum(t in have for t in need) / len(need)


def years_in(text):
    return {int(y) for y in re.findall(r'(?<!\d)(1[6-9]\d\d|20\d\d)(?!\d)', text or '')}


# ---------- DOI handling ----------

def normalize_doi(doi):
    doi = (doi or '').strip()
    doi = re.sub(r'^(?:https?://(?:dx\.)?doi\.org/|doi:\s*)', '', doi, flags=re.I)
    if '%' in doi:
        doi = urllib.parse.unquote(doi)
    return doi.strip().lower()


def _scan_doi(text, start):
    """Consume one DOI starting at text[start]; balanced (), [] and SICI <...> are kept."""
    depth = {'(': 0, '[': 0, '<': 0}
    close = {')': '(', ']': '[', '>': '<'}
    i = start
    while i < len(text):
        c = text[i]
        if c.isspace() or c in '"\'{}|\\^`':
            break
        if c in depth:
            depth[c] += 1
        elif c in close:
            if depth[close[c]] == 0:
                break
            depth[close[c]] -= 1
        i += 1
    doi = text[start:i]
    while doi and doi[-1] in '.,;:':
        doi = doi[:-1]
    # an unclosed bracket means we ran into surrounding prose; trim back to it
    for opener, closer in (('(', ')'), ('[', ']'), ('<', '>')):
        while doi.count(opener) > doi.count(closer):
            doi = doi[:doi.rfind(opener)]
    return doi.rstrip('.,;:'), i


def extract_dois(text):
    """All DOIs in free text, in order, deduplicated case-insensitively."""
    text = urllib.parse.unquote(text or '') if '%2F' in (text or '') or '%2f' in (text or '') else (text or '')
    out, seen, pos = [], set(), 0
    while True:
        m = DOI_START.search(text, pos)
        if not m:
            return out
        doi, pos = _scan_doi(text, m.start())
        key = doi.lower()
        if '/' in doi and len(doi.split('/', 1)[1]) > 0 and key not in seen:
            seen.add(key)
            out.append(doi)


def doi_of_related_work(work):
    """Same derivation as build.js doiOfRelatedWork, plus balanced-bracket DOIs and an explicit doi field."""
    if work.get('doi'):
        return normalize_doi(work['doi'])
    raw = str(work.get('url') or '').strip()
    m = re.match(r'^https?://(?:dx\.)?doi\.org/(.+)$', raw, re.I)
    if m:
        found = extract_dois(urllib.parse.unquote(m.group(1)))
        return found[0].lower() if found else None
    m = re.match(r'^https://arxiv\.org/abs/(\d{4}\.\d{4,5})(?:v\d+)?/?$', raw, re.I)
    return f'10.48550/arxiv.{m.group(1)}' if m else None


def arxiv_id(doi):
    m = re.match(r'^10\.48550/arxiv\.(.+)$', doi, re.I)
    return m.group(1) if m else None


# ---------- registry metadata ----------

class Network:
    """HTTP access with retries. Tests substitute fetch()."""

    def __init__(self, timeout=30, retries=3):
        self.timeout, self.retries = timeout, retries

    def fetch(self, url, accept='application/json'):
        """Returns (status, body); status -1 means the network could not answer."""
        for attempt in range(self.retries):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': accept})
                with urllib.request.urlopen(req, timeout=self.timeout) as r:
                    return r.status, r.read()
            except urllib.error.HTTPError as e:
                if e.code in (429, 500, 502, 503, 504) and attempt + 1 < self.retries:
                    time.sleep(2 * (attempt + 1))
                    continue
                return e.code, b''
            except Exception:
                if attempt + 1 < self.retries:
                    time.sleep(2 * (attempt + 1))
        return -1, b''


def _years_from_parts(obj, keys):
    out = set()
    for k in keys:
        try:
            out.add(int(obj[k]['date-parts'][0][0]))
        except Exception:
            pass
    return out


def _from_crossref(c):
    authors = [a.get('family') or a.get('name') or '' for a in (c.get('author') or c.get('editor') or [])]
    return {'source': 'crossref', 'title': ' '.join(c.get('title') or []),
            'subtitle': ' '.join(c.get('subtitle') or []),
            'container': ' '.join(c.get('container-title') or []),
            'authors': [a for a in authors if a],
            'years': sorted(_years_from_parts(c, ('issued', 'published-print', 'published-online', 'created'))),
            'type': c.get('type')}


def _from_datacite(a):
    titles = [t.get('title', '') for t in a.get('titles') or []]
    authors = [x.get('familyName') or (x.get('name') or '').split(',')[0] for x in a.get('creators') or []]
    return {'source': 'datacite', 'title': titles[0] if titles else '', 'subtitle': ' '.join(titles[1:2]),
            'container': a.get('publisher') if isinstance(a.get('publisher'), str) else '',
            'authors': [x for x in authors if x],
            'years': [int(a['publicationYear'])] if a.get('publicationYear') else [],
            'type': (a.get('types') or {}).get('resourceTypeGeneral')}


def _from_csl(c):
    authors = [a.get('family') or a.get('literal') or '' for a in (c.get('author') or c.get('editor') or [])]
    title = c.get('title')
    return {'source': 'csl', 'title': ' '.join(title) if isinstance(title, list) else (title or ''),
            'subtitle': '', 'container': c.get('container-title') if isinstance(c.get('container-title'), str) else '',
            'authors': [a for a in authors if a],
            'years': sorted(_years_from_parts(c, ('issued', 'published-print', 'published-online', 'created'))),
            'type': c.get('type')}


def resolve(doi, net):
    """Registry record for one DOI: {'resolved': bool|None, ...metadata}. None means unverifiable."""
    q = urllib.parse.quote(doi, safe='/()<>;:')
    status, body = net.fetch('https://doi.org/api/handles/' + q)
    if status == -1:
        return {'resolved': None, 'error': 'doi.org handle API unreachable'}
    if status == 404:
        return {'resolved': False, 'error': 'DOI does not resolve at doi.org (handle 404)'}
    if status != 200:
        return {'resolved': None, 'error': f'doi.org handle API returned HTTP {status}'}
    try:
        code = json.loads(body).get('responseCode')
    except Exception:
        code = None
    if code != 1:
        return {'resolved': False, 'error': f'DOI does not resolve at doi.org (responseCode {code})'}
    unreachable = False
    s, b = net.fetch('https://api.crossref.org/works/' + q)
    if s == 200:
        return {'resolved': True, **_from_crossref(json.loads(b)['message'])}
    unreachable |= s == -1
    s, b = net.fetch('https://api.datacite.org/dois/' + q)
    if s == 200:
        return {'resolved': True, **_from_datacite(json.loads(b)['data']['attributes'])}
    unreachable |= s == -1
    s, b = net.fetch('https://doi.org/' + q, accept='application/vnd.citationstyles.csl+json')
    if s == 200:
        try:
            return {'resolved': True, **_from_csl(json.loads(b))}
        except Exception:
            pass
    unreachable |= s == -1
    if unreachable:
        return {'resolved': None, 'error': 'registry metadata unreachable'}
    return {'resolved': True, 'source': None, 'error': 'DOI resolves but has no Crossref/DataCite/CSL metadata'}


# ---------- citation matching ----------

def surname_in(surname, text):
    n = norm(surname)
    if not n:
        return True
    hay = ' ' + norm(text) + ' '
    return (' ' + n + ' ') in hay or (' ' + n.split()[-1] + ' ') in hay


def match_citation(meta, citation, work=None, doi=''):
    """Compare registry metadata with the page's citation. Returns (ok, reasons, scores)."""
    work = work or {}
    reasons = []
    title = meta.get('title') or ''
    full = (title + ' ' + (meta.get('subtitle') or '')).strip()
    if work.get('title'):
        cited = work['title']
        score = min(containment(title, cited), containment(cited, full))
        if score < 0.9:
            reasons.append(f'cited title "{cited}" differs from registry title "{title}"')
    else:
        score = max(containment(title, citation), containment(full, citation)) if title else 0.0
        if not title:
            reasons.append('registry record has no title to compare')
        elif score < TITLE_MIN:
            reasons.append(f'registry title "{title}" is not in the page citation '
                           f'({score:.0%} of title words; need {TITLE_MIN:.0%})')
    authors = meta.get('authors') or []
    first = authors[0] if authors else None
    author_text = ' '.join(work.get('authors') or []) or citation
    # Evidence Press deposits are credited to Anonymous under the standing protocol; the page
    # names that credit, never a tool or model that a deposit's creator field may carry.
    institutional = doi.startswith('10.5281/zenodo.') and re.search(r'\b(anonymous|evidence press)\b', norm(author_text))
    if first and not institutional and not surname_in(first, author_text):
        reasons.append(f'registry first author "{first}" is not named in the page citation')
    cited_years = {int(work['year'])} if work.get('year') else years_in(citation)
    reg_years = set(meta.get('years') or [])
    if cited_years and reg_years:
        preprint = meta.get('type') in ('posted-content', 'Preprint') or 'arxiv' in (meta.get('container') or '').lower()
        ok = any(abs(c - r) <= 1 for c in cited_years for r in reg_years) or \
            (preprint and any(c >= min(reg_years) for c in cited_years))
        if not ok:
            reasons.append(f'cited year {sorted(cited_years)} does not match registry year {sorted(reg_years)}')
    return not reasons, reasons, {'title': round(score, 2)}


# ---------- manuscript bibliography ----------

def read_manuscript(path):
    if path.lower().endswith('.pdf'):
        exe = shutil.which('pdftotext')
        if not exe:
            raise RuntimeError('pdftotext is required to read a PDF manuscript bibliography')
        r = subprocess.run([exe, '-layout', path, '-'], capture_output=True, text=True, timeout=120)
        if r.returncode != 0:
            raise RuntimeError(f'pdftotext failed on {path}')
        return r.stdout
    with open(path, encoding='utf-8', errors='replace') as f:
        return f.read()


def bibliography_entries(text, kind):
    """Split a manuscript bibliography into entries. kind: bib, tex, or text."""
    if kind == 'bib':
        return [e for e in re.split(r'(?m)^\s*@', text) if e.strip()]
    if kind == 'tex':
        m = re.search(r'\\begin\{thebibliography\}(.*?)\\end\{thebibliography\}', text, re.S)
        body = m.group(1) if m else text
        parts = re.split(r'\\bibitem', body)
        return [p for p in parts[1:]] or [body]
    m = None
    for m in re.finditer(r'(?im)^\s*(?:#+\s*)?(references|bibliography|works cited|literature cited)\s*$', text):
        pass
    body = text[m.end():] if m else text
    parts = re.split(r'(?m)^\s*(?:\[\d+\]|\d+\.\s|\[[A-Z][A-Za-z+]*\d*\])', body)
    if len(parts) < 3:
        parts = re.split(r'\n\s*\n', body)
    return [p for p in parts if p.strip()]


class Bibliography:
    def __init__(self, sources):
        self.entries, self.sources = [], []
        for path, text in sources:
            kind = 'bib' if path.endswith('.bib') else 'tex' if path.endswith(('.tex', '.bbl')) else 'text'
            self.entries.extend(bibliography_entries(text, kind))
            self.sources.append(path)
        joined = '\n'.join(self.entries)
        self._compact = re.sub(r'\s+', '', joined).lower()    # PDF text breaks DOIs across lines
        self.dois = {d.lower() for d in extract_dois(joined)} | {d.lower() for d in extract_dois(self._compact)}

    def membership(self, doi, meta):
        """('doi'|'arxiv'|'title', None) when present; (None, other_doi) when the entry lists another DOI."""
        if doi in self.dois or re.sub(r'\s+', '', doi) in self._compact:
            return 'doi', None
        ax = arxiv_id(doi)
        if ax and re.search(r'(?<![\d.])' + re.escape(ax.lower()) + r'(?!\d)', self._compact):
            return 'arxiv', None
        title = (meta or {}).get('title')
        if not title:
            return None, None
        first = ((meta or {}).get('authors') or [None])[0]
        for entry in self.entries:
            if containment(title, entry) >= BIB_TITLE_MIN and (not first or surname_in(first, entry)):
                listed = [d.lower() for d in extract_dois(re.sub(r'\s+', '', entry))]
                others = [d for d in listed if d != doi]
                if others and doi not in listed:
                    return None, others[0]
                return 'title', None
        return None, None


def emit_related_works(paths):
    """relatedWorks skeleton with DOIs taken verbatim from the manuscript bibliography."""
    out = []
    for path in paths:
        text = read_manuscript(path)
        kind = 'bib' if path.endswith('.bib') else 'tex' if path.endswith(('.tex', '.bbl')) else 'text'
        for entry in bibliography_entries(text, kind):
            dois = extract_dois(entry)
            if kind == 'bib':
                m = re.search(r'(?im)^\s*doi\s*=\s*[{"]\s*([^}"]+)', entry)
                dois = [m.group(1).strip()] if m else []
            if not dois:
                continue
            doi = normalize_doi(dois[0])
            title = ''
            if kind == 'bib':
                m = re.search(r'(?im)^\s*title\s*=\s*[{"](.+?)[}"]\s*,?\s*$', entry)
                title = re.sub(r'[{}]', '', m.group(1)) if m else ''
            out.append({'citation': title or ' '.join(entry.split())[:300],
                        'url': 'https://doi.org/' + dois[0].strip(),
                        'bibliographySource': os.path.basename(path)})
    return out


# ---------- ledger (offline fallback and cache) ----------

def load_ledger(path):
    if path and os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
        if data.get('schemaVersion') != LEDGER_SCHEMA:
            raise RuntimeError(f'unsupported ledger schema in {path}')
        return data
    return {'schemaVersion': LEDGER_SCHEMA, 'dois': {}, 'bibliography': {}}


def save_ledger(path, ledger):
    ledger['dois'] = dict(sorted(ledger['dois'].items()))
    ledger['bibliography'] = dict(sorted(ledger['bibliography'].items()))
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(ledger, f, indent=1, ensure_ascii=False)
        f.write('\n')
    os.replace(tmp, path)


def online(net, mode):
    if mode == 'online':
        return True
    if mode == 'offline':
        return False
    status, _ = net.fetch('https://doi.org/api/handles/10.1000/1')
    return status != -1


# ---------- the check ----------

def check_release(meta, body='', citations=None, manuscripts=(), net=None, mode='auto',
                  ledger=None, fetch_pdf=True, log=print):
    """Return a report {'slug', 'status', 'items', 'problems'}; status 'passed' only when every item is OK."""
    net = net or Network()
    ledger = ledger if ledger is not None else load_ledger(None)
    slug = meta.get('slug') or '?'
    own = {normalize_doi(meta.get('doi')), normalize_doi(meta.get('conceptDoi'))} - {''}
    problems, items = [], []
    live = online(net, mode)
    if not live:
        log(f'{slug}: registries unreachable or offline mode; using ledger ({len(ledger["dois"])} DOIs)')

    def metadata(doi):
        if live:
            rec = resolve(doi, net)
            if rec.get('resolved') is not None:
                ledger['dois'][doi] = {**rec, 'checkedAt': datetime.date.today().isoformat()}
            return rec
        rec = ledger['dois'].get(doi)
        return rec if rec else {'resolved': None, 'error': 'offline and DOI absent from ledger'}

    works = []
    for i, w in enumerate(meta.get('relatedWorks') or []):
        doi = doi_of_related_work(w)
        if not doi:
            url = str(w.get('url') or '')
            if 'doi.org/' in url.lower():
                problems.append(f'relatedWorks[{i}]: unparseable DOI URL {url}')
            continue
        if doi in own:
            continue
        works.append((i, w, doi))
    page_only = {doi for _, w, doi in works if w.get('pageOnly') is True}
    related = {doi for _, _, doi in works}
    body_dois = [normalize_doi(d) for d in extract_dois(body)]
    body_dois = [d for d in dict.fromkeys(body_dois) if d not in own and d not in related]

    # Bibliography: explicit manuscripts, else the release's manuscript PDF.
    bib, bib_error = None, None
    needs_bib = any(doi not in page_only for _, _, doi in works) or body_dois
    sources = []
    try:
        for path in manuscripts:
            sources.append((path, read_manuscript(path)))
        if not sources and needs_bib and meta.get('pdfUrl') and fetch_pdf and live:
            status, data = net.fetch(meta['pdfUrl'], accept='application/pdf')
            if status != 200:
                raise RuntimeError(f'cannot download manuscript PDF {meta["pdfUrl"]} (HTTP {status})')
            with tempfile.TemporaryDirectory() as d:
                p = os.path.join(d, 'manuscript.pdf')
                with open(p, 'wb') as f:
                    f.write(data)
                sources.append((meta['pdfUrl'], read_manuscript(p)))
            ledger['bibliography'].setdefault(slug, {})['pdfSha256'] = hashlib.sha256(data).hexdigest()
    except Exception as e:
        bib_error = str(e)
    if sources:
        bib = Bibliography(sources)
    prior = ledger['bibliography'].get(slug, {})

    def in_bibliography(doi, rec):
        if bib is not None:
            how, other = bib.membership(doi, rec if rec.get('resolved') else None)
            if other:
                return f'manuscript bibliography lists {other} for this work, not {doi}'
            if not how:
                return f'not in the manuscript bibliography; take DOIs only from the bibliography, ' \
                       f'or mark the entry "pageOnly": true with a "pageOnlyReason"'
            ledger['bibliography'].setdefault(slug, {}).setdefault('members', {})[doi] = how
            return None
        if not live and doi in prior.get('members', {}) and prior.get('pdfUrl') == meta.get('pdfUrl'):
            return None
        return f'manuscript bibliography unavailable ({bib_error or "no --manuscript and no pdfUrl"})'

    for i, w, doi in works:
        rec = metadata(doi)
        item = {'kind': 'relatedWork', 'index': i, 'doi': doi, 'citation': w.get('citation'), 'reasons': []}
        if rec.get('resolved') is None:
            item['status'] = 'UNVERIFIED'
            item['reasons'].append(rec.get('error'))
        elif rec.get('resolved') is False:
            item['status'] = 'NOT-RESOLVING'
            item['reasons'].append(rec.get('error'))
        elif not rec.get('source'):
            item['status'] = 'NO-METADATA'
            item['reasons'].append(rec.get('error'))
        else:
            ok, reasons, scores = match_citation(rec, w.get('citation') or '', w, doi)
            item.update(scores=scores, registryTitle=rec.get('title'), registryAuthors=(rec.get('authors') or [])[:3])
            item['status'] = 'OK' if ok else 'MISMATCH'
            item['reasons'] += reasons
        if w.get('pageOnly') is True:
            if not str(w.get('pageOnlyReason') or '').strip():
                item['status'] = 'FAILED' if item['status'] == 'OK' else item['status']
                item['reasons'].append('pageOnly entries need a non-empty pageOnlyReason')
            item['bibliography'] = 'page-only'
        elif item['status'] in ('OK', 'MISMATCH'):
            err = in_bibliography(doi, rec)
            if err:
                item['status'] = 'NOT-IN-BIBLIOGRAPHY' if item['status'] == 'OK' else item['status']
                item['reasons'].append(err)
        items.append(item)

    for doi in body_dois:
        rec = metadata(doi)
        item = {'kind': 'body', 'doi': doi, 'reasons': []}
        if rec.get('resolved') is None:
            item['status'] = 'UNVERIFIED'
            item['reasons'].append(rec.get('error'))
        elif rec.get('resolved') is False:
            item['status'] = 'NOT-RESOLVING'
            item['reasons'].append(rec.get('error'))
        else:
            err = in_bibliography(doi, rec)
            item['status'] = 'NOT-IN-BIBLIOGRAPHY' if err else 'OK'
            if err:
                item['reasons'].append(err)
        items.append(item)

    if bib is not None and meta.get('pdfUrl'):
        ledger['bibliography'].setdefault(slug, {})['pdfUrl'] = meta['pdfUrl']

    verified = {it['doi'] for it in items if it['kind'] == 'relatedWork' and it['status'] == 'OK'}
    for c in (citations or []):
        if c.get('citingReleaseSlug') != slug:
            continue
        cd = normalize_doi(c.get('citedDoi'))
        if cd and cd not in own and cd not in verified:
            problems.append(f'citations.json {c.get("id")}: cited DOI {cd} is not a verified relatedWorks DOI')

    for it in items:
        if it['status'] != 'OK':
            problems.append((f'relatedWorks[{it["index"]}] ' if it['kind'] == 'relatedWork' else 'body.md ') + f'{it["doi"]}: {it["status"]}: ' + '; '.join(r for r in it['reasons'] if r))
    return {'slug': slug, 'status': 'failed' if problems else 'passed', 'online': live,
            'bibliographySources': bib.sources if bib else [], 'items': items, 'problems': problems}


# ---------- command line ----------

def changed_slugs(site_root, base):
    r = subprocess.run(['git', 'diff', '--name-only', f'{base}...HEAD', '--', 'papers/'],
                       cwd=site_root, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f'git diff against {base} failed: {r.stderr.strip()}')
    slugs = sorted({p.split('/')[1] for p in r.stdout.split() if p.count('/') >= 2})
    return [s for s in slugs if os.path.exists(os.path.join(site_root, 'papers', s, 'meta.json'))]


def _load_release(args, slug=None):
    if args.site_root:
        slug = slug or args.slug
        meta_path = os.path.join(args.site_root, 'papers', slug, 'meta.json')
        body_path = os.path.join(args.site_root, 'papers', slug, 'body.md')
        cit_path = args.citations or os.path.join(args.site_root, 'dist', 'api', 'citations.json')
    else:
        meta_path, body_path, cit_path = args.meta, args.body, args.citations
    with open(meta_path, encoding='utf-8') as f:
        meta = json.load(f)
    body = ''
    if body_path and os.path.exists(body_path):
        with open(body_path, encoding='utf-8') as f:
            body = f.read()
    citations = None
    if cit_path and os.path.exists(cit_path):
        with open(cit_path, encoding='utf-8') as f:
            citations = json.load(f).get('citations')
    return meta, body, citations


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    for name in ('check', 'changed'):
        p = sub.add_parser(name)
        p.add_argument('--site-root')
        p.add_argument('--citations')
        p.add_argument('--manuscript', action='append', default=[])
        p.add_argument('--network', choices=('auto', 'online', 'offline'), default='auto')
        p.add_argument('--ledger')
        p.add_argument('--write-ledger', action='store_true')
        p.add_argument('--json')
        if name == 'check':
            p.add_argument('--slug')
            p.add_argument('--meta')
            p.add_argument('--body')
        else:
            p.add_argument('--base', default='origin/main')
    p = sub.add_parser('emit-related-works')
    p.add_argument('--manuscript', action='append', required=True)
    args = ap.parse_args(argv)

    if args.cmd == 'emit-related-works':
        print(json.dumps(emit_related_works(args.manuscript), indent=1, ensure_ascii=False))
        return 0
    if args.cmd == 'check' and not (args.meta or (args.site_root and args.slug)):
        ap.error('check needs --meta, or --site-root with --slug')
    if args.cmd == 'changed' and not args.site_root:
        ap.error('changed needs --site-root')
    if args.write_ledger and not args.ledger:
        ap.error('--write-ledger needs --ledger')

    ledger = load_ledger(args.ledger)
    net = Network()
    slugs = changed_slugs(args.site_root, args.base) if args.cmd == 'changed' else [args.slug]
    if args.cmd == 'changed' and args.manuscript:
        ap.error('changed derives each manuscript from its pdfUrl; use check for --manuscript')
    reports = []
    for slug in slugs:
        meta, body, citations = _load_release(args, slug)
        reports.append(check_release(meta, body, citations, args.manuscript, net, args.network, ledger))
    if args.write_ledger:
        save_ledger(args.ledger, ledger)
    for rep in reports:
        print(f'cited-reference-check {rep["slug"]}: {rep["status"]} '
              f'({len(rep["items"])} reference(s), {len(rep["problems"])} problem(s), '
              f'{"online" if rep["online"] else "offline ledger"})')
        for prob in rep['problems']:
            print('  - ' + prob)
    if not reports:
        print('cited-reference-check: no changed releases')
    if args.json:
        with open(args.json, 'w', encoding='utf-8') as f:
            json.dump({'schemaVersion': '1.0', 'kind': 'cited-reference-check', 'reports': reports}, f, indent=1)
    return 1 if any(r['status'] != 'passed' for r in reports) else 0


if __name__ == '__main__':
    sys.exit(main())
