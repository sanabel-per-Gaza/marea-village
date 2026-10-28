import { mkdir, writeFile } from 'node:fs/promises';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser } from './browser.mjs';

const url = process.env.TEST_URL || 'http://127.0.0.1:4174/marea-village/';
const out = process.env.SCREENSHOT_DIR || 'docs/screenshots';
await mkdir(out, { recursive: true });
const browser = await launchBrowser();
const errors = [];
const reports = [];
try {
  await Promise.all([360, 390, 768, 1024, 1440].map(async (width) => {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 844 : 1000 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    for (const route of ['', 'marea-village-2027/']) {
      await page.goto(new URL(route, url).href, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      await expect(page.getByRole('tab')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(new URL(canonical).pathname).toBe(new URL(route, url).pathname);
      const targets = await page.locator('button, .hero-actions a, .nav-links a, .contact-grid a, .edition-link').evaluateAll((els) =>
        els.filter((el) => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44; })
          .map((el) => el.textContent.trim())
      );
      expect(targets).toEqual([]);
      if (route) {
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('MAREA Village 2027');
        await expect(page.getByText('Spazio in allestimento', { exact: true })).toBeVisible();
        await expect(page.locator('[aria-current="page"]')).toHaveText('Village 2027');
      } else {
        expect(await page.locator('.edition-link h3').evaluateAll((headings) => headings.every((heading) =>
          heading.getBoundingClientRect().height <= parseFloat(getComputedStyle(heading).fontSize) * 1.1
        ))).toBe(true);
        const photo = page.locator('.home-photo');
        await expect(photo).toHaveAttribute('fetchpriority', 'high');
        expect(await photo.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
        const photoUrl = await photo.evaluate((img) => img.currentSrc);
        expect(new URL(photoUrl).origin).toBe(new URL(url).origin);
        await expect(page.locator('#manifesto')).toBeAttached();
        await expect(page.locator('#info').getByRole('link', { name: 'info@mareavillage.it' })).toHaveAttribute('href', 'mailto:info@mareavillage.it');
        await expect(page.locator('#programma')).toHaveCount(0);
        const art = page.getByRole('button', { name: 'A Arte', exact: true });
        await art.click();
        await expect(art).toHaveAttribute('aria-expanded', 'true');
        await art.click();
        await expect(art).toHaveAttribute('aria-expanded', 'false');
      }
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      reports.push({ route: route || 'home', width, violations: axe.violations });
      // Every internal destination and fragment must resolve, including with a Pages base path.
      const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.href));
      for (const href of new Set(hrefs)) {
        const target = new URL(href);
        if (target.origin !== new URL(url).origin) continue;
        const response = await page.request.get(target.href);
        expect(response.ok(), target.href).toBe(true);
        if (target.hash) {
          const html = await response.text();
          expect(html).toContain(`id="${target.hash.slice(1)}"`);
        }
      }
      if (width === 390 || width === 1440) {
        await page.evaluate(() => scrollTo(0, 0));
        const name = route ? '2027' : 'home';
        await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: true, animations: 'disabled' });
      }
    }
    await context.close();
  }));
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const page = await noJs.newPage();
  await page.goto(url);
  await expect(page.locator('#manifesto')).toBeVisible();
  await expect(page.locator('.edition-link')).toHaveCount(2);
  await noJs.close();
} finally {
  await browser.close();
  await writeFile(`${out}/pages-verification.json`, JSON.stringify({ reports, errors }, null, 2));
}
expect(errors).toEqual([]);
expect(reports.flatMap((report) => report.violations)).toEqual([]);
console.log('Home and 2027: responsive, SEO, navigation, no-JS and accessibility checks passed.');
