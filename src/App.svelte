<script lang="ts">
  import { onMount } from "svelte";
  import Hero from "./app/Hero.svelte";
  import Music from "./app/Music.svelte";
  import Code from "./app/Code.svelte";
  import Header from "./app/Header.svelte";
  import { fetchRepos } from "./lib/github.svelte";
  import { scrollState, updateMorphValues } from "./lib/scroll.svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import IconLogoGithub from "~icons/carbon/logo-github";
  import IconLogoTwitter from "~icons/carbon/logo-twitter";
  import IconLogoInstagram from "~icons/carbon/logo-instagram";

  fetchRepos("ozwaldorf", [
    "lutgen-rs",
    "flake",
    "carburetor",
    "punfetch",
    "ozboar/zoom-sync",
  ]);

  let heroSection: HTMLElement;
  let codeSection: HTMLElement;
  let musicSection: HTMLElement;
  let footerElement: HTMLElement;
  let footerOpacityValue = $state(0);
  const footerOpacity = tweened(0, { duration: 400, easing: cubicOut });

  function updateCurrentSection() {
    if (!scrollState.introComplete) return;

    const viewportCenter = window.scrollY + window.innerHeight / 2;

    const sections = [
      { id: "hero" as const, el: heroSection },
      { id: "code" as const, el: codeSection },
      { id: "music" as const, el: musicSection },
    ].filter((s) => s.el);

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.el.offsetTop <= viewportCenter) {
        if (scrollState.currentSection !== section.id) {
          scrollState.currentSection = section.id;
          const newHash = section.id === "hero" ? "" : `#${section.id}`;
          history.replaceState(null, "", newHash || window.location.pathname);
        }
        break;
      }
    }
  }

  onMount(() => {
    // Handle initial hash navigation
    const hash = window.location.hash.slice(1);
    if (hash && (hash === "code" || hash === "music")) {
      // Skip intro animations if navigating directly to a section
      scrollState.introComplete = true;
      scrollState.currentSection = hash;
      updateMorphValues(1, true);
      // Wait for sections to render, then scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    }

    // Scroll position tracking
    const handleScroll = () => {
      scrollState.scrollY = window.scrollY;

      if (heroSection && scrollState.introComplete) {
        const heroHeight = heroSection.offsetHeight;
        // Start morph immediately, complete when scrolled past hero
        const morphEnd = heroHeight - 100;

        const progress = Math.max(0, Math.min(1, window.scrollY / morphEnd));
        scrollState.heroProgress = progress;
        updateMorphValues(progress);
      }

      updateCurrentSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial section detection
    handleScroll();

    // Subscribe to footer opacity tweened store
    const unsubscribeFooter = footerOpacity.subscribe(
      (v) => (footerOpacityValue = v),
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribeFooter();
    };
  });

  // Re-run section detection when sections become available
  $effect(() => {
    if (codeSection && musicSection && scrollState.introComplete) {
      updateCurrentSection();
    }
  });

  // Footer fade in based on scroll position
  $effect(() => {
    if (!footerElement || !scrollState.introComplete) return;

    // Track scrollY to make this reactive
    const _ = scrollState.scrollY;

    const footerRect = footerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    // Fade starts when footer top enters viewport, completes when footer bottom reaches viewport bottom
    const fadeStart = viewportHeight; // footer top at bottom of viewport
    const fadeEnd = -footerRect.height + viewportHeight; // footer bottom at bottom of viewport
    const fadeProgress = Math.max(
      0,
      Math.min(1, (fadeStart - footerRect.top) / (fadeStart - fadeEnd)),
    );
    footerOpacity.set(fadeProgress);
  });
</script>

<Header />

<main>
  <section id="hero" bind:this={heroSection}>
    <Hero />
  </section>
  {#if scrollState.introComplete}
    <section id="code" bind:this={codeSection}>
      <Code />
    </section>
    <section id="music" bind:this={musicSection}>
      <Music />
    </section>
  {/if}
</main>

<footer bind:this={footerElement} style:opacity={footerOpacityValue}>
  <span class="farewell quotation">so long, and thanks for all the fish!</span>
  <div class="footer-links">
    <a
      href="https://github.com/ozwaldorf"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconLogoGithub width="32" />
      <span>GitHub</span>
    </a>
    <a
      href="https://twitter.com/ozwaldorf_"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconLogoTwitter width="32" />
      <span>Twitter</span>
    </a>
  </div>
  <img src="/track.png" alt="" />
</footer>

<style>
  main {
    scroll-behavior: smooth;
  }

  section {
    min-height: 100vh;
    position: relative;
  }

  footer {
    width: 100%;
    position: relative;
  }

  footer img {
    width: 100%;
    display: block;
  }

  .farewell {
    position: absolute;
    top: 35%;
    left: 15%;
    color: var(--gray-50);
    font-size: 1.5rem;
  }

  .footer-links {
    position: absolute;
    bottom: 15%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    padding: 0 25%;
  }

  .footer-links a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--gray-80);
    text-decoration: none;
    font-size: 1.5rem;
    transition: color 0.2s ease;
  }

  .footer-links a:hover {
    color: var(--gray-70);
  }
</style>
