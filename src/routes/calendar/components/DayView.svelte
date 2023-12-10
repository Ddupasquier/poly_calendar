<script lang="ts">
  import type { CalendarEvent } from "../types";
  import {filteredEvents, allFilteredEventsOccuringOnTheSelectedDate} from "$lib/stores";

  export let events: CalendarEvent[] = [];

  $: console.log('numberLimitedEvents', events);
  $: console.log('filteredEvents', $allFilteredEventsOccuringOnTheSelectedDate);
</script>

<div class="day-view">
  {#each $allFilteredEventsOccuringOnTheSelectedDate as event}
    {#if event}
      <div class="event">
        <h2>{event.title}</h2>
        <p>
          {event.startDate}<br />
          {event.endDate}
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
    max-height: 50rem;
    overflow-y: auto;
    box-sizing: border-box;

    .event {
      padding: 0.5rem;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: inset 15px 0 0 -10px var(--color-theme-2-L3);
      transition: box-shadow 1s ease-in;
      cursor: pointer;

      &:hover {
        // background-color: var(--color-theme-2-L2);
        box-shadow: inset 1000px 0 0 -10px var(--color-theme-2-L3);
      }

      h2 {
        font-size: 0.85rem;
        color: #333;
        margin: 0 0 0.5rem 0;
        user-select: none;

        @media (max-width: 600px) {
          font-size: 0.75rem;
        }
      }

      p {
        font-size: 0.75rem;
        color: #666;
        margin: 0;
        user-select: none;

        @media (max-width: 600px) {
          font-size: 0.7rem;
        }
      }
    }
  }
</style>
