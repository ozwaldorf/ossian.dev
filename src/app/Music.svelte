<script>
  import { fade } from "svelte/transition";
  import IconConstruction from "~icons/carbon/construction";
  import Header from "./Header.svelte";
</script>

<Header />
<div class="page-container">
  <div class="page-content" transition:fade>
    <div class="construction">
      <IconConstruction width="64" height="64" />
      <h2>Under construction!</h2>
    </div>
  </div>
</div>

<style>
  .page-container {
    min-height: 100vh;
  }

  .page-content {
    padding-top: 80px;
  }

  .construction {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    height: 100%;
    color: var(--gray-60);
  }

  .construction h2 {
    margin: auto;
    font-weight: 500;
  }
</style>
