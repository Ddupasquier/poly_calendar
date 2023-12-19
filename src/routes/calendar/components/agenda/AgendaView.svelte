<script lang="ts">
  import { Common } from "$lib/components";
  import { isLoadingEvents, limitedEvents } from "$lib/stores";
  import { fade } from "svelte/transition";
  import AgendaEvent from "./AgendaEvent.svelte";
</script>

<div class="agenda-view">
  {#if $isLoadingEvents}
    <Common.Loader />
  {:else if $limitedEvents.length === 0}
    <p class="no-events" in:fade>No events under your specifications.</p>
  {:else}
    {#each $limitedEvents as event}
      {#if event}
        <AgendaEvent {event} />
      {/if}
    {/each}
  {/if}
</div>

<style lang="scss">
  .agenda-view {
    display: flex;
    flex-direction: column;
    padding: 1rem 1.5rem;
    background-color: var(--color-bg-0-L4);
    border-radius: var(--primary-border-radius);
    margin-top: 1rem;
  }

  .no-events {
    text-align: center;
    width: 100%;
  }
</style>
