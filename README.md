# MAREA Village

8–11 ottobre 2026 · ex base NATO · Bagnoli, Napoli.

**Sito:** https://sanabel-per-gaza.github.io/marea-village/

SvelteKit + Svelte 5 + adapter-static, CSS semplice, font Barlow self-hosted. Tutte le pagine sono prerenderizzate; i riferimenti grafici in `design/` non vengono inclusi nel sito pubblicato.

## Sviluppo con Bun

Richiede **Bun 1.3.14**; il lockfile versionato è `bun.lock`.

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun run test
bun run build
bun run preview
```

La build statica viene scritta in `build/`.

Per simulare GitHub Pages con il percorso del repository:

```sh
BASE_PATH=/marea-village \
PUBLIC_SITE_URL=https://sanabel-per-gaza.github.io/marea-village \
bun run build

bun scripts/serve.mjs
# http://127.0.0.1:4174/marea-village/
```

`BASE_PATH` è vuoto per un sito alla radice. `PUBLIC_SITE_URL` è l'URL completo del sito, incluso l'eventuale percorso, e serve per canonical, Open Graph e JSON-LD.

## Modificare il programma

Modificare **solo `src/lib/data/programma.json`**: giorni, categorie, eventi e mostre vengono importati dalla pagina. I file in `data/` conservano il materiale originale del passaggio di consegne e non sono la sorgente del sito.

Ogni evento comprende `cat`, `time` e, secondo il tipo, `title`, `lines`, `people`, `place` oppure `names` per i concerti. Gli eventi vengono ordinati automaticamente per orario. Anche i concerti possono avere `lines` per le informazioni aggiuntive.

Il programma è allineato a `PROGRAMMA MAREA VILLAGE-3.pdf` (aggiornamento del 7 ottobre 2026). Handala Ali partecipa al dibattito di sabato 10 ottobre delle 16:30–19:30, non all'incontro delle 10:00–12:00. Il PDF originale scaricabile è pubblicato in **`static/programma-marea-village.pdf`**; quando cambia il programma, aggiornare anche questo file. Il link nella sezione Programma supporta il base path di GitHub Pages.

Le descrizioni delle assemblee sono predisposte come array opzionale:

```json
"descrizione": [
  "Primo paragrafo.",
  "Secondo paragrafo."
]
```

Se presente e non vuoto, compare un approfondimento espandibile sotto l'evento. Non è necessario cambiare il componente.

La funzione **Adesso** viene calcolata dopo l'hydration nel fuso `Europe/Rome`, aggiornata ogni 30 secondi e attiva soltanto dall'8 all'11 ottobre 2026. Fuori dal festival il giorno iniziale è giovedì. La scelta manuale del giorno non viene sovrascritta dagli aggiornamenti dell'orologio. I concerti senza orario finale sono considerati in corso fino a mezzanotte.

## Altri contenuti e campi in arrivo

La sorgente è `src/lib/data/contenuti.json`:

- `social`: oggetto etichetta → URL, ad esempio `{"Instagram": "https://…"}`.
- `contatti`: oggetto etichetta → link, usando `mailto:` o `tel:` quando appropriato.
- `donazioneSanabel`: URL della donazione, oppure stringa vuota.
- `indirizzo`: indirizzo verificato, oppure stringa vuota.
- `posizioniConfermate`: `false` mostra la mappa attenuata con il layer “Mappa in definizione” e disabilita marker e controlli dei luoghi (anche da tastiera e per le tecnologie assistive); `true` rimuove il layer e riattiva la consultazione.
- Testi del manifesto, introduzione al villaggio, Sanabel, luoghi, stand e adesioni.

Oggetti vuoti e valori vuoti non generano link o sezioni. Non aggiungere contatti o posizioni non verificati. La geometria SVG è in `src/lib/components/VillageMap.svelte`.

## GitHub Pages

In **Settings → Pages → Source**, scegliere **GitHub Actions**.

Il workflow `.github/workflows/deploy.yml`:

1. installa con `bun install --frozen-lockfile`;
2. esegue controlli Svelte e test;
3. costruisce con `BASE_PATH=/${repository.name}`;
4. carica `build/` con `actions/upload-pages-artifact`;
5. pubblica con `actions/deploy-pages`.

Le PR eseguono controlli e build senza pubblicare. Il push su `main` pubblica il sito. Sono configurati i permessi `pages: write` e `id-token: write` per il job di deploy.

### Dominio personalizzato

1. Creare `static/CNAME` contenente soltanto il dominio, senza protocollo o percorso.
2. Configurare DNS e **Settings → Pages → Custom domain**.
3. La presenza di `static/CNAME` fa usare al workflow **`BASE_PATH=""`**; `configure-pages` fornisce l'URL del dominio personalizzato.
4. Per la build locale usare `BASE_PATH="" PUBLIC_SITE_URL=https://tuo-dominio.it bun run build`.

`static/.nojekyll` viene copiato nell'output.

## Verifiche e screenshot

`docs/screenshots/` contiene i render a **360, 390, 768, 1024 e 1440 px** e il report Playwright/axe. `docs/audits/` contiene i report Lighthouse mobile e desktop.

Per ripetere i controlli sul server statico avviato:

```sh
# Usa Brave se disponibile su macOS; altrimenti installa Chromium:
bunx playwright install chromium
bun run test:browser
bun run audit
```

Si può specificare un browser con `CHROME_PATH` e un sito con `TEST_URL`. I test verificano assenza di overflow, quattro tab sulla stessa riga, target di almeno 44 px, filtri, accordion, mappa, navigazione da tastiera, SEO e hydration con un orologio simulato nel fuso New York.

Open Graph (`static/og-marea.png`, 1200×630) è generato dall'hero:

```sh
# Con il server di sviluppo avviato:
bun scripts/generate-og.mjs
```

Gli asset originali sono conservati; la pagina serve versioni WebP responsive. Nessun font viene scaricato da Google a runtime.

## Note sul riferimento

L'export `design/Marea Village.dc.html` dipende da `support.js`, assente nel materiale fornito. `bun scripts/reference.mjs` apre l'originale e risolve soltanto i binding dell'hero per un'anteprima con gli stili inline originali. Non è codice del sito pubblicato.

Due adattamenti accessibili sono documentati in `docs/REVIEW.md`: controlli della mappa da 44 px e variante corallo su blu per rispettare il contrasto AA.
