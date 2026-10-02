import { readFile, readdir, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchBrowser } from './browser.mjs';

// The supplied Design Components export needs support.js, which is not in the handoff.
// Open the original, then resolve only the hero's data bindings for a browser preview.
const source = await readFile('design/Marea Village.dc.html', 'utf8');
const days = JSON.parse(await readFile('data/programma.json', 'utf8')).giorni;
const url = process.env.TEST_URL || 'http://127.0.0.1:4174/marea-village/';
const css = (await readdir('build/_app/immutable/assets')).find((name) => /^0\..+\.css$/.test(name));
const cssSource = await readFile(`build/_app/immutable/assets/${css}`, 'utf8');
const fonts = (cssSource.match(/@font-face\{[^}]+\}/g) || []).join('\n').replace(/url\(([^)]+)\)/g, (_, path) => `url(${url}_app/immutable/assets/${path.replace(/^['"]|['"]$/g, '').replace(/^\.\//, '')})`);
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await page.goto(pathToFileURL(resolve('design/Marea Village.dc.html')).href, { waitUntil: 'domcontentloaded' });
  let body = source.slice(source.indexOf('<nav '), source.indexOf('</header>') + 9);
  body = body.replace(/<sc-for list="\{\{ heroDays \}\}"[^>]*>([\s\S]*?)<\/sc-for>/, (_, template) =>
    days.map((day) => template.replace(/\{\{ d.short \}\}/g, day.short).replace(/\{\{ d.num \}\}/g, String(day.num)).replace(/onClick="[^"]+"/g, '')).join(''));
  body = body.replaceAll('assets/marea-logo.png', `${url}marea-logo.png`);
  const layers = [
    [70, 46, '#2A7FD6', 190], [80, 40, '#0A55B5', 150],
    [70, 34, '#073D8B', 110], [40, 22, '#D7141A', 56]
  ];
  const waves = layers.map(([y, amp, fill, height]) => `<svg viewBox="0 0 2880 ${height}" preserveAspectRatio="none" style="position:absolute;left:0;bottom:0;width:200%;height:${height}px"><path d="M0 ${y} Q360 ${y-amp} 720 ${y} T1440 ${y} T2160 ${y} T2880 ${y} V${height} H0Z" fill="${fill}" /></svg>`).join('');
  body = body.replace('{{ heroWaves }}', `<div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:190px;overflow:hidden">${waves}</div>`);
  const styles = source.match(/<style>([\s\S]*?)<\/style>/)[1];
  // Keep the preview on the asset origin so self-hosted font requests pass CORS.
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.setContent(`<html lang="it"><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${fonts}${styles}</style></head><body>${body}</body></html>`);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((image) => image.decode())); });
  await mkdir('.impeccable/review', { recursive: true });
  await page.screenshot({ path: '.impeccable/review/reference-hero.png' });
  console.log('Original design opened; inline-style hero preview saved to .impeccable/review/reference-hero.png.');
} finally {
  await browser.close();
}
