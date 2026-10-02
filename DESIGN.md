---
name: MAREA Village
description: Identità da manifesto popolare, fedele al riferimento fornito
colors:
  blu: "#0164C6"
  blu-scuro: "#073D8B"
  navy: "#0B1A73"
  rosso: "#D7141A"
  rosso-sole: "#FC311D"
  accento-su-blu: "#FF6656"
  crema: "#FAF9EE"
  linea: "#D3E1F4"
  rosa: "#FFB9B5"
  verde-prato: "#BFDDB0"
  suolo: "#EFEBDA"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(3rem, 7vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.9
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  square: "0"
  chip: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.rosso}"
    textColor: "#FFFFFF"
    rounded: "{rounded.square}"
    padding: "15px 26px"
  button-secondary:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.blu-scuro}"
    rounded: "{rounded.square}"
    padding: "15px 26px"
---

# Design System: MAREA Village

## Overview

Il file `design/Marea Village.dc.html` è il riferimento definitivo. L'interfaccia usa un linguaggio da manifesto popolare: colori saturi piatti, tipografia condensed maiuscola, bordi netti, ombre rosse/blu a pieno offset e onde come transizioni di sezione.

## Colors

- Blu: `#0164C6`
- Blu scuro: `#073D8B`
- Navy: `#0B1A73`
- Rosso: `#D7141A`
- Rosso sole: `#FC311D`
- Crema: `#FAF9EE`
- Linea: `#D3E1F4`
- Rosa: `#FFB9B5`
- Verde prato: `#BFDDB0`
- Suolo: `#EFEBDA`
- Accento su blu: `#FF6656`, variante accessibile del rosso sole per testo grande sul blu scuro. La palette originale resta invariata negli altri usi.

## Typography

Barlow per testo corrente, pesi 400/500/600. Barlow Condensed 600/700/800 per etichette, controlli e titoli. I titoli principali sono maiuscoli, molto compatti e con ombra piena rossa.

## Layout

Contenitore massimo 1240 px. Sezioni ampie e verticali; programma e manifesto sono i passaggi più densi. I tab giorno restano sempre in quattro colonne. La mappa precede scheda e chip su mobile.

## Elevation & Depth

Ombre piene strutturali, derivate dal manifesto fornito: titoli 5px 5px rossi, CTA 5px 5px blu scuro o rossi, mappa 8px 8px rossi. Nessun effetto glass o gradiente.

## Shapes

Superfici e CTA rettangolari. Filtri con raggio pillola; marker numerati circolari. Onde SVG come transizioni fra campiture.

## Components

Un movimento continuo di marea lega hero e marquee. Tab, filtri, accordion e mappa hanno stati attivi ad alto contrasto. Con movimento ridotto, animazioni e smooth scrolling vengono disabilitati.

## Do's and Don'ts

- **Do** mantenere i quattro tab giorno nella stessa riga e i target da almeno 44 px.
- **Do** usare il corallo accessibile per il testo su blu scuro.
- **Do** preservare logo, illustrazione e geometria della mappa forniti.
- **Don't** introdurre font remoti, librerie UI o riscritture editoriali.
- **Don't** mostrare campi vuoti o presentare la mappa come confermata prima della verifica.
