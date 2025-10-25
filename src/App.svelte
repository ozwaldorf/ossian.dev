<script lang="ts">
  import Hero from "./app/Hero.svelte";
  import Music from "./app/Music.svelte";
  import Tech from "./app/Tech.svelte";
  import { fetchRepos } from "./lib/github.svelte";
  import { Router } from "@mateothegreat/svelte5-router";

  const routes = [
    { path: "", component: Hero },
    { path: "tech", component: Tech },
    { path: "music", component: Music },
  ];

  fetchRepos("ozwaldorf", [
    "lutgen-rs",
    "flake",
    "carburetor",
    "ozboar/zoom-sync",
  ]);
</script>

<main>
  <Router {routes} hash />
</main>
