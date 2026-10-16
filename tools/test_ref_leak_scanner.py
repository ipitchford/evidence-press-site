import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import tempfile
import unittest
import zipfile
from unittest.mock import patch

from ref_leak_scanner import Limits, scan_paths, scan_text


def zipped(entries):
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, 'w') as z:
        for name, data in entries:
            z.writestr(name, data)
    return stream.getvalue()


def real_pdf(text, metadata=None):
    """Minimal actual PDF with text content and correct xref; no external tools."""
    text = text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
    content = ('BT /F1 12 Tf 40 100 Td ('+text+') Tj ET').encode()
    objects = [b'<< /Type /Catalog /Pages 2 0 R >>',
               b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
               b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
               b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
               b'<< /Length '+str(len(content)).encode()+b' >>\nstream\n'+content+b'\nendstream']
    if metadata is not None:
        escaped = metadata.replace('\\','\\\\').replace('(', '\\(').replace(')', '\\)')
        objects.append(('<< /Title ('+escaped+') /Subject ('+escaped+') >>').encode())
    result = b'%PDF-1.4\n'; offsets = [0]
    for n, obj in enumerate(objects, 1):
        offsets.append(len(result)); result += str(n).encode()+b' 0 obj\n'+obj+b'\nendobj\n'
    start = len(result)
    result += f'xref\n0 {len(objects)+1}\n0000000000 65535 f \n'.encode()
    result += b''.join(f'{x:010d} 00000 n \n'.encode() for x in offsets[1:])
    result += f'trailer\n<< /Size {len(objects)+1} /Root 1 0 R'.encode()
    result += b' /Info 6 0 R' if metadata is not None else b''
    result += b' >>\nstartxref\n'+str(start).encode()+b'\n%%EOF\n'
    return result


class TextTests(unittest.TestCase):
    def test_list_version_and_acceptance_ids(self):
        negatives = ['Quality audit: each located and rated. 2. Take my table as the only material.',
                     'Describe what changed for output in **Release 4.2**.',
                     'Acceptance output: **AT-Right-1:** Pass; **AT-Right-2:** Pass; **AT-Wrong-1:** Pass; **AT-Wrong-2:** Pass.']
        for value in negatives:
            with self.subTest(value=value): self.assertEqual(scan_text(value), [])
        for value in ['REF grade **3**', 'Quality rated: 3 stars',
                      '**Release 4.2**. Overall quality: 3*',
                      '**AT-Right-1:** Pass. REF rating: 4 stars']:
            with self.subTest(value=value): self.assertTrue(scan_text(value))
    def test_mathematical_grading_and_language_prerequisite(self):
        self.assertEqual(scan_text('A non-graded four-element rooted tree.'), [])
        warning = 'Require external specialist assessment before first, priority, world-leading, Furter R(3), JC2 or HC4 language.'
        self.assertEqual(scan_text(warning), [])
        self.assertTrue(scan_text(warning + ' Overall rating: 3 stars.'))
        self.assertTrue(scan_text('Require external specialist assessment before using language: REF rating 3 stars.'))
        self.assertTrue(scan_text('The output is graded four for quality.'))
        self.assertTrue(scan_text('The assessment is world-leading.'))
    def test_disclaimer_scope(self):
        negatives = [
            'Internal checking does not establish external peer review, formal verification or four-star significance.',
            'The extensions do not justify an automatic four-star rating.',
            'No formal verification, external peer review or four-star significance is asserted.',
            'No absolute novelty, historical priority, four-star grade or measured impact is claimed.',
            'No four-star grade or higher-degree theorem may be inferred.',
            'This is not a substantiated four-star rating or measured impact.',
            'Specialist review, not a producer-assigned four-star label.',
            'Four-star significance and external assurance were not promoted.',
            'A known four-colouring bound for three star forests. Possible originality is limited.',
        ]
        for value in negatives:
            with self.subTest(value=value): self.assertEqual(scan_text(value), [])
        positives = [
            'REF rating 3 stars; not external peer review.',
            'No formal review. Overall rating: 3 stars.',
            'Not a four-star rating, but a three-star rating.',
            'Checking does not establish peer review, but REF 3 stars is our rating.',
            'Checking does not establish peer review; rating: 3 stars.',
            'Checking does not establish peer review, rating is 3 stars.',
            'Not less than 3 stars in quality.',
            'Prospective assessment was 2★ overall; the extension does not establish 4★ significance.',
        ]
        for value in positives:
            with self.subTest(value=value): self.assertTrue(scan_text(value))
    def test_adversarial_no_ref_and_tex(self):
        for value in [r'Overall rating: 3\*', r'Overall rating: $3^{\star}$',
                      r'Quality rating: \(4^\star\)',
                      'Overall assessment: internationally excellent',
                      '{"qualityRating":"3"}', '{"refRating":"3"}',
                      '{"ref_grade":"three"}',
                      '<meta name="description" content="REF 3 stars">',
                      '<img alt="Prospective quality four stars">']:
            with self.subTest(value=value):self.assertTrue(scan_text(value))
    def test_html_math_and_tex_near_prose(self):
        for value in ['<p>Quality of proof.</p><math><mi>x</mi><mo>=</mo><mn>3</mn><mo>*</mo><mi>y</mi></math>',
                      r'Rigour: see \ref{theorem}; $x^{\star}$ is optimal.',
                      r'Quality check: $3\ast x$ equals $9$.']:
            with self.subTest(value=value):self.assertEqual(scan_text(value), [])
    def test_positive_variants(self):
        samples = ['REF rating: 3*', 'Prospective REF: **three-star** quality',
                   'Overall quality: four stars', 'REF: 2', 'REF internationally excellent',
                   'Research Excellence Framework rating four', 'Rigour ★★★',
                   r'{"REF":"\u0033\u2605"}', 'REF: &#51;&#9733;',
                   '<b>REF</b><span>three</span> stars', 'REF grade **3**',
                   'REF quality rating: ３★', 'REF three ⭐', 'REF\n3☆',
                   'provisional assessment: 2*', 'REF: &amp;#51;&amp;#9733;',
                   'REF three‑star quality']
        for value in samples:
            with self.subTest(value=value):
                self.assertTrue(scan_text(value))

    def test_negative_math(self):
        for value in [r'See \ref{thm:main}; x^* = 3 * x.',
                      'We prove the claim for x* and y*.', 'a = 3 * 4',
                      'REF is a policy acronym without a rating.',
                      r'Rigour of proof: \ref{eq:3} gives x^{*}.',
                      'An unrelated astronomical three-star system.',
                      'Quality of multiplication: 3*x = 9.']:
            with self.subTest(value=value):
                self.assertEqual(scan_text(value), [])


class PayloadTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.root = Path(self.temp.name)
    def tearDown(self):
        self.temp.cleanup()
    def scan(self, data, name='README.md', **limits):
        p = self.root/name; p.write_bytes(data)
        return scan_paths([p], limits=Limits(**limits))
    def test_plain_and_hidden_review_not_excluded(self):
        (self.root/'.private-review.md').write_text('REF rating 3 stars')
        r=scan_paths([self.root]); self.assertTrue(r['findings']); self.assertFalse(r['errors'])
        self.assertEqual(len(r['files'][0]['sha256']),64)
    def test_nested_zip(self):
        r=self.scan(zipped([('inner.zip',zipped([('review.json',b'{"grade":"REF 4 stars"}')]))]),'a.zip')
        self.assertTrue(r['findings']); self.assertFalse(r['errors'])
        self.assertIn('!inner.zip!review.json',r['findings'][0]['source'])
    def test_tar(self):
        stream=io.BytesIO()
        with tarfile.open(fileobj=stream,mode='w:gz') as t:
            data=b'REF: 3 stars'; info=tarfile.TarInfo('r.txt');info.size=len(data);t.addfile(info,io.BytesIO(data))
        r=self.scan(stream.getvalue(),'a.tar.gz');self.assertTrue(r['findings']);self.assertFalse(r['errors'])
    def test_unsafe_zip_names(self):
        for name in ['../x','/x','C:/x','a\\..\\x']:
            with self.subTest(name=name):self.assertTrue(self.scan(zipped([(name,b'ok')]),'a.zip')['errors'])
    def test_zip_symlink(self):
        stream=io.BytesIO()
        with zipfile.ZipFile(stream,'w') as z:
            info=zipfile.ZipInfo('link');info.create_system=3;info.external_attr=0o120777<<16;z.writestr(info,'target')
        self.assertTrue(self.scan(stream.getvalue(),'a.zip')['errors'])
    def test_tar_link(self):
        stream=io.BytesIO()
        with tarfile.open(fileobj=stream,mode='w') as t:
            info=tarfile.TarInfo('link');info.type=tarfile.SYMTYPE;info.linkname='out';t.addfile(info)
        self.assertTrue(self.scan(stream.getvalue(),'a.tar')['errors'])
    def test_corrupt_and_unknown_documents(self):
        for name in ['a.zip','a.pdf','a.docx','a.7z','a.tar.gz']:
            with self.subTest(name=name):self.assertTrue(self.scan(b'not a valid document',name)['errors'])
    def test_encrypted_zip_flag(self):
        data=bytearray(zipped([('a.txt',b'hello')]))
        local=data.index(b'PK\x03\x04');central=data.index(b'PK\x01\x02')
        data[local+6]|=1;data[central+8]|=1
        self.assertTrue(self.scan(data,'a.zip')['errors'])
    def test_bounds(self):
        self.assertTrue(self.scan(b'x'*101,max_input_bytes=100)['errors'])
        self.assertTrue(self.scan(zipped([('x',b'a'*1000)]),'a.zip',max_member_bytes=500)['errors'])
        self.assertTrue(self.scan(zipped([('x.zip',zipped([('y',b'a')]))]),'a.zip',max_archive_depth=1)['errors'])
        self.assertTrue(self.scan(zipped([('x',b'a'),('y',b'a')]),'a.zip',max_files=2)['errors'])
        self.assertTrue(self.scan(b'abc',max_total_bytes=2)['errors'])
    def test_empty_directories_bound(self):
        for n in range(4):(self.root/str(n)).mkdir()
        self.assertTrue(scan_paths([self.root],limits=Limits(max_files=2))['errors'])
    def test_filesystem_symlink_and_missing(self):
        p=self.root/'link';p.symlink_to('missing')
        self.assertTrue(scan_paths([p])['errors']);self.assertTrue(scan_paths([self.root/'missing'])['errors'])
    def test_unreadable(self):
        p=self.root/'x';p.write_text('hi')
        with patch('ref_leak_scanner.os.open',side_effect=PermissionError('denied')):
            self.assertTrue(scan_paths([p])['errors'])
    def test_opaque_coverage(self):
        r=self.scan(b'\x89PNG\x00','image.png');self.assertFalse(r['errors']);self.assertTrue(r['coverage']['nontext_not_checked']);self.assertFalse(r['coverage']['text_checked'])
    def test_utf16(self):
        self.assertTrue(self.scan('REF three stars'.encode('utf-16'))['findings'])
    @unittest.skipUnless(shutil.which('pdftotext'),'pdftotext not installed')
    def test_real_pdf(self):
        r=self.scan(real_pdf('Prospective REF rating: 3 stars'),'a.pdf')
        self.assertFalse(r['errors']);self.assertTrue(r['findings'])
        r=self.scan(real_pdf('Theorem: x squared is nonnegative.'),'a.pdf')
        self.assertFalse(r['errors']);self.assertFalse(r['findings'])
    @unittest.skipUnless(shutil.which('pdftotext'),'pdftotext not installed')
    def test_pdf_metadata_and_no_ref(self):
        r=self.scan(real_pdf('A mathematical theorem.','Overall rating: three stars'),'metadata.pdf')
        self.assertFalse(r['errors']);self.assertTrue(r['findings'])
        r=self.scan(real_pdf('Overall assessment: internationally excellent'),'descriptor.pdf')
        self.assertFalse(r['errors']);self.assertTrue(r['findings'])
    def test_pdf_missing_extractor(self):
        with patch('ref_leak_scanner.shutil.which',return_value=None):
            self.assertTrue(self.scan(real_pdf('hi'),'a.pdf')['errors'])
    def test_encrypted_pdf(self):
        self.assertTrue(self.scan(real_pdf('hi')+b'\n/Encrypt 2 0 R','a.pdf')['errors'])
    @unittest.skipUnless(shutil.which('pdftotext'),'pdftotext not installed')
    def test_pdf_empty_and_expansion(self):
        self.assertTrue(self.scan(real_pdf(''),'empty.pdf')['errors'])
        # Text extraction is bounded independently of PDF input size.
        from ref_leak_scanner import Scanner
        with self.assertRaises(ValueError):
            Scanner(Limits(max_member_bytes=10)).pdf(real_pdf('x'*100))
    def test_duplicate_zip(self):
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            data=zipped([('x',b'ok'),('x',b'ok')])
        self.assertTrue(self.scan(data,'duplicate.zip')['errors'])
    def test_binary_unknown_fails(self):
        self.assertTrue(self.scan(b'\x00\xff','unknown.bin')['errors'])
    def test_payload_never_executes(self):
        p=self.root/'script.py';p.write_text('raise RuntimeError("do not execute")')
        r=scan_paths([p]);self.assertFalse(r['errors']);self.assertEqual(len(r['coverage']['text_checked']),1)
    def test_invalid_config_and_empty(self):
        with self.assertRaises(ValueError):Limits(max_files=0)
        with self.assertRaises(ValueError):Limits(max_files=True)
        self.assertTrue(scan_paths([])['errors'])
    def test_cli(self):
        p=self.root/'r.md';p.write_text('REF 3 stars')
        run=subprocess.run([sys.executable,str(Path(__file__).with_name('ref_leak_scanner.py')),str(p)],capture_output=True,text=True)
        self.assertEqual(run.returncode,1);self.assertTrue(json.loads(run.stdout)['findings'])


if __name__=='__main__':unittest.main()
