import { launchBrowser } from './browser.mjs';

const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.querySelectorAll('.hero img')) await image.decode();
  });
  await page.addStyleTag({ content: '.site-nav { display: none !important; } .hero { height: 630px !important; min-height: 630px !important; }' });
  await page.locator('.hero').screenshot({ path: 'static/og-marea.png', animations: 'disabled' });
  console.log('Generated static/og-marea.png (1200×630) from the hero.');
} finally {
  await browser.close();
}
