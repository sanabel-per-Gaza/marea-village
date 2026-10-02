# Verifica finale

Revisione visuale eseguita nella stessa sessione: questo ambiente non offre un revisore separato. Riferimento: `design/Marea Village.dc.html`; screenshot completi in `docs/screenshots/`.

## persistence

Pass: sorgenti SvelteKit, contenuti JSON, token CSS, font locali, lockfile Bun, workflow Pages, README, favicon e immagine Open Graph presenti. La build produce HTML statico in `build/`.

L'export originale richiede `support.js`, non fornito. È stato aperto nel browser; l'hero è stato confrontato tramite un'anteprima che conserva gli stili inline originali e risolve i binding dei giorni.

## fidelity

| Elemento | Esito | Evidenza |
| --- | --- | --- |
| TYPE | Match | Barlow e Barlow Condensed nei pesi richiesti, self-hosted. |
| MATERIAL | Match | Logo e illustrazione forniti; geometria SVG originale della mappa. |
| GROUND | Match | Palette e fondi blu/crema definiti nel brief. |
| Hero e navigazione | Match / adattamento responsive | Logo con ombra, date, quattro giorni, due CTA, navigazione scorrevole su mobile. |
| Programma e mostre | Match | Tutti i testi del JSON, filtri, concerti in blocco blu, stato vuoto. |
| Manifesto | Match / adattamento AA | Testi integrali e accordion; corallo su blu schiarito per garantire contrasto. |
| Mappa | Match / adattamento touch | viewBox 1272×1096 e posizioni originali; controlli HTML da 44×44 px sui marker. |
| Sanabel e footer | Match | Illustrazione caricata e testi originali visibili nelle catture finali. |

Il rosso sole originale sul blu scuro ha rapporto 2,73:1. Solo il testo grande su quel fondo usa `--accento-su-blu: #FF6656`; il token originale resta invariato.

## ceiling

Le animazioni native del riferimento sono presenti: quattro strati di onde e marquee, entrambi fermi con `prefers-reduced-motion`. Sono verificati focus, navigazione dei tab con frecce/Home/End, accordion e mappa da tastiera.

Il detector segnala il bordo blu a sinistra dei relatori. È mantenuto perché esplicitamente richiesto dal brief e presente nel riferimento, non introdotto come decorazione generica.

## material_fixes

Nessun intervento materiale residuo emerso nella verifica finale. Le posizioni della mappa restano dichiaratamente provvisorie; contatti, social, donazione e indirizzo sono vuoti e non visualizzati.

## keep

Preservare testi forniti, identità da manifesto, tipografia condensed, ombre piene e geometria della mappa.

## Test eseguiti

- `bun run check`: 0 errori, 0 warning.
- `bun run test`: 6 test, 18 asserzioni.
- Playwright + axe: **360, 390, 768, 1024, 1440 px**, nessun overflow, errore client, asset mancante o violazione WCAG AA rilevata.
- Tutti i controlli misurati hanno target almeno 44×44 px.
- Verificati tab, filtro vuoto, accordion, chip e marker della mappa.
- Verificato “Adesso” dopo hydration con orologio simulato al 10 ottobre 2026, 17:00 a Roma, mentre il browser usa il fuso New York.
- Verificato che la scelta manuale non venga sovrascritta dal timer.
- HTML prerenderizzato leggibile senza JavaScript e privo di badge temporali obsoleti.
- JSON-LD valido con quattro Event; favicon, OG 1200×630 e canonical con base path di Pages.

### Lighthouse locale

| Profilo | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 99 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Report in `docs/audits/`. Misurazione sulla build statica servita con compressione gzip; i punteggi in produzione possono variare. Il profilo desktop usa la configurazione ufficiale desktop di Lighthouse, non il throttling mobile.

**Esito:** ship, limitatamente alle evidenze e ai controlli sopra elencati.
