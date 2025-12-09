<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { scrollState } from "../lib/scroll.svelte";
  import IconLogoGithub from "~icons/carbon/logo-github";
  import IconLogoTwitter from "~icons/carbon/logo-twitter";

  let footerElement: HTMLElement;
  let footerOpacityValue = $state(0);
  const footerOpacity = tweened(0, { duration: 400, easing: cubicOut });

  onMount(() => {
    const unsubscribe = footerOpacity.subscribe((v) => (footerOpacityValue = v));
    return () => unsubscribe();
  });

  // Footer fade in based on scroll position
  $effect(() => {
    if (!footerElement || !scrollState.introComplete) return;

    // Track scrollY to make this reactive
    const _ = scrollState.scrollY;

    const footerRect = footerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    // Fade starts when footer top enters viewport, completes when footer bottom reaches viewport bottom
    const fadeStart = viewportHeight;
    const fadeEnd = -footerRect.height + viewportHeight;
    const fadeProgress = Math.max(
      0,
      Math.min(1, (fadeStart - footerRect.top) / (fadeStart - fadeEnd)),
    );
    footerOpacity.set(fadeProgress);
  });
</script>

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

<style lang="scss">
  @use '@carbon/colors';

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
    color: #{colors.$gray-50};
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
    color: #{colors.$gray-80};
    text-decoration: none;
    font-size: 1.5rem;
    transition: color 0.2s ease;
  }

  .footer-links a:hover {
    color: #{colors.$gray-70};
  }
</style>
