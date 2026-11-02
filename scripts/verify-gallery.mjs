import { mkdir, readFile } from 'node:fs/promises';
import { expect } from '@playwright/test';
import { launchBrowser } from './browser.mjs';

const data = JSON.parse(await readFile(new URL('../src/lib/data/archivio-2026.json', import.meta.url), 'utf8'));
const homeUrl = process.env.TEST_URL || 'http://127.0.0.1:4174/marea-village/';
const url = new URL('marea-village-2026/', homeUrl).href;
const out = process.env.SCREENSHOT_DIR || 'docs/screenshots';
await mkdir(out, { recursive: true });
const browser = await launchBrowser();
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.clock.install({ time: new Date('2026-11-02T10:00:00Z') });
    await page.goto(url, { waitUntil: 'networkidle' });
    const gallery = page.getByRole('region', { name: 'Selezione foto di MAREA Village 2026', exact: true });
    const figure = gallery.locator('figure');
    const image = gallery.locator('img');
    const loaded = () => expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    await gallery.scrollIntoViewIfNeeded();
    await loaded();
    await expect(gallery.getByRole('button', { name: 'Avvia slideshow', exact: true })).toBeVisible();
    await expect(figure).toHaveAttribute('aria-label', `Foto 1 di ${data.galleria.foto.length}`);
    await page.clock.runFor(13000);
    await expect(figure).toHaveAttribute('aria-label', `Foto 1 di ${data.galleria.foto.length}`);

    await gallery.getByRole('button', { name: 'Precedente', exact: true }).click();
    await expect(figure).toHaveAttribute('aria-label', `Foto ${data.galleria.foto.length} di ${data.galleria.foto.length}`);
    await gallery.getByRole('button', { name: 'Successiva', exact: true }).click();
    await expect(figure).toHaveAttribute('aria-label', `Foto 1 di ${data.galleria.foto.length}`);
    await gallery.getByRole('button', { name: 'Successiva', exact: true }).click();
    await loaded();
    await gallery.getByRole('button', { name: 'Avvia slideshow', exact: true }).click();
    await page.mouse.move(1, 1);
    await page.clock.runFor(6100);
    await expect(figure).toHaveAttribute('aria-label', `Foto 3 di ${data.galleria.foto.length}`);
    await loaded();

    await gallery.getByRole('button', { name: 'Pausa slideshow', exact: true }).click();
    await page.mouse.move(1, 1);
    await page.clock.runFor(13000);
    await expect(figure).toHaveAttribute('aria-label', `Foto 3 di ${data.galleria.foto.length}`);

    await gallery.getByRole('button', { name: 'Avvia slideshow', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(150);
    const offscreen = await figure.getAttribute('aria-label');
    await page.clock.runFor(13000);
    await expect(figure).toHaveAttribute('aria-label', offscreen);
    await gallery.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.clock.runFor(6100);
    await expect(figure).not.toHaveAttribute('aria-label', offscreen);
    await gallery.getByRole('button', { name: 'Successiva', exact: true }).focus();
    await expect(gallery.getByRole('button', { name: 'Avvia slideshow', exact: true })).toBeVisible();
    const focused = await figure.getAttribute('aria-label');
    await page.clock.runFor(13000);
    await expect(figure).toHaveAttribute('aria-label', focused);

    for (const photo of data.galleria.foto) {
      const response = await page.request.get(new URL(photo.src.slice(1), homeUrl).href);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('image/webp');
    }
    for (const doc of data.rassegnaStampa) {
      const response = await page.request.get(new URL(doc.src.slice(1), homeUrl).href);
      expect(response.ok()).toBe(true);
      expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
    }
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#materiali').scrollIntoViewIfNeeded();
    await loaded();
    await page.locator('#materiali').screenshot({ path: `${out}/materials-${width}.png`, animations: 'disabled', style: '.site-nav { visibility: hidden; }' });
    await context.close();
  }

  const automatic = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const autoPage = await automatic.newPage();
  await autoPage.clock.install({ time: new Date('2026-11-02T10:00:00Z') });
  await autoPage.goto(url, { waitUntil: 'networkidle' });
  await autoPage.clock.runFor(13000);
  await expect(autoPage.locator('.slideshow figure')).toHaveAttribute('aria-label', `Foto 1 di ${data.galleria.foto.length}`);
  await autoPage.locator('.slideshow').scrollIntoViewIfNeeded();
  // IntersectionObserver is delivered on the render cycle, outside the simulated timer queue.
  await autoPage.waitForTimeout(150);
  await expect.poll(() => autoPage.locator('.slideshow img').evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  await autoPage.clock.runFor(6100);
  await expect(autoPage.locator('.slideshow figure')).toHaveAttribute('aria-label', `Foto 2 di ${data.galleria.foto.length}`);
  await autoPage.emulateMedia({ reducedMotion: 'reduce' });
  await expect(autoPage.getByRole('button', { name: 'Avvia slideshow', exact: true })).toBeVisible();
  const afterPreference = await autoPage.locator('.slideshow figure').getAttribute('aria-label');
  await autoPage.clock.runFor(13000);
  await expect(autoPage.locator('.slideshow figure')).toHaveAttribute('aria-label', afterPreference);
  await automatic.close();

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const touchPage = await touch.newPage();
  await touchPage.clock.install({ time: new Date('2026-11-02T10:00:00Z') });
  await touchPage.goto(url, { waitUntil: 'networkidle' });
  await touchPage.locator('.slideshow').scrollIntoViewIfNeeded();
  await expect.poll(() => touchPage.locator('.slideshow img').evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  await touchPage.getByRole('button', { name: 'Avvia slideshow', exact: true }).tap();
  await touchPage.clock.runFor(6100);
  await expect(touchPage.locator('.slideshow figure')).toHaveAttribute('aria-label', `Foto 2 di ${data.galleria.foto.length}`);
  await touch.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const page = await noJs.newPage();
  await page.goto(url);
  await page.locator('#galleria').scrollIntoViewIfNeeded();
  await expect(page.locator('#galleria img')).toBeVisible();
  await expect(page.locator('.slideshow-controls')).toHaveCount(0);
  await expect(page.locator('#galleria .album-link')).toHaveAttribute('href', data.galleria.albumUrl);
  await expect(page.locator('.supporters span')).toHaveCount(40);
  await noJs.close();

  const failure = await browser.newContext({ reducedMotion: 'reduce' });
  await failure.route('**/galleria-2026/02-*', (route) => route.abort());
  const errorPage = await failure.newPage();
  await errorPage.goto(url, { waitUntil: 'networkidle' });
  await errorPage.locator('.slideshow').scrollIntoViewIfNeeded();
  await errorPage.getByRole('button', { name: 'Successiva', exact: true }).click();
  await expect(errorPage.locator('.image-error')).toBeVisible();
  await errorPage.getByRole('button', { name: 'Successiva', exact: true }).click();
  await expect(errorPage.locator('.image-error')).toHaveCount(0);
  await expect.poll(() => errorPage.locator('.slideshow img').evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  await failure.close();
} finally {
  await browser.close();
}
console.log('Slideshow: manual controls, autoplay, pause, reduced motion, offscreen pause, focus, no-JS and image recovery passed.');
