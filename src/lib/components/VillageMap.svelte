<script lang="ts">
  export let selected = 'palco';
  export let confirmed = false;
  export let onSelect: (id: string) => void = () => {};

  const base: Record<string, string> = {
    teatro: '#0164C6', areaL: '#0164C6', palP: '#0164C6',
    palco: '#073D8B', bar: '#073D8B', stand: '#073D8B',
    info: '#073D8B', bambini: '#BFDDB0'
  };

  const pins = [
    { id: 'palco', n: 1, name: 'Palco', x: 470, y: 349, r1: 36, r2: 30, fs: 33 },
    { id: 'areaL', n: 2, name: 'Area L, destra', x: 978, y: 470, r1: 36, r2: 30, fs: 33 },
    { id: 'palP', n: 3, name: 'Palazzina P', x: 1022, y: 780, r1: 36, r2: 30, fs: 33 },
    { id: 'teatro', n: 4, name: 'Teatro, edificio G', x: 188, y: 592, r1: 36, r2: 30, fs: 33 },
    { id: 'bambini', n: 5, name: 'La Marea dei Bambini', x: 470, y: 830, r1: 36, r2: 30, fs: 33 },
    { id: 'stand', n: 6, name: 'Stand da 0 a 9', x: 612, y: 760, r1: 30, r2: 24, fs: 26 },
    { id: 'bar', n: 7, name: 'Gazebo birra bar', x: 780, y: 350, r1: 28, r2: 22, fs: 24 },
    { id: 'info', n: 8, name: 'Ingresso e Infopoint', x: 760, y: 908, r1: 30, r2: 24, fs: 26 }
  ];

  function fill(id: string) {
    if (!confirmed || id !== selected) return base[id];
    return id === 'bambini' ? '#FFB9B5' : '#D7141A';
  }

  function marker(id: string) {
    return confirmed && id === selected ? '#073D8B' : '#D7141A';
  }
</script>

