<script lang="ts">
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { scrollState } from "../lib/scroll.svelte";

  let footerElement: HTMLElement;
  const footerOpacity = new Tween(0, { duration: 400, easing: cubicOut });

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

<footer bind:this={footerElement} style:opacity={footerOpacity.current}>
  <span class="farewell quotation">so long, and thanks for all the fish!</span>
  <img src="/track.png" alt="" />
</footer>

<style lang="scss">
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
    color: var(--cds-text-helper);
    font-size: clamp(1rem, 3vw, 2.625rem);
  }
</style>
