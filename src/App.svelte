<script lang="ts">
  import Hero from "./app/Hero.svelte";
  import Music from "./app/Music.svelte";
  import Projects from "./app/Projects.svelte";
  import Work from "./app/Work.svelte";
  import { fetchRepos } from "./lib/github.svelte";
  import { Router } from "@mateothegreat/svelte5-router";

  const routes = [
    { path: "/", component: Hero },
    { path: "/work", component: Work },
    { path: "/projects", component: Projects },
    { path: "/music", component: Music },
  ];

  fetchRepos("ozwaldorf", ["lutgen-rs", "flake", "carburetor"]);
</script>

<main>
  <Router {routes} hash />
</main>
