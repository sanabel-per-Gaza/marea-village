# Audit e rifinitura — Impeccable 4.8

## Integrità dell’implementazione: PASS

Il sito conserva un sistema specifico e coerente: logo fornito, Barlow locale, campiture blu/crema, ombre strutturali e onde dell’archivio. Non è stato eseguito un redesign. `DESIGN.md` resta invariato; `.impeccable/design.json` è stato rigenerato con le estensioni e i componenti effettivi. `PRODUCT.md` ora descrive le tre pagine e i materiali ricevuti.

Revisione tecnica e visiva nella stessa sessione, senza revisore separato.

## Audit Health Score

| Dimensione | Punteggio | Evidenza |
| --- | ---: | --- |
| Accessibilità | 3/4 | axe senza violazioni; focus, tastiera, testo ingrandito e movimento ridotto verificati. Nessuna certificazione WCAG o prova con screen reader fisico. |
| Performance | 3/4 | Lighthouse 88 mobile, 99 desktop; immagini migliorabili su rete mobile lenta. |
| Theming | 3/4 | Palette intenzionale a tema unico; rimangono valori letterali dello stile originale. |
| Responsive | 4/4 | Cinque larghezze, reflow 320 px, testo 200%, tap e trascinamento touch sintetici. |
| Integrità | 4/4 | Identità e contenuti preservati; unico warning grafico verificato come intenzionale. |
| **Totale** | **17/20 — Good** | Nessun problema bloccante o maggiore residuo rilevato. |

## Difetti corretti

- **Focus da tastiera** — `src/app.css`: il precedente rosso sole aveva contrasto 1,54:1 sul blu e 2,73:1 sul blu scuro. Ora outline crema e anello navy hanno contrasto reciproco **14,08:1**; l’anello prevale sulle ombre di hover/selezione. Verificati logo, CTA, edizioni, accordion e tab.
- **Testo ingrandito** — `src/app.css` e `src/routes/+page.svelte`: parole lunghe possono andare a capo senza overflow; le colonne delle edizioni rispettano la larghezza dell’anno, che resta su una sola riga. Verificato anche testo al 200% in viewport da 320 px.
- **Movimento ridotto** — rimossa la disattivazione globale delle animazioni a 0,001 ms. Onde e marquee si fermano; CTA e tab non traslano. I feedback cromatici e d’ombra restano disponibili.
- **Configurazione pubblicazione** — `static/CNAME` rende esplicito il dominio `mareavillage.it`, già verificato nelle impostazioni GitHub Pages, e attiva la build alla radice prevista dal workflow.

## Rilievi residui

### [P2] Caricamento iniziale su mobile lento

- **Categoria:** Performance.
- **Posizione:** immagini della home in `static/marea-home-*.webp`, font locali importati da `src/app.css`.
- **Evidenza:** Lighthouse mobile simulato: FCP 2,4 s, LCP 3,5 s, CLS 0,05 e TBT 0 ms. Suggerisce circa 116 KiB di risparmio immagini e segnala CSS/font sul percorso critico.
- **Impatto:** attesa più lunga su reti lente; non blocca la consultazione.
- **Raccomandazione:** valutare ulteriore compressione o AVIF e preload mirati dei font dopo confronto visivo. Evitare caricamenti asincroni del CSS che lascino contenuto non stilizzato.
- **Comando suggerito:** `/impeccable optimize`, poi `/impeccable polish`.

**Residui rilevati:** P0 0, P1 0, P2 1, P3 0.

## Detector: risultati e limiti

Eseguito una volta su `src` con il motore aggiornato:

- **1 warning:** bordo blu dei relatori (`border-left: 3px solid var(--blu)`). Confermato nel riferimento originale, già giustificato in `docs/REVIEW.md`; non è un difetto introdotto in questa modifica.
- **96 avvisi consultivi:** 50 colori letterali e 46 dimensioni tipografiche non espresse nella scala ridotta del frontmatter. Sono separati dai difetti verificati: la loro presenza non dimostra contrasto insufficiente o incoerenza visiva. Non sono stati eliminati riscrivendo il riferimento o gonfiando i token solo per azzerare il detector.
- Contrasto e layout sono stati verificati anche sul render; il detector non sostituisce l’ispezione.

## Verifiche eseguite

- `bun run check`: zero errori e warning.
- `bun test`: 10 test, 62 asserzioni.
- Build statica sia con base `/marea-village`, sia alla radice per `https://mareavillage.it`.
- Suite finale sulla build alla radice: tre pagine a **360, 390, 768, 1024, 1440 px**; nessun errore client, asset mancante, overflow o violazione axe A/AA rilevata.
- Reflow a **320 px** e testo al **200%** sulle tre pagine; anni delle edizioni sempre su una riga.
- Test preesistenti: programma, PDF, filtri, tastiera, mappa provvisoria, hydration e assenza di JavaScript.
- Touch sintetico Chromium: scelta giorno/categoria, trascinamento orizzontale nativo dei filtri, scelta del filtro dopo lo scorrimento. Nessun dispositivo fisico o motore Safari/Firefox testato.
- Ispezione visiva desktop/mobile di home, archivio con album e pagina 2027. Catture di sessione in `/tmp/marea-impeccable-final/`, non versionate.
- Riepilogo macchina versionato: `docs/audits/impeccable-4.8.json`.

### Lighthouse sulla home

| Profilo | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 88 | 100 | 100 | 100 |
| Desktop | 99 | 100 | 100 | 100 |

Misurazione locale sulla build statica compressa, non promessa di punteggi in produzione. Report completi in `/tmp/marea-impeccable-lighthouse-final/`; `AUDIT_DIR` consente di riprodurli senza sovrascrivere gli audit storici.

## Da mantenere

- Testi, logo, foto proposta e identità originali.
- Album esterno chiaramente collegato, senza fingere una galleria importata.
- Stato 2027 “Spazio in allestimento”, senza date inventate.
- Nessun profilo social inventato: gli URL ufficiali restano da ricevere.
