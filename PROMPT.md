# Prompt per l'agente — sito MAREA Village

Copia tutto quello che segue nell'agente (es. Claude Code), dopo aver messo questa cartella `handoff/` nella root di un repo vuoto.

---

Costruisci il sito statico del festival **MAREA Village** (8–11 ottobre 2026, ex base NATO, Bagnoli, Napoli) e pubblicalo su **GitHub Pages**.

## Materiale nella cartella `handoff/`
- `design/Marea Village.dc.html` — **riferimento visivo e funzionale definitivo**. Aprilo nel browser. Ricrea layout, spaziature, colori, tipografia, ombre e interazioni il più fedelmente possibile. Gli stili sono tutti inline: estraili in CSS pulito.
- `data/programma.json` — giorni, categorie, eventi per giorno, mostre.
- `data/contenuti.json` — manifesto ("Siamo…", acronimo M.A.R.E.A.), luoghi della mappa, stand, adesioni.
- `static/marea-logo.png` (logo bianco trasparente), `static/boat.png` (illustrazione Sanabel).
- `design/locandina.jpeg`, `design/riferimento-aereo.png` — solo riferimento, non pubblicare.

Tutti i testi vanno riportati **alla lettera**: non riscriverli.

## Stack
- **SvelteKit + `@sveltejs/adapter-static`**, tutto prerenderizzato (`export const prerender = true`), output HTML statico.
- CSS semplice nei componenti Svelte più un `app.css` con le variabili. Niente Tailwind né librerie UI.
- Font self-hosted con `@fontsource/barlow` (400, 500, 600) e `@fontsource/barlow-condensed` (600, 700, 800). Niente Google Fonts runtime.
- Contenuti importati dai JSON in `src/lib/data/`. Per aggiornare il programma si modifica solo il JSON.
- JS lato client solo dove serve: tab giorni, filtro categorie, accordion manifesto, mappa interattiva, marquee/onde.

## Token di design
```
--blu: #0164C6;  --blu-scuro: #073D8B;  --navy: #0B1A73;
--rosso: #D7141A;  --rosso-sole: #FC311D;  --crema: #FAF9EE;
--linea: #D3E1F4;  --rosa: #FFB9B5;  --verde-prato: #BFDDB0;  --suolo: #EFEBDA;
Titoli: Barlow Condensed 800, maiuscolo, ombra piena "5px 5px 0 var(--rosso)"
Testo: Barlow 400/500, 17–20px, line-height 1.45–1.55
```

## Struttura (pagina unica, ancore)
1. **Nav** sticky blu scuro: logo + link (Programma, Mostre, Manifesto, Il villaggio, Sanabel, Info). Su mobile i link vanno su una seconda riga scorrevole in orizzontale.
2. **Hero** a tutto schermo, blu: logo con drop-shadow rossa, "8—11", "Ottobre 2026", 4 box giorno (cliccando selezionano quel giorno nel programma e scrollano lì), luogo, 2 CTA. In fondo 4 strati di onde SVG animate (translateX loop).
3. **Marquee** rosso: Mediterraneo · Arte · Resistenza · Ecologia · Azione · La marea avanza… tuffati!
4. **Programma**: 4 tab giorno (sempre 4 colonne, anche a 360px), chip categoria, lista eventi (orario in tag rosso, categoria, titolo, righe, relatori con bordo blu, luogo). I concerti stanno in un blocco blu a tutta larghezza. Messaggio se il filtro non trova nulla.
   - **"Adesso"**: con fuso `Europe/Rome`, durante l'8–11 ottobre 2026 il tab di default è il giorno corrente, gli eventi in corso hanno il badge "ADESSO" e vicino al titolo compare "Adesso al villaggio · Giorno HH:MM". Va calcolato **lato client** dopo l'hydration, perché la pagina è prerenderizzata.
5. **Mostre** (tutti i giorni).
6. **Manifesto** su blu scuro, con bordi superiore e inferiore a onda: intro, lista "Siamo…", claim, accordion M-A-R-E-A (il primo aperto).
7. **Il villaggio**: testo sul palco + **mappa SVG interattiva** (copia la geometria dal file di design, viewBox 0 0 1272 1096) con 8 luoghi numerati. Il click su mappa o chip seleziona il luogo, e la scheda mostra descrizione e attività del giorno selezionato. Ordine: mappa → scheda → chip. Badge "posizioni da confermare" finché le posizioni non sono confermate. Sotto, la lista degli stand 0–9.
8. **Sanabel**: blocco rosso + illustrazione.
9. **Info + Adesioni** su blu, con bordo superiore a onda; footer con logo.

## Requisiti
- Responsive verificato a 360, 390, 768, 1024 e 1440px. Niente scroll orizzontale, target touch ≥ 44px.
- `prefers-reduced-motion`: onde e marquee ferme, niente smooth scroll.
- Accessibilità: tab con `role="tab"`/`aria-selected`, accordion con `aria-expanded`, focus visibile, alt corretti, contrasto AA.
- SEO: `<title>`, meta description, Open Graph (immagine 1200×630 generata dall'hero), `lang="it"`, JSON-LD `Event` con le 4 date e il luogo.
- Favicon dal logo.
- Lighthouse ≥ 95 su tutte le categorie.

## Deploy GitHub Pages
- `svelte.config.js`: `adapter-static` con `fallback: undefined` e `paths.base` = `process.env.BASE_PATH`, in modo che funzioni su `https://<utente>.github.io/<repo>/`. Usa `{base}` per link e asset.
- Aggiungi `static/.nojekyll`.
- Workflow `.github/workflows/deploy.yml`: push su `main` → `npm ci` → `npm run build` con `BASE_PATH=/${{ github.event.repository.name }}` → `actions/upload-pages-artifact` (cartella `build`) → `actions/deploy-pages`. Permessi `pages: write`, `id-token: write`.
- Nel README spiega: come attivare Pages (Settings → Pages → Source: GitHub Actions), come usare un dominio personalizzato (file `static/CNAME` e `BASE_PATH` vuoto), come modificare `programma.json`.

## Da lasciare predisposto (contenuti in arrivo)
- Testi delle **assemblee**: aggiungi agli eventi un campo opzionale `descrizione` (array di paragrafi) che si espande sotto l'evento.
- Link social, link donazione Sanabel, contatti, indirizzo esatto: campi in `contenuti.json`. Se sono vuoti, non mostrare nulla.
- Posizioni della mappa da confermare.

Quando hai finito, fai una build locale, controlla tutte le larghezze indicate e apri una PR con screenshot mobile e desktop.
