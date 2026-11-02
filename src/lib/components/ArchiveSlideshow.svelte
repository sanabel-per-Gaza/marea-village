<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { slideIndex, type GalleryPhoto } from '$lib/gallery';

  export let photos: GalleryPhoto[];

  const sizes = '(max-width: 900px) calc(100vw - 32px), (max-width: 1240px) calc(50vw - 56px), 572px';
  let root: HTMLDivElement;
  let image: HTMLImageElement;
  let index = 0;
  let mounted = false;
  let playing = false;
  let visible = false;
  let pageVisible = true;
  let hovered = false;
  let ready = false;
  let failed = false;
  let pointerIntent: boolean | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  $: photo = photos[index] ?? photos[0];
  $: schedule(mounted && playing && visible && pageVisible && !hovered && ready, index, photos.length);

  function schedule(canPlay: boolean, position: number, total: number) {
    if (timer) clearTimeout(timer);
    timer = undefined;
    if (canPlay && total > 1) {
      timer = setTimeout(() => show(slideIndex(position, 1, total)), 6000);
    }
  }

  function show(next: number) {
    ready = false;
    failed = false;
    index = next;
  }

  function move(step: number) {
    playing = false;
    show(slideIndex(index, step, photos.length));
  }

  function toggle() {
    // A pointer click focuses the button first; preserve the intent from before focus paused it.
    playing = pointerIntent ?? !playing;
    pointerIntent = null;
  }

  function imageLoaded() {
    ready = true;
    const next = photos[slideIndex(index, 1, photos.length)];
    if (next && photos.length > 1) {
      const preload = new Image();
      if (next.srcSmall) preload.srcset = `${base}${next.srcSmall} 480w, ${base}${next.src} ${next.width}w`;
      preload.sizes = sizes;
      preload.src = `${base}${next.src}`;
    }
  }

  function imageFailed() {
    playing = false;
    ready = false;
    failed = true;
  }

  onMount(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => { if (media.matches) playing = false; };
    const visibilityChanged = () => { pageVisible = !document.hidden; };
    playing = !media.matches;
    pageVisible = !document.hidden;
    ready = image.complete && image.naturalWidth > 0;
    mounted = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
    }, { threshold: [0, 0.15] });
    observer.observe(root);
    media.addEventListener('change', motionChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
      media.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  });
</script>

{#if photo}
  <div
    class="slideshow"
    role="region"
    aria-roledescription="carosello"
    aria-label="Selezione foto di MAREA Village 2026"
    bind:this={root}
    onpointerenter={(event) => { if (event.pointerType === 'mouse') hovered = true; }}
    onpointerleave={(event) => { if (event.pointerType === 'mouse') hovered = false; }}
    onfocusin={() => (playing = false)}
  >
    <figure aria-roledescription="diapositiva" aria-label={`Foto ${index + 1} di ${photos.length}`}>
      <div class="image-frame">
        <img
          bind:this={image}
          class:hidden={failed}
          src={`${base}${photo.src}`}
          srcset={photo.srcSmall ? `${base}${photo.srcSmall} 480w, ${base}${photo.src} ${photo.width}w` : undefined}
          {sizes}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          onload={imageLoaded}
          onerror={imageFailed}
        />
        {#if failed}<p class="image-error">Foto non disponibile. Prova “Successiva” oppure apri l’album.</p>{/if}
      </div>
      <figcaption aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        <span class="photo-number">Foto {index + 1} di {photos.length}</span>
        {photo.alt}
      </figcaption>
    </figure>
    {#if mounted && photos.length > 1}
      <div class="slideshow-controls" aria-label="Controlli slideshow">
        <button class="control" type="button" onclick={() => move(-1)}>Precedente</button>
        <button
          class="control playback"
          type="button"
          onpointerdown={() => (pointerIntent = !playing)}
          onpointercancel={() => (pointerIntent = null)}
          onkeydown={() => (pointerIntent = null)}
          onclick={toggle}
        >{playing ? 'Pausa slideshow' : 'Avvia slideshow'}</button>
        <button class="control" type="button" onclick={() => move(1)}>Successiva</button>
      </div>
    {/if}
  </div>
{/if}

<style>
  figure { margin: 0; }
  .image-frame { position: relative; aspect-ratio: 3 / 2; background: var(--navy); }
  img { display: block; width: 100%; height: 100%; object-fit: contain; }
  img.hidden { display: none; }
  .image-error { position: absolute; inset: 0; display: grid; align-content: center; margin: 0; padding: 1.5rem; color: var(--crema); font-size: 1.125rem; line-height: 1.45; }
  figcaption { min-height: 4.75rem; padding-top: 1rem; color: var(--navy); font-size: 1rem; line-height: 1.4; }
  .photo-number { display: block; margin-bottom: 0.25rem; font-weight: 600; font-variant-numeric: tabular-nums; }
  .slideshow-controls { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
  .control { flex: 1 1 auto; min-width: 2.75rem; min-height: 2.75rem; padding: 0.625rem 0.875rem; border: 2px solid var(--blu-scuro); color: var(--blu-scuro); background: var(--crema); font: 700 1rem/1.1 'Barlow Condensed', sans-serif; text-transform: uppercase; cursor: pointer; }
  .playback { color: #fff; background: var(--blu-scuro); }
  .control:hover { color: var(--navy); background: var(--rosa); }
</style>
