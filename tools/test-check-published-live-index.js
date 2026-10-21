#!/usr/bin/env node
/* Evidence Press: check-published.js --live must fail closed when the live
 * release indexes (feed.json, sitemap.xml) cannot be read, and pass when they
 * can. Runs the real checker in a temporary site tree against a local server. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const TOOLS = __dirname;

function server(mode) {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      const url = req.url.split('?')[0];
      if (url === '/feed.json') {
        if (mode === 'feed-down') { res.writeHead(503); return res.end(); }
        res.writeHead(200, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ items: [] }));
      }
      if (url === '/sitemap.xml') {
        if (mode === 'sitemap-down') { res.writeHead(500); return res.end(); }
        res.writeHead(200, { 'content-type': 'application/xml' });
        return res.end('<urlset></urlset>');
      }
      res.writeHead(404); res.end();
    });
    s.listen(0, '127.0.0.1', () => resolve(s));
  });
}

function siteTree(base) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ep-published-'));
  fs.mkdirSync(path.join(root, 'tools'));
  for (const f of ['check-published.js', 'institutional-page-identity.js']) {
    fs.copyFileSync(path.join(TOOLS, f), path.join(root, 'tools', f));
  }
  fs.writeFileSync(path.join(root, 'site.config.json'), JSON.stringify({ baseUrl: base }));
  fs.writeFileSync(path.join(root, 'PUBLISHED.json'),
    JSON.stringify({ note: 'fixture', releases: [], pages: [], artifacts: [] }));
  fs.mkdirSync(path.join(root, 'dist', 'releases'), { recursive: true });
  return root;
}

function run(mode) {
  return server(mode).then(s => new Promise(resolve => {
    const base = `http://127.0.0.1:${s.address().port}`;
    const root = siteTree(base);
    const child = spawn(process.execPath,
      [path.join(root, 'tools', 'check-published.js'), '--live'], { cwd: root });
    let out = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { out += d; });
    child.on('close', code => {
      s.close();
      fs.rmSync(root, { recursive: true, force: true });
      resolve({ code, out });
    });
  }));
}

(async () => {
  const failures = [];
  const ok = await run('ok');
  if (ok.code !== 0) failures.push(`readable indexes should pass, got exit ${ok.code}:\n${ok.out}`);
  for (const mode of ['feed-down', 'sitemap-down']) {
    const r = await run(mode);
    if (r.code === 0) failures.push(`${mode}: expected refusal, got exit 0`);
    if (!/live release index unreadable/.test(r.out)) failures.push(`${mode}: refusal message missing:\n${r.out}`);
  }
  if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
  console.log('check-published live-index fail-closed tests passed (3 cases).');
})();
