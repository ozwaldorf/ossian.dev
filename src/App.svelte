<script lang="ts">
  import { onMount } from "svelte";
  import Hero from "./app/Hero.svelte";
  import Music from "./app/Music.svelte";
  import Tech from "./app/Tech.svelte";
  import Header from "./app/Header.svelte";
  import { fetchRepos } from "./lib/github.svelte";
  import { scrollState, updateMorphValues } from "./lib/scroll.svelte";

  fetchRepos("ozwaldorf", [
    "lutgen-rs",
    "flake",
    "carburetor",
    "punfetch",
    "ozboar/zoom-sync",
  ]);

  let heroSection: HTMLElement;
  let techSection: HTMLElement;
  let musicSection: HTMLElement;

  function updateCurrentSection() {
    if (!scrollState.introComplete) return;

    const viewportCenter = window.scrollY + window.innerHeight / 2;

    const sections = [
      { id: "hero" as const, el: heroSection },
      { id: "tech" as const, el: techSection },
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
    if (hash && (hash === "tech" || hash === "music")) {
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
        const morphEnd = heroHeight;

        const progress = Math.max(0, Math.min(1, window.scrollY / morphEnd));
        scrollState.heroProgress = progress;
        updateMorphValues(progress);
      }

      updateCurrentSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial section detection
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // Re-run section detection when sections become available
  $effect(() => {
    if (techSection && musicSection && scrollState.introComplete) {
      updateCurrentSection();
    }
  });
</script>

<Header />

<main>
  <section id="hero" bind:this={heroSection}>
    <Hero />
  </section>
  {#if scrollState.introComplete}
    <section id="tech" bind:this={techSection}>
      <Tech />
    </section>
    <section id="music" bind:this={musicSection}>
      <Music />
    </section>
  {/if}
</main>

<footer>
  <span class="farewell quotation">so long, and thanks for all the fish!</span>
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
    top: 25%;
    left: 15%;
    color: var(--gray-50);
  }
</style>
