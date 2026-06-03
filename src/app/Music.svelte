<script lang="ts">
  import { youtubeChannels } from "../lib/youtube.svelte";
  import ChannelCard from "./ChannelCard.svelte";
</script>

<div class="music-section">
  <div class="music-header">
    <h2 class="section-heading">Music</h2>
  </div>

  <div class="channels">
    {#each youtubeChannels as cs (cs.channel.url)}
      <ChannelCard {cs} />
    {/each}
  </div>
</div>

<style lang="scss">
  .music-section {
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .channels {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 2.5rem;
    width: 100%;
  }

  @media (max-width: 760px) {
    .music-section {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>
