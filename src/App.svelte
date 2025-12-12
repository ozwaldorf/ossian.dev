<script lang="ts">
  import { onMount } from "svelte";
  import type { Component } from "svelte";
  import Hero from "./app/Hero.svelte";
  import Header from "./app/Header.svelte";

  let heroSection = $state<HTMLElement | undefined>(undefined);

  // Check for initial hash to determine if we should load content immediately
  const initialHash =
    typeof window !== "undefined" ? window.location.hash.slice(1) : "";
  const validHashes = ["code", "music", "bands", "links"];
  const hasValidHash = validHashes.includes(initialHash);

  // Dynamic import of content chunk
  let Content = $state<Component<{
    heroSection: HTMLElement | undefined;
    initialHash?: string;
  }> | null>(null);
  let loading = false;

  async function loadContent() {
    if (loading || Content) return;
    loading = true;
    const module = await import("./app/Content.svelte");
    Content = module.default;
  }

  // Preload content during idle time
  onMount(() => {
    if (hasValidHash) {
      loadContent();
    } else {
      requestIdleCallback(() => loadContent());
    }
  });
</script>

<Header />

<main>
  <section id="hero" bind:this={heroSection}>
    <Hero />
  </section>
  {#if Content}
    <Content
      {heroSection}
      initialHash={hasValidHash ? initialHash : undefined}
    />
  {/if}
</main>

<style>
  main {
    scroll-behavior: smooth;
  }

  section {
    min-height: 100vh;
    position: relative;
  }
</style>
