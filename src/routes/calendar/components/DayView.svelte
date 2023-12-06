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
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: hsl(0, 0%, 97%);
    border-radius: var(--primary-border-radius);
    width: 100%;
    box-sizing: border-box;

    .event {
      padding: 0.5rem;
      border-left: 4px solid var(--color-theme-2-L3);
      background-color: #fff;
      border-radius: 4px;
      box-shadow: inset 0 2px 4px hsl(0, 0%, 0%, 0.051);
      transition: all 0.2s ease-in-out;

      h2 {
        font-size: 0.85rem;
        color: #333;
        margin: 0 0 0.5rem 0;

        @media (max-width: 600px) {
          font-size: 0.75rem;
        }
      }

      p {
        font-size: 0.75rem;
        color: #666;
        margin: 0;

        @media (max-width: 600px) {
          font-size: 0.7rem;
        }
      }

      &:hover {
        background-color: var(--color-theme-2-L2);
        border-left: 14px solid var(--color-theme-2-L3);
      }
    }
  }
</style>
