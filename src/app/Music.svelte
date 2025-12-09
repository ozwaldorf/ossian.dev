<script>
  import IconMusic from "~icons/carbon/music";
</script>

<div class="music-section">
  <div class="sawthat-section">
    <h2>
      <IconMusic width="28" height="28" />
      Music
    </h2>
    <p class="description">Bands I've seen live</p>
    <a href="https://ossian.sawthat.band" target="_blank" rel="noopener noreferrer" class="sawthat-link">
      <span class="sawthat-text">ossian.sawthat.band</span>
      <span class="arrow">→</span>
    </a>
  </div>
</div>

<style>
  .music-section {
    min-height: 100vh;
    padding-top: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sawthat-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    text-align: center;
    padding: 2rem;
  }

  .sawthat-section h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 2rem;
    font-weight: 600;
    color: var(--gray-10);
    margin: 0;
  }

  .description {
    color: var(--gray-50);
    font-size: 1.1rem;
    margin: 0;
  }

  .sawthat-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: color-mix(in oklab, var(--magenta-50) 15%, transparent);
    border: 1px solid color-mix(in oklab, var(--magenta-50) 30%, transparent);
    border-radius: 8px;
    color: var(--magenta-50);
    text-decoration: none;
    font-size: 1.25rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .sawthat-link:hover {
    background: color-mix(in oklab, var(--magenta-50) 25%, transparent);
    border-color: var(--magenta-50);
    transform: translateY(-2px);
  }

  .arrow {
    transition: transform 0.2s ease;
  }

  .sawthat-link:hover .arrow {
    transform: translateX(4px);
  }
</style>
