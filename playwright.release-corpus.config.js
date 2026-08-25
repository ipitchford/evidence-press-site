module.exports = {
  testDir: './tests',
  testMatch: ['release-corpus.spec.js', 'article-corpus.spec.js'],
  timeout: 120000,
  workers: 1,
  use: { headless: true, channel: 'chrome' }
};
