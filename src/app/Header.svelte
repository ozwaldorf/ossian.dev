<script lang="ts">
  import { receive } from "../lib/transition.svelte";
  import { route, active } from "@mateothegreat/svelte5-router";
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
      <a href="/#/work" use:route use:active>Work</a>
      <a href="/#/projects" use:route use:active>Projects</a>
      <a href="/#/music" use:route use:active>Music</a>
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
    max-width: 1200px;
    margin: 0 auto;
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
    color: white;
    margin: 0;
  }

  .title {
    font-size: 1rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  nav {
    margin-left: auto;
    display: flex;
    gap: 2rem;
  }

  nav a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    position: relative;
  }

  nav a:hover {
    color: rgba(255, 255, 255, 1);
  }
</style>
