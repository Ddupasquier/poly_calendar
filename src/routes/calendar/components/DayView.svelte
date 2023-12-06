<!-- DayView.svelte -->
<script lang="ts">
  import type { CalendarEvent } from "../types";

  export let events: CalendarEvent[] = [];
  // Logic to filter events for the specific day
</script>

<div class="day-view">
  {#each events as event}
    {#if event}
      <div class="event">
        <h2>{event.title}</h2>
        <p>
          {event.startDate?.toTimeString()} - {event.endDate.toTimeString()}
        </p>
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .day-view {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;

    .event {
      padding: 0.5rem;
      margin-bottom: 1rem;
      border-left: 4px solid #5b9bd5;
      background-color: #f2f2f2;
      border-radius: 4px;

      h2 {
        font-size: 1rem;
        color: #333;
        margin: 0 0 0.5rem 0;
      }

      p {
        font-size: 0.8rem;
        color: #666;
        margin: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
