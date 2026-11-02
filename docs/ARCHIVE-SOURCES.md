# Materiali MAREA Village 2026

## Rassegna stampa locale

Fonte fornita: https://drive.google.com/drive/folders/1qMjMfwj-fUOaX64d6TgyDb1X2N3ekxkQ

Sono stati scaricati tutti i cinque PDF. Alcuni contengono intere edizioni dei giornali: il sito pubblica solo le pagine relative a MAREA Village e alla visita di Greta Thunberg, senza tagliare le pagine né riscrivere gli articoli. Si conservano anche i richiami di prima pagina. La raccolta unificata contiene le stesse dieci pagine dei cinque estratti.

| File originale | Pagine incluse |
| --- | --- |
| Corriere_del_Mezzogiorno_Campania_10_Ottobre_2026.pdf | 1, 3 |
| Il_Fatto_Quotidiano_11_Ottobre_2026.pdf | 4 |
| Il_Mattino_Napoli_-_11_Ottobre_2026.pdf | 21, 24 |
| la_Repubblica_Napoli_-_11_Ottobre_2026.pdf | 26, 43, 45 |
| marea 2026 corrmezz.pdf | 1, 2 (testo completo dell’articolo; escluse le pagine successive con commenti, pubblicità e navigazione del sito) |

I numeri indicano la posizione fisica nel PDF originale, non la numerazione stampata sul giornale. Date e testate riprendono i nomi dei file ricevuti; il quinto articolo riporta l’11 ottobre 2026 nel suo URL.

File pubblicati in `static/rassegna-2026/`. Identificativi Drive, SHA-256 degli originali, dimensioni e pagine sono registrati in `src/lib/data/archivio-2026.json`. L’estrazione conserva testo, immagini e impaginazione delle pagine selezionate; non è una rasterizzazione. I file originali completi non sono versionati nel repository.

Generazione eseguita con `pypdf` installato temporaneamente fuori dal progetto, senza aggiungere dipendenze runtime. I PDF sono serviti dal sito, senza collegamenti Drive nell’interfaccia.

## Selezione fotografica e slideshow

Otto fotografie scelte dall’album pubblico fornito: pubblico, incontri, discussioni, installazione e iniziative all’aperto. Le didascalie descrivono ciò che si vede, senza attribuire date o autori non confermati. Ogni voce in `galleria.foto` conserva il collegamento alla foto originale su Google Photos. L’album è parziale e questo è dichiarato nell’interfaccia.

Sono servite copie locali WebP a 480 e 960 px, senza richieste a Google per le immagini dello slideshow. Le foto non vengono tagliate: il riquadro le contiene per intero.

**Piano del movimento:** la sequenza fotografica è l’unico movimento aggiunto. Riquadro stabile e contatore mantengono la continuità; precedente, successiva e pausa danno il controllo. Cadenza di 6 secondi, solo a riquadro visibile e scheda attiva. Hover sospende temporaneamente; focus o navigazione manuale fermano la riproduzione fino a un nuovo avvio esplicito. La preferenza di movimento ridotto disabilita l’avvio automatico, senza rimuovere i controlli. Si precarica solo la foto successiva. Non si aggiungono librerie di animazione.

**Foto home:** il file attualmente usato misura 2048×921 px. Nessuna sostituzione finché non viene fornito l’originale nuovo; non serve ricreare artificialmente il cielo.

## Adesioni

L’elenco conserva le adesioni precedenti e integra quelle della mail, eliminando il duplicato “Acqua pubblica” e unificando le varianti evidenti “Corto Circuito Flegreo” / “CortoCircuito Flegreo” e “Medicina Democratica” / “Medicina democratica”. Nomi differenti non sono stati accorpati per supposizione. Totale: 40.

## Verifiche di questa modifica

- Svelte: zero errori e warning; 13 test unitari, 206 asserzioni.
- Suite browser sulle tre pagine a 360, 390, 768, 1024 e 1440 px, più reflow a 320 px e testo al 200%.
- Nessun overflow, errore client, file mancante o violazione axe A/AA rilevata.
- Slideshow verificato con cambio manuale e ciclico, avvio/pausa, focus da tastiera, movimento ridotto, avvio automatico solo in vista, sospensione fuori schermo, cambiamento della preferenza di movimento e recupero dopo immagine non disponibile.
- Test con tap touch sintetico: avvio e avanzamento senza richiedere un secondo tap fuori dal riquadro. La pausa hover è limitata al mouse, non al touch.
- Prima foto, link all’album, PDF e 40 adesioni disponibili anche senza JavaScript.
- PDF verificati come file completi, con dimensioni corrispondenti ai dati e rendering delle dieci pagine; tutti gli otto WebP e i loro derivati sono presenti.
- Build sia alla radice sia con base `/marea-village`; slideshow e file locali verificati anche con il prefisso.
- Ispezione desktop/mobile della sezione e delle pagine PDF. Impeccable sui due componenti: zero warning, sei avvisi consultivi su valori già coerenti con il sistema.
