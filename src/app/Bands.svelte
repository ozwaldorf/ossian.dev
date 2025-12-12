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

  interface BandColorInfo {
    bg: string;
    isLight: boolean;
  }

  let cols = $state(3);
  let rows = $state(2);
  let gridSize = $derived(cols * rows);
  let bandColors = $state<Map<string, BandColorInfo>>(new Map());

  function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  async function extractColor(imageUrl: string): Promise<BandColorInfo> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ bg: "transparent", isLight: false });
          return;
        }

        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const imageData = ctx.getImageData(0, 0, 50, 50).data;
        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        const luminance = getLuminance(r, g, b);
        resolve({ bg: `rgb(${r}, ${g}, ${b})`, isLight: luminance > 0.4 });
      };
      img.onerror = () => resolve({ bg: "transparent", isLight: false });
      img.src = imageUrl;
    });
  }

  async function loadBandColor(band: Band) {
    if (bandColors.has(band.id)) return;
    const colorInfo = await extractColor(band.picture);
    bandColors.set(band.id, colorInfo);
    bandColors = new Map(bandColors);
  }

  function loadColor(node: HTMLElement, band: Band) {
    loadBandColor(band);
    return {
      update(newBand: Band) {
        loadBandColor(newBand);
      },
    };
  }

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
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const availableWidth = Math.min(vw - 64, 1200);
    const availableHeight = vh * 0.6;

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

  function getLatestConcert(concerts: { date: string; location: string }[]) {
    if (!concerts || concerts.length === 0) return null;
    return concerts.reduce((latest, concert) => {
      const [d1, m1, y1] = latest.date.split("-").map(Number);
      const [d2, m2, y2] = concert.date.split("-").map(Number);
      const date1 = new Date(y1, m1 - 1, d1);
      const date2 = new Date(y2, m2 - 1, d2);
      return date2 > date1 ? concert : latest;
    });
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

  let displayedBands = $state<Band[]>([]);
  let fadingTile = $state<number | null>(null);
  let initialized = false;

  function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function getRandomBandNotDisplayed(): Band | null {
    const bands = sawThatState.bands;
    const displayedIds = new Set(displayedBands.map((b) => b.id));
    const available = bands.filter((b) => !displayedIds.has(b.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  function initializeGrid() {
    if (initialized) return;
    const bands = sawThatState.bands;
    if (bands.length === 0) return;

    const shuffled = shuffleArray(bands);
    displayedBands = shuffled.slice(0, Math.min(gridSize, shuffled.length));
    initialized = true;
  }

  function swapRandomTile() {
    if (sawThatState.bands.length <= gridSize) return;
    if (fadingTile !== null) return;
    if (displayedBands.length === 0) return;

    const newBand = getRandomBandNotDisplayed();
    if (!newBand) return;

    const tileIndex = Math.floor(Math.random() * displayedBands.length);
    fadingTile = tileIndex;

    setTimeout(() => {
      displayedBands[tileIndex] = newBand;
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
    computeGrid();
    window.addEventListener("resize", computeGrid);
    const interval = setInterval(swapRandomTile, SWAP_INTERVAL);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", computeGrid);
    };
  });
</script>

{#if hasSawThatConfig()}
  <div class="bands-section">
    <div class="bands-header">
      <a
        href="https://ossian.sawthat.band"
        target="_blank"
        rel="noopener noreferrer"
        class="header-link"
      >
        <h3>I saw that band ... <IconLaunch width="28" height="28" /></h3>
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
        {#each displayedBands as band, i}
          {@const concert = getLatestConcert(band.concerts)}
          {@const colorInfo = bandColors.get(band.id)}
          <div
            use:loadColor={band}
            class="band-card"
            class:fading={fadingTile === i}
            class:light-bg={colorInfo?.isLight}
            style:--band-color={colorInfo?.bg ?? "var(--cds-border-subtle-01)"}
          >
            <img src={band.picture} alt={band.band} class="band-image" />
            <div class="band-info">
              <h4 class="band-name" use:fitText={{ max: 14, min: 5 }}>
                {band.band}
              </h4>
              {#if concert}
                <p class="band-time">{getRelativeTime(concert.date)}</p>
                <p class="band-location" use:fitText={{ max: 11, min: 5 }}>
                  {concert.location}
                </p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "@carbon/colors";
  @use "@carbon/styles/scss/type";

  .bands-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
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
    @include type.type-style("fluid-quotation-02", true);
    letter-spacing: 0.02em;
    color: var(--cds-text-primary);
    margin: 0;
    transition: color 0.15s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .bands-grid {
    display: grid;
    gap: 1rem;
  }

  .band-card {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--band-color, var(--cds-border-subtle-01));
    border-radius: 12px;
    overflow: hidden;
    opacity: 1;
    container-type: inline-size;
    transition:
      opacity 400ms ease,
      border-color 300ms ease;
  }

  .band-card.fading {
    opacity: 0;
  }

  .band-card.light-bg .band-name {
    color: #161616;
  }

  .band-card.light-bg .band-time,
  .band-card.light-bg .band-location {
    color: #525252;
  }

  .band-image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    background: var(--cds-layer-02);
  }

  .band-info {
    --overlap: 30cqi;
    margin-top: calc(-1 * var(--overlap));
    padding: 1.75rem 0.75rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
    background: linear-gradient(
      to bottom in oklab,
      transparent 0,
      var(--band-color, var(--cds-layer-01)) var(--overlap),
      var(--band-color, var(--cds-layer-01)) 100%
    );
  }

  .band-name {
    font-weight: 600;
    color: var(--cds-text-primary);
    margin: 0;
    white-space: nowrap;
  }

  .band-time {
    font-size: 0.75rem;
    color: var(--cds-text-secondary);
    margin: 0;
  }

  .band-location {
    color: var(--cds-text-secondary);
    margin: 0;
    white-space: nowrap;
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
</style>
