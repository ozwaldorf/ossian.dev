<script lang="ts">
  import IconLogoGithub from "~icons/carbon/logo-github";
  import IconLogoX from "~icons/carbon/logo-x";
  import IconLink from "~icons/carbon/link";
  import IconLaunch from "~icons/carbon/launch";
</script>

<div class="links-section">
  <div class="links-header">
    <h2><IconLink width="28" height="28" /> Links</h2>
  </div>

  <div class="links-list">
    <a
      href="https://github.com/ozwaldorf"
      target="_blank"
      rel="noopener noreferrer"
      class="link-card"
    >
      <IconLogoGithub width="24" height="24" />
      <span class="link-text">GitHub</span>
      <IconLaunch class="launch-icon" width="20" height="20" />
    </a>
    <a
      href="https://x.com/ozwaldorf_"
      target="_blank"
      rel="noopener noreferrer"
      class="link-card"
    >
      <IconLogoX width="24" height="24" />
      <span class="link-text">x.com</span>
      <IconLaunch class="launch-icon" width="20" height="20" />
    </a>
    <a
      href="https://ossian.sawthat.band"
      target="_blank"
      rel="noopener noreferrer"
      class="link-card"
    >
      <span>✌️</span>
      <span class="link-text">sawthat.band</span>
      <IconLaunch class="launch-icon" width="20" height="20" />
    </a>
  </div>
</div>

<style lang="scss">
  .links-section {
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .links-header h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 2rem;
    font-weight: 600;
    color: var(--cds-text-primary);
    margin: 0;
  }

  .links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
  }

  .link-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem 1rem 1.25rem;
    background: var(--cds-layer-01);
    border: 1px solid var(--cds-border-subtle-01);
    border-radius: 12px;
    text-decoration: none;
    color: var(--cds-text-primary);
    transition: all 0.2s ease;
  }

  .link-card:hover {
    background: var(--cds-layer-selected-01);
  }

  .link-text {
    flex: 1;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .link-card :global(.launch-icon) {
    color: var(--cds-icon-secondary);
  }
</style>
