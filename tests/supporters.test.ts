import { expect, test } from 'bun:test';
import contenuti from '../src/lib/data/contenuti.json';

test('adesioni 2026: elenco integrato senza troncare né duplicare i nomi', () => {
  const supplied = [
  "Acqua pubblica",
  "Associazione AllenaMenti Nonviolente",
  "Associazione Claudio Miccoli",
  "Associazione Culturale Vento del Monte Curvale",
  "Associazione Ricostruzione Democratica",
  "Associazione Sponda Sud",
  "Associazione Vita Attiva",
  "Associazione 9 maggio",
  "Casa del Popolo Villa Medusa",
  "Circoli di Salerno e Napoli della Associazione Nazionale di Amicizia Italia-Cuba",
  "Circolo Thomas Sankara - APS Presidente: Giovanni Grasso.",
  "Comitati flegrei impegnati sulla crisi bradisismica",
  "Comunità Palestinese della Campania",
  "Cooperativa sociale Dedalus",
  "CortoCircuito Flegreo",
  "Diritto all'abitare",
  "Giardino liberato di Materdei",
  "Global Sumud Campania",
  "Humanity InFocus",
  "Mare libero e gratuito Napoli",
  "Liberi Edizioni",
  "Medicina democratica",
  "Napoli non è in vendita",
  "Rete Antifascista 25 Aprile",
  "Rete No Coppa America",
  "Reti a difesa dei migranti",
  "Sezioni ANPI Napoli Orientale, Napoli Nord, Napoli Centro “Lenuccia”, Portici,Sant'Anastasia",
  "Sinistra Anticapitalista"
];
  for (const name of supplied) expect(contenuti.adesioni).toContain(name);
  expect(contenuti.adesioni).toContain('Mediterranea Saving Humans');
  expect(contenuti.adesioni).toContain('Sanabel');
  expect(contenuti.adesioni.some((name) => name.startsWith('e altre'))).toBe(false);
  const normalized = contenuti.adesioni.map((name) => name.toLocaleLowerCase('it').replace(/\s+/g, ''));
  expect(new Set(normalized).size).toBe(normalized.length);
});
