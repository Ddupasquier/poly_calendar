<script lang="ts">
  import { allFilteredEventsOccuringOnTheSelectedDate } from "$lib/stores";
  import DayEvent from "./DayEvent.svelte";
</script>

<div class="day-view">
  {#each $allFilteredEventsOccuringOnTheSelectedDate as event}
    {#if event}
      <DayEvent {event} />
    {/if}
  {/each}
</div>

<style lang="scss">
  .day-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: hsl(0, 0%, 97%);
    border-radius: var(--primary-border-radius);
    width: 100%;
    min-width: 30rem;
    max-height: 50rem;
    overflow-y: auto;
    box-sizing: border-box;
  }
</style>
