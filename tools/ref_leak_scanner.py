#!/usr/bin/env python3
"""Bounded public-payload quality-rating scanner; heuristics, not media clearance."""
from __future__ import annotations
import argparse
import hashlib
import html
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import selectors
import shutil
import stat
import subprocess
import tarfile
import tempfile
import time
import unicodedata
import zipfile
from dataclasses import dataclass, asdict


@dataclass
class Limits:
    max_input_bytes: int = 32 * 1024 * 1024
    max_member_bytes: int = 16 * 1024 * 1024
    max_total_bytes: int = 128 * 1024 * 1024
    max_files: int = 10000
    max_archive_depth: int = 4
    pdf_timeout_seconds: int = 20

    def __post_init__(self):
        for name, value in asdict(self).items():
            if type(value) is not int or value <= 0:
                raise ValueError(f'{name} must be a positive integer')


def normalize(text):
    # Decode textual transport escapes, not executable languages.
    for _ in range(4):
        previous = text
        text = html.unescape(text)
        text = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), text)
        text = re.sub(r'\\[nrt](?![a-zA-Z])', ' ', text)
        if text == previous:
            break
    text = unicodedata.normalize('NFKC', text)
    text = re.sub(r'[\u2010-\u2015\u2212]', '-', text)
    text = re.sub(r'[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]', '', text)
    text = re.sub(r'\\([*])', r'\1', text)
    text = re.sub(r'\\ast\b', '*', text)
    text = re.sub(r'\\(?:star|bigstar)\b', '★', text)
    text = re.sub(r'([1-4])\s*\^\s*\{?\s*★\s*\}?', r'\1★', text)
    # Metadata attributes are public text too (e.g. social previews and PDF
    # Info fields emitted by pdftotext -htmlmeta). Preserve their values.
    def attributes(match):
        tag = match[0]
        values = re.findall(r'([\w:-]+)\s*=\s*(?:"([^"]*)"|\x27([^\x27]*)\x27|([^\s>]+))', tag)
        return ' ' + ' '.join(key+' '+(a or b or c) for key,a,b,c in values) + ' '
    text = re.sub(r'<[^>]{0,500}>', attributes, text)
    text = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', text)
    text = re.sub(r'(?i)\b(ref|quality|overall|research)_(rating|grade|score)\b', r'\1 \2', text)
    text = re.sub(r'<[^>]{0,500}>', ' ', text)
    return re.sub(r'\s+', ' ', text)


REF = re.compile(r'(?<![\\\w])REF\b|Research\s+Excellence\s+Framework', re.I)
CONTEXT = re.compile(r'\b(?:rating|rated|grade|graded|quality|rigou?r|originality|significance|assessment|assessed|output|prospective|provisional)\b', re.I)
LEVEL = r'(?:[1-4]|one|two|three|four)'
STAR = re.compile(r'(?<![\w^])' + LEVEL + r'[\s_*`{}:\-]{0,12}(?:[★☆⭐✩✭✮✯✰]|\*|stars?\b)|[★☆⭐✩✭✮✯✰]{1,4}', re.I)
GRADE = re.compile(r'\b(?:rat(?:ing|ed)|grad(?:e|ed)|score)\b[^\w.;!?]{0,20}' + LEVEL + r'\b', re.I)
REF_GRADE = re.compile(r'(?<![\\\w])REF\b[\s\W_]{0,20}' + LEVEL + r'\b', re.I)
DESCRIPTOR = re.compile(r'\b(?:world[ -]leading|internationally\s+excellent|internationally\s+recognised|nationally\s+recognised)\b', re.I)


def explicit_disclaimer(text, match):
    """Suppress narrow negative claims, never a whole file or surrounding review.

    Contrast conjunctions and sentence boundaries reset scope. This is a
    linguistic heuristic: it is not a general negation or sentiment parser.
    """
    before = re.split(r'[.;!?]|\b(?:but|however|yet|nevertheless)\b', text[:match.start()], flags=re.I)[-1][-220:]
    after = re.split(r'[.;!?]|\b(?:but|however|yet|nevertheless)\b', text[match.end():], flags=re.I)[0][:160]
    if re.search(r'\b(?:rating|grade|assessment)\s*(?:is|was|:|=)\s*$', before, re.I) or re.search(r'\b(?:rated|graded|assessed at)\s*$', before, re.I):
        return False
    if re.search(r'\b(?:does? not|cannot|do not)\s+(?:establish|justify|imply|claim|demonstrate|support)\b', before, re.I):
        return True
    if re.search(r'\bnot\s+(?:a|an|the|a substantiated|a producer-assigned|a credible)\s+(?:[\w-]+\s+){0,3}$', before, re.I):
        return True
    if re.search(r'\bno\b', before, re.I) and re.search(r'\b(?:claim(?:ed)?|asserted|inferred|established)\b', after, re.I):
        return True
    if re.search(r'\b(?:neither|need not become)\b', before, re.I):
        return True
    if re.search(r'^\s*(?:significance|grade|rating)?\s*(?:and external assurance\s*)?(?:was|were|is|are) not (?:promoted|claimed|asserted)\b', after, re.I):
        return True
    return False


