# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

SvelteKit con `@sveltejs/adapter-static`, contenuti JSON, CSS nei componenti e font Barlow self-hosted. Pubblicazione prevista su GitHub Pages.

## Users

Persone interessate a partecipare a MAREA Village, soprattutto da mobile durante la pianificazione o la permanenza al festival. Devono capire rapidamente identità, date, programma, luoghi e finalità dell'evento.

## Product Purpose

Sito ufficiale statico di MAREA Village, festival di arte, cultura e politica previsto dall'8 all'11 ottobre 2026 all'ex base NATO di Bagnoli, Napoli. Il successo consiste nel rendere programma e orientamento nel villaggio immediatamente accessibili e nel comunicare manifesto, mostre, Sanabel e adesioni senza riscrivere i contenuti forniti.

## Positioning

Un festival costruito dai comitati di Bagnoli e dai movimenti sociali napoletani che unisce arte, cultura, politica e solidarietà in un'area sottratta alla funzione militare.

## Operating Context

Pagina unica a sezioni con navigazione ad ancore. Il programma si consulta per giorno e categoria; durante il festival segnala il giorno corrente e le attività in corso nel fuso Europe/Rome. La mappa collega luoghi e attività del giorno selezionato.

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
- `static/marea-logo.png` e `static/boat.png`: asset pubblicabili.
- Non sono disponibili contatti, link social, link donazione o indirizzo esatto verificati.

## Product Principles

- Il programma viene prima: consultabile in pochi tocchi e sempre leggibile.
- L'identità politica e culturale resta esplicita, senza neutralizzazioni.
- La mappa deve orientare, non decorare.
- Ogni contenuto proviene dai dati forniti ed è aggiornabile senza toccare il layout.
- L'esperienza resta accessibile e stabile su mobile, anche con movimento ridotto.

## Accessibility & Inclusion

Contrasto AA, focus visibile, controlli da almeno 44 px, semantica corretta per tab e accordion, testi alternativi, supporto `prefers-reduced-motion`.
