<script lang="ts">
  import { onMount } from "svelte";
  import Hero from "./app/Hero.svelte";
  import Music from "./app/Music.svelte";
  import Bands from "./app/Bands.svelte";
  import Code from "./app/Code.svelte";
  import Header from "./app/Header.svelte";
  import Links from "./app/Links.svelte";
  import Footer from "./app/Footer.svelte";
  import { scrollState, updateMorphValues, sectionOpacity } from "./lib/scroll.svelte";

  let heroSection = $state<HTMLElement | undefined>(undefined);
  let codeSection = $state<HTMLElement | undefined>(undefined);
  let musicSection = $state<HTMLElement | undefined>(undefined);
  let bandsSection = $state<HTMLElement | undefined>(undefined);
  let linksSection = $state<HTMLElement | undefined>(undefined);
  let footerSection = $state<HTMLElement | undefined>(undefined);

  function updateCurrentSection() {
    if (!scrollState.introComplete) return;

    const viewportCenter = window.scrollY + window.innerHeight / 2;

    const sections = [
      { id: "hero" as const, el: heroSection },
      { id: "code" as const, el: codeSection },
      { id: "music" as const, el: musicSection },
      { id: "bands" as const, el: bandsSection },
      { id: "links" as const, el: linksSection },
    ].filter((s) => s.el);

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.el && section.el.offsetTop <= viewportCenter) {
        if (scrollState.currentSection !== section.id) {
          scrollState.currentSection = section.id;
          const newHash = section.id === "hero" ? "" : `#${section.id}`;
          history.replaceState(null, "", newHash || window.location.pathname);
        }
        break;
      }
    }
  }

  function updateSectionOpacity(
    el: HTMLElement | undefined,
    tween: typeof sectionOpacity.code,
  ) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const visibleThreshold = viewportHeight * 0.5;

    // Fade in as section enters viewport from below
    const visibleFromBottom = viewportHeight - rect.top;
    const fadeInProgress = Math.max(0, Math.min(1, visibleFromBottom / visibleThreshold));

    // Fade out as section leaves viewport from top
    const visibleFromTop = rect.bottom;
    const fadeOutProgress = Math.max(0, Math.min(1, visibleFromTop / visibleThreshold));

    // Combine: section is visible when both conditions are met
    tween.set(Math.min(fadeInProgress, fadeOutProgress));
  }

  onMount(() => {
    // Handle initial hash navigation
    const hash = window.location.hash.slice(1);
    if (hash && (hash === "code" || hash === "music" || hash === "bands" || hash === "links")) {
      // Skip intro animations if navigating directly to a section
      scrollState.introComplete = true;
      scrollState.currentSection = hash;
      updateMorphValues(1, true);
      // Set all section opacities to 1 instantly
      sectionOpacity.code.set(1, { duration: 0 });
      sectionOpacity.music.set(1, { duration: 0 });
      sectionOpacity.bands.set(1, { duration: 0 });
      sectionOpacity.links.set(1, { duration: 0 });
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

        // Update section opacities
        updateSectionOpacity(codeSection, sectionOpacity.code);
        updateSectionOpacity(musicSection, sectionOpacity.music);
        updateSectionOpacity(bandsSection, sectionOpacity.bands);
        updateSectionOpacity(linksSection, sectionOpacity.links);
        updateSectionOpacity(footerSection, sectionOpacity.footer);
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
    if (codeSection && musicSection && linksSection && scrollState.introComplete) {
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
    <section id="code" bind:this={codeSection} style:opacity={sectionOpacity.code.current}>
      <Code />
    </section>
    <section id="music" bind:this={musicSection} style:opacity={sectionOpacity.music.current}>
      <Music />
    </section>
    <section id="bands" bind:this={bandsSection} style:opacity={sectionOpacity.bands.current}>
      <Bands />
    </section>
    <section id="links" bind:this={linksSection} style:opacity={sectionOpacity.links.current}>
      <Links />
    </section>
  {/if}
</main>

<footer bind:this={footerSection} style:opacity={sectionOpacity.footer.current}>
  <Footer />
</footer>

<style>
  main {
    scroll-behavior: smooth;
  }

  section {
    min-height: 100vh;
    position: relative;
  }

  section#code,
  section#music,
  section#bands,
  section#links {
    min-height: auto;
  }
</style>
