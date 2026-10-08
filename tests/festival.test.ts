import { describe, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import programma from '../src/lib/data/programma.json';
import { eventsAtPlace, getRomeNow, isEventNow, parseRange, sortEvents } from '../src/lib/festival';

describe('Europe/Rome — Adesso', () => {
  test('outside the festival is inactive', () => {
    expect(getRomeNow(programma.giorni, new Date('2026-10-07T22:00:00+02:00'))).toBeNull();
    expect(getRomeNow(programma.giorni, new Date('2026-10-12T00:00:00+02:00'))).toBeNull();
    expect(getRomeNow(programma.giorni, new Date('2025-10-10T17:00:00+02:00'))).toBeNull();
  });
  test('uses Rome independently of the machine timezone', () => {
    expect(getRomeNow(programma.giorni, new Date('2026-10-10T15:00:00Z'))).toEqual({
      day: 'sab', minutes: 17 * 60, label: 'Sabato 17:00'
    });
    expect(getRomeNow(programma.giorni, new Date('2026-10-08T22:01:00Z'))?.day).toBe('ven');
  });
  test('start inclusive, end exclusive, no badge on other days', () => {
    const event = { cat: 'incontri', time: '16:30–19:30' };
    expect(isEventNow(event, 'sab', { day: 'sab', minutes: 990, label: '' })).toBe(true);
    expect(isEventNow(event, 'sab', { day: 'sab', minutes: 1170, label: '' })).toBe(false);
    expect(isEventNow(event, 'ven', { day: 'sab', minutes: 1020, label: '' })).toBe(false);
    expect(isEventNow(event, 'sab', null)).toBe(false);
  });
  test('concerts without end run until midnight', () => {
    expect(parseRange('dalle 20:30')).toEqual([1230, 1440]);
    expect(isEventNow({ cat: 'live', time: 'dalle 20:30' }, 'ven', { day: 'ven', minutes: 1260, label: '' })).toBe(true);
  });
});

describe('programme data and map', () => {
  test('four days and sorted events without mutating data', () => {
    expect(programma.giorni.map((day) => day.num)).toEqual([8, 9, 10, 11]);
    const input = [{ cat: 'incontri', time: '18:30–19:30' }, { cat: 'incontri', time: '09:00–10:00' }];
    expect(sortEvents(input)[0].time).toBe('09:00–10:00');
    expect(input[0].time).toBe('18:30–19:30');
  });
  test('matches the updated PDF programme', () => {
    expect(Object.values(programma.eventi).map((events) => events.length)).toEqual([4, 9, 9, 1]);
    expect(programma.eventi.gio.find((event) => event.title === 'Guerra e libertà di informazione')?.lines)
      .toContain('Conversazione con Romanetti e Marc Innaro');
    const cpr = programma.eventi.ven.find((event) => event.title === '“Nessun essere umano è illegale!”');
    expect(cpr?.people).toEqual([
      'Coordina Laura Marmorale (Mediterranea Saving Humans)',
      "Mimma D'Amico (Ex Canapificio, coordinatrice regionale No CPR)",
      'Lorenzo Figoni (Action Aid - da remoto)',
      'Francesca Viviani (avvocata, Rete Lucana No CPR)',
      'Faouzi (testimone resistente)',
      'don Pino Natale (parroco di San Laise)',
      'Pasquale Gallifuoco (vicepresidente regionale ACLI)',
      'Movimento Migranti e Rifugiati di Napoli',
      'Cooperativa Sociale Il Geco'
    ]);
    const crisi = programma.eventi.sab.find((event) => event.time === '10:00–12:00' && event.cat === 'incontri');
    expect(crisi?.people).toContain('Piero Castrataro (sindaco di Isernia)');
    expect(crisi?.people).toHaveLength(7);
    expect(crisi?.people?.some((person) => person.includes('Handala Ali'))).toBe(false);
    const mediterraneo = programma.eventi.sab.find((event) => event.time === '16:30–19:30');
    expect(mediterraneo?.people).toContain('Greta Thunberg');
    expect(mediterraneo?.people).toContain('Luca Persico ‘O Zulù');
    expect(mediterraneo?.people).toEqual([
      'Greta Thunberg',
      'Francesca Albanese',
      'Emiliano Brancaccio',
      'Luciana Castellina',
      'Luigi Daniele',
      'Luca Persico ‘O Zulù',
      'Handala Ali',
      'Intervengono realtà di base, reti e movimenti sociali'
    ]);
    expect(programma.eventi.ven.find((event) => event.cat === 'live')?.names).toEqual([
      'Priscilla Drag Artivist (monologo)',
      'Lino Vairetti (Osanna), Massimo Mollo e Omar Suleiman',
      'PS5',
      'Psyché'
    ]);
    const saturdayLive = programma.eventi.sab.find((event) => event.cat === 'live');
    expect(saturdayLive?.names).toEqual(['Bababoom Hi Fi Full Sound System']);
    expect(saturdayLive?.lines).toEqual(['with Jules I & Dub Harp']);
  });
  test('downloadable PDF is included in the static assets', async () => {
    const pdf = Bun.file(new URL('../static/programma-marea-village.pdf', import.meta.url));
    expect(await pdf.exists()).toBe(true);
    expect(pdf.size).toBe(1893040);
    expect(await pdf.slice(0, 5).text()).toBe('%PDF-');
    expect(createHash('sha256').update(await pdf.bytes()).digest('hex'))
      .toBe('9ee7c9b2d05781a6f41d6ee56a387cee37e9ac4c182e27cfde09be2db46281bc');
  });
  test('map links activities to the correct places', () => {
    expect(eventsAtPlace(programma.eventi.gio, 'palco')[0].cat).toBe('live');
    expect(eventsAtPlace(programma.eventi.gio, 'areaL')).toHaveLength(2);
    expect(eventsAtPlace(programma.eventi.ven, 'stand').map((event) => event.title)).toEqual(['Colori e mani', 'Anche il Tatreez è Sumud']);
    expect(eventsAtPlace(programma.eventi.dom, 'palco')).toEqual([]);
  });
});
