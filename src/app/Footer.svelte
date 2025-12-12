<script module lang="ts">
  declare const __COMMIT_HASH__: string;
  declare const __BUILD_DATE__: string;
</script>

<script lang="ts">
  const commitHash = __COMMIT_HASH__;
  const buildDateObj = new Date(__BUILD_DATE__);
  const buildDate = `${buildDateObj.toLocaleDateString("en-US", { month: "short" })} ${buildDateObj.getDate()}`;
  const year = buildDateObj.getFullYear();
</script>

<div class="footer-content">
  <img src="/track.png" alt="" />
  <span class="farewell quotation">so long, and thanks for all the fish!</span>
  <div class="footer-meta">
    <span>(c) {year} Ossian Mapes</span>
    <span class="separator">.</span>
    <span>Built on {buildDate}</span>
    <span class="separator">.</span>
    <a
      href="https://github.com/ozwaldorf/ossian.dev/commit/{commitHash}"
      target="_blank"
      rel="noopener noreferrer"
    >
      Commit {commitHash}
    </a>
  </div>
</div>

<style lang="scss">
  .footer-content {
    width: 100%;
    position: relative;
  }

  .footer-content img {
    width: 100%;
    display: block;
  }

  .farewell {
    position: absolute;
    top: 35%;
    left: 15%;
    color: var(--cds-text-helper);
    font-size: clamp(1rem, 3vw, 2.625rem);
  }

  .footer-meta {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: monospace;
    font-size: clamp(0.6rem, 1.5vw, 0.85rem);
    color: var(--cds-background);
    z-index: 10;
  }

  .footer-meta a {
    color: var(--cds-background);
    text-decoration: none;
  }

  .footer-meta a:hover {
    color: #1a3a5c;
  }

  .separator {
    opacity: 0.5;
  }
</style>
