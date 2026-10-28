<script>
  import { base } from '$app/paths';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
</script>

<PageMeta title="MAREA Village 2027 · Spazio in allestimento" description="MAREA Village 2027: spazio in allestimento." path="/marea-village-2027/" />
<SiteHeader current="2027" />

<main>
  <div class="content">
    <h1>MAREA Village <span>2027</span></h1>
    <p>Spazio in allestimento</p>
    <div class="links">
      <a href={`${base}/`}>Torna alla home</a>
      <a href={`${base}/marea-village-2026/`}>Esplora l’archivio 2026</a>
    </div>
  </div>
</main>
<SiteFooter />

<style>
  main { display: flex; align-items: center; min-height: 65svh; padding: 4rem var(--gutter) 5rem; color: #fff; background: var(--blu-scuro); border-bottom: 0.75rem solid var(--rosso); }
  .content { width: min(100%, var(--content)); margin-inline: auto; }
  h1 { margin: 0; font: 800 clamp(3rem, 8vw, 6rem)/0.95 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  h1 span { display: block; color: var(--rosa); }
  p { margin: 2rem 0; font-size: clamp(1.5rem, 4vw, 2.25rem); }
  .links { display: flex; flex-wrap: wrap; gap: 0.5rem 2rem; }
  a { display: inline-flex; align-items: center; min-height: 2.75rem; color: #fff; font-weight: 600; }
  a:hover { color: var(--rosa); }
</style>
