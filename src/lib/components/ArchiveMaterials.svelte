<script lang="ts">
  import { base } from '$app/paths';
  import archivio from '$lib/data/archivio-2026.json';

  import ArchiveSlideshow from '$lib/components/ArchiveSlideshow.svelte';
  import type { GalleryPhoto } from '$lib/gallery';

  const photos: GalleryPhoto[] = archivio.galleria.foto;

  function fileSize(bytes: number) {
    return `${(bytes / 1_000_000).toLocaleString('it-IT', { maximumFractionDigits: 1 })} MB`;
  }
</script>

<section id="materiali" class="materials" aria-labelledby="materiali-title">
  <div class="content">
    <h2 id="materiali-title">MAREA Village 2026<br /><span>Foto e rassegna</span></h2>

    <div class="materials-grid" class:with-gallery={photos.length || archivio.galleria.albumUrl}>
      {#if photos.length || archivio.galleria.albumUrl}
        <section id="galleria" aria-labelledby="galleria-title">
          <h3 id="galleria-title">La quattro giorni in foto</h3>
          {#if photos.length}<ArchiveSlideshow {photos} />{/if}
          <p class="gallery-note">Una selezione dall’album fotografico, ancora in aggiornamento.</p>
          {#if archivio.galleria.albumUrl}<a class="album-link" href={archivio.galleria.albumUrl}>Sfoglia l’album completo</a>{/if}
        </section>
      {/if}

      <section id="rassegna-stampa" aria-labelledby="stampa-title">
        <h3 id="stampa-title">Rassegna stampa</h3>
        <p>Le pagine dedicate a MAREA Village, dai giornali e dai materiali ricevuti.</p>
        <a class="press-link" href={`${base}${archivio.raccoltaStampa.src}`} download>Scarica la rassegna completa · PDF · {fileSize(archivio.raccoltaStampa.bytes)}</a>
        <ul class="press-list local-press">
          {#each archivio.rassegnaStampa as documento}
            <li>
              <a href={`${base}${documento.src}`}>
                <span class="source">PDF · {fileSize(documento.bytes)}</span>
                <span class="article-title">{documento.titolo}</span>
              </a>
            </li>
          {/each}
        </ul>
      </section>
    </div>

    <section id="rassegna-web" aria-labelledby="web-title">
      <h3 id="web-title">Rassegna web e social network</h3>
      <ul class="press-list">
        {#each archivio.rassegnaWeb as articolo}
          <li>
            <a href={articolo.url}>
              <span class="source">{articolo.fonte}</span>
              <span class="article-title">{articolo.titolo}</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  </div>
</section>

<style>
  .materials { padding: 4rem var(--gutter); }
  .content { width: min(100%, var(--content)); margin-inline: auto; }
  h2 { margin: 0 0 3rem; font: 800 clamp(2.5rem, 5vw, 4rem)/1 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  h2 span { color: var(--blu-scuro); }
  h3 { margin: 0 0 1.25rem; font: 800 clamp(1.75rem, 3vw, 2.5rem)/1.1 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  section section + section { margin-top: 3.5rem; }
  .press-link, .album-link { display: inline-flex; align-items: center; min-height: 2.75rem; color: var(--blu-scuro); font-size: 1.25rem; font-weight: 600; }
  .press-list { margin: 0; padding: 0; list-style: none; }
  .local-press { margin-top: 1.5rem; }
  p { max-width: 65ch; font-size: 1.125rem; line-height: 1.45; }
  .press-list li { border-top: 1px solid var(--blu-scuro); }
  .press-list li:last-child { border-bottom: 1px solid var(--blu-scuro); }
  .press-list a { display: grid; grid-template-columns: 15rem minmax(0, 1fr); align-items: baseline; gap: 0.5rem 2rem; min-height: 2.75rem; padding-block: 1.5rem; color: var(--navy); text-decoration: none; }
  .source { font: 700 1.125rem/1.3 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  .article-title { max-width: 65ch; font-size: 1.25rem; line-height: 1.4; text-decoration: underline; text-underline-offset: 0.2em; }
  a:hover { color: var(--rosso); }
  .materials-grid { display: grid; gap: 3rem; margin-bottom: 3.5rem; }
  .materials-grid.with-gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .materials-grid > section + section { margin-top: 0; }
  .local-press a { grid-template-columns: minmax(0, 1fr); gap: 0.25rem; padding-block: 1rem; }
  .gallery-note { margin: 1.5rem 0 0; }
  @media (max-width: 900px) {
    .materials-grid.with-gallery { grid-template-columns: minmax(0, 1fr); }
  }
  .album-link { margin-top: 1rem; }
  @media (max-width: 640px) {
    .press-list a { grid-template-columns: minmax(0, 1fr); }
  }
</style>
