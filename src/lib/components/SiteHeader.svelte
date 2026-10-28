<script lang="ts">
  import { base } from '$app/paths';
  export let current: 'home' | '2027' = 'home';
</script>

<nav class="site-nav" aria-label="Navigazione principale">
  <div class="nav-inner">
    <a class="nav-logo" href={`${base}/`} aria-label="MAREA Village, home">
      <img src={`${base}/marea-logo-320.webp`} alt="MAREA Village" width="1470" height="474" />
    </a>
    <div class="nav-scroll">
      <div class="nav-links">
        <a href={current === 'home' ? '#manifesto' : `${base}/#manifesto`}>Manifesto</a>
        <a href="#info">Info</a>
        <a href={`${base}/marea-village-2026/`}>Village 2026</a>
        <a href={`${base}/marea-village-2027/`} aria-current={current === '2027' ? 'page' : undefined}>Village 2027</a>
      </div>
    </div>
  </div>
</nav>

<style>
  .site-nav { position: sticky; z-index: 50; top: 0; color: #fff; background: var(--blu-scuro); }
  .nav-inner { display: flex; align-items: center; gap: 1.5rem; width: min(100%, var(--content)); min-height: 3.5rem; margin-inline: auto; padding: 0.375rem var(--gutter); }
  .nav-logo { display: flex; align-items: center; flex: none; min-height: 2.75rem; }
  .nav-logo img { display: block; width: auto; height: 2rem; }
  .nav-scroll { min-width: 0; flex: 1; overflow-x: auto; scrollbar-width: thin; }
  .nav-links { display: flex; gap: 1.375rem; width: max-content; margin-left: auto; }
  .nav-links a { display: block; min-height: 2.75rem; padding-block: 0.75rem; color: #fff; font: 700 1.0625rem/1 'Barlow Condensed', sans-serif; letter-spacing: 0.06em; text-decoration: none; text-transform: uppercase; white-space: nowrap; }
  .nav-links a:hover, .nav-links a[aria-current] { color: var(--rosa); }
  @media (max-width: 640px) {
    .nav-inner { align-items: stretch; flex-direction: column; gap: 0; padding-bottom: 0; }
    .nav-logo { align-self: flex-start; }
    .nav-logo img { height: 1.75rem; }
    .nav-scroll { width: calc(100% + 2 * var(--gutter)); margin-left: calc(-1 * var(--gutter)); padding-inline: var(--gutter); }
    .nav-links { gap: 1.125rem; margin-left: 0; }
  }
</style>
