<script lang="ts">
  import { base } from '$app/paths';
  import archivio from '$lib/data/archivio-2026.json';

  interface Photo {
    src: string;
    alt: string;
    width: number;
    height: number;
    didascalia?: string;
  }

  const photos: Photo[] = archivio.galleria.foto;
</script>

<section id="materiali" class="materials" aria-labelledby="materiali-title">
  <div class="content">
    <h2 id="materiali-title">MAREA Village 2026<br /><span>Foto e rassegna</span></h2>

    {#if photos.length || archivio.galleria.albumUrl}
      <section id="galleria" aria-labelledby="galleria-title">
        <h3 id="galleria-title">La quattro giorni in foto</h3>
        {#if photos.length}
          <div class="photo-grid">
            {#each photos as photo}
              <figure>
                <a href={`${base}${photo.src}`}>
                  <img src={`${base}${photo.src}`} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" />
                </a>
                {#if photo.didascalia}<figcaption>{photo.didascalia}</figcaption>{/if}
              </figure>
            {/each}
          </div>
        {/if}
        {#if archivio.galleria.albumUrl}<a class="album-link" href={archivio.galleria.albumUrl}>Sfoglia l’album completo</a>{/if}
      </section>
    {/if}

    <section id="rassegna-stampa" aria-labelledby="stampa-title">
      <h3 id="stampa-title">Rassegna stampa</h3>
      <a class="press-link" href={archivio.rassegnaStampa}>Sfoglia la rassegna stampa su Google Drive</a>
    </section>

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
  .press-list li { border-top: 1px solid var(--blu-scuro); }
  .press-list li:last-child { border-bottom: 1px solid var(--blu-scuro); }
  .press-list a { display: grid; grid-template-columns: 15rem minmax(0, 1fr); align-items: baseline; gap: 0.5rem 2rem; min-height: 2.75rem; padding-block: 1.5rem; color: var(--navy); text-decoration: none; }
  .source { font: 700 1.125rem/1.3 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  .article-title { max-width: 65ch; font-size: 1.25rem; line-height: 1.4; text-decoration: underline; text-underline-offset: 0.2em; }
  a:hover { color: var(--rosso); }
  .photo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
  figure { margin: 0; }
  figure img { display: block; width: 100%; height: auto; }
  figcaption { margin-top: 0.75rem; font-size: 1rem; line-height: 1.4; }
  .album-link { margin-top: 1rem; }
  @media (max-width: 640px) {
    .press-list a, .photo-grid { grid-template-columns: minmax(0, 1fr); }
  }
</style>
