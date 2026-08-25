#!/usr/bin/env node
'use strict';

/* Evidence Press article authoring contract.
 *
 * Articles are communication objects, not research-release evidence packages.
 * This loader deliberately uses a separate schema, URL space and API so an
 * essay cannot inherit a DOI, replay state or assurance claim by accident.
 */
const fs = require('fs');
const path = require('path');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ARTICLE_CLASSES = ['essay', 'commentary', 'synthesis', 'research-note', 'institutional-update'];
const STATUSES = ['published', 'corrected', 'superseded', 'withdrawn'];
const RENDER_MODES = ['generated', 'existing-page'];
const META_FIELDS = new Set([
  'schemaVersion', 'slug', 'title', 'standfirst', 'summary', 'datePublished',
  'dateModified', 'articleClass', 'status', 'byline', 'topics',
  'newResearchClaims', 'claimBoundary', 'sources', 'relatedReleases',
  'relatedArticles', 'corrections', 'license', 'renderMode', 'canonicalPath',
  'sourcePath'
]);

function isRealDate(value) {
  return DATE_RE.test(String(value || '')) &&
    new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}

function isHttpsUrl(value) {
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

function contained(root, candidate) {
  const base = path.resolve(root);
  const target = path.resolve(root, candidate);
  return target === base || target.startsWith(base + path.sep);
}

function validateMeta(meta, context) {
  const errors = [];
  const bad = message => errors.push(`${context}: ${message}`);
  const requiredText = ['title', 'standfirst', 'summary', 'byline', 'claimBoundary'];

  for (const field of Object.keys(meta)) if (!META_FIELDS.has(field)) bad(`unknown field ${field}`);
  if (meta.schemaVersion !== '1.0') bad('schemaVersion must be 1.0');
  if (!SLUG_RE.test(String(meta.slug || ''))) bad(`slug "${meta.slug}" must be lower-case words joined by single hyphens`);
  requiredText.forEach(field => {
    if (typeof meta[field] !== 'string' || !meta[field].trim()) bad(`${field} must be a non-empty string`);
  });
  if (!ARTICLE_CLASSES.includes(meta.articleClass)) bad(`articleClass must be one of ${ARTICLE_CLASSES.join(', ')}`);
  if (!STATUSES.includes(meta.status)) bad(`status must be one of ${STATUSES.join(', ')}`);
  if (!RENDER_MODES.includes(meta.renderMode || 'generated')) bad(`renderMode must be one of ${RENDER_MODES.join(', ')}`);
  if (!isRealDate(meta.datePublished)) bad('datePublished must be a real YYYY-MM-DD date');
  if (!isRealDate(meta.dateModified)) bad('dateModified must be a real YYYY-MM-DD date');
  if (isRealDate(meta.datePublished) && isRealDate(meta.dateModified) && meta.dateModified < meta.datePublished)
    bad('dateModified cannot precede datePublished');
  if (meta.license !== 'CC0-1.0') bad('license must be CC0-1.0');
  if (typeof meta.newResearchClaims !== 'boolean') bad('newResearchClaims must be a boolean');
  if (!Array.isArray(meta.topics) || !meta.topics.length || meta.topics.some(topic => typeof topic !== 'string' || !topic.trim()))
    bad('topics must be a non-empty array of strings');
  if (!Array.isArray(meta.sources)) bad('sources must be an array');
  for (const [index, source] of (meta.sources || []).entries()) {
    if (!source || typeof source.citation !== 'string' || !source.citation.trim()) bad(`sources[${index}].citation must be non-empty`);
    if (!source || !isHttpsUrl(source.url)) bad(`sources[${index}].url must be an https URL`);
    if (source && Object.keys(source).some(key => !['citation', 'url'].includes(key))) bad(`sources[${index}] contains an unknown field`);
  }
  for (const field of ['relatedReleases', 'relatedArticles', 'corrections']) {
    if (!Array.isArray(meta[field] || [])) bad(`${field} must be an array when supplied`);
  }
  for (const [index, correction] of (meta.corrections || []).entries()) {
    if (!isRealDate(correction.date)) bad(`corrections[${index}].date must be a real YYYY-MM-DD date`);
    if (typeof correction.summary !== 'string' || !correction.summary.trim()) bad(`corrections[${index}].summary must be non-empty`);
    if (correction && Object.keys(correction).some(key => !['date', 'summary', 'detail'].includes(key))) bad(`corrections[${index}] contains an unknown field`);
  }
  if ((meta.renderMode || 'generated') === 'existing-page') {
    if (!/^\/[a-z0-9/-]+\/$/.test(String(meta.canonicalPath || '')) || String(meta.canonicalPath).includes('..'))
      bad('existing-page canonicalPath must be a safe root-relative directory URL');
    if (typeof meta.sourcePath !== 'string' || !meta.sourcePath.trim()) bad('existing-page sourcePath is required');
  } else if (meta.canonicalPath != null || meta.sourcePath != null) {
    bad('generated articles derive their canonical and source paths; omit canonicalPath and sourcePath');
  }
  return errors;
}

function loadArticles(root, options = {}) {
  const articlesDir = path.join(root, 'articles');
  if (!fs.existsSync(articlesDir)) return [];
  const releaseSlugs = new Set(options.releaseSlugs || []);
  const errors = [];
  const articles = fs.readdirSync(articlesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('_') &&
      fs.existsSync(path.join(articlesDir, entry.name, 'meta.json')))
    .map(entry => {
      const metaRel = path.join('articles', entry.name, 'meta.json');
      let meta;
      try { meta = JSON.parse(fs.readFileSync(path.join(root, metaRel), 'utf8')); }
      catch (error) { errors.push(`${metaRel}: invalid JSON (${error.message})`); return null; }
      if (!meta.slug) meta.slug = entry.name;
      errors.push(...validateMeta(meta, metaRel));
      if (meta.slug !== entry.name) errors.push(`${metaRel}: slug must match its directory name`);

      const renderMode = meta.renderMode || 'generated';
      const sourceRel = renderMode === 'existing-page'
        ? meta.sourcePath
        : path.join('articles', entry.name, 'body.md');
      if (!sourceRel || !contained(root, sourceRel)) {
        errors.push(`${metaRel}: source path escapes the repository`);
        return null;
      }
      const sourceAbs = path.join(root, sourceRel);
      if (!fs.existsSync(sourceAbs)) {
        errors.push(`${metaRel}: missing source ${sourceRel}`);
        return null;
      }
      const body = fs.readFileSync(sourceAbs, 'utf8');
      if (!body.trim()) errors.push(`${sourceRel}: article body cannot be empty`);
      for (const [index, relation] of (meta.relatedReleases || []).entries()) {
        if (!relation || !SLUG_RE.test(String(relation.slug || '')))
          errors.push(`${metaRel}: relatedReleases[${index}].slug is invalid`);
        else if (releaseSlugs.size && !releaseSlugs.has(relation.slug))
          errors.push(`${metaRel}: relatedReleases[${index}] names unknown release ${relation.slug}`);
        if (!relation || typeof relation.relation !== 'string' || !relation.relation.trim())
          errors.push(`${metaRel}: relatedReleases[${index}].relation must be non-empty`);
        if (relation && Object.keys(relation).some(key => !['slug', 'relation', 'note'].includes(key)))
          errors.push(`${metaRel}: relatedReleases[${index}] contains an unknown field`);
      }
      const wordCount = (body.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) || []).length;
      const canonicalPath = renderMode === 'existing-page' ? meta.canonicalPath : `/articles/${meta.slug}/`;
      return {
        ...meta,
        renderMode,
        body,
        sourcePath: sourceRel.split(path.sep).join('/'),
        metaPath: metaRel.split(path.sep).join('/'),
        canonicalPath,
        wordCount,
        readingMinutes: Math.max(1, Math.ceil(wordCount / 220))
      };
    }).filter(Boolean);

  const slugs = new Map();
  const paths = new Map();
  for (const article of articles) {
    if (slugs.has(article.slug)) errors.push(`duplicate article slug ${article.slug}`);
    else slugs.set(article.slug, article.metaPath);
    if (paths.has(article.canonicalPath)) errors.push(`duplicate article canonical path ${article.canonicalPath}`);
    else paths.set(article.canonicalPath, article.metaPath);
  }
  for (const article of articles) {
    for (const [index, relation] of (article.relatedArticles || []).entries()) {
      if (!relation || !slugs.has(relation.slug)) errors.push(`${article.metaPath}: relatedArticles[${index}] names unknown article ${relation && relation.slug}`);
      if (!relation || typeof relation.relation !== 'string' || !relation.relation.trim())
        errors.push(`${article.metaPath}: relatedArticles[${index}].relation must be non-empty`);
      if (relation && Object.keys(relation).some(key => !['slug', 'relation', 'note'].includes(key)))
        errors.push(`${article.metaPath}: relatedArticles[${index}] contains an unknown field`);
    }
  }
  if (errors.length) throw new Error(`article authoring contract failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n  - ${errors.join('\n  - ')}`);
  return articles.sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.slug.localeCompare(b.slug));
}

module.exports = { ARTICLE_CLASSES, STATUSES, RENDER_MODES, loadArticles, validateMeta };
