import { existsSync } from 'node:fs';
import { chromium } from '@playwright/test';

export const executablePath = process.env.CHROME_PATH ||
  (existsSync('/Applications/Brave Browser.app/Contents/MacOS/Brave Browser')
    ? '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
    : chromium.executablePath());

export function launchBrowser() {
  return chromium.launch({ executablePath, args: ['--no-sandbox'] });
}
