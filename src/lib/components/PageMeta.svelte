<script lang="ts">
  import { base } from '$app/paths';
  import { PUBLIC_SITE_URL } from '$env/static/public';

  export let title: string;
  export let description: string;
  export let path = '/';

  const siteUrl = PUBLIC_SITE_URL.replace(/\/$/, '');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="it_IT" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={siteUrl ? `${siteUrl}/og-marea-home.jpg` : `${base}/og-marea-home.jpg`} />
  <meta property="og:image:alt" content="Il palco di MAREA Village a Bagnoli" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  {#if siteUrl}
    <link rel="canonical" href={siteUrl + path} />
    <meta property="og:url" content={siteUrl + path} />
  {/if}
</svelte:head>
