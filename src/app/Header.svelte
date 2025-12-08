<script lang="ts">
  import { receive } from "../lib/transition.svelte";
  import { route } from "@mateothegreat/svelte5-router";
  import IconHome from "~icons/carbon/home";
  import IconCode from "~icons/carbon/code";
  import IconMusic from "~icons/carbon/music";
</script>

<header>
  <div class="header-content">
    <div class="profile-image" in:receive={{ key: "profile-image" }}>
      <img src="./ossian.jpg" alt="Profile" />
    </div>
    <div
      in:receive={{ key: "profile-name" }}
      onintrostart={() => console.log("Name receiving")}
    >
      <h1 class="name">Ossian Mapes</h1>
    </div>
    <div
      in:receive={{ key: "profile-title" }}
      onintrostart={() => console.log("Title receiving")}
    >
      <h2 class="title">Full Stack Developer</h2>
    </div>
    <nav>
      <a href="./" use:route in:receive={{ key: "nav-home" }}>
        <IconHome width="20" height="20" />
        <span>Home</span>
      </a>
      <a href="#tech" use:route in:receive={{ key: "nav-tech" }}>
        <IconCode width="20" height="20" />
        <span>Tech</span>
      </a>
      <a href="#music" use:route in:receive={{ key: "nav-music" }}>
        <IconMusic width="20" height="20" />
        <span>Music</span>
      </a>
    </nav>
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 1rem 2rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profile-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .name {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--white);
    margin: 0;
  }

  .title {
    font-size: 1rem;
    font-weight: 400;
    color: color-mix(in oklab, var(--white) 80%, transparent);
    margin: 0;
  }

  nav {
    margin-left: auto;
    display: flex;
    gap: 2rem;
  }

  nav a {
    color: color-mix(in oklab, var(--white) 70%, transparent);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  nav a:hover {
    color: var(--white);
  }
</style>
