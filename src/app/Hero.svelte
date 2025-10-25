<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { send, typewriter } from "../lib/transition.svelte";
  import { route } from "@mateothegreat/svelte5-router";

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
          in:typewriter={{ speed: 2 }}
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
        <h2
          class="title"
          in:typewriter={{ speed: 2 }}
          onintroend={() => (step = 3)}
        >
          Full Stack Developer
        </h2>
      </div>
    {/if}
  </div>

  {#if step >= 3}
    <div in:slide>
      <nav class="hero-nav" in:fade>
        <a href="#tech" use:route out:send={{ key: "nav-tech" }}>Tech</a>
        <a href="#music" use:route out:send={{ key: "nav-music" }}>Music</a>
      </nav>
    </div>
  {/if}
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
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .name {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin: 0 0 1rem 0;
    min-height: 1lh;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    min-height: 1lh;
  }

  .hero-nav {
    margin-top: 2rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
  }

  .hero-nav a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    transition: color 0.2s;
    position: relative;
  }

  .hero-nav a:hover {
    color: rgba(255, 255, 255, 1);
  }
</style>
