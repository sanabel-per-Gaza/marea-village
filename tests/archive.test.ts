import { describe, expect, test } from 'bun:test';
import archivio from '../src/lib/data/archivio-2026.json';

describe('archivio 2026', () => {
  test('includes the supplied press folder and all seven web/social sources', () => {
    expect(archivio.rassegnaStampa).toBe('https://drive.google.com/drive/folders/1qMjMfwj-fUOaX64d6TgyDb1X2N3ekxkQ?usp=sharing');
    expect(archivio.rassegnaWeb).toHaveLength(7);
    expect(new Set(archivio.rassegnaWeb.map((item) => item.url)).size).toBe(7);
    const hosts = archivio.rassegnaWeb.map((item) => new URL(item.url).hostname);
    expect(hosts.filter((host) => host === 'www.ansa.it')).toHaveLength(3);
    expect(hosts.filter((host) => host === 'www.instagram.com')).toHaveLength(2);
    expect(hosts.filter((host) => host === 'www.facebook.com')).toHaveLength(2);
    for (const item of archivio.rassegnaWeb) {
      expect(new URL(item.url).protocol).toBe('https:');
      expect(item.titolo.trim()).not.toBe('');
      expect(item.fonte.trim()).not.toBe('');
    }
  });
  test('does not invent the missing gallery', () => {
    expect(archivio.galleria).toEqual({ albumUrl: '', foto: [] });
  });
});
