import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser } from './browser.mjs';

const contents = JSON.parse(await readFile(new URL('../src/lib/data/contenuti.json', import.meta.url), 'utf8'));
const contactLinks = [...Object.entries(contents.contatti ?? {}), ...Object.entries(contents.social ?? {})].filter(([, value]) => value.trim());
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
    const pdfLink = page.getByRole('link', { name: 'Scarica il programma · PDF', exact: true });
    await expect(pdfLink).toHaveAttribute('download', 'PROGRAMMA MAREA VILLAGE.pdf');
    await expect(pdfLink).toHaveAttribute('href', new URL('programma-marea-village.pdf', url).pathname);
    if (width === 1440) {
      const [download] = await Promise.all([page.waitForEvent('download'), pdfLink.click()]);
      // PDF viewers may prefer the URL filename over the download attribute.
      expect(['PROGRAMMA MAREA VILLAGE.pdf', 'programma-marea-village.pdf']).toContain(download.suggestedFilename());
      expect(await download.failure()).toBeNull();
      const downloaded = await readFile(await download.path());
      const original = await readFile(new URL('../static/programma-marea-village.pdf', import.meta.url));
      expect(downloaded.equals(original)).toBe(true);
    }
    const rows = await page.getByRole('tab').evaluateAll((tabs) => tabs.map((tab) => Math.round(tab.getBoundingClientRect().y)));
    expect(Math.max(...rows) - Math.min(...rows)).toBeLessThanOrEqual(4);
    const targets = await page.locator('button, .button, .hero-days a, .nav-links a, .contact-grid a').evaluateAll((els) =>
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
    if (width === 390 || width === 1440) {
      await page.locator('.nav-links a[href="#programma"]').click();
      await page.screenshot({ path: `${out}/program-${width}.png`, animations: 'disabled' });
    }

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
    await expect(page.locator('#program-panel').getByText('Greta Thunberg', { exact: true })).toBeVisible();
    await expect(page.locator('#program-panel').getByText('Luca Persico ‘O Zulù', { exact: true })).toBeVisible();
    const morningDebate = page.locator('.event-row').filter({ has: page.getByRole('heading', { name: 'Napoli e il Sud: gli effetti della crisi', exact: true }) });
    const afternoonDebate = page.locator('.event-row').filter({ has: page.getByRole('heading', { name: 'Contro militarismo e genocidio, per un manifesto di resistenza e libertà nel Mediterraneo', exact: true }) });
    await expect(morningDebate).not.toContainText('Handala Ali');
    await expect(afternoonDebate.getByText('Handala Ali', { exact: true })).toBeVisible();
    await expect(page.locator('.live-event .event-lines')).toHaveText('with Jules I & Dub Harp');

    const art = page.getByRole('button', { name: 'A Arte', exact: true });
    await art.click();
    await expect(art).toHaveAttribute('aria-expanded', 'true');
    if (contents.posizioniConfermate) {
      await expect(page.locator('.map-overlay')).toHaveCount(0);
      await page.getByRole('button', { name: 'Seleziona 2, Area L, destra' }).click();
      await expect(page.locator('.place-card h3')).toHaveText('Area L · destra');
      await expect(page.locator('.place-events > div')).toHaveCount(3);
      await page.locator('.place-chips button').nth(3).click();
      await expect(page.locator('.place-card h3')).toHaveText('Teatro · edificio G (SAP)');
      await expect(page.locator('.place-events > div')).toHaveCount(1);
    } else {
      await expect(page.getByRole('heading', { name: 'Mappa in definizione', exact: true })).toBeVisible();
      await expect(page.locator('.map-content')).toHaveAttribute('inert', '');
      await expect(page.locator('.place-column')).toHaveAttribute('inert', '');
      await expect(page.locator('.map-content')).toHaveAttribute('aria-hidden', 'true');
      await expect(page.locator('.place-column')).toHaveAttribute('aria-hidden', 'true');
      await expect(page.locator('.pin-target:disabled')).toHaveCount(8);
      await expect(page.locator('.place-chips button:disabled')).toHaveCount(8);
      await expect(page.getByRole('button', { name: 'Seleziona 2, Area L, destra' })).toHaveCount(0);
      await page.locator('.nav-links a[href="#villaggio"]').click();
      await page.locator('.map-overlay').click({ position: { x: 20, y: 20 } });
      await expect(page.locator('.place-card h3')).toHaveText('Palco');
      await page.locator('.pin-target').first().evaluate((button) => button.focus());
      expect(await page.locator('.map-content, .place-column').evaluateAll((areas) =>
        areas.some((area) => area.contains(document.activeElement)))).toBe(false);
    }
    if (width === 390 || width === 1440) {
      await page.locator('.nav-links a[href="#villaggio"]').click();
      await page.screenshot({ path: `${out}/map-${width}.png`, animations: 'disabled' });
    }

    await expect(page.locator('.contact-grid')).toHaveCount(contactLinks.length ? 1 : 0);
    for (const [label, href] of contactLinks) {
      await expect(page.locator('.contact-grid').getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
    }
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
  await expect(noJsPage.getByRole('link', { name: 'Scarica il programma · PDF', exact: true }))
    .toHaveAttribute('download', 'PROGRAMMA MAREA VILLAGE.pdf');
  if (!contents.posizioniConfermate) {
    await expect(noJsPage.getByRole('heading', { name: 'Mappa in definizione', exact: true })).toBeVisible();
    await expect(noJsPage.locator('.pin-target:disabled')).toHaveCount(8);
    await expect(noJsPage.locator('.place-chips button:disabled')).toHaveCount(8);
  }
  await noJs.close();
} finally {
  await browser.close();
  await writeFile(`${out}/verification.json`, JSON.stringify({ reports: reports.sort((a,b) => a.width-b.width), errors }, null, 2));
}
console.log(JSON.stringify({ reports, errors }, null, 2));
expect(errors).toEqual([]);
expect(reports.flatMap((r) => r.violations)).toEqual([]);
console.log('Responsive, interaction, hydration and accessibility checks passed.');
