<script lang="ts">
  import { onMount } from "svelte";
  import type { YouTubeChannelState } from "../lib/youtube.svelte";
  import { fade } from "svelte/transition";
  import IconYoutube from "~icons/carbon/logo-youtube";
  import IconShuffle from "~icons/carbon/shuffle";
  import IconLaunch from "~icons/carbon/launch";

  const SHUFFLE_INTERVAL = 10000; // 10 seconds

  let { cs }: { cs: YouTubeChannelState } = $props();

  let isShuffling = $state(false);
  let progress = $state(0);
  let isPaused = $state(false);
  let lastTime = $state(0);
  let animationFrame: number;

  function doShuffle() {
    if (cs.videos.length > 1 && !isShuffling) {
      isShuffling = true;
      let newIndex: number;
      const currentId = cs.randomVideo?.id;
      do {
        newIndex = Math.floor(Math.random() * cs.videos.length);
      } while (cs.videos[newIndex].id === currentId);
      cs.randomVideo = cs.videos[newIndex];
      progress = 0;
      lastTime = performance.now();
    }
  }

  function shuffleVideo(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    doShuffle();
  }

  function onTransitionEnd() {
    isShuffling = false;
  }

  function tick(time: number) {
    if (!isPaused && !isShuffling && cs.randomVideo) {
      const delta = time - lastTime;
      progress = Math.min(progress + delta / SHUFFLE_INTERVAL, 1);
      lastTime = time;

      if (progress >= 1) {
        doShuffle();
      }
    } else {
      lastTime = time;
    }
    animationFrame = requestAnimationFrame(tick);
  }

  onMount(() => {
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  });

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
</script>

<div class="channel-section">
  <div class="channel-header">
    <a
      href={cs.channel.url}
      target="_blank"
      rel="noopener noreferrer"
      class="channel-link"
    >
      {#if cs.channel.avatar}
        <img
          src={cs.channel.avatar}
          alt={cs.channel.name}
          class="channel-avatar"
        />
      {:else}
        <div class="channel-avatar skeleton"></div>
      {/if}
      <div class="channel-info">
        <h2>
          <IconYoutube width="24" height="24" />
          {cs.channel.name}
        </h2>
        <p class="channel-description">
          {cs.channel.description}
        </p>
      </div>
      <IconLaunch class="launch-icon" width="24" height="24" />
    </a>
  </div>

  {#if cs.randomVideo}
    <div
      class="video-card-container"
      onmouseenter={() => (isPaused = true)}
      onmouseleave={() => (isPaused = false)}
    >
      <button
        class="shuffle-button"
        class:spinning={isShuffling}
        onclick={shuffleVideo}
        title="Random video ({Math.round((1 - progress) * 10)}s)"
        disabled={isShuffling}
      >
        <svg class="progress-ring" viewBox="0 0 44 44">
          <circle
            class="progress-ring-bg"
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke-width="2"
          />
          <circle
            class="progress-ring-fill"
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke-width="2"
            stroke-dasharray="125.66"
            stroke-dashoffset={125.66 * (1 - progress)}
          />
        </svg>
        <IconShuffle width="18" height="18" />
      </button>
      {#key cs.randomVideo.id}
        <a
          href={`https://www.youtube.com/watch?v=${cs.randomVideo.id}`}
          target="_blank"
          rel="noopener noreferrer"
          class="video-card"
          in:fade={{ duration: 200, delay: 150 }}
          out:fade={{ duration: 150 }}
          onintroend={onTransitionEnd}
        >
          <div class="thumbnail-wrapper">
            <img
              src={cs.randomVideo.thumbnail}
              alt={cs.randomVideo.title}
              class="video-thumbnail"
            />
          </div>
          <div class="video-info">
            <h3 class="video-title">{cs.randomVideo.title}</h3>
            <p class="video-date">
              {formatDate(cs.randomVideo.published)}
            </p>
          </div>
        </a>
      {/key}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "@carbon/colors";

  .channel-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 500px;
    width: 100%;
  }

  .channel-header {
    width: 100%;
  }

  .channel-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: inherit;
    padding: 1.25rem 2rem 1.25rem 1.25rem;
    border-radius: 12px;
    background: var(--cds-layer-01);
    border: 1px solid var(--cds-border-subtle-01);
    transition: all 0.2s ease;
  }

  .channel-link:hover {
    background: var(--cds-layer-selected-01);
  }

  .channel-link :global(.launch-icon) {
    margin-left: auto;
    color: var(--cds-icon-secondary);
  }

  .channel-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #{colors.$red-50};
  }

  .channel-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .channel-info h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--cds-text-primary);
    margin: 0;
  }

  .channel-info h2 :global(svg) {
    color: #{colors.$red-50};
  }

  .channel-description {
    color: var(--cds-text-helper);
    font-size: 0.9rem;
    margin: 0;
  }

  .video-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--cds-layer-01);
    border: 1px solid var(--cds-border-subtle-01);
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
    width: 100%;
  }

  .video-card:hover {
    transform: translateY(-4px);
    background: var(--cds-layer-selected-01);
    border-color: #{colors.$red-50};
    box-shadow: var(--cds-shadow);
  }

  .video-card-container {
    position: relative;
    width: 100%;
    display: grid;
  }

  .video-card-container > .video-card {
    grid-area: 1 / 1;
  }

  .thumbnail-wrapper {
    position: relative;
    aspect-ratio: 16 / 9;
    background: var(--cds-layer-02);
    overflow: hidden;
  }

  .video-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .shuffle-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    background: #{colors.$red-50};
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, transform 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .shuffle-button:hover:not(:disabled),
  .shuffle-button.spinning {
    background: #{colors.$red-60};
    transform: scale(1.05);
  }

  .shuffle-button.spinning :global(svg:not(.progress-ring)) {
    animation: spin 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .shuffle-button:disabled {
    cursor: not-allowed;
  }

  .progress-ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    pointer-events: none;
  }

  .progress-ring-bg {
    stroke: rgba(255, 255, 255, 0.3);
  }

  .progress-ring-fill {
    stroke: white;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.1s linear;
  }

  .video-info {
    padding: 0 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .video-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--cds-text-primary);
    margin: 0;
    line-height: 1.4;
  }

  .video-date {
    font-size: 0.85rem;
    color: var(--cds-text-helper);
    margin: 0;
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

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>
