<script>
  import { fade } from "svelte/transition";
  import Projects from "./Projects.svelte";
  import Work from "./Work.svelte";
  import Header from "./Header.svelte";
</script>

<Header />
<div class="page-container">
  <div class="page-content" transition:fade>
    <Projects />
    <Work />
  </div>
</div>

<style>
  .page-container {
    min-height: 100vh;
  }

  .page-content {
    padding-top: 80px;
  }
</style>