def scan_text(text, source='<text>'):
    """Return contextual findings. Offsets refer to normalized text, not bytes."""
    normalized = normalize(text)
    findings = []
    seen = set()
    for pattern, rule in ((STAR, 'contextual-star-rating'), (GRADE, 'ref-numeric-grade'), (REF_GRADE, 'ref-numeric-grade'),
                          (DESCRIPTOR, 'ref-quality-descriptor')):
        for match in pattern.finditer(normalized):
            start, end = max(0, match.start()-160), min(len(normalized), match.end()+160)
            window = normalized[start:end]
            # Mathematical grading of finite objects is not an assigned
            # quality score. Keep this lexical exception deliberately narrow.
            if pattern is GRADE and re.search(r'\bnon-$', normalized[:match.start()], re.I) and re.match(r'-element\b', normalized[match.end():], re.I):
                continue
            if pattern is DESCRIPTOR:
                clause = re.split(r'[.;!?]', normalized[:match.start()])[-1][-180:]
                tail = re.split(r'[.;!?]', normalized[match.end():])[0][:100]
                # A prerequisite for using an expression is not its assertion.
                # Never use this exception to suppress numeric/star scores.
                if re.search(r'\brequire\s+external\s+specialist\s+assessment\s+before\b', clause, re.I) and re.search(r'\blanguage\b', tail, re.I):
                    continue
            if rule == 'contextual-star-rating':
                # Closing Markdown emphasis after a decimal/version component
                # or a named acceptance-test ID is not a star symbol.
                if re.search(r'\d\.$', normalized[:match.start()]) and re.fullmatch(r'[1-4]\*{1,3}', match[0]):
                    continue
                if re.search(r'\bAT-(?:Right|Wrong)-$', normalized[:match.start()], re.I) and re.fullmatch(r'[1-4]:\*{1,3}', match[0]):
                    continue
                # Star forests/graphs are mathematical objects, not grades.
                if re.search(r'stars?$', match[0], re.I) and re.match(r'\s+(?:forests?|graphs?|packings?|covers?)\b', normalized[match.end():], re.I):
                    continue
                if re.fullmatch(r'[★☆⭐✩✭✮✯✰]+', match[0]) and re.search(r'\^\s*\{?\s*$', normalized[:match.start()]):
                    continue
            # Numeric multiplication, TeX superscripts, and bare star notation
            # are not ratings without prose context. Explicit multiplication
            # after a numeric asterisk is excluded even with nearby context.
            if rule == 'contextual-star-rating' and re.match(r'\s*[A-Za-z0-9(]', normalized[match.end():]) and match[0].rstrip().endswith('*'):
                if re.match(r'\s*(?:[0-9(]|[xyz](?:\b|[_^]))', normalized[match.end():]):
                    continue
            has_ref = REF.search(window)
            has_assessment = CONTEXT.search(window)
            if not has_ref and not has_assessment:
                continue
            if explicit_disclaimer(normalized, match):
                continue
            if (match.start(), rule) in seen:
                continue
            seen.add((match.start(), rule))
            findings.append({'source': source, 'rule': rule,
                             'normalized_offset': match.start(),
                             'match': match[0], 'excerpt': window,
                             'rationale': 'Quality-rating expression near REF or assessment language; human review required.'})
    return findings


MEDIA = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svgz', '.avif', '.heic',
         '.mp3', '.mp4', '.m4a', '.wav', '.ogg', '.flac', '.mov', '.webm', '.ico', '.woff', '.woff2', '.ttf', '.otf'}
UNSUPPORTED = {'.7z', '.rar', '.gz', '.bz2', '.xz', '.doc', '.xls', '.ppt', '.odt', '.ods', '.odp', '.docx', '.xlsx', '.pptx'}


