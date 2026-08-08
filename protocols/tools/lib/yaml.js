'use strict';
/*
 * yaml-lite — a dependency-free loader for the YAML subset used by Productivity
 * Protocols contracts (protocol.yaml, kernel.yaml). It is NOT a general YAML
 * parser. Supported: block mappings, block sequences (scalar and mapping items),
 * quoted and bare scalars, integers/floats/booleans/null, inline empty array
 * `[]`, folded (`>` / `>-`) and literal (`|` / `|-`) block scalars, full-line
 * `#` comments, and blank lines. Unsupported constructs should not appear in a
 * pack; the validator's job is partly to keep authoring inside this subset.
 *
 * Licence: Apache-2.0.
 */

function isBlank(line) { return line.trim() === ''; }
function isComment(line) { return line.trim().startsWith('#'); }
function indentOf(line) { const m = line.match(/^(\s*)/); return m[1].length; }

function splitFlow(s) {
  // Split a flow-sequence body on top-level commas, respecting quotes and nesting.
  const out = [];
  let depth = 0, q = null, cur = '';
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '[' || ch === '{') { depth++; cur += ch; continue; }
    if (ch === ']' || ch === '}') { depth--; cur += ch; continue; }
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim() !== '') out.push(cur);
  return out;
}

function scalar(sRaw) {
  const s = sRaw.trim();
  if (s === '' ) return null;
  if (s === '{}') return {};
  if (s[0] === '[' && s[s.length - 1] === ']') {
    const inner = s.slice(1, -1).trim();
    if (inner === '') return [];
    return splitFlow(inner).map(scalar);
  }
  if (s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s[0] === '"') {
    try { return JSON.parse(s); } catch { return s.slice(1, -1); }
  }
  if (s[0] === "'") {
    return s.slice(1, s.length - 1).replace(/''/g, "'");
  }
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  return s;
}

function splitKey(content) {
  // Returns [key, rest] splitting on the first ':' followed by whitespace or EOL.
  const m = content.match(/^([^:]+):(?:\s+([\s\S]*))?$/);
  if (!m) return null;
  return [m[1].trim(), (m[2] === undefined ? '' : m[2]).trim()];
}

function looksLikeKey(content) {
  return /^[^:\s][^:]*:(\s|$)/.test(content);
}

function load(text) {
  const lines = text.split(/\r?\n/);
  let pos = 0;

  function skip() {
    while (pos < lines.length && (isBlank(lines[pos]) || isComment(lines[pos]))) pos++;
  }

  function parseBlockScalar(parentIndent, indicator) {
    const fold = indicator[0] === '>';
    const chomp = indicator.includes('-') ? 'strip' : 'clip';
    const buf = [];
    let blockIndent = null;
    while (pos < lines.length) {
      const line = lines[pos];
      if (isBlank(line)) { buf.push(''); pos++; continue; }
      const ind = indentOf(line);
      if (ind <= parentIndent) break;
      if (blockIndent === null) blockIndent = ind;
      buf.push(line.slice(blockIndent));
      pos++;
    }
    // trim trailing blank lines captured
    while (buf.length && buf[buf.length - 1] === '') buf.pop();
    let out;
    if (fold) {
      out = '';
      for (let i = 0; i < buf.length; i++) {
        if (i === 0) { out = buf[i]; continue; }
        if (buf[i] === '' || buf[i - 1] === '') out += '\n' + buf[i];
        else out += ' ' + buf[i];
      }
    } else {
      out = buf.join('\n');
    }
    if (chomp === 'clip') out += '\n';
    return out;
  }

  function parseMapping(indent) {
    const obj = {};
    while (true) {
      skip();
      if (pos >= lines.length) break;
      const ind = indentOf(lines[pos]);
      if (ind < indent) break;
      if (ind > indent) break; // defensive; shouldn't happen in well-formed input
      const content = lines[pos].slice(indent);
      const kv = splitKey(content);
      if (!kv) break;
      const [key, rest] = kv;
      pos++;
      if (rest === '') {
        // nested block, block scalar handled above only if rest present; here look ahead
        skip();
        if (pos < lines.length && indentOf(lines[pos]) > indent) {
          obj[key] = parseNode(indentOf(lines[pos]));
        } else {
          obj[key] = null;
        }
      } else if (rest[0] === '>' || rest[0] === '|') {
        obj[key] = parseBlockScalar(indent, rest);
      } else {
        obj[key] = scalar(rest);
      }
    }
    return obj;
  }

  function parseSequence(indent) {
    const arr = [];
    while (true) {
      skip();
      if (pos >= lines.length) break;
      const ind = indentOf(lines[pos]);
      if (ind < indent) break;
      const content = lines[pos].slice(indent);
      if (content[0] !== '-') break;
      let item = content.slice(1);
      if (item.startsWith(' ')) item = item.slice(1);
      if (looksLikeKey(item)) {
        // Mapping item. Rewrite '- ' to '  ' so the item block is a mapping at indent+2.
        lines[pos] = ' '.repeat(indent + 2) + item;
        arr.push(parseMapping(indent + 2));
      } else {
        // Scalar (or block scalar) item.
        if (item[0] === '>' || item[0] === '|') {
          pos++;
          arr.push(parseBlockScalar(indent, item));
        } else {
          pos++;
          arr.push(scalar(item));
        }
      }
    }
    return arr;
  }

  function parseNode(indent) {
    skip();
    if (pos >= lines.length) return null;
    const content = lines[pos].slice(indent);
    if (content[0] === '-' && (content[1] === ' ' || content.length === 1)) {
      return parseSequence(indent);
    }
    return parseMapping(indent);
  }

  skip();
  if (pos >= lines.length) return null;
  return parseNode(indentOf(lines[pos]));
}

module.exports = { load };
