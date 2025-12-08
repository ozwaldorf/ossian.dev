<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { send, typewriter } from "../lib/transition.svelte";
  import { route } from "@mateothegreat/svelte5-router";
  import IconCode from "~icons/carbon/code";
  import IconMusic from "~icons/carbon/music";

  let step = $state(0);
</script>

<div class="hero">
  <div
    class="profile-image"
    in:fade={{ duration: 1000 }}
    out:send={{ key: "profile-image" }}
    onintroend={() => (step = 1)}
  >
    <img src="./ossian.jpg" alt="Profile" />
  </div>

  <div out:send={{ key: "profile-name" }}>
    {#if step >= 1}
      <div in:slide>
        <h1
          class="name"
          in:typewriter={{ speed: 1, delay: 200 }}
          onintroend={() => (step = 2)}
        >
          Ossian Mapes
        </h1>
      </div>
    {/if}
  </div>

  <div out:send={{ key: "profile-title" }}>
    {#if step >= 2}
      <div in:slide>
        <nav class="hero-nav">
          <a
            href="#tech"
            use:route
            in:fade={{ delay: 600, duration: 400 }}
            out:send={{ key: "nav-tech" }}
          >
            <IconCode width="20" height="20" />
            <span>Tech</span>
          </a>
          <a
            href="#music"
            use:route
            in:fade={{ delay: 1400, duration: 400 }}
            out:send={{ key: "nav-music" }}
          >
            <IconMusic width="20" height="20" />
            <span>Music</span>
          </a>
        </nav>
      </div>
    {/if}
  </div>
</div>

<style>
  .hero {
    text-align: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .profile-image {
    width: 160px;
    height: 160px;
    margin: 0 auto 2rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 10px 40px color-mix(in oklab, var(--black) 30%, transparent);
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .name {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 1rem 0;
    min-height: 1lh;
  }

  .hero-nav {
    display: flex;
    gap: 2rem;
    justify-content: center;
  }

  .hero-nav a {
    color: color-mix(in oklab, var(--white) 70%, transparent);
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    transition: color 0.2s;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hero-nav a:hover {
    color: var(--white);
  }
</style>
