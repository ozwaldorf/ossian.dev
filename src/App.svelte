<script lang="ts">
  import Hero from "./app/Hero.svelte";
  import Projects from "./app/Projects.svelte";
  import Work from "./app/Work.svelte";
  import { Router } from "@mateothegreat/svelte5-router";

  const routes = [
    { path: "/", component: Hero },
    { path: "/work", component: Work },
    { path: "/projects", component: Projects },
  ];
</script>

<main>
  <Router {routes} hash />
</main>

<style>
</style>
