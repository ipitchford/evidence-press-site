const { test, expect } = require('@playwright/test');
for (const width of [390, 768, 1440]) {
  test('homepage banners retain their full native frame at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto((process.env.EP_TEST_ORIGIN || 'http://127.0.0.1:8080') + '/', { waitUntil: 'load' });
    const images = page.locator('.card-art img');
    expect(await images.count()).toBeGreaterThan(8);
    for (let i = 0; i < 9; i++) {
      await images.nth(i).scrollIntoViewIfNeeded();
      await expect(images.nth(i)).toHaveJSProperty('complete', true);
    }
    const measure = () => page.locator('.card-art img').evaluateAll(nodes => nodes.slice(0, 9).map(img => {
      const r = img.getBoundingClientRect(), frame = img.parentElement.getBoundingClientRect();
      return { loaded: img.naturalWidth > 0, ratioError: Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight),
        widthGap: Math.abs(frame.width - r.width), heightGap: Math.abs(frame.height - r.height) };
    }));
    for (const item of await measure()) {
      expect(item.loaded).toBe(true);
      expect(item.ratioError).toBeLessThan(.02);
      expect(item.widthGap).toBeLessThan(1);
      expect(item.heightGap).toBeLessThan(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThan(2);
    // Reproduce the original six-to-one frame: this must be detected.
    await page.addStyleTag({ content: '.cards .card:first-child .card-art { aspect-ratio:6/1!important; }' });
    expect((await measure())[0].heightGap).toBeGreaterThan(10);
  });
}
