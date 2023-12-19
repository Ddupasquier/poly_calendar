<script lang="ts">
  import { limitedEvents } from "$lib/stores";
  import AgendaEvent from "./AgendaEvent.svelte";
</script>

<div class="agenda-view">
  {#each $limitedEvents as event}
    {#if event}
      <AgendaEvent {event} />
    {/if}
  {/each}
</div>

<style lang="scss">
  .agenda-view {
    display: flex;
    flex-direction: column;
    padding: 1rem 1.5rem;
    background-color: hsl(0, 0%, 97%);
    border-radius: var(--primary-border-radius);
    margin-top: 1rem;
  }
</style>
