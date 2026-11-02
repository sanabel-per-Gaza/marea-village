<script>
  import { base } from '$app/paths';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import Manifesto from '$lib/components/Manifesto.svelte';
</script>

<PageMeta title="MAREA Village · Arte, cultura e politica" description="MAREA Village: arte, cultura e politica a Bagnoli, Napoli. Il manifesto, l’archivio dell’edizione 2026 e lo spazio dedicato al 2027." />
<SiteHeader />

<main>
  <header class="home-hero">
    <img class="home-photo" src={`${base}/marea-home-1280.webp`} srcset={`${base}/marea-home-720.webp 720w, ${base}/marea-home-1280.webp 1280w, ${base}/marea-home-2048.webp 2048w`} sizes="100vw" alt="Il palco di MAREA Village a Bagnoli, con lo striscione Mediterraneo, Arte, Resistenza, Ecologia." width="2048" height="921" fetchpriority="high" />
    <div class="hero-band">
      <div class="hero-inner">
        <h1>
          <span class="sr-only">MAREA Village</span>
          <img src={`${base}/marea-logo-navy-720.webp`} srcset={`${base}/marea-logo-navy-720.webp 720w, ${base}/marea-logo-navy-1200.webp 1200w`} sizes="(max-width: 640px) min(256px, calc(100vw - 32px)), 288px" alt="" width="1470" height="474" />
        </h1>
        <p class="hero-claim">La marea avanza… <span>tuffati!</span></p>
        <div class="hero-actions">
          <a class="button button-red" href="#manifesto">Manifesto</a>
          <a class="button button-light" href="#info">Info</a>
        </div>
      </div>
    </div>
  </header>

  <section class="editions" aria-labelledby="edizioni-title">
    <div class="content">
      <h2 id="edizioni-title">MAREA Village</h2>
      <a class="edition-link" href={`${base}/marea-village-2026/`}>
        <h3>2026</h3><span>Programma, mostre e materiali dell’edizione</span><span class="edition-action">Esplora l’archivio</span>
      </a>
      <a class="edition-link" href={`${base}/marea-village-2027/`}>
        <h3>2027</h3><span>Spazio in allestimento</span><span class="edition-action">Vai al 2027</span>
      </a>
    </div>
  </section>

  <Manifesto />
</main>
<SiteFooter />

<style>
  .content, .hero-inner { width: min(100%, var(--content)); margin-inline: auto; }
  .home-hero { color: var(--navy); background: var(--crema); }
  .home-photo { display: block; width: 100%; height: auto; }
  .hero-band { border-top: 0.5rem solid var(--rosso); }
  .hero-inner { display: grid; grid-template-columns: minmax(12rem, 0.8fr) minmax(0, 1.2fr) auto; align-items: center; gap: 2rem; padding: 2rem var(--gutter); }
  h1 { min-width: 0; margin: 0; }
  h1 img { display: block; width: 100%; max-width: 18rem; height: auto; filter: drop-shadow(3px 3px 0 var(--rosso)); }
  .hero-claim { margin: 0; font: 800 clamp(1.75rem, 3.2vw, 2.5rem)/1.05 'Barlow Condensed', sans-serif; text-transform: uppercase; text-wrap: balance; }
  .hero-claim span { color: var(--rosso); }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 1rem; }
  .button { display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding: 0.875rem 1.625rem; font: 800 1.25rem/1 'Barlow Condensed', sans-serif; letter-spacing: 0.04em; text-transform: uppercase; text-decoration: none; }
  .button-red { color: #fff; background: var(--rosso); box-shadow: 5px 5px 0 var(--blu-scuro); }
  .button-light { color: #fff; background: var(--blu-scuro); box-shadow: 5px 5px 0 var(--rosso); }
  .button:hover { color: var(--navy); background: var(--rosa); }
  .editions { padding: 4rem var(--gutter); }
  h2 { margin: 0 0 2rem; font: 800 clamp(2.5rem, 5vw, 4rem)/1 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  .edition-link { display: grid; grid-template-columns: max-content minmax(0, 1fr) auto; align-items: center; gap: 1rem 2rem; min-height: 7rem; padding-block: 1.5rem; border-top: 2px solid var(--blu-scuro); color: var(--navy); text-decoration: none; }
  .edition-link:last-child { border-bottom: 2px solid var(--blu-scuro); }
  .edition-link:hover { color: var(--rosso); }
  h3 { margin: 0; font: 800 clamp(3rem, 6vw, 5rem)/1 'Barlow Condensed', sans-serif; }
  .edition-link span { font-size: 1.125rem; }
  .edition-link .edition-action { font-weight: 600; text-decoration: underline; text-underline-offset: 0.2em; }
  @media (max-width: 900px) {
    .hero-inner { grid-template-columns: minmax(0, 1fr) auto; gap: 1.25rem 2rem; }
    .hero-claim { grid-column: 1; }
    .hero-actions { grid-column: 2; grid-row: 1 / span 2; }
  }
  @media (max-width: 640px) {
    .hero-inner { grid-template-columns: minmax(0, 1fr); gap: 1.25rem; padding-block: 1.5rem; }
    h1 img { max-width: 16rem; }
    .hero-claim { font-size: 2rem; }
    .hero-actions { grid-column: auto; grid-row: auto; }
    .editions { padding-block: 3rem; }
    .edition-link { grid-template-columns: max-content minmax(0, 1fr); gap: 0.75rem 1rem; }
    .edition-action { grid-column: 2; }
  }
</style>
