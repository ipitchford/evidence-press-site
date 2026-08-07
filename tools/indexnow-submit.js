#!/usr/bin/env node
/* Evidence Press — IndexNow submission.
 *
 * Pushes every public URL to the IndexNow network (Bing, Yandex, DuckDuckGo,
 * Seznam, …) so new or updated pages are picked up without waiting for an
 * organic crawl. Google does not participate in IndexNow; that channel is
 * Search Console + the sitemap.
 *
 *   node tools/indexnow-submit.js
 *
 * The URL list is read from the freshly built dist/sitemap.xml (the single
 * source of truth for what is public), and ownership is proven by the fixed
 * key file that build.js writes at the domain root from site.config.json's
 * "indexNowKey". Run this AFTER a successful deploy, so both the key file and
 * the submitted pages are already live — tools/deploy.sh does exactly that.
 *
 * Exit 0 = accepted (or nothing to do). Exit 1 = the submission failed and was
 * NOT silently swallowed. Requires only Node >= 18 (built-in fetch). No packages.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE = (CONFIG.baseUrl || '').replace(/\/$/, '');
const KEY = CONFIG.indexNowKey;
const ENDPOINT = 'https://api.indexnow.org/indexnow'; // shared endpoint; fans out to all participants

if (!KEY) {
  console.log('IndexNow: no "indexNowKey" in site.config.json — nothing to submit, skipping.');
  process.exit(0);
}
if (!BASE) {
  console.error('IndexNow: site.config.json has no baseUrl.');
  process.exit(1);
}

const sitemapPath = path.join(ROOT, 'dist', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('IndexNow: dist/sitemap.xml not found — run `node build.js` first.');
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim()).filter(Boolean);
if (!urlList.length) {
  console.error('IndexNow: no <loc> entries found in dist/sitemap.xml.');
  process.exit(1);
}

const host = new URL(BASE).host;
const body = {
  host,
  key: KEY,
  keyLocation: `${BASE}/${KEY}.txt`,
  urlList
};

(async () => {
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.error(`IndexNow: request failed to reach ${ENDPOINT} — ${e.message}`);
    process.exit(1);
  }
  const text = (await res.text()).slice(0, 500);
  // IndexNow returns 200 (OK) or 202 (Accepted, pending validation) on success.
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow: submitted ${urlList.length} URLs for ${host} → HTTP ${res.status} (accepted).`);
    process.exit(0);
  }
  console.error(`IndexNow: submission REJECTED → HTTP ${res.status} ${res.statusText}\n${text}`);
  console.error('  422 = key/host mismatch or a URL outside the host; 403 = key file not reachable at keyLocation.');
  process.exit(1);
})();
