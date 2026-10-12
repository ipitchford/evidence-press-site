'use strict';
/* Publication gate: a research release must link its manuscript PDF.
   Shared by build.js (fails the build) and tools/test-metadata.js (checks the
   built catalogue and runs hostile controls). Historical exceptions live in
   data/MANUSCRIPT_PDF_WAIVERS.json and must match slug and version exactly. */
const fs = require('fs');
const path = require('path');

const WAIVER_FILE = path.join(__dirname, '..', 'data', 'MANUSCRIPT_PDF_WAIVERS.json');

function loadWaivers(file = WAIVER_FILE) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function checkManuscriptPdf(papers, register = loadWaivers()) {
  const errors = [];
  const bySlug = new Map(papers.map(p => [p.slug, p]));
  const waivers = new Map();
  for (const w of register.waivers || []) {
    if (!w || !w.slug || !w.version || !w.reason || !w.companionRelease) {
      errors.push(`manuscript-PDF waiver ${JSON.stringify(w && w.slug)} must state slug, version, reason and companionRelease`);
      continue;
    }
    if (waivers.has(w.slug)) errors.push(`manuscript-PDF waiver for ${w.slug} is duplicated`);
    waivers.set(w.slug, w);
    const paper = bySlug.get(w.slug);
    if (!paper) { errors.push(`manuscript-PDF waiver names unknown release ${w.slug}`); continue; }
    if (paper.version !== w.version) errors.push(`manuscript-PDF waiver for ${w.slug} names version ${w.version}, but the record is ${paper.version}`);
    if (paper.pdfUrl) errors.push(`manuscript-PDF waiver for ${w.slug} is unnecessary: the record links a PDF`);
    if (register.gateIntroduced && String(paper.datePublished) >= register.gateIntroduced)
      errors.push(`manuscript-PDF waiver for ${w.slug} is not allowed: published on or after the gate (${register.gateIntroduced})`);
    const companion = bySlug.get(w.companionRelease);
    if (!companion || !companion.pdfUrl) errors.push(`manuscript-PDF waiver for ${w.slug} must name a companion release that links a PDF`);
  }
  for (const p of papers) {
    if (!p.pdfUrl) {
      if (!waivers.has(p.slug)) errors.push(`papers/${p.slug}: pdfUrl is required — a research release must link its manuscript PDF`);
      continue;
    }
    let parsed;
    try { parsed = new URL(p.pdfUrl); } catch { errors.push(`papers/${p.slug}: pdfUrl is not a URL`); continue; }
    if (parsed.protocol !== 'https:') errors.push(`papers/${p.slug}: pdfUrl must use https`);
    if (!/\.pdf$/i.test(decodeURIComponent(parsed.pathname))) errors.push(`papers/${p.slug}: pdfUrl must point at a .pdf file`);
  }
  return errors;
}

module.exports = { checkManuscriptPdf, loadWaivers };
