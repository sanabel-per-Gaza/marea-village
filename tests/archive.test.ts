import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import archivio from '../src/lib/data/archivio-2026.json';

describe('archivio 2026', () => {
  test('preserves the press source and all seven web/social sources', () => {
    expect(archivio.fonteRassegnaStampa).toBe('https://drive.google.com/drive/folders/1qMjMfwj-fUOaX64d6TgyDb1X2N3ekxkQ');
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
  test('press PDFs are local, complete files with source references', () => {
    expect(archivio.rassegnaStampa).toHaveLength(5);
    for (const doc of [...archivio.rassegnaStampa, archivio.raccoltaStampa]) {
      expect(doc.src.startsWith('/rassegna-2026/')).toBe(true);
      const bytes = readFileSync(new URL('../static' + doc.src, import.meta.url));
      expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
      expect(bytes.subarray(-100).toString()).toContain('%%EOF');
      expect(bytes.length).toBe(doc.bytes);
    }
    expect(archivio.raccoltaStampa.pagine).toBe(archivio.rassegnaStampa.reduce((total, doc) => total + doc.pagineOriginali.length, 0));
    for (const doc of archivio.rassegnaStampa) {
      expect(doc.sha256Originale).toMatch(/^[a-f0-9]{64}$/);
      expect(new URL(doc.fonte).hostname).toBe('drive.google.com');
    }
  });
  test('gallery accepts only a verified album or described local photos', () => {
    if (archivio.galleria.albumUrl) {
      expect(new URL(archivio.galleria.albumUrl).protocol).toBe('https:');
    }
    const photos = archivio.galleria.foto as { src: string; alt: string; width: number; height: number }[];
    for (const photo of photos) {
      expect(photo.src.startsWith('/') && !photo.src.startsWith('//')).toBe(true);
      expect(photo.alt.trim()).not.toBe('');
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    }
  });
});
