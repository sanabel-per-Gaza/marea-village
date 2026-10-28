# Verifica home e archivio

Questa verifica riguarda la separazione in tre pagine; `docs/REVIEW.md` e i report Lighthouse già versionati descrivono il sito precedente. Lighthouse non è stato rieseguito.

## Contenuti

- Home: foto proposta da Mauro scaricata dalla condivisione Google Photos e pubblicata localmente in WebP responsive, manifesto integrale condiviso, Info, collegamenti alle due edizioni.
- Archivio 2026: programma e PDF, mostre, manifesto, villaggio, Sanabel e adesioni preservati. Aggiunti cartella stampa Google Drive e tutti i sette link web/social forniti.
- Pagina 2027: “Spazio in allestimento”, senza inventare date, programma o luogo della nuova edizione.
- I link ai profili ufficiali e la galleria restano in attesa dei materiali: nessun post della rassegna è spacciato per profilo ufficiale, nessuna immagine è usata come galleria senza conferma.

## Verifiche eseguite

- `bun run check`: zero errori e warning.
- `bun test`: 10 test, 61 asserzioni.
- Build statica con `BASE_PATH=/marea-village` e con base vuota.
- Playwright e axe sulle tre pagine a 360, 390, 768, 1024 e 1440 px, in entrambe le configurazioni.
- Nessun overflow orizzontale, errore client, asset mancante o violazione WCAG A/AA rilevata.
- Target controllati di almeno 44×44 px; corretto il link “Info” nella nuova navigazione.
- Navigazione interna, frammenti, canonical, pagina 2027 e foto locale verificati.
- Test preesistenti di programma, PDF scaricato, filtri, tastiera, mappa provvisoria e hydration mantenuti sull’archivio.
- Home e archivio leggibili anche senza JavaScript.
- Ispezione visiva desktop/mobile delle tre pagine su screenshot della build; immagini e report della sessione prodotti in `/tmp/marea-review/` e `/tmp/marea-review-root/` (non versionati).

## Detector grafico

Eseguito una volta sui componenti e sulle pagine modificati. L’unico warning non consultivo riguarda il bordo dei relatori già presente nel riferimento originale: resta invariato come documentato in `docs/REVIEW.md`. Gli avvisi consultivi sui colori e sulla scala tipografica riflettono l’identità esistente e la documentazione del sistema grafico, non errori di contrasto rilevati da axe.

## Limiti

- Servono URL dei profili social ufficiali e foto o album della quattro giorni per completare quei due punti.
- Gli URL esterni sono quelli ricevuti: disponibilità e richieste di accesso dipendono da ANSA, Google Drive, Instagram e Facebook.
- Nessun push o deploy eseguito.
