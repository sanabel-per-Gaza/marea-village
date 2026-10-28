import { mkdir, writeFile } from 'node:fs/promises';
import { expect } from '@playwright/test';
import { launchBrowser } from './browser.mjs';

const url = process.env.TEST_URL || 'http://127.0.0.1:4174/marea-village/';
const out = process.env.SCREENSHOT_DIR || 'docs/screenshots';
await mkdir(out, { recursive: true });
const browser = await launchBrowser();
const reports = [];
const errors = [];

function luminance(rgb) {
  const values = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return values.reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrast(first, second) {
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));

  for (const route of ['', 'marea-village-2026/', 'marea-village-2027/']) {
    await page.goto(new URL(route, url).href, { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    const focus = await page.locator(':focus-visible').evaluate((element) => {
      const style = getComputedStyle(element);
      return { outline: style.outlineColor, outlineStyle: style.outlineStyle, shadow: style.boxShadow };
    });
    expect(focus.outlineStyle).toBe('solid');
    const shadowColor = focus.shadow.match(/rgba?\([^)]+\)/)?.[0];
    expect(shadowColor).toBeTruthy();
    const ratio = contrast(focus.outline, shadowColor);
    expect(ratio).toBeGreaterThanOrEqual(3);
    const controls = route === '' ? ['.hero-actions .button-red', '.edition-link', '.accordion button']
      : route === 'marea-village-2026/' ? ['.hero-actions .button-red', '.day-tabs button.active', '.accordion button']
      : ['main .links a'];
    for (const selector of controls) {
      const control = page.locator(selector).first();
      await control.focus();
      await expect(control).toBeFocused();
      await expect.poll(() => control.evaluate((element) => getComputedStyle(element).boxShadow)).toBe(focus.shadow);
    }

    // 320 CSS px exercises reflow at the equivalent width of a 1280px viewport at 400% zoom.
    await page.setViewportSize({ width: 320, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${route || 'home'} at 320px`).toBe(false);
    // Increase only text sizing: browser zoom and physical-device rendering remain separate checks.
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${route || 'home'} with 200% text`).toBe(false);
    if (!route) {
      const singleLineYears = await page.locator('.edition-link h3').evaluateAll((headings) => headings.every((heading) =>
        heading.getBoundingClientRect().height <= parseFloat(getComputedStyle(heading).fontSize) * 1.1
      ));
      expect(singleLineYears).toBe(true);
    }
    reports.push({ route: route || 'home', focusContrast: Number(ratio.toFixed(2)), reflow320: true, text200Percent: true });
    await page.setViewportSize({ width: 390, height: 844 });
  }

  await page.goto(new URL('marea-village-2026/', url).href, { waitUntil: 'networkidle' });
  const motion = await page.locator('.wave, .marquee-track').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).animationName));
  expect(motion.every((name) => name === 'none')).toBe(true);
  await page.getByRole('tab', { name: 'Sab 10' }).click();
  expect(await page.getByRole('tab', { name: 'Sab 10' }).evaluate((element) => getComputedStyle(element).transform)).toBe('none');
  expect(await page.locator('.event-row').first().evaluate((element) => getComputedStyle(element).transitionProperty)).toBe('background');
  expect(await page.locator('.event-row').first().evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0.15s');
  await context.close();

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const touchPage = await touch.newPage();
  await touchPage.goto(new URL('marea-village-2026/', url).href, { waitUntil: 'networkidle' });
  await touchPage.getByRole('tab', { name: 'Sab 10' }).tap();
  await expect(touchPage.getByRole('tab', { name: 'Sab 10' })).toHaveAttribute('aria-selected', 'true');
  await touchPage.getByRole('button', { name: 'Assemblee', exact: true }).tap();
  await expect(touchPage.locator('.empty-message')).toBeVisible();

  // Exercise native horizontal scrolling of the filter strip with a synthesized touch drag.
  const strip = touchPage.locator('.category-filters');
  await strip.scrollIntoViewIfNeeded();
  await strip.evaluate((element) => { element.scrollLeft = 0; });
  const box = await strip.boundingBox();
  const cdp = await touch.newCDPSession(touchPage);
  const y = box.y + box.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width - 20, y }] });
  for (let index = 1; index <= 8; index++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.width - 20 - index * 30, y }] });
    await touchPage.waitForTimeout(20);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  expect(await strip.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await touchPage.getByRole('button', { name: 'Concerti / Live', exact: true }).tap();
  await expect(touchPage.locator('.live-event')).toHaveCount(1);
  reports.push({ synthesizedChromiumTouch: 'day selection, category selection and horizontal filter drag passed', physicalDevice: 'not tested' });
  await touch.close();
} finally {
  await browser.close();
  await writeFile(`${out}/accessibility-verification.json`, JSON.stringify({ reports, errors }, null, 2));
}
expect(errors).toEqual([]);
console.log(JSON.stringify(reports, null, 2));
console.log('Keyboard focus, reflow, reduced motion and synthesized touch checks passed.');
