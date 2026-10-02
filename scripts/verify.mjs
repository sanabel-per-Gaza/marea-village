import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser } from './browser.mjs';

const url = process.env.TEST_URL || 'http://127.0.0.1:4174/marea-village/';
const out = process.env.SCREENSHOT_DIR || 'docs/screenshots';
await mkdir(out, { recursive: true });
const browser = await launchBrowser();
const reports = [];
const errors = [];
try {
  await Promise.all([360, 390, 768, 1024, 1440].map(async (width) => {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 844 : 1000 },
      deviceScaleFactor: 1, reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push({ width, error: error.message }));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push({ width, status: response.status(), url: response.url() });
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
    await expect(page.getByRole('tab')).toHaveCount(4);
    const rows = await page.getByRole('tab').evaluateAll((tabs) => tabs.map((tab) => Math.round(tab.getBoundingClientRect().y)));
    expect(Math.max(...rows) - Math.min(...rows)).toBeLessThanOrEqual(4);
    const targets = await page.locator('button, .hero-days a, .hero-actions a, .nav-links a').evaluateAll((els) =>
      els.filter((el) => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44; })
        .map((el) => ({ text: el.getAttribute('aria-label') || el.textContent?.trim(), width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }))
    );
    expect(targets).toEqual([]);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    reports.push({ width, overflow, targets, violations: axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })) });

    const filename = width === 1440 ? 'desktop.png' : width === 390 ? 'mobile.png' : `width-${width}.png`;
    await page.locator('.boat-wrap img').evaluate(async (image) => { image.loading = 'eager'; await image.decode(); });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${filename}`, fullPage: true, animations: 'disabled' });

    await page.locator('.hero-days a').nth(2).click();
    await expect(page.getByRole('tab', { name: 'Sab 10' })).toHaveAttribute('aria-selected', 'true');
    await page.getByRole('button', { name: 'Assemblee', exact: true }).click();
    await expect(page.locator('.empty-message')).toBeVisible();
    await page.getByRole('tab', { name: 'Dom 11' }).click();
    await expect(page.locator('.event-copy h3')).toHaveText('Assemblea pubblica');
    await page.getByRole('button', { name: 'Tutto', exact: true }).click();
    await page.getByRole('tab', { name: 'Ven 9' }).click();
    await expect(page.locator('.event-row')).toHaveCount(8);
    await page.getByRole('tab', { name: 'Ven 9' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Sab 10' })).toBeFocused();

    const art = page.getByRole('button', { name: 'A Arte', exact: true });
    await art.click();
    await expect(art).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('button', { name: 'Seleziona 2, Area L, destra' }).click();
    await expect(page.locator('.place-card h3')).toHaveText('Area L · destra');
    await expect(page.locator('.place-events > div')).toHaveCount(3);
    await page.locator('.place-chips button').nth(3).click();
    await expect(page.locator('.place-card h3')).toHaveText('Teatro · edificio G (SAP)');
    await expect(page.locator('.place-events > div')).toHaveCount(1);

    await expect(page.locator('.contact-grid')).toHaveCount(0);
    const staticSeo = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(staticSeo)['@graph']).toHaveLength(4);
    await context.close();
  }));

  const context = await browser.newContext({ timezoneId: 'America/New_York', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.clock.install({ time: new Date('2026-10-10T15:00:00Z') });
  await page.goto(url, { waitUntil: 'networkidle' });
  await expect(page.getByRole('tab', { name: 'Sab 10' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.now-summary')).toHaveText('Adesso al villaggio · Sabato 17:00');
  await expect(page.locator('.now-badge')).toHaveCount(3);
  await page.locator('.hero-days a').first().click();
  await page.clock.runFor(31_000);
  await expect(page.getByRole('tab', { name: 'Gio 8' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.now-badge')).toHaveCount(0);
  await context.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(url);
  await expect(noJsPage.getByText('Guerra e libertà di informazione', { exact: true })).toBeVisible();
  await expect(noJsPage.locator('.now-summary')).toHaveCount(0);
  await noJs.close();
} finally {
  await browser.close();
  await writeFile(`${out}/verification.json`, JSON.stringify({ reports: reports.sort((a,b) => a.width-b.width), errors }, null, 2));
}
console.log(JSON.stringify({ reports, errors }, null, 2));
expect(errors).toEqual([]);
expect(reports.flatMap((r) => r.violations)).toEqual([]);
console.log('Responsive, interaction, hydration and accessibility checks passed.');