class Scanner:
    def __init__(self, limits):
        self.limits = limits
        self.total = 0
        self.count = 0
        self.entries = 0
        self.report = {'schemaVersion': '1.0', 'files': [], 'findings': [], 'errors': [],
                       'coverage': {'text_checked': [], 'nontext_not_checked': [], 'archives_checked': []},
                       'limits': asdict(limits),
                       'boundary': 'Contextual heuristic detection only; not a guarantee of no rating leakage. Opaque media requires separate visual/audio QA; exit 0 is not media clearance.'}

    def error(self, source, reason):
        self.report['errors'].append({'source': source, 'reason': str(reason)[:500]})

    def reserve(self, size):
        self.count += 1
        if self.count > self.limits.max_files:
            raise ValueError('file/member count limit exceeded')
        if size > self.limits.max_member_bytes:
            raise ValueError('member size limit exceeded')
        self.total += size
        if self.total > self.limits.max_total_bytes:
            raise ValueError('total expanded-byte limit exceeded')

    def safe_member(self, name):
        p = PurePosixPath(name)
        if not name or '\\' in name or p.is_absolute() or '..' in p.parts or re.match(r'^[A-Za-z]:', name) or '\x00' in name:
            raise ValueError('unsafe archive member path')

    def pdf(self, data):
        if re.search(rb'/Encrypt\b', data):
            raise ValueError('encrypted PDF not accepted')
        executable = shutil.which('pdftotext')
        if not executable:
            raise ValueError('PDF extractor pdftotext unavailable')
        with tempfile.TemporaryDirectory(prefix='ref-scan-') as directory:
            path = Path(directory)/'input.pdf'
            path.write_bytes(data)
            # Parser diagnostics are intentionally discarded, not accumulated
            # into an unbounded memory/disk buffer from a hostile document.
            with open(os.devnull, 'wb') as stderr:
                proc = subprocess.Popen([executable, '-htmlmeta', '-enc', 'UTF-8', str(path), '-'], stdout=subprocess.PIPE, stderr=stderr)
                chunks, size = [], 0
                selector = selectors.DefaultSelector()
                selector.register(proc.stdout, selectors.EVENT_READ)
                deadline = time.monotonic()+self.limits.pdf_timeout_seconds
                try:
                    while selector.get_map():
                        remaining = deadline-time.monotonic()
                        if remaining <= 0:
                            raise ValueError('PDF extraction timeout')
                        for key, _ in selector.select(min(remaining, .2)):
                            block = os.read(key.fd, 65536)
                            if not block:
                                selector.unregister(key.fileobj)
                                continue
                            size += len(block)
                            if size > self.limits.max_member_bytes:
                                raise ValueError('PDF extracted-text limit exceeded')
                            chunks.append(block)
                    code = proc.wait(timeout=max(.01, deadline-time.monotonic()))
                    if code:
                        raise ValueError(f'PDF extraction failed (exit {code})')
                    text = b''.join(chunks).decode('utf-8', errors='strict')
                    body = re.search(r'<pre[^>]*>(.*?)</pre>', text, re.S | re.I)
                    if not body or not normalize(body[1]).strip():
                        raise ValueError('PDF contains no extractable text; OCR/media QA required')
                    self.total += size
                    if self.total > self.limits.max_total_bytes:
                        raise ValueError('total extracted-byte limit exceeded')
                    return text
                finally:
                    selector.close()
                    if proc.poll() is None:
                        proc.kill()
                    proc.wait()
                    proc.stdout.close()

    def data(self, data, source, depth=0):
        record = {'source': source, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}
        self.report['files'].append(record)
        try:
            self.reserve(len(data))
            lower = source.lower()
            suffix = Path(lower).suffix
            is_zip = data.startswith((b'PK\x03\x04', b'PK\x05\x06', b'PK\x07\x08')) or suffix == '.zip'
            is_tar = lower.endswith(('.tar', '.tar.gz', '.tgz', '.tar.bz2', '.tbz2', '.tar.xz')) or data[257:262] == b'ustar'
            if is_zip or is_tar:
                if depth >= self.limits.max_archive_depth:
                    raise ValueError('archive nesting limit exceeded')
                seen = set()
                if is_zip:
                    with zipfile.ZipFile(io.BytesIO(data)) as archive:
                        if len(archive.infolist()) > self.limits.max_files-self.count:
                            raise ValueError('archive member count limit exceeded')
                        for item in archive.infolist():
                            self.safe_member(item.filename)
                            if item.filename in seen:
                                raise ValueError('duplicate archive member')
                            seen.add(item.filename)
                            if item.flag_bits & 1:
                                raise ValueError('encrypted archive member')
                            mode = item.external_attr >> 16
                            if stat.S_ISLNK(mode):
                                raise ValueError('archive symlink')
                            if stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR):
                                raise ValueError('archive special member')
                            if item.is_dir():
                                continue
                            if item.file_size > min(self.limits.max_member_bytes, self.limits.max_total_bytes-self.total):
                                raise ValueError('archive expanded-size limit exceeded')
                            with archive.open(item) as stream:
                                payload = stream.read(self.limits.max_member_bytes+1)
                            self.data(payload, source+'!'+item.filename, depth+1)
                else:
                    with tarfile.open(fileobj=io.BytesIO(data), mode='r|*') as archive:
                        for index, item in enumerate(archive):
                            if index >= self.limits.max_files-self.count:
                                raise ValueError('archive member count limit exceeded')
                            self.safe_member(item.name)
                            if item.name in seen:
                                raise ValueError('duplicate archive member')
                            seen.add(item.name)
                            if item.isdir():
                                continue
                            if not item.isfile():
                                raise ValueError('archive link or special member')
                            if item.size > min(self.limits.max_member_bytes, self.limits.max_total_bytes-self.total):
                                raise ValueError('archive expanded-size limit exceeded')
                            with archive.extractfile(item) as stream:
                                payload = stream.read(self.limits.max_member_bytes+1)
                            self.data(payload, source+'!'+item.name, depth+1)
                record['kind'] = 'archive'
                self.report['coverage']['archives_checked'].append(source)
            elif data.startswith(b'%PDF-') or suffix == '.pdf':
                record['kind'] = 'pdf-text'
                self.text(self.pdf(data), source)
            elif suffix in UNSUPPORTED:
                raise ValueError('unsupported document/archive extraction; not checked')
            elif suffix in MEDIA:
                record['kind'] = 'opaque-media'
                self.report['coverage']['nontext_not_checked'].append({'source': source, 'reason': 'Separate media/font QA required; no text clearance'})
            else:
                if data.startswith((b'\xff\xfe', b'\xfe\xff')):
                    text = data.decode('utf-16')
                else:
                    text = data.decode('utf-8-sig')
                if '\x00' in text:
                    raise ValueError('binary or unsupported text encoding')
                record['kind'] = 'text'
                self.text(text, source)
        except Exception as exc:
            record['kind'] = record.get('kind', 'error')
            self.error(source, exc)

    def text(self, text, source):
        self.report['findings'].extend(scan_text(text, source))
        self.report['coverage']['text_checked'].append(source)

    def path(self, path):
        path = Path(path)
        try:
            self.entries += 1
            if self.entries > self.limits.max_files:
                raise ValueError('filesystem entry count limit exceeded')
            info = path.lstat()
            if stat.S_ISLNK(info.st_mode):
                raise ValueError('filesystem symlink')
            if stat.S_ISDIR(info.st_mode):
                for child in path.iterdir():
                    if self.entries >= self.limits.max_files:
                        raise ValueError('filesystem file count limit exceeded')
                    self.path(child)
            elif stat.S_ISREG(info.st_mode):
                if info.st_size > self.limits.max_input_bytes:
                    raise ValueError('input size limit exceeded')
                # O_NOFOLLOW prevents replacement with a symlink after lstat.
                fd = os.open(path, os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0))
                with os.fdopen(fd, 'rb') as stream:
                    data = stream.read(self.limits.max_input_bytes+1)
                if len(data) > self.limits.max_input_bytes:
                    raise ValueError('input grew beyond size limit')
                self.data(data, str(path))
            else:
                raise ValueError('special filesystem entry')
        except Exception as exc:
            self.error(str(path), exc)


def scan_paths(paths, *, limits=None):
    scanner = Scanner(limits or Limits())
    paths = list(paths)
    if not paths:
        scanner.error('<inputs>', 'no explicit public inputs supplied')
    for path in paths:
        scanner.path(path)
    scanner.report['status'] = 'failed' if scanner.report['findings'] or scanner.report['errors'] else 'no-findings-in-checked-text'
    scanner.report['coverage']['expanded_bytes_accounted'] = scanner.total
    return scanner.report


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('paths', nargs='+')
    for field, default in asdict(Limits()).items():
        parser.add_argument('--'+field.replace('_','-'), type=int, default=default)
    args = parser.parse_args(argv)
    try:
        report = scan_paths(args.paths, limits=Limits(**{k:getattr(args,k) for k in asdict(Limits())}))
    except ValueError as exc:
        report = {'status':'failed', 'findings':[], 'errors':[{'reason':str(exc)}]}
    print(json.dumps(report, ensure_ascii=True, indent=2))
    return 1 if report['findings'] or report['errors'] else 0


if __name__ == '__main__':
    raise SystemExit(main())
