const { test, expect } = require('@playwright/test');

for (const width of [1440, 390]) {
  test(`Atlas search, state filters and anchors at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${process.env.ATLAS_TEST_BASE || 'http://127.0.0.1:8080'}/atlas/`);
    await expect(page.locator('#atlas-status')).toContainText('nodes and');
    const isolated = await page.evaluate(async () => {
      const g = await (await fetch('/api/research-graph.json')).json();
      const linked = new Set(g.edges.filter(e => e.source.startsWith('release:') && e.target.startsWith('release:')).flatMap(e => [e.source, e.target]));
      return g.nodes.find(n => n.type === 'release' && !linked.has(n.id))?.id;
    });
    if (isolated) {
      await page.locator('#atlas-search').fill(isolated);
      await expect(page.locator('#atlas-search-results button')).toHaveCount(1);
    }
    await page.locator('#atlas-search').fill('shuffle');
    await expect(page.locator('#atlas-search-results button').first()).toBeVisible();
    const title = await page.locator('#atlas-search-results button').first().textContent();
    await page.locator('#atlas-search-results button').first().click();
    await expect(page.locator('#atlas-inspector')).toContainText(title);
    await page.reload();
    await expect(page.locator('#atlas-search')).toHaveValue('shuffle');
    await page.locator('[data-atlas-mode="proposals"]').click();
    await page.locator('#atlas-proposal-state').selectOption('awaiting-review');
    const count = await page.evaluate(async () => (await (await fetch('/api/atlas-proposals.json')).json()).proposals.filter(p => p.currentState === 'awaiting-review').length);
    await expect(page.locator('[data-atlas-proposal-row]:visible')).toHaveCount(count);
    await page.reload();
    await expect(page.locator('#atlas-proposal-state')).toHaveValue('awaiting-review');
    await page.locator('#atlas-proposal-state').selectOption('all');
    expect(await page.locator('#atlas-graph').evaluate(svg => {
      const v = svg.viewBox.baseVal;
      return [...svg.querySelectorAll('.node-shape')].every(n => {
        const b = n.getBBox();
        return b.x >= v.x && b.y >= v.y && b.x + b.width <= v.x + v.width && b.y + b.height <= v.y + v.height;
      });
    })).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    expect(errors).toEqual([]);
  });
}
