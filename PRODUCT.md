# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

SvelteKit con `@sveltejs/adapter-static`, contenuti JSON, CSS nei componenti e font Barlow self-hosted. Pubblicazione prevista su GitHub Pages.

## Users

Persone interessate a MAREA Village, soprattutto da mobile. Devono conoscere identità e finalità del festival, ritrovare il programma e i materiali dell’edizione 2026 e raggiungere lo spazio dedicato al 2027.

## Product Purpose

Sito ufficiale statico di MAREA Village, festival di arte, cultura e politica a Bagnoli, Napoli. La home presenta identità, manifesto e informazioni; l’archivio conserva l’edizione dell’8–11 ottobre 2026 all’ex base NATO, con programma e materiali; lo spazio 2027 è in allestimento, senza date o programma confermati. I testi forniti vanno preservati.

## Positioning

Un festival costruito dai comitati di Bagnoli e dai movimenti sociali napoletani che unisce arte, cultura, politica e solidarietà in un'area sottratta alla funzione militare.

## Operating Context

Tre pagine prerenderizzate: `/`, `/marea-village-2026/` e `/marea-village-2027/`. La home mantiene Manifesto e Info, la foto proposta e l’accesso alle edizioni. L’archivio raccoglie l’album pubblico Google Photos, rassegna stampa, sette link web/social e tutti i contenuti preesistenti. Il programma resta consultabile per giorno e categoria; la funzione temporale è attiva soltanto durante le date 2026 nel fuso Europe/Rome. La mappa rimane dichiaratamente provvisoria.

## Capabilities and Constraints

- Output completamente statico e prerenderizzato.
- I dati del programma e i contenuti editoriali risiedono in JSON.
- Supporto GitHub Pages con base path configurabile.
- Testi forniti da preservare alla lettera.
- Campi vuoti per social, donazioni, contatti e indirizzo non devono generare UI.
- Posizioni della mappa ancora da confermare.
- Nessuna affermazione, contatto o indirizzo può essere inventato.

## Brand Commitments

Nome MAREA Village, logo e illustrazione Sanabel forniti. Il riferimento visivo definitivo è `design/Marea Village.dc.html`; palette, tipografia, ombre piene, onde e tono grafico vanno preservati.

## Evidence on Hand

- `design/Marea Village.dc.html`: riferimento visivo e funzionale.
- `src/lib/data/programma.json`: date, categorie, eventi e mostre.
- `src/lib/data/contenuti.json`: manifesto, luoghi, stand e adesioni.
- `src/lib/data/archivio-2026.json`: album Google Photos e link della rassegna forniti.
- `static/marea-logo.png` e `static/boat.png`: asset pubblicabili.
- `design/marea-home-original.jpg`: foto proposta, pubblicata in WebP responsive nella home.
- Contatto verificato: `info@mareavillage.it`. I profili social ufficiali, il link donazione e l’indirizzo esatto non sono ancora disponibili; i post della rassegna non sono profili ufficiali.
- Dominio GitHub Pages configurato e verificato: `mareavillage.it`, con `static/CNAME`.

## Product Principles

- Separare identità corrente e archivio delle edizioni; il programma 2026 resta consultabile in pochi tocchi e sempre leggibile.
- L'identità politica e culturale resta esplicita, senza neutralizzazioni.
- La mappa deve orientare, non decorare.
- Ogni contenuto proviene dai dati forniti ed è aggiornabile senza toccare il layout.
- L'esperienza resta accessibile e stabile su mobile, anche con movimento ridotto.

## Accessibility & Inclusion

Contrasto AA, focus visibile, controlli da almeno 44 px, semantica corretta per tab e accordion, testi alternativi, supporto `prefers-reduced-motion`.
