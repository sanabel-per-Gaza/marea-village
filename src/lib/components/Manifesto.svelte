<script lang="ts">
  import contenuti from '$lib/data/contenuti.json';

  let openAccordions = new Set([0]);

  function toggleAccordion(index: number) {
    const next = new Set(openAccordions);
    next.has(index) ? next.delete(index) : next.add(index);
    openAccordions = next;
  }
</script>

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

<style>
  .content { width: min(100%, var(--content)); margin-inline: auto; }
  .section-label { font: 700 1.125rem/1.2 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  .manifesto h2 { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; text-transform: uppercase; }
  .manifesto {
    position: relative;
    padding: 9.375rem var(--gutter) 10rem;
    color: #fff;
    background: var(--blu-scuro);
  }

  .section-wave {
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


  @media (max-width: 900px) {
    .manifesto-intro { grid-template-columns: minmax(0, 1fr); }
  }
  @media (max-width: 640px) {
    .manifesto { padding-top: 8rem; padding-bottom: 9rem; }
    .manifesto-copy { font-size: 1.125rem; }
    .manifesto-copy .lead { font-size: 1.25rem; }
    .accordion button { gap: 0.75rem; }
  }
</style>
