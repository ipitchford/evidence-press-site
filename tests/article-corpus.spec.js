const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { loadArticles } = require('../tools/articles');

const root = path.resolve(__dirname, '..');
const releaseSlugs = fs.readdirSync(path.join(root, 'papers')).filter(name => !name.startsWith('_'));
const articles = loadArticles(root, { releaseSlugs });

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 }
]) {
  test(`all articles satisfy the communication-layer browser contract at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (!['127.0.0.1', 'localhost'].includes(url.hostname)) return route.abort();
      return route.continue();
    });
    const failures = [];
    for (const article of articles) {
      const pageErrors = [];
      const onPageError = error => pageErrors.push(String(error));
      page.on('pageerror', onPageError);
      const response = await page.goto(`http://127.0.0.1:8080${article.canonicalPath}`, { waitUntil: 'load' });
      const result = await page.evaluate(() => ({
        h1Count: document.querySelectorAll('h1').length,
        overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        boundaryCount: document.querySelectorAll('.article-boundary').length,
        articleRecordLinks: [...document.querySelectorAll('a')].filter(link => /article\.json$/.test(link.href)).length,
        editLinks: [...document.querySelectorAll('a')].filter(link => link.href.includes('github.com/') && link.href.includes('/edit/main/')).length
      }));
      const problems = [];
      if (!response || response.status() !== 200) problems.push(`HTTP ${response && response.status()}`);
      if (result.h1Count !== 1) problems.push(`${result.h1Count} H1 elements`);
      if (result.overflow > 1) problems.push(`${result.overflow}px horizontal overflow`);
      if (result.boundaryCount !== 1) problems.push(`${result.boundaryCount} publication boundaries`);
      if (result.articleRecordLinks < 1) problems.push('no article.json link');
      if (result.editLinks < 2) problems.push(`${result.editLinks} GitHub edit links`);
      if (pageErrors.length) problems.push(`page errors: ${pageErrors.join(' | ')}`);
      if (problems.length) failures.push(`${article.slug}: ${problems.join('; ')}`);
      page.off('pageerror', onPageError);
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });

  test(`article index filters without horizontal overflow at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('http://127.0.0.1:8080/articles/', { waitUntil: 'load' });
    await page.locator('#article-filter').fill('not-a-real-topic');
    await expect(page.locator('.article-card:visible')).toHaveCount(0);
    await expect(page.locator('.filter-status')).toContainText('No articles match');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
