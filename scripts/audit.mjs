import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { launch } from 'chrome-launcher';
import { executablePath } from './browser.mjs';

const url = process.env.TEST_URL || 'http://127.0.0.1:4174/marea-village/';
await mkdir('docs/audits', { recursive: true });
const chrome = await launch({
  chromePath: executablePath,
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
});
try {
  for (const formFactor of ['mobile', 'desktop']) {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: ['html', 'json'],
      logLevel: 'error',
      ...(formFactor === 'desktop' ? {
        preset: 'desktop',
        formFactor: 'desktop',
        screenEmulation: { mobile: false, width: 1440, height: 1000, deviceScaleFactor: 1, disabled: false }
      } : {})
    }, formFactor === 'desktop' ? desktopConfig : undefined);
    await writeFile(`docs/audits/${formFactor}.html`, result.report[0]);
    await writeFile(`docs/audits/${formFactor}.json`, result.report[1]);
    console.log(formFactor, Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])));
    const failed = Object.entries(result.lhr.audits).filter(([, a]) => a.score !== null && a.score < 1 && a.details);
    console.log('Findings:', failed.map(([key, a]) => ({ key, score: a.score, display: a.displayValue, details: Array.isArray(a.details.items) ? a.details.items.slice(0, 3) : undefined })));
  }
} finally {
  await chrome.kill();
}
