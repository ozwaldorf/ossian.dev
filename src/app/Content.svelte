<script lang="ts">
  import { onMount } from "svelte";
  import Music from "./Music.svelte";
  import Bands from "./Bands.svelte";
  import Code from "./Code.svelte";
  import Links from "./Links.svelte";
  import Footer from "./Footer.svelte";
  import { scrollState, updateMorphValues, sectionOpacity } from "../lib/scroll.svelte";

  interface Props {
    heroSection: HTMLElement | undefined;
    initialHash?: string;
  }

  let { heroSection, initialHash }: Props = $props();

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

    const visibleFromBottom = viewportHeight - rect.top;
    const fadeInProgress = Math.max(0, Math.min(1, visibleFromBottom / visibleThreshold));

    const visibleFromTop = rect.bottom;
    const fadeOutProgress = Math.max(0, Math.min(1, visibleFromTop / visibleThreshold));

    tween.set(Math.min(fadeInProgress, fadeOutProgress));
  }

  onMount(() => {
    // Handle initial hash navigation
    if (initialHash) {
      scrollState.introComplete = true;
      scrollState.currentSection = initialHash as typeof scrollState.currentSection;
      updateMorphValues(1, true);
      sectionOpacity.code.set(1, { duration: 0 });
      sectionOpacity.music.set(1, { duration: 0 });
      sectionOpacity.bands.set(1, { duration: 0 });
      sectionOpacity.links.set(1, { duration: 0 });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(initialHash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    }

    const handleScroll = () => {
      scrollState.scrollY = window.scrollY;

      if (heroSection && scrollState.introComplete) {
        const heroHeight = heroSection.offsetHeight;
        const morphEnd = heroHeight - 100;

        const progress = Math.max(0, Math.min(1, window.scrollY / morphEnd));
        scrollState.heroProgress = progress;
        updateMorphValues(progress);

        updateSectionOpacity(codeSection, sectionOpacity.code);
        updateSectionOpacity(musicSection, sectionOpacity.music);
        updateSectionOpacity(bandsSection, sectionOpacity.bands);
        updateSectionOpacity(linksSection, sectionOpacity.links);
        updateSectionOpacity(footerSection, sectionOpacity.footer);
      }

      updateCurrentSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  $effect(() => {
    if (codeSection && musicSection && linksSection && scrollState.introComplete) {
      updateCurrentSection();
    }
  });
</script>

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
<footer bind:this={footerSection} style:opacity={sectionOpacity.footer.current}>
  <Footer />
</footer>

<style>
  section {
    min-height: auto;
    position: relative;
  }
</style>
