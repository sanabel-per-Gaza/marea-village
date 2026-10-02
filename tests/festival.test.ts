import { describe, expect, test } from 'bun:test';
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
  test('map links activities to the correct places', () => {
    expect(eventsAtPlace(programma.eventi.gio, 'palco')[0].cat).toBe('live');
    expect(eventsAtPlace(programma.eventi.gio, 'areaL')).toHaveLength(2);
    expect(eventsAtPlace(programma.eventi.ven, 'stand').map((event) => event.title)).toEqual(['Colori e mani', 'Anche il Tatreez è Sumud']);
    expect(eventsAtPlace(programma.eventi.dom, 'palco')).toEqual([]);
  });
});
