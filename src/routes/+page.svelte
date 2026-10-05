<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { PUBLIC_SITE_URL } from '$env/static/public';
  import displayFont from '@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2?url';
  import programma from '$lib/data/programma.json';
  import contenuti from '$lib/data/contenuti.json';
  import VillageMap from '$lib/components/VillageMap.svelte';
  import { getRomeNow, isEventNow, eventsAtPlace, sortEvents, type FestivalEvent, type NowInfo } from '$lib/festival';

  const events: Record<string, FestivalEvent[]> = programma.eventi;
  const categories: Record<string, string> = programma.categorie;
  const siteUrl = PUBLIC_SITE_URL.replace(/\/$/, '');
  const ogImage = siteUrl ? `${siteUrl}/og-marea.png` : `${base}/og-marea.png`;

  let selectedDay = 'gio';
  let selectedCategory = 'tutto';
  let nowInfo: NowInfo | null = null;
  let selectedPlace = 'palco';
  let openAccordions = new Set([0]);
  let dayPicked = false;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': programma.giorni.map((day) => ({
      '@type': 'Event',
      name: `MAREA Village — ${day.name} ${day.num} ottobre 2026`,
      startDate: `2026-10-${String(day.num).padStart(2, '0')}`,
      endDate: `2026-10-${String(day.num).padStart(2, '0')}`,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: 'Ex base NATO, Bagnoli',
        address: { '@type': 'PostalAddress', addressLocality: 'Napoli', addressCountry: 'IT' }
      },
      image: ogImage,
      ...(siteUrl ? { url: siteUrl + '/' } : {}),
      description: 'Festival di arte, cultura e politica organizzato dai comitati di Bagnoli e dai movimenti sociali napoletani.'
    }))
  };

  function isNow(event: FestivalEvent, dayId: string) {
    return isEventNow(event, dayId, nowInfo);
  }

  function chooseHeroDay(event: MouseEvent, id: string) {
    event.preventDefault();
    pickDay(id);
    document.getElementById('programma')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  function pickDay(id: string) {
    dayPicked = true;
    selectedDay = id;
  }

  function tabKey(event: KeyboardEvent, index: number) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const length = programma.giorni.length;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + length) % length;
    pickDay(programma.giorni[next].id);
    document.getElementById(`tab-${programma.giorni[next].id}`)?.focus();
  }

  function toggleAccordion(index: number) {
    const next = new Set(openAccordions);
    next.has(index) ? next.delete(index) : next.add(index);
    openAccordions = next;
  }

  $: activeDay = programma.giorni.find((day) => day.id === selectedDay) ?? programma.giorni[0];
  $: dayEvents = sortEvents(events[selectedDay] ?? []);
  $: visibleEvents = selectedCategory === 'tutto' ? dayEvents : dayEvents.filter((event) => event.cat === selectedCategory);
  $: selectedPlaceData = contenuti.luoghi.find((place) => place.id === selectedPlace) ?? contenuti.luoghi[0];
  $: selectedPlaceEvents = eventsAtPlace(events[selectedDay] ?? [], selectedPlace);
  $: availableCategories = new Set(Object.values(events).flat().map((event) => event.cat));
  $: social = Object.entries(contenuti.social as Record<string, string>).filter(([, value]) => value.trim());
  $: contacts = Object.entries(contenuti.contatti as Record<string, string>).filter(([, value]) => value.trim());

  onMount(() => {
    const updateNow = () => {
      nowInfo = getRomeNow(programma.giorni);
      if (nowInfo && !dayPicked) selectedDay = nowInfo.day;
    };
    updateNow();
    const timer = window.setInterval(updateNow, 30_000);
    return () => window.clearInterval(timer);
  });
</script>

