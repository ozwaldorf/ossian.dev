<script lang="ts">
  import { onMount } from "svelte";
  import { headerOpacity, positionGetters } from "../lib/scroll.svelte";
  import IconHome from "~icons/carbon/home";
  import IconCode from "~icons/carbon/code";
  import IconMusic from "~icons/carbon/music";
  import IconLink from "~icons/carbon/link";

  // Skeleton refs for position capture
  let skeletonProfile: HTMLElement;
  let skeletonName: HTMLElement;
  let skeletonTitle: HTMLElement;
  let skeletonHomeLink: HTMLElement;
  let skeletonCodeLink: HTMLElement;
  let skeletonMusicLink: HTMLElement;
  let skeletonLinksLink: HTMLElement;

  function getTargetPositions() {
    if (
      !skeletonProfile ||
      !skeletonName ||
      !skeletonTitle ||
      !skeletonHomeLink ||
      !skeletonCodeLink ||
      !skeletonMusicLink ||
      !skeletonLinksLink
    ) {
      return null;
    }
    return {
      profile: skeletonProfile.getBoundingClientRect(),
      name: skeletonName.getBoundingClientRect(),
      title: skeletonTitle.getBoundingClientRect(),
      homeLink: skeletonHomeLink.getBoundingClientRect(),
      codeLink: skeletonCodeLink.getBoundingClientRect(),
      musicLink: skeletonMusicLink.getBoundingClientRect(),
      linksLink: skeletonLinksLink.getBoundingClientRect(),
    };
  }

  // Register position getter on mount
  onMount(() => {
    positionGetters.getHeaderPositions = getTargetPositions;
  });
</script>

<!-- Hidden skeleton for target position reference -->
<header class="skeleton" aria-hidden="true">
  <div class="header-content">
    <div bind:this={skeletonProfile} class="profile-image">
      <img src="./ossian.webp" alt="" />
    </div>
    <div class="info">
      <div class="name-title">
        <div bind:this={skeletonName} class="name">Ossian Mapes</div>
        <div bind:this={skeletonTitle} class="title">Full Stack Developer</div>
      </div>
      <nav>
        <a bind:this={skeletonHomeLink} href="./" class="nav-link">
          <IconHome width="20" height="20" />
          <span>Home</span>
        </a>
        <a bind:this={skeletonCodeLink} href="#code" class="nav-link">
          <IconCode width="20" height="20" />
          <span>Code</span>
        </a>
        <a bind:this={skeletonMusicLink} href="#music" class="nav-link">
          <IconMusic width="20" height="20" />
          <span>Music</span>
        </a>
        <a bind:this={skeletonLinksLink} href="#links" class="nav-link">
          <IconLink width="20" height="20" />
          <span>Links</span>
        </a>
      </nav>
    </div>
  </div>
</header>

<!-- Visible header background -->
<header
  style:opacity={$headerOpacity}
  style:pointer-events={$headerOpacity > 0.1 ? "auto" : "none"}
>
  <div class="header-content">
    <div class="spacer"></div>
  </div>
</header>

<style lang="scss">
  header.skeleton {
    opacity: 0;
    pointer-events: none;
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    padding: 1rem 2rem 4.5rem 2rem;
    background: linear-gradient(
      to bottom in oklab,
      var(--cds-background) 0%,
      var(--cds-background) 10%,
      transparent 100%
    );
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .profile-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .name {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--cds-text-on-color);
  }

  .title {
    font-size: 1rem;
    font-weight: 400;
    color: var(--cds-text-secondary);
  }

  nav {
    margin-left: auto;
    display: flex;
    gap: 2rem;
  }

  .info {
    display: contents;
  }

  .name-title {
    display: contents;
  }

  @media (max-width: 760px) {
    .header-content {
      flex-wrap: nowrap;
    }

    .info {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.25rem;
    }

    .name-title {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    nav {
      margin-left: 0;
      gap: 1rem;
    }
  }

  .nav-link {
    color: var(--cds-text-secondary);
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s;
  }

  .nav-link:hover {
    color: var(--cds-text-on-color);
  }

  .spacer {
    flex: 1;
  }
</style>
