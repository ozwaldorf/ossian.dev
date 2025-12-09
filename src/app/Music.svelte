<script>
  import IconConstruction from "~icons/carbon/construction";
</script>

<div class="music-section">
  <div class="construction">
    <IconConstruction width="64" height="64" />
    <h2>Under construction!</h2>
  </div>
</div>

<style>
  .music-section {
    min-height: 100vh;
    padding-top: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
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
