<script>
  import { base } from '$app/paths';
  import contenuti from '$lib/data/contenuti.json';

  const contacts = Object.entries(contenuti.contatti).filter(([, value]) => value.trim());
  const social = Object.entries(contenuti.social).filter(([, value]) => value.trim());
</script>

<section id="info" class="info" aria-labelledby="info-title">
  <div class="content">
    <h2 id="info-title">Info</h2>
    <div class="contact-grid">
      {#if contacts.length}
        <div><h3>Contatti</h3>{#each contacts as [label, href]}<a {href}>{label}</a>{/each}</div>
      {/if}
      {#if social.length}
        <div><h3>Social</h3>{#each social as [label, href]}<a {href}>{label}</a>{/each}</div>
      {/if}
    </div>
    <footer>
      <a href={`${base}/`} aria-label="MAREA Village, home"><img src={`${base}/marea-logo-320.webp`} alt="MAREA Village" width="1470" height="474" /></a>
      <a href={`${base}/marea-village-2026/`}>Archivio 2026</a>
      <a href={`${base}/marea-village-2027/`}>MAREA Village 2027</a>
    </footer>
  </div>
</section>

<style>
  .info { padding: 4rem var(--gutter); color: #fff; background: var(--blu); }
  .content { width: min(100%, var(--content)); margin-inline: auto; }
  h2 { margin: 0 0 1.5rem; font: 800 clamp(2.5rem, 6vw, 4rem)/1 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  h3 { margin: 0 0 0.5rem; color: #fff; font: 700 1.125rem/1.2 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: 0.08em; }
  .contact-grid { display: flex; flex-wrap: wrap; gap: 2rem 4rem; }
  a { display: flex; align-items: center; width: fit-content; min-height: 2.75rem; color: #fff; font-weight: 600; }
  a:hover { color: var(--crema); text-decoration-thickness: 2px; }
  footer { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem 2rem; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #fff; }
  footer a:first-child { margin-right: auto; }
  footer img { display: block; width: 13rem; height: auto; }
</style>
