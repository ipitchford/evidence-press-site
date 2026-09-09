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
      if (article.renderMode === 'generated') {
        const bannerState = await page.evaluate(() => {
          const figure = document.querySelector('.article-banner');
          const image = figure && figure.querySelector('img');
          const heading = document.querySelector('h1');
          const rect = image && image.getBoundingClientRect();
          const graph = [...document.querySelectorAll('script[type="application/ld+json"]')]
            .flatMap(script => JSON.parse(script.textContent)['@graph'] || []);
          const node = graph.find(item => item['@type'] === 'Article');
          return {
            count: document.querySelectorAll('.article-banner').length,
            src: image && image.getAttribute('src'), alt: image && image.alt,
            caption: figure && figure.querySelector('figcaption')?.textContent,
            eager: image && image.loading === 'eager',
            loaded: image && image.complete && image.naturalWidth > 0,
            beforeHeading: figure && Boolean(figure.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING),
            ratio: rect && rect.width / rect.height,
            ogImage: document.querySelector('meta[property="og:image"]')?.content,
            twitterImage: document.querySelector('meta[name="twitter:image"]')?.content,
            twitterCard: document.querySelector('meta[name="twitter:card"]')?.content,
            jsonldImage: node && node.image,
            author: node && node.author,
            creditText: node && node.creditText
          };
        });
        if (article.banner) {
          const expectedImage = 'https://evidencepress.org' + article.banner.src;
          if (bannerState.count !== 1 || bannerState.src !== article.banner.src) problems.push('missing or wrong banner');
          if (bannerState.alt !== article.banner.alt || bannerState.caption !== article.banner.caption) problems.push('banner descriptions changed');
          if (!bannerState.eager || !bannerState.loaded || !bannerState.beforeHeading) problems.push('banner loading or placement incorrect');
          if (Math.abs(bannerState.ratio - (viewport.name === 'mobile' ? 16 / 9 : 3)) > 0.02) problems.push('banner aspect ratio incorrect');
          if ([bannerState.ogImage, bannerState.twitterImage, bannerState.jsonldImage].some(url => url !== expectedImage)) problems.push('banner metadata image mismatch');
          if (bannerState.twitterCard !== 'summary_large_image') problems.push('banner missing large social card');
        } else if (bannerState.count || bannerState.ogImage || bannerState.twitterImage || bannerState.jsonldImage || bannerState.twitterCard !== 'summary') {
          problems.push('no-banner article behaviour changed');
        }
        if (article.bylineType === 'ai-systems' && (bannerState.author || bannerState.creditText !== article.byline)) problems.push('AI byline misrepresented in structured metadata');
        const audioState = await page.evaluate(() => {
          const section = document.querySelector('.article-audio');
          const player = section && section.querySelector('audio');
          return { count: document.querySelectorAll('.article-audio audio').length,
            src: player && player.getAttribute('src'), controls: player && player.controls,
            autoplay: player && player.autoplay, text: section && section.textContent,
            links: section ? [...section.querySelectorAll('a')].map(a => a.getAttribute('href')) : [] };
        });
        if (article.audio) {
          if (audioState.count !== 1 || audioState.src !== article.audio.src || !audioState.controls || audioState.autoplay)
            problems.push('article audio missing, duplicated or lacks manual controls');
          if (!audioState.text.includes(article.audio.voiceLabel) || !audioState.links.includes(article.audio.transcript) || !audioState.links.includes(article.audio.provenance))
            problems.push('article audio lacks disclosure, transcript or provenance');
        } else if (audioState.count) problems.push('unexpected article audio');
      }
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
