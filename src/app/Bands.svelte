<script lang="ts">
  import { onMount } from "svelte";
  import {
    sawThatState,
    hasSawThatConfig,
    type Band,
  } from "../lib/sawthat.svelte";
  import IconLaunch from "~icons/carbon/launch";

  const SWAP_INTERVAL = 2500;
  const FADE_DURATION = 400;
  const CARD_MIN_WIDTH = 140;
  const CARD_MIN_HEIGHT = 220;
  const MAX_COLS = 6;
  const MAX_ROWS = 3;
  const MIN_COLS = 2;
  const MIN_ROWS = 1;

  interface BandConcert {
    band: Band;
    concert: { date: string; location: string };
    id: string;
  }

  function flattenBandConcerts(bands: Band[]): BandConcert[] {
    return bands.flatMap((band) =>
      band.concerts.map((concert, i) => ({
        band,
        concert,
        id: `${band.id}-${i}`,
      })),
    );
  }

  let cols = $state(3);
  let rows = $state(2);
  let gridSize = $derived(cols * rows);
  let containerEl = $state<HTMLElement | undefined>(undefined);

  function fitText(
    node: HTMLElement,
    params: { max?: number; min?: number } = {},
  ) {
    const maxSize = params.max ?? 13;
    const minSize = params.min ?? 8;

    const fit = () => {
      node.style.fontSize = "";
      const parent = node.parentElement;
      if (!parent) return;

      const maxWidth = parent.clientWidth;
      let fontSize = maxSize;
      node.style.fontSize = `${fontSize}px`;

      while (node.scrollWidth > maxWidth && fontSize > minSize) {
        fontSize -= 0.5;
        node.style.fontSize = `${fontSize}px`;
      }
    };

    fit();
    const observer = new MutationObserver(fit);
    observer.observe(node, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return {
      destroy() {
        observer.disconnect();
      },
    };
  }

  function computeGrid() {
    if (!containerEl) return;
    const availableWidth = containerEl.clientWidth;
    const availableHeight = window.innerHeight * 0.6;

    const newCols = Math.max(
      MIN_COLS,
      Math.min(MAX_COLS, Math.floor(availableWidth / CARD_MIN_WIDTH)),
    );
    const newRows = Math.max(
      MIN_ROWS,
      Math.min(MAX_ROWS, Math.floor(availableHeight / CARD_MIN_HEIGHT)),
    );

    if (newCols !== cols || newRows !== rows) {
      cols = newCols;
      rows = newRows;
      initialized = false;
      initializeGrid();
    }
  }

  function getRelativeTime(dateString: string): string {
    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1 month ago";
    if (diffMonths < 12) return `${diffMonths} months ago`;

    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) return "1 year ago";
    return `${diffYears} years ago`;
  }

  let displayedConcerts = $state<BandConcert[]>([]);
  let fadingTile = $state<number | null>(null);
  let loadedImages = $state<Set<string>>(new Set());
  let initialized = false;
  let allConcerts = $derived(flattenBandConcerts(sawThatState.bands));

  function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function getRandomConcertNotDisplayed(): BandConcert | null {
    const displayedIds = new Set(displayedConcerts.map((c) => c.id));
    const available = allConcerts.filter((c) => !displayedIds.has(c.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  function onImageLoad(id: string) {
    loadedImages.add(id);
    loadedImages = new Set(loadedImages);
  }

  function initializeGrid() {
    if (initialized) return;
    if (allConcerts.length === 0) return;

    const shuffled = shuffleArray(allConcerts);
    displayedConcerts = shuffled.slice(0, Math.min(gridSize, shuffled.length));
    initialized = true;
  }

  function swapRandomTile() {
    if (allConcerts.length <= gridSize) return;
    if (fadingTile !== null) return;
    if (displayedConcerts.length === 0) return;

    const newConcert = getRandomConcertNotDisplayed();
    if (!newConcert) return;

    const tileIndex = Math.floor(Math.random() * displayedConcerts.length);
    fadingTile = tileIndex;

    setTimeout(() => {
      displayedConcerts[tileIndex] = newConcert;
      setTimeout(() => {
        fadingTile = null;
      }, 50);
    }, FADE_DURATION);
  }

  $effect(() => {
    if (!sawThatState.loading && sawThatState.bands.length > 0) {
      initializeGrid();
    }
  });

  onMount(() => {
    requestAnimationFrame(() => {
      computeGrid();
    });
    window.addEventListener("resize", computeGrid);
    const interval = setInterval(swapRandomTile, SWAP_INTERVAL);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", computeGrid);
    };
  });
</script>

{#if hasSawThatConfig()}
  <div class="bands-section" bind:this={containerEl}>
    <div class="bands-header">
      <a
        href="https://{sawThatState.username}.sawthat.band"
        target="_blank"
        rel="noopener noreferrer"
        class="header-link"
      >
        <h3 class="section-heading">
          I saw that band ... <IconLaunch width="28" height="28" />
        </h3>
      </a>
    </div>

    {#if sawThatState.error}
      <div class="error">{sawThatState.error}</div>
    {:else if sawThatState.loading}
      <div class="bands-grid" style:grid-template-columns="repeat({cols}, 1fr)">
        {#each Array(gridSize) as _}
          <div class="band-card loading">
            <div class="band-image skeleton"></div>
            <div class="band-info">
              <div class="skeleton-text"></div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="bands-grid" style:grid-template-columns="repeat({cols}, 1fr)">
        {#each displayedConcerts as item, i}
          {@const concertUrl = `https://${sawThatState.username}.sawthat.band/${encodeURIComponent(item.band.band)}/${item.band.id}?&date=${item.concert.date}`}
          <a
            href={concertUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="band-card"
            class:fading={fadingTile === i}
            class:loaded={loadedImages.has(item.id)}
            class:light-bg={item.band.color?.isLight}
            style:--band-color={item.band.color?.bg ?? "var(--cds-border-subtle-01)"}
          >
            <img
              src={item.band.picture}
              alt={item.band.band}
              class="band-image"
              onload={() => onImageLoad(item.id)}
            />
            <div class="band-info">
              <h4 class="band-name" use:fitText={{ max: 14, min: 5 }}>
                {item.band.band}
              </h4>
              <p class="band-time">{getRelativeTime(item.concert.date)}</p>
              <p class="band-location" use:fitText={{ max: 11, min: 5 }}>
                {item.concert.location}
              </p>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "@carbon/colors";

  .bands-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 2rem;
    box-sizing: border-box;
    overflow: hidden;
  }

  .bands-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .header-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--cds-text-secondary);
    transition: color 0.15s ease;
  }

  .header-link:hover {
    color: var(--cds-link-primary);
  }

  .header-link:hover h3 {
    color: var(--cds-link-primary);
  }

  .bands-header h3 {
    transition: color 0.15s ease;
  }

  .bands-grid {
    display: grid;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
  }

  .band-card {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--band-color, var(--cds-border-subtle-01));
    border-radius: 12px;
    overflow: hidden;
    opacity: 0;
    container-type: inline-size;
    text-decoration: none;
    color: inherit;
    min-width: 0;
    transition:
      opacity 400ms ease,
      border-color 300ms ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .band-card.loaded {
    opacity: 1;
  }

  .band-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--cds-shadow);
  }

  .band-card.fading {
    opacity: 0;
  }

  .band-card.light-bg .band-name {
    color: #161616;
  }

  .band-card.light-bg .band-time,
  .band-card.light-bg .band-location {
    color: #161616;
  }

  .band-image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    background: var(--cds-layer-02);
  }

  .band-info {
    margin-top: -30cqi;
    height: 45cqi;
    padding: 0 0.75rem 0.75rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 0.25rem;
    text-align: center;
    background: linear-gradient(
      to bottom in oklab,
      transparent 0,
      var(--band-color, var(--cds-layer-01)) 30cqi,
      var(--band-color, var(--cds-layer-01)) 100%
    );
  }

  .band-name {
    font-weight: 600;
    color: var(--cds-text-primary);
    margin: 0;
  }

  .band-time {
    font-size: 0.75rem;
    color: var(--cds-text-primary);
    margin: 0;
  }

  .band-location {
    color: var(--cds-text-primary);
    margin: 0;
  }

  .band-card.loading {
    pointer-events: none;
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      var(--cds-layer-02) 25%,
      var(--cds-layer-hover-01) 50%,
      var(--cds-layer-02) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-text {
    height: 0.85rem;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      var(--cds-layer-02) 25%,
      var(--cds-layer-hover-01) 50%,
      var(--cds-layer-02) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .error {
    text-align: center;
    padding: 2rem;
    color: var(--cds-support-error);
    font-size: 0.9rem;
  }

  @media (max-width: 760px) {
    .bands-section {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>