<svelte:head>
  <title>MAREA Village 2026 · Bagnoli, Napoli</title>
  <meta name="description" content="MAREA Village, festival di arte, cultura e politica: dall'8 all'11 ottobre 2026 all'ex base NATO di Bagnoli, Napoli." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="it_IT" />
  <meta property="og:title" content="MAREA Village 2026" />
  <meta property="og:description" content="8—11 ottobre 2026 · Ex base NATO · Bagnoli · Napoli" />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:alt" content="MAREA Village · 8—11 ottobre 2026 · Bagnoli, Napoli" />
  {#if siteUrl}<link rel="canonical" href={`${siteUrl}/`} /><meta property="og:url" content={`${siteUrl}/`} />{/if}
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preload" href={displayFont} as="font" type="font/woff2" crossorigin="anonymous" />
  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`}
</svelte:head>

<nav class="site-nav" aria-label="Navigazione principale">
  <div class="nav-inner">
    <a class="nav-logo" href="#top" aria-label="MAREA Village, torna all'inizio">
      <img src={`${base}/marea-logo-320.webp`} alt="MAREA Village" width="1470" height="474" />
    </a>
    <div class="nav-scroll">
      <div class="nav-links">
        <a href="#programma">Programma</a>
        <a href="#mostre">Mostre</a>
        <a href="#manifesto">Manifesto</a>
        <a href="#villaggio">Il villaggio</a>
        <a href="#sanabel">Sanabel</a>
        <a href="#info">Info</a>
      </div>
    </div>
  </div>
</nav>

<main>
  <header id="top" class="hero">
    <div class="hero-inner">
      <div class="hero-brand">
        <h1 class="sr-only">MAREA Village · 8—11 ottobre 2026</h1>
        <img src={`${base}/marea-logo-720.webp`} srcset={`${base}/marea-logo-720.webp 720w, ${base}/marea-logo-1200.webp 1200w`} sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 900px) 576px, (max-width: 1240px) calc(50vw - 56px), 568px" alt="MAREA Village" width="1470" height="474" fetchpriority="high" />
      </div>
      <div class="hero-details">
        <div class="hero-dates">8—11</div>
        <div class="hero-month">Ottobre 2026</div>
        <div class="hero-days" aria-label="Scegli il giorno del programma">
          {#each programma.giorni as day}
            <a href="#programma" onclick={(event) => chooseHeroDay(event, day.id)}>
              <span>{day.short}</span>
              <strong>{day.num}</strong>
            </a>
          {/each}
        </div>
        <div class="hero-place">Ex base NATO · Bagnoli · Napoli</div>
        <div class="hero-actions">
          <a class="button button-red" href="#programma">Il programma</a>
          <a class="button button-light" href="#manifesto">Il manifesto</a>
        </div>
      </div>
    </div>
    <div class="waves" aria-hidden="true">
      <svg class="wave wave-one" viewBox="0 0 2880 190" preserveAspectRatio="none"><path d="M0 70 Q360 24 720 70 T1440 70 T2160 70 T2880 70 V190 H0Z" /></svg>
      <svg class="wave wave-two" viewBox="0 0 2880 150" preserveAspectRatio="none"><path d="M0 80 Q360 40 720 80 T1440 80 T2160 80 T2880 80 V150 H0Z" /></svg>
      <svg class="wave wave-three" viewBox="0 0 2880 110" preserveAspectRatio="none"><path d="M0 70 Q360 36 720 70 T1440 70 T2160 70 T2880 70 V110 H0Z" /></svg>
      <svg class="wave wave-four" viewBox="0 0 2880 56" preserveAspectRatio="none"><path d="M0 40 Q360 18 720 40 T1440 40 T2160 40 T2880 40 V56 H0Z" /></svg>
    </div>
  </header>

  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      {#each [0, 1] as copy}
        <div class="marquee-run">
          {#each ['Mediterraneo', 'Arte', 'Resistenza', 'Ecologia', 'Azione', 'La marea avanza… tuffati!'] as word}
            <span>{word}<i></i></span>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <section id="programma" class="section program-section" aria-labelledby="programma-title">
    <div class="content">
      <div class="section-heading-row">
        <h2 id="programma-title" class="display-title">Programma</h2>
        <a class="button button-red" href={`${base}/programma-marea-village.pdf`} download="PROGRAMMA MAREA VILLAGE.pdf">Scarica il programma · PDF</a>
        {#if nowInfo}
          <div class="now-summary" aria-live="polite"><span></span>Adesso al villaggio · {nowInfo.label}</div>
        {/if}
      </div>

      <p class="section-intro">8–11 ottobre 2026 · Parco San Laise (ex base NATO) · Ingresso libero</p>

      <div class="day-tabs" role="tablist" aria-label="Giorni del programma">
        {#each programma.giorni as day, index}
          <button
            id={`tab-${day.id}`}
            type="button"
            role="tab"
            aria-selected={selectedDay === day.id}
            aria-controls="program-panel"
            tabindex={selectedDay === day.id ? 0 : -1}
            onkeydown={(event) => tabKey(event, index)}
            class:active={selectedDay === day.id}
            onclick={() => pickDay(day.id)}
          >
            <span>{day.short}</span><strong>{day.num}</strong>
          </button>
        {/each}
      </div>

      <div class="category-filters" aria-label="Filtra per categoria">
        <button type="button" class:active={selectedCategory === 'tutto'} aria-pressed={selectedCategory === 'tutto'} onclick={() => (selectedCategory = 'tutto')}>Tutto</button>
        {#each Object.entries(programma.categorie).filter(([key]) => availableCategories.has(key)) as [key, label]}
          <button type="button" class:active={selectedCategory === key} aria-pressed={selectedCategory === key} onclick={() => (selectedCategory = key)}>{label}</button>
        {/each}
      </div>

      <div id="program-panel" class="event-list" role="tabpanel" aria-labelledby={`tab-${selectedDay}`} tabindex="0">
        {#each visibleEvents as event}
          {#if event.cat === 'live'}
            <article class="live-event">
              <div class="event-time"><time>{event.time}</time></div>
              <div>
                <div class="event-category">Concerti / Live · Palco</div>
                <div class="live-names">
                  {#each event.names ?? [] as name}<h3>{name}</h3>{/each}
                </div>
                {#if event.lines?.length}
                  <div class="event-lines">{#each event.lines as line}<div>{line}</div>{/each}</div>
                {/if}
                {#if isNow(event, selectedDay)}<span class="now-badge inverse">Adesso</span>{/if}
              </div>
            </article>
          {:else}
            <article class="event-row">
              <div class="event-time">
                <time>{event.time}</time>
                {#if isNow(event, selectedDay)}<span class="now-badge">Adesso</span>{/if}
              </div>
              <div class="event-copy">
                <div class="event-category">{categories[event.cat]}</div>
                <h3>{event.title}</h3>
                {#if event.lines?.length}
                  <div class="event-lines">{#each event.lines as line}<div>{line}</div>{/each}</div>
                {/if}
                {#if event.people?.length}
                  <div class="event-people">{#each event.people as person}<div>{person}</div>{/each}</div>
                {/if}
                {#if event.place}<div class="event-place">↳ {event.place}</div>{/if}
                {#if event.descrizione?.length}
                  <details class="event-description">
                    <summary>Approfondisci</summary>
                    {#each event.descrizione as paragraph}<p>{paragraph}</p>{/each}
                  </details>
                {/if}
              </div>
            </article>
          {/if}
        {:else}
          <div class="empty-message">Nessuna attività di questo tipo in questa giornata.</div>
        {/each}
      </div>
    </div>
  </section>

  <section id="mostre" class="section exhibitions" aria-labelledby="mostre-title">
    <div class="content">
      <div class="all-days">Tutti i giorni</div>
      <h2 id="mostre-title" class="display-title compact">Mostre / Esposizioni</h2>
      <div class="exhibition-grid">
        {#each programma.mostre as mostra}
          <article>
            <h3>{mostra.title}</h3>
            <div>{mostra.by}</div>
            <div class="event-place">↳ {mostra.place}</div>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="manifesto" class="manifesto" aria-labelledby="manifesto-title">
    <svg class="section-wave wave-top" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H1440 V30 Q1260 90 1080 50 T720 50 T360 50 T0 40Z" /></svg>
    <svg class="section-wave wave-bottom" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 100 H1440 V60 Q1260 10 1080 50 T720 50 T360 50 T0 60Z" /></svg>
    <div class="content">
      <div class="section-label">Manifesto</div>
      <h2 id="manifesto-title">M.A.R.E.A.<wbr />village</h2>
      <div class="manifesto-intro">
        <div class="manifesto-copy">
          {#each contenuti.manifestoIntro as paragraph, index}<p class:lead={index === 0}>{paragraph}</p>{/each}
        </div>
        <div class="siamo-list">
          {#each contenuti.siamo as item}
            <div><strong>Siamo</strong> {item}</div>
          {/each}
          <p>{contenuti.manifestoSiamoConclusione}</p>
        </div>
      </div>

      <div class="manifesto-claim">La marea avanza… <span>tuffati!</span></div>
      <p class="acronym-intro">{contenuti.manifestoAcronimoIntro}</p>

      <div class="accordion">
        {#each contenuti.acronimo as item, index}
          <div class="accordion-item">
            <h3>
              <button type="button" aria-expanded={openAccordions.has(index)} aria-controls={`accordion-panel-${index}`} onclick={() => toggleAccordion(index)}>
                <span class="letter">{item.letter}</span>
                <span class="word">{item.word}</span>
                <span class="sign" aria-hidden="true">{openAccordions.has(index) ? '−' : '+'}</span>
              </button>
            </h3>
            {#if openAccordions.has(index)}
              <div id={`accordion-panel-${index}`} class="accordion-panel">
                {#each item.paras as paragraph}<p>{paragraph}</p>{/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <div class="closing-claims">
        {#each contenuti.manifestoConclusioni as paragraph}<div>{paragraph}</div>{/each}
      </div>
    </div>
  </section>

  <section id="villaggio" class="section village" aria-labelledby="villaggio-title">
    <div class="content">
      <h2 id="villaggio-title" class="display-title">Il villaggio</h2>
      <p class="section-intro">{contenuti.villaggioIntro}</p>

      <div class="village-grid">
        <VillageMap selected={selectedPlace} confirmed={contenuti.posizioniConfermate} onSelect={(id) => (selectedPlace = id)} />
        <div class="place-column">
          <div class="place-card" aria-live="polite">
            <h3>{selectedPlaceData.name}</h3>
            <p>{selectedPlaceData.what}</p>
            {#if selectedPlaceEvents.length}
              <div class="place-day">{activeDay.name} {activeDay.num} ottobre</div>
              <div class="place-events">
                {#each selectedPlaceEvents as event}
                  <div><time>{event.time}</time><strong>{event.cat === 'live' ? 'Concerti / Live' : event.title}</strong></div>
                {/each}
              </div>
            {/if}
          </div>
          <div class="place-chips" aria-label="Luoghi del villaggio">
            {#each contenuti.luoghi as place}
              <button type="button" class:active={selectedPlace === place.id} aria-pressed={selectedPlace === place.id} onclick={() => (selectedPlace = place.id)}>
                <span>{place.n}</span><strong>{place.name}</strong>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <h3 class="stand-title">Stand</h3>
      <div class="stand-grid">
        {#each contenuti.stand as stand}
          <div><span>{stand.n}</span><strong>{stand.name}</strong></div>
        {/each}
      </div>
    </div>
  </section>

  <section id="sanabel" class="section sanabel" aria-labelledby="sanabel-title">
    <div class="content sanabel-grid">
      <div class="sanabel-copy">
        <div class="section-label">Il ricavato del festival</div>
        <h2 id="sanabel-title">Sanabel</h2>
        <p>{contenuti.sanabel.testo}</p>
        <div class="sanabel-date">{contenuti.sanabel.collegamento}</div>
        {#if contenuti.donazioneSanabel}<a class="button button-light donate" href={contenuti.donazioneSanabel}>Sostieni Sanabel</a>{/if}
      </div>
      <div class="boat-wrap"><img src={`${base}/boat.webp`} alt="Illustrazione della barca di Sanabel" width="408" height="880" loading="lazy" /></div>
    </div>
  </section>

  <section id="info" class="info" aria-labelledby="info-title">
    <svg class="info-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H1440 V40 C1200 90 960 10 720 50 S240 100 0 40Z" /></svg>
    <div class="content">
      <h2 id="info-title" class="sr-only">Informazioni e adesioni</h2>
      <div class="info-grid">
        <div><div class="info-label">Quando</div><strong>8 — 11 ottobre 2026</strong></div>
        <div><div class="info-label">Dove</div><strong>Ex base NATO<br />Bagnoli · Napoli</strong></div>
        {#if contenuti.indirizzo}<div><div class="info-label">Indirizzo</div><strong>{contenuti.indirizzo}</strong></div>{/if}
      </div>

      {#if contacts.length || social.length}
        <div class="contact-grid">
          {#if contacts.length}
            <div><div class="info-label">Contatti</div>{#each contacts as [label, value]}<a href={value}>{label}</a>{/each}</div>
          {/if}
          {#if social.length}
            <div><div class="info-label">Social</div>{#each social as [label, value]}<a href={value}>{label}</a>{/each}</div>
          {/if}
        </div>
      {/if}

      <div class="supporters">
        <div class="info-label">Adesioni</div>
        <div>{#each contenuti.adesioni as supporter}<span>{supporter}</span>{/each}</div>
      </div>

      <footer>
        <a href="#top"><img src={`${base}/marea-logo-720.webp`} alt="MAREA Village" width="1470" height="474" /></a>
        <div>MAREAvillage 2026</div>
      </footer>
    </div>
  </section>
</main>

<style>
  :global(body) {
    color: var(--navy);
  }

  .content {
    width: min(100%, var(--content));
    margin-inline: auto;
  }

  .site-nav {
    position: sticky;
    z-index: 50;
    top: 0;
    color: #fff;
    background: var(--blu-scuro);
  }

  .nav-inner {
    display: flex;
    align-items: center;
    width: min(100%, var(--content));
    min-height: 3.5rem;
    padding: 0.375rem var(--gutter);
    margin-inline: auto;
    column-gap: 1.5rem;
  }

  .nav-logo {
    display: flex;
    flex: none;
    padding-block: 0.375rem;
  }

  .nav-logo img {
    display: block;
    width: auto;
    height: 2rem;
  }

  .nav-scroll {
    min-width: 0;
    flex: 1 1 18.75rem;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .nav-scroll::-webkit-scrollbar {
    display: none;
  }

  .nav-links {
    display: flex;
    gap: 1.375rem;
    width: max-content;
    margin-left: auto;
    white-space: nowrap;
  }

  .nav-links a {
    min-width: 2.75rem;
    min-height: 2.75rem;
    text-align: center;
    padding-block: 0.75rem;
    color: #fff;
    font: 700 1.0625rem/1 'Barlow Condensed', sans-serif;
    letter-spacing: 0.06em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .nav-links a:hover {
    color: var(--rosa);
  }

  .hero {
    position: relative;
    display: flex;
    min-height: calc(100svh - 3.5rem);
    overflow: hidden;
    color: #fff;
    background: var(--blu);
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    gap: clamp(2.5rem, 5vw, 4rem);
    width: min(100%, var(--content));
    padding: clamp(2.5rem, 7vw, 4rem) var(--gutter) 11.875rem;
    margin-inline: auto;
  }

  .hero-brand img {
    display: block;
    width: 100%;
    height: auto;
    filter: drop-shadow(7px 7px 0 var(--rosso));
  }

  .hero-details {
    max-width: 33.75rem;
  }

  .hero-dates,
  .hero-month,
  .hero-place,
  .display-title,
  .manifesto h2,
  .sanabel h2 {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    text-transform: uppercase;
  }

  .hero-dates {
    font-size: clamp(5.5rem, 13vw, 11.25rem);
    line-height: 0.82;
    letter-spacing: -0.02em;
    text-shadow: 7px 7px 0 var(--rosso);
  }

  .hero-month {
    margin-top: 0.875rem;
    font-size: clamp(2.375rem, 5vw, 4.125rem);
    line-height: 1;
    text-shadow: 4px 4px 0 var(--rosso);
  }

  .hero-days,
  .day-tabs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .hero-days {
    gap: 0.375rem;
    margin-top: 1.625rem;
  }

  .hero-days a {
    display: flex;
    min-width: 0;
    min-height: 4.75rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 0.25rem 0.5rem;
    border: 2px solid #fff;
    color: #fff;
    font: 700 0.9375rem/1 'Barlow Condensed', sans-serif;
    letter-spacing: 0.08em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .hero-days a:hover,
  .hero-days a:focus-visible {
    color: var(--rosso);
    background: #fff;
  }

  .hero-days strong {
    margin-top: 0.25rem;
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: 0;
  }

  .hero-place {
    margin-top: 1.5rem;
    font-size: clamp(1.375rem, 2.4vw, 1.875rem);
    line-height: 1.1;
    letter-spacing: 0.02em;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.75rem;
  }

  .button {
    display: inline-flex;
    min-height: 3.25rem;
    align-items: center;
    justify-content: center;
    padding: 0.9375rem 1.625rem;
    font: 800 1.25rem/1 'Barlow Condensed', sans-serif;
    letter-spacing: 0.05em;
    text-decoration: none;
    text-transform: uppercase;
    transition: box-shadow 150ms ease-out, transform 150ms ease-out;
  }

  .button:hover {
    transform: translate(3px, 3px);
  }

  .button-red {
    color: #fff;
    background: var(--rosso);
    box-shadow: 5px 5px 0 var(--blu-scuro);
  }

  .button-red:hover {
    color: #fff;
    background: #b00f14;
    box-shadow: 2px 2px 0 var(--blu-scuro);
  }

  .button-light {
    color: var(--blu-scuro);
    background: #fff;
    box-shadow: 5px 5px 0 var(--rosso);
  }

  .button-light:hover {
    color: var(--blu-scuro);
    box-shadow: 2px 2px 0 var(--rosso);
  }

  @keyframes marea-wave {
    to { transform: translateX(-50%); }
  }

  .waves {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
    left: 0;
    height: 11.875rem;
    overflow: hidden;
    pointer-events: none;
  }

  .wave {
    max-width: none;
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 200%;
    animation: marea-wave linear infinite;
  }

  .wave-one { height: 11.875rem; fill: #2a7fd6; animation-duration: 26s; }
  .wave-two { height: 9.375rem; fill: #0a55b5; animation-duration: 18s; animation-delay: -6s; }
  .wave-three { height: 6.875rem; fill: var(--blu-scuro); animation-duration: 12s; animation-delay: -3s; }
  .wave-four { height: 3.5rem; fill: var(--rosso); animation-duration: 9s; animation-delay: -2s; }

  .marquee {
    overflow: hidden;
    padding-block: 1rem;
    color: #fff;
    background: var(--rosso);
    font: 800 clamp(1.625rem, 3.4vw, 2.625rem)/1 'Barlow Condensed', sans-serif;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .marquee-track,
  .marquee-run,
  .marquee span {
    display: flex;
    align-items: center;
  }

  .marquee-track {
    width: max-content;
    animation: marea-wave 38s linear infinite;
  }

  .marquee-run {
    flex: none;
    gap: 2.25rem;
    padding-right: 2.25rem;
  }

  .marquee span {
    gap: 2.25rem;
  }

  .marquee i {
    width: 0.75rem;
    height: 0.75rem;
    background: #fff;
    transform: rotate(45deg);
  }

  .section {
    padding-inline: var(--gutter);
  }

  .program-section {
    padding-top: 4.5rem;
    padding-bottom: 2.5rem;
  }

  .section-heading-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.25rem;
    margin-bottom: 1.75rem;
  }

  .display-title {
    margin: 0;
    color: var(--blu-scuro);
    font-size: clamp(3rem, 7vw, 5.5rem);
    line-height: 0.9;
    text-shadow: 5px 5px 0 var(--rosso);
  }

  .display-title.compact {
    margin: 0.75rem 0 1.75rem;
    font-size: clamp(2.5rem, 5.5vw, 4rem);
    line-height: 0.95;
    text-shadow: 4px 4px 0 var(--rosso);
  }

  .now-summary {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    color: var(--rosso);
    font: 700 1.125rem/1.2 'Barlow Condensed', sans-serif;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .now-summary span {
    width: 0.75rem;
    height: 0.75rem;
    flex: none;
    border-radius: 50%;
    background: var(--rosso);
  }

  .day-tabs {
    gap: clamp(0.375rem, 1.2vw, 0.625rem);
  }

  .day-tabs button {
    display: flex;
    min-width: 0;
    min-height: 5rem;
    cursor: pointer;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: clamp(0.625rem, 1.6vw, 1rem) 0.25rem;
    border: 3px solid var(--rosso);
    color: var(--rosso);
    background: transparent;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    text-transform: uppercase;
    transition: transform 150ms ease-out, box-shadow 150ms ease-out;
  }

  .day-tabs button.active {
    color: #fff;
    background: var(--rosso);
    box-shadow: 6px 6px 0 var(--blu-scuro);
    transform: translateY(-3px);
  }

  .day-tabs span { font-size: clamp(0.875rem, 1.8vw, 1.25rem); letter-spacing: 0.08em; }
  .day-tabs strong { font-size: clamp(2.25rem, 5vw, 3.5rem); line-height: 0.9; }

  .category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1.125rem 0 0.5rem;
  }

  .category-filters button {
    min-height: 2.75rem;
    cursor: pointer;
    padding: 0.625rem 1rem;
    border: 2px solid var(--blu);
    border-radius: 999px;
    color: var(--blu);
    background: transparent;
    font-size: 1rem;
    font-weight: 600;
  }

  .category-filters button.active {
    color: #fff;
    background: var(--blu);
  }

  .event-list {
    margin-top: 0.75rem;
  }

  .event-row,
  .live-event {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
  }

  .event-row {
    padding: 1.5rem 1rem;
    margin-inline: -1rem;
    border-top: 2px solid var(--linea);
    transition: background 150ms ease-out;
  }

  .event-row:hover {
    background: #fff;
  }

  .event-time {
    display: flex;
    flex: 0 0 8.125rem;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: center;
    gap: 0.5rem;
  }

  .event-time time,
  .place-events time {
    display: inline-block;
    flex: none;
    padding: 0.4375rem 0.625rem;
    color: #fff;
    background: var(--rosso);
    font: 700 1.125rem/1 'Barlow Condensed', sans-serif;
    font-variant-numeric: tabular-nums;
  }

  .event-copy {
    min-width: 0;
    flex: 1 1 17.5rem;
  }

  .event-category,
  .place-day,
  .section-label,
  .info-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .event-category {
    color: var(--blu);
    font-size: 0.875rem;
  }

  .event-copy h3,
  .exhibition-grid h3,
  .place-card h3,
  .stand-title {
    color: var(--navy);
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    line-height: 1.05;
    text-transform: uppercase;
  }

  .event-copy h3 {
    max-width: 45rem;
    margin: 0.25rem 0 0.5rem;
    font-size: clamp(1.5rem, 2.6vw, 2rem);
    text-wrap: pretty;
  }

  .event-lines {
    display: flex;
    max-width: 45rem;
    flex-direction: column;
    gap: 0.125rem;
    font-size: 1.0625rem;
    line-height: 1.45;
  }

  .event-people {
    display: flex;
    max-width: 45rem;
    flex-direction: column;
    gap: 0.125rem;
    padding-left: 0.875rem;
    margin-top: 0.625rem;
    border-left: 3px solid var(--blu);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;
  }

  .event-place {
    margin-top: 0.625rem;
    color: var(--blu);
    font-size: 0.9375rem;
    font-weight: 600;
  }

  .now-badge {
    padding: 0.125rem 0.5rem;
    border: 2px solid var(--rosso);
    color: var(--rosso);
    font: 800 0.875rem/1 'Barlow Condensed', sans-serif;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .now-badge.inverse {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    margin-top: 0.875rem;
    border: 0;
    color: var(--rosso);
    background: #fff;
  }

  .event-description {
    max-width: 45rem;
    margin-top: 1rem;
  }

  .event-description summary {
    min-height: 2.75rem;
    cursor: pointer;
    color: var(--blu);
    font-weight: 600;
  }

  .event-description p {
    margin: 0 0 0.75rem;
    line-height: 1.5;
  }

  .live-event {
    padding: 2rem clamp(1.25rem, 4vw, 2.5rem);
    margin-block: 1.25rem;
    color: #fff;
    background: var(--blu);
  }

  .live-event .event-category {
    color: #fff;
    opacity: 0.9;
  }

  .live-names {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    margin-top: 0.5rem;
  }

  .live-names h3 {
    margin: 0;
    font: 800 clamp(1.875rem, 4vw, 3rem)/1.05 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .empty-message {
    padding-block: 2.5rem;
    border-top: 2px solid var(--linea);
    font-size: 1.125rem;
    font-weight: 500;
  }

  .exhibitions {
    padding-top: 2.5rem;
    padding-bottom: 5rem;
  }

  .all-days {
    display: inline-block;
    padding: 0.5625rem 0.875rem;
    color: #fff;
    background: var(--rosso);
    font: 800 1.375rem/1 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .exhibition-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
    column-gap: 2.5rem;
  }

  .exhibition-grid article {
    padding-block: 1.25rem;
    border-top: 2px solid var(--linea);
    font-size: 1.0625rem;
    line-height: 1.45;
  }

  .exhibition-grid h3 {
    margin: 0 0 0.375rem;
    font-size: 1.625rem;
  }

  .manifesto {
    position: relative;
    padding: 9.375rem var(--gutter) 10rem;
    color: #fff;
    background: var(--blu-scuro);
  }

  .section-wave,
  .info-wave {
    position: absolute;
    left: 0;
    display: block;
    width: 100%;
    pointer-events: none;
    fill: var(--crema);
  }

  .section-wave { height: 5.625rem; }
  .wave-top { top: -1px; }
  .wave-bottom { bottom: -1px; }

  .section-label {
    color: var(--rosa);
    font-size: 1.125rem;
    letter-spacing: 0.14em;
  }

  .manifesto h2 {
    margin: 0.625rem 0 2.25rem;
    font-size: clamp(3rem, 9vw, 6.5rem);
    line-height: 0.9;
    overflow-wrap: anywhere;
    text-shadow: clamp(3px, 0.5vw, 6px) clamp(3px, 0.5vw, 6px) 0 var(--rosso);
  }

  .manifesto-intro {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.5rem 4rem;
  }

  .manifesto-copy {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
    font-size: 1.25rem;
    line-height: 1.55;
  }

  .manifesto-copy p,
  .siamo-list p {
    margin: 0;
  }

  .manifesto-copy .lead {
    font-size: 1.4375rem;
    font-weight: 500;
  }

  .siamo-list {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .siamo-list > div {
    padding-bottom: 0.875rem;
    border-bottom: 1px solid #2a5ba8;
    font: 600 clamp(1.3125rem, 2vw, 1.5625rem)/1.25 'Barlow Condensed', sans-serif;
  }

  .siamo-list strong {
    color: var(--rosa);
    font-weight: 800;
    text-transform: uppercase;
  }

  .siamo-list p {
    margin-top: 0.5rem;
    font-size: 1.1875rem;
    line-height: 1.5;
  }

  .manifesto-claim {
    margin: 4rem 0 3.5rem;
    font: 800 clamp(2.75rem, 7vw, 5.75rem)/0.95 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .manifesto-claim span {
    color: var(--accento-su-blu);
  }

  .acronym-intro {
    max-width: 47.5rem;
    margin: 0 0 1.75rem;
    font-size: 1.1875rem;
    line-height: 1.5;
  }

  .accordion-item {
    border-top: 2px solid #2a5ba8;
  }

  .accordion-item h3 {
    margin: 0;
  }

  .accordion button {
    display: grid;
    width: 100%;
    min-height: 5.5rem;
    cursor: pointer;
    grid-template-columns: minmax(3rem, clamp(3rem, 11vw, 6.875rem)) minmax(0, 1fr) 2rem;
    align-items: center;
    gap: 1rem;
    padding-block: 1.125rem;
    border: 0;
    color: #fff;
    background: transparent;
    text-align: left;
  }

  .accordion .letter {
    color: var(--accento-su-blu);
    font: 800 clamp(3.25rem, 8vw, 6rem)/0.85 'Barlow Condensed', sans-serif;
  }

  .accordion .word {
    font: 800 clamp(1.625rem, 4vw, 3rem)/1 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  .accordion .sign {
    font: 700 2.125rem/1 'Barlow Condensed', sans-serif;
    text-align: center;
  }

  .accordion-panel {
    max-width: 59rem;
    padding: 0 0 2rem clamp(0rem, calc(12vw - 1.25rem), 7.875rem);
    font-size: 1.1875rem;
    line-height: 1.55;
  }

  .accordion-panel p {
    margin: 0 0 0.875rem;
  }

  .closing-claims {
    display: flex;
    max-width: 60rem;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 3.5rem;
    font: 700 clamp(1.5rem, 2.6vw, 2rem)/1.2 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .closing-claims div:last-child {
    color: var(--rosa);
  }

  .village {
    padding-top: 6rem;
    padding-bottom: 5rem;
  }

  .section-intro {
    max-width: 47.5rem;
    margin: 0.75rem 0 2.25rem;
    font-size: 1.1875rem;
    line-height: 1.5;
  }

  .village-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(20rem, 1fr);
    align-items: start;
    gap: 1.25rem;
  }

  .place-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .place-card {
    min-height: 10rem;
    padding: 1.375rem;
    color: #fff;
    background: var(--blu-scuro);
  }

  .place-card h3 {
    margin: 0;
    color: #fff;
    font-size: 1.75rem;
  }

  .place-card p {
    margin: 0.5rem 0 0;
    font-size: 1rem;
    line-height: 1.45;
  }

  .place-day {
    margin-top: 1rem;
    color: var(--rosa);
    font-size: 0.875rem;
  }

  .place-events {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .place-events > div {
    display: flex;
    align-items: baseline;
    gap: 0.625rem;
  }

  .place-events time {
    padding: 0.25rem 0.375rem;
    font-size: 0.875rem;
  }

  .place-events strong {
    font: 700 1.0625rem/1.2 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .place-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .place-chips button {
    display: flex;
    min-height: 2.75rem;
    cursor: pointer;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem 0.375rem 0.375rem;
    border: 2px solid var(--linea);
    color: var(--navy);
    background: transparent;
  }

  .place-chips button:hover,
  .place-chips button.active {
    border-color: var(--rosso);
    color: var(--rosso);
    background: #fff;
  }

  .place-chips span {
    display: flex;
    width: 2rem;
    height: 2rem;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;
    background: var(--rosso);
    font: 800 1.125rem/1 'Barlow Condensed', sans-serif;
  }

  .place-chips strong {
    font: 800 1.125rem/1.1 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .stand-title {
    margin: 3.5rem 0 1rem;
    color: var(--blu-scuro);
    font-size: 2rem;
  }

  .stand-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    column-gap: 2rem;
  }

  .stand-grid > div {
    display: flex;
    align-items: baseline;
    gap: 0.875rem;
    padding-block: 0.75rem;
    border-top: 2px solid var(--linea);
  }

  .stand-grid span {
    width: 1.875rem;
    flex: none;
    color: var(--rosso);
    font: 800 1.375rem/1 'Barlow Condensed', sans-serif;
  }

  .stand-grid strong {
    font-size: 1.125rem;
    line-height: 1.3;
  }

  .sanabel {
    padding-bottom: 6rem;
  }

  .sanabel-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    color: #fff;
    background: var(--rosso);
  }

  .sanabel-copy {
    padding: clamp(1.75rem, 5vw, 4rem);
  }

  .sanabel-copy .section-label {
    color: #fff;
  }

  .sanabel h2 {
    margin: 0.625rem 0 1.5rem;
    font-size: clamp(3.5rem, 8vw, 6.5rem);
    line-height: 0.9;
    text-shadow: 6px 6px 0 var(--blu-scuro);
  }

  .sanabel p {
    max-width: 35rem;
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.55;
  }

  .sanabel-date {
    margin-top: 1.75rem;
    font-size: 1.0625rem;
    font-weight: 600;
    line-height: 1.4;
  }

  .donate {
    margin-top: 1.75rem;
  }

  .boat-wrap {
    display: flex;
    min-height: 22.5rem;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: #fbfbef;
  }

  .boat-wrap img {
    display: block;
    width: auto;
    max-height: 27.5rem;
  }

  .info {
    position: relative;
    padding: 9.375rem var(--gutter) 4rem;
    color: #fff;
    background: var(--blu);
  }

  .info-wave {
    top: -1px;
    height: 6.875rem;
  }

  .info-grid,
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.5rem;
  }

  .info-label {
    color: #d6e6fa;
    font-size: 1rem;
    letter-spacing: 0.14em;
  }

  .info-grid strong {
    display: block;
    margin-top: 0.5rem;
    font: 800 2.25rem/1.05 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .contact-grid {
    margin-top: 3rem;
  }

  .contact-grid a {
    display: block;
    width: fit-content;
    min-height: 2.75rem;
    padding-block: 0.5rem;
    color: #fff;
    font-weight: 600;
  }

  .supporters {
    padding-top: 1.75rem;
    margin-top: 4rem;
    border-top: 2px solid #3b86d6;
  }

  .supporters > div:last-child {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.375rem;
    margin-top: 0.875rem;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    margin-top: 4.5rem;
    color: #d6e6fa;
    font-size: 0.9375rem;
    font-weight: 600;
  }

  footer a {
    display: block;
  }

  footer img {
    display: block;
    width: 16.25rem;
    height: auto;
  }

  @media (max-width: 900px) {
    .hero-inner,
    .manifesto-intro,
    .village-grid,
    .sanabel-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .hero-inner {
      align-content: center;
      gap: 2.5rem;
    }

    .hero-brand img {
      max-width: 36rem;
    }

    .hero-details {
      max-width: 38rem;
    }

    .village-grid {
      gap: 1.75rem;
    }

    .stand-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .nav-inner {
      align-items: stretch;
      flex-direction: column;
      gap: 0;
      padding-bottom: 0;
    }

    .nav-logo {
      align-self: flex-start;
      min-height: 2.75rem;
      align-items: center;
    }

    .nav-logo img {
      height: 1.75rem;
    }

    .nav-scroll {
      width: calc(100% + 2 * var(--gutter));
      flex: auto;
      margin-left: calc(-1 * var(--gutter));
      padding-inline: var(--gutter);
    }

    .nav-links {
      gap: 1.125rem;
      margin-left: 0;
    }

    .hero {
      min-height: calc(100svh - 5.5rem);
    }

    .hero-inner {
      align-content: start;
      padding-top: 2.5rem;
      padding-bottom: 9.5rem;
    }

    .hero-brand img {
      max-width: 28rem;
    }

    .hero-dates {
      font-size: clamp(5rem, 27vw, 7rem);
    }

    .hero-actions .button {
      flex: 1 1 9.5rem;
    }

    .program-section {
      padding-top: 3.75rem;
    }

    .day-tabs {
      gap: 0.375rem;
    }

    .day-tabs button {
      min-height: 4.625rem;
      border-width: 2px;
    }

    .day-tabs button.active {
      box-shadow: 4px 4px 0 var(--blu-scuro);
    }

    .category-filters {
      flex-wrap: nowrap;
      padding: 0.25rem 0.25rem 0.5rem;
      margin-inline: -0.25rem;
      overflow-x: auto;
    }

    .category-filters button {
      flex: none;
    }

    .event-row,
    .live-event {
      flex-direction: column;
    }

    .event-time {
      flex-basis: auto;
    }

    .live-event {
      margin-inline: calc(-1 * var(--gutter));
    }

    .exhibition-grid,
    .stand-grid,
    .info-grid,
    .contact-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .manifesto {
      padding-top: 8rem;
      padding-bottom: 9rem;
    }

    .manifesto-copy,
    .sanabel p {
      font-size: 1.125rem;
    }

    .manifesto-copy .lead {
      font-size: 1.25rem;
    }

    .accordion button {
      gap: 0.75rem;
    }

    .village {
      padding-top: 5rem;
    }

    .place-events > div {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.375rem;
    }

    .sanabel {
      padding-inline: 0;
    }

    .sanabel-grid {
      width: 100%;
    }

    .boat-wrap {
      min-height: 19rem;
    }

    .boat-wrap img {
      max-height: 23rem;
    }

    .info-grid {
      gap: 2rem;
    }
  }

  @media (max-width: 390px) {
    .hero-days a {
      font-size: 0.8125rem;
    }

    .hero-days strong {
      font-size: 2rem;
    }

    .day-tabs span {
      font-size: 0.8125rem;
    }

    .day-tabs strong {
      font-size: 2rem;
    }

    .place-chips button {
      width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wave,
    .marquee-track {
      animation: none;
    }

    .button:hover {
      transform: none;
    }
  }
</style>
