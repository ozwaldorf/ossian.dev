<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { typewriter, fadeSlide } from "../lib/transition.svelte";
  import {
    scrollState,
    morphProgress,
    profileSize,
    nameSize,
    titleSize,
    headerOpacity,
    positionGetters,
    type ElementPositions,
  } from "../lib/scroll.svelte";
  import IconCode from "~icons/carbon/code";
  import IconMusic from "~icons/carbon/music";
  import IconHome from "~icons/carbon/home";

  // Check for hash to skip intro
  const skipIntro =
    typeof window !== "undefined" && window.location.hash.length > 1;
  let step = $state(skipIntro ? 4 : 0);
  let mounted = $state(false);

  // Skeleton refs - always in DOM at natural positions
  let skeletonProfile: HTMLElement;
  let skeletonName: HTMLElement;
  let skeletonTitle: HTMLElement;
  let skeletonHomeLink: HTMLElement;
  let skeletonTechLink: HTMLElement;
  let skeletonMusicLink: HTMLElement;

  // Target positions from header skeleton (fixed, captured once)
  let targetPos = $state<ElementPositions | null>(null);

  function captureHeaderPositions() {
    // Capture header skeleton positions (fixed position, doesn't change with scroll)
    if (positionGetters.getHeaderPositions) {
      targetPos = positionGetters.getHeaderPositions();
    }
  }

  // Get current hero skeleton positions (these move with scroll, so get them live)
  function getHeroPositions(): ElementPositions | null {
    if (
      skeletonProfile &&
      skeletonName &&
      skeletonTitle &&
      skeletonHomeLink &&
      skeletonTechLink &&
      skeletonMusicLink
    ) {
      return {
        profile: skeletonProfile.getBoundingClientRect(),
        name: skeletonName.getBoundingClientRect(),
        title: skeletonTitle.getBoundingClientRect(),
        homeLink: skeletonHomeLink.getBoundingClientRect(),
        techLink: skeletonTechLink.getBoundingClientRect(),
        musicLink: skeletonMusicLink.getBoundingClientRect(),
      };
    }
    return null;
  }

  function onIntroComplete() {
    step = 4;
    scrollState.introComplete = true;
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  // On mount: capture header positions and handle skip intro
  onMount(() => {
    captureHeaderPositions();
    if (skipIntro) {
      scrollState.introComplete = true;
    }
    // Trigger mount after a tick so transitions can fire
    mounted = true;

    // Recapture header positions on resize
    const handleResize = () => {
      captureHeaderPositions();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const linkWidth = 70;

  // Default positions for when targetPos is null (before header mounts)
  const defaultRect = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  } as DOMRect;
  const defaultPositions = {
    profile: defaultRect,
    name: defaultRect,
    title: defaultRect,
    homeLink: defaultRect,
    techLink: defaultRect,
    musicLink: defaultRect,
  };

  // Interpolate between hero (start) and header (target) positions
  // Hero positions come from live getBoundingClientRect, header positions are stored
  function lerp(start: number, end: number, t: number) {
    return start + (end - start) * t;
  }

  function getInterpolatedPos(key: keyof ElementPositions) {
    const hero = getHeroPositions();
    const header = targetPos;
    if (!hero || !header) {
      return { top: 0, left: 0 };
    }
    return {
      top: lerp(hero[key].top, header[key].top, $morphProgress),
      left: lerp(hero[key].left, header[key].left, $morphProgress),
    };
  }

  let profileTop = $derived(getInterpolatedPos("profile").top);
  let profileLeft = $derived(getInterpolatedPos("profile").left);
  let nameTop = $derived(getInterpolatedPos("name").top);
  let nameLeft = $derived(getInterpolatedPos("name").left);
  let titleTop = $derived(getInterpolatedPos("title").top);
  let titleLeft = $derived(getInterpolatedPos("title").left);
  let techLinkTop = $derived(getInterpolatedPos("techLink").top);
  let techLinkLeft = $derived(getInterpolatedPos("techLink").left);
  let musicLinkTop = $derived(getInterpolatedPos("musicLink").top);
  let musicLinkLeft = $derived(getInterpolatedPos("musicLink").left);
  let homeLinkTop = $derived(getInterpolatedPos("homeLink").top);
  let homeLinkLeft = $derived(getInterpolatedPos("homeLink").left);
</script>

<!-- Hidden skeleton for position reference - always in DOM -->
<div class="hero skeleton" aria-hidden="true">
  <div bind:this={skeletonProfile} class="profile-image">
    <img src="./ossian.jpg" alt="" />
  </div>
  <div bind:this={skeletonName} class="name-container">
    <h1 class="name">Ossian Mapes</h1>
  </div>
  <div bind:this={skeletonTitle} class="title-container">
    <span class="title">Full Stack Developer</span>
  </div>
  <div class="nav-container">
    <nav class="hero-nav">
      <a bind:this={skeletonHomeLink} href="#" class="nav-link home-skeleton">
        <IconHome width="20" height="20" />
        <span>Home</span>
      </a>
      <a bind:this={skeletonTechLink} href="#tech" class="nav-link">
        <IconCode width="20" height="20" />
        <span>Tech</span>
      </a>
      <a bind:this={skeletonMusicLink} href="#music" class="nav-link">
        <IconMusic width="20" height="20" />
        <span>Music</span>
      </a>
    </nav>
  </div>
</div>

<!-- Visible elements -->
<div class="hero">
  {#if skipIntro || mounted}
    <!-- Normal intro animation flow -->
    <div
      class="profile-image"
      class:morphing={scrollState.introComplete}
      style:--profile-size="{$profileSize}px"
      style:top={scrollState.introComplete ? `${profileTop}px` : undefined}
      style:left={scrollState.introComplete ? `${profileLeft}px` : undefined}
      in:fade={{ duration: 1000 }}
      onintroend={() => (step = 1)}
    >
      <img src="./ossian.jpg" alt="Profile" />
    </div>

    <div
      class="name-container"
      class:morphing={scrollState.introComplete}
      style:--name-size="{$nameSize}rem"
      style:top={scrollState.introComplete ? `${nameTop}px` : undefined}
      style:left={scrollState.introComplete ? `${nameLeft}px` : undefined}
    >
      {#if step >= 1}
        <div in:slide>
          <h1
            class="name"
            in:typewriter={{ speed: 2, delay: 200 }}
            onintroend={() => setTimeout(() => (step = 2), 300)}
          >
            Ossian Mapes
          </h1>
        </div>
      {/if}
    </div>

    {#if step >= 2}
      <div
        class="title-container"
        class:morphing={scrollState.introComplete}
        style:--title-size="{$titleSize}rem"
        style:top={scrollState.introComplete ? `${titleTop}px` : undefined}
        style:left={scrollState.introComplete ? `${titleLeft}px` : undefined}
        in:fadeSlide={{ duration: 800 }}
        onintroend={() => setTimeout(() => (step = 3), 300)}
      >
        <span class="title">Full Stack Developer</span>
      </div>
    {/if}

    {#if step >= 3}
      <div
        in:fadeSlide={{ duration: 800 }}
        class="nav-container"
        onintroend={onIntroComplete}
      >
        <nav class="hero-nav" class:morphing={scrollState.introComplete}>
          <a
            href="./"
            class="nav-link"
            class:morphing={scrollState.introComplete}
            style:top={scrollState.introComplete
              ? `${homeLinkTop}px`
              : undefined}
            style:left={scrollState.introComplete
              ? `${homeLinkLeft}px`
              : undefined}
            style:opacity={$headerOpacity}
            style:pointer-events={$headerOpacity > 0.5 ? "auto" : "none"}
            class:active={scrollState.currentSection === "hero"}
            onclick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
          >
            <IconHome width="20" height="20" />
            <span>Home</span>
          </a>
          <a
            href="#tech"
            class="nav-link"
            class:morphing={scrollState.introComplete}
            style:top={scrollState.introComplete
              ? `${techLinkTop}px`
              : undefined}
            style:left={scrollState.introComplete
              ? `${techLinkLeft}px`
              : undefined}
            class:active={scrollState.currentSection === "tech"}
            onclick={(e) => {
              e.preventDefault();
              scrollToSection("tech");
            }}
          >
            <IconCode width="20" height="20" />
            <span>Tech</span>
          </a>
          <a
            href="#music"
            class="nav-link"
            class:morphing={scrollState.introComplete}
            style:top={scrollState.introComplete
              ? `${musicLinkTop}px`
              : undefined}
            style:left={scrollState.introComplete
              ? `${musicLinkLeft}px`
              : undefined}
            class:active={scrollState.currentSection === "music"}
            onclick={(e) => {
              e.preventDefault();
              scrollToSection("music");
            }}
          >
            <IconMusic width="20" height="20" />
            <span>Music</span>
          </a>
        </nav>
      </div>
    {/if}
  {/if}
</div>

<style>
  .hero.skeleton {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    inset: 0;
  }

  .hero {
    text-align: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .profile-image {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 10px 40px color-mix(in oklab, var(--black) 30%, transparent);
  }

  .profile-image.morphing {
    width: var(--profile-size);
    height: var(--profile-size);
    position: fixed;
    margin: 0;
    z-index: 1001;
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .name-container.morphing {
    position: fixed;
    z-index: 1001;
    text-align: left;
  }

  .name {
    font-size: var(--name-size, 2.5rem);
    font-weight: 700;
    color: var(--white);
    margin: 0;
    min-height: 1lh;
  }

  .name-container.morphing .name {
    margin: 0;
  }

  .title-container.morphing {
    position: fixed;
    z-index: 1001;
  }

  .title {
    font-size: var(--title-size, 1.5rem);
    font-weight: 400;
    color: color-mix(in oklab, var(--white) 50%, transparent);
    white-space: nowrap;
  }

  .hero-nav {
    display: flex;
    gap: 2rem;
    justify-content: center;
    position: relative;
  }

  .hero-nav .nav-link.home-skeleton,
  .hero-nav .nav-link:first-child:not(.morphing) {
    position: absolute;
  }

  .nav-link {
    color: color-mix(in oklab, var(--white) 70%, transparent);
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link.morphing {
    position: fixed;
    z-index: 1001;
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--white);
  }
</style>
