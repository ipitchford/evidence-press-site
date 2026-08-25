const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const slugs = fs.readdirSync(path.join(root, 'papers'))
  .filter(slug => fs.existsSync(path.join(root, 'papers', slug, 'meta.json')))
  .sort();

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 }
]) {
  test(`all releases satisfy the browser contract at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.route('**/*', route => {
      const request = route.request();
      const url = new URL(request.url());
      if (request.resourceType() === 'media' || !['127.0.0.1', 'localhost'].includes(url.hostname)) return route.abort();
      return route.continue();
    });
    const failures = [];

    for (const slug of slugs) {
      const pageErrors = [];
      const onPageError = error => pageErrors.push(String(error));
      page.on('pageerror', onPageError);
      const response = await page.goto(`http://127.0.0.1:8080/releases/${slug}/`, { waitUntil: 'load' });
      const images = page.locator('img');
      for (let index = 0; index < await images.count(); index += 1) await images.nth(index).scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () => [...document.images].every(image => image.complete),
        undefined,
        { timeout: 10000 }
      );
      const result = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
        return {
          overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
          h1Count: document.querySelectorAll('h1').length,
          duplicateIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
          audioCount: document.querySelectorAll('audio').length,
          briefingCount: document.querySelectorAll('.briefings').length,
          katexErrors: document.querySelectorAll('.katex-error').length,
          failedImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
          nonPrivateYoutube: [...document.querySelectorAll('iframe')].map(frame => frame.src)
            .filter(src => /youtube\.com/.test(src) && !/youtube-nocookie\.com/.test(src))
        };
      });
      const problems = [];
      if (!response || response.status() !== 200) problems.push(`HTTP ${response && response.status()}`);
      if (result.h1Count !== 1) problems.push(`${result.h1Count} H1 elements`);
      if (result.duplicateIds.length) problems.push(`duplicate IDs: ${result.duplicateIds.join(', ')}`);
      if (result.overflow > 1) problems.push(`${result.overflow}px horizontal overflow`);
      if (result.audioCount !== 1 || result.briefingCount !== 1)
        problems.push(`audio=${result.audioCount}, briefing=${result.briefingCount}`);
      if (result.katexErrors) problems.push(`${result.katexErrors} KaTeX errors`);
      if (result.failedImages.length) problems.push(`failed images: ${result.failedImages.join(', ')}`);
      if (result.nonPrivateYoutube.length) problems.push(`non-private YouTube embeds: ${result.nonPrivateYoutube.join(', ')}`);
      if (pageErrors.length) problems.push(`page errors: ${pageErrors.join(' | ')}`);
      if (problems.length) failures.push(`${slug}: ${problems.join('; ')}`);
      page.off('pageerror', onPageError);
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });
}