<div class="map-shell" class:in-definition={!confirmed} role="group" aria-label={confirmed ? 'Mappa interattiva del villaggio MAREA' : 'Mappa del villaggio MAREA in definizione'} aria-describedby={confirmed ? undefined : 'map-status'}>
  <div class="map-content" inert={!confirmed} aria-hidden={!confirmed}>
  <svg viewBox="0 0 1272 1096" aria-hidden="true">
    <title id="map-title">Mappa schematica del villaggio MAREA</title>
    <desc id="map-description">Mappa interattiva con otto luoghi numerati.</desc>
    <rect width="1272" height="1096" fill="#EFEBDA" />
    <rect y="985" width="1272" height="111" fill="#D9D3BE" />
    <text x="1240" y="1050" text-anchor="end" class="street">STRADA</text>

    <rect x="430" y="25" width="285" height="110" fill="#B9CBE6" />
    <rect x="325" y="130" width="440" height="150" fill="#B9CBE6" />
    <rect x="340" y="298" width="455" height="112" fill="#E2DBC4" />
    <rect x="368" y="412" width="192" height="200" fill="#BFDDB0" />
    <rect x="630" y="412" width="192" height="200" fill="#BFDDB0" />
    <rect x="400" y="648" width="160" height="215" fill={fill('bambini')} />
    <rect x="660" y="648" width="180" height="215" fill="#BFDDB0" />
    <line x1="372" y1="485" x2="560" y2="580" class="path" />
    <line x1="818" y1="430" x2="630" y2="580" class="path" />
    <line x1="420" y1="800" x2="560" y2="660" class="path" />
    <line x1="838" y1="730" x2="660" y2="655" class="path" />
    <circle cx="612" cy="610" r="44" fill="#E2DBC4" />
    <text x="612" y="534" text-anchor="middle" class="park">PARCO SAN LAISE</text>

    <g>
      <rect x="20" y="372" width="335" height="263" fill={fill('teatro')} />
      <rect x="20" y="465" width="270" height="85" fill="#EFEBDA" />
    </g>
    <rect x="72" y="688" width="328" height="262" fill="#B9CBE6" />
    <rect x="90" y="780" width="240" height="80" fill="#EFEBDA" />
    <g>
      <rect x="815" y="255" width="325" height="270" fill={fill('areaL')} />
      <rect x="875" y="345" width="265" height="70" fill="#EFEBDA" />
    </g>
    <g>
      <rect x="860" y="572" width="325" height="263" fill={fill('palP')} />
      <rect x="905" y="650" width="280" height="85" fill="#EFEBDA" />
    </g>
    <g>
      <rect x="380" y="318" width="360" height="62" fill={fill('palco')} />
    </g>
    <g>
      <rect x="752" y="322" width="56" height="56" fill={fill('bar')} />
    </g>

    <g>
      {#each [0, 1, 2, 3, 4] as number}
        <rect x="548" y={672 + number * 38} width="30" height="30" fill={fill('stand')} />
        <text x="563" y={694 + number * 38} text-anchor="middle" class="stand-number">{number}</text>
      {/each}
      {#each [5, 6, 7, 8, 9] as number}
        <rect x="662" y={672 + (number - 5) * 38} width="30" height="30" fill={fill('stand')} />
        <text x="677" y={694 + (number - 5) * 38} text-anchor="middle" class="stand-number">{number}</text>
      {/each}
    </g>
    <g>
      <rect x="612" y="880" width="90" height="56" fill={fill('info')} />
    </g>
    <path d="M657 985 L637 955 L677 955 Z" fill="#073D8B" />

    {#each pins as item}
      <g class="marker">
        <circle cx={item.x} cy={item.y} r={item.r1} fill="#FAF9EE" />
        <circle cx={item.x} cy={item.y} r={item.r2} fill={marker(item.id)} />
        <text x={item.x} y={item.y + item.fs * 0.33} text-anchor="middle" style={`font-size:${item.fs}px`}>{item.n}</text>
      </g>
    {/each}
  </svg>
  {#each pins as pin}
    <button
      class="pin-target"
      type="button"
      style={`left:${pin.x / 1272 * 100}%;top:${pin.y / 1096 * 100}%`}
      aria-label={`Seleziona ${pin.n}, ${pin.name}`}
      aria-pressed={confirmed && selected === pin.id}
      disabled={!confirmed}
      onclick={() => confirmed && onSelect(pin.id)}
    ><span class="sr-only">{pin.name}</span></button>
  {/each}
  </div>
  {#if !confirmed}
    <div class="map-overlay" role="note" id="map-status">
      <div class="map-status">
        <h3>Mappa in definizione</h3>
        <p>Le posizioni sono provvisorie. La mappa non è ancora consultabile.</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .map-shell {
    position: relative;
    background: #fff;
    border: 3px solid var(--blu-scuro);
    box-shadow: 8px 8px 0 var(--rosso);
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  text {
    pointer-events: none;
    font-family: 'Barlow Condensed', sans-serif;
  }

  .street {
    fill: var(--blu-scuro);
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 4px;
  }

  .park {
    fill: #2e6b2e;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 3px;
  }

  .path {
    stroke: var(--suolo);
    stroke-width: 14;
  }

  .pin-target {
    position: absolute;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: transparent;
    cursor: pointer;
  }

  .pin-target:hover {
    outline: 3px solid var(--blu-scuro);
    outline-offset: 2px;
  }

  .stand-number {
    fill: #fff;
    font-size: 19px;
    font-weight: 700;
  }

  .marker text {
    fill: #fff;
    font-weight: 800;
  }

  .in-definition .map-content {
    opacity: 0.4;
    filter: grayscale(1);
  }

  .map-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: color-mix(in srgb, var(--crema) 45%, transparent);
    cursor: not-allowed;
  }

  .map-status {
    max-width: 26rem;
    padding: clamp(1rem, 3vw, 1.75rem);
    color: var(--blu-scuro);
    background: var(--crema);
    text-align: center;
  }

  .map-status h3 {
    margin: 0;
    font: 800 clamp(1.75rem, 3vw, 2.5rem)/1.05 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
    text-wrap: balance;
  }

  .map-status p {
    margin: 0.75rem 0 0;
    font-size: 1rem;
    line-height: 1.45;
    text-wrap: pretty;
  }
</style>
