<script lang="ts">
  import {
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    addWeeks,
    format,
  } from "date-fns";
  import type { CalendarEvent } from "../types";

  export let events: CalendarEvent[] = [];

  // This could be dynamic, e.g., passed as a prop or managed by a store for reactivity
  const now = new Date();

  // Calculate the start and end of the week
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Set weekStartsOn: 1 for Monday as the first day of the week
  const end = endOfWeek(now, { weekStartsOn: 1 });

  // Create an array of days for the current week
  const weekDays = eachDayOfInterval({ start, end });

  function eventFallsOnDay(event: CalendarEvent, day: Date): boolean {
    return isSameDay(event.startDate, day) || isSameDay(event.endDate, day);
  }
</script>

<div class="week-view">
  {#each weekDays as day}
    <div class="day">
      <h3>
        {format(day, "EEEE")},
        <br />{format(day, "MMM d")}
      </h3>
      {#each events as event}
        {#if eventFallsOnDay(event, day)}
          <div class="event">
            <h2>{event.title}</h2>
            <!-- Display event details -->
          </div>
        {/if}
      {/each}
    </div>
  {/each}
</div>

<style lang="scss">
  .week-view {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
    padding: 1rem 1.5rem;
    background-color: hsl(0, 0%, 97%);
    border-radius: var(--primary-border-radius);

    @media (max-width: 600px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 400px) {
      grid-template-columns: 1fr;
    }

    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      border-radius: var(--primary-border-radius);
      transition: background-color 0.2s ease-in-out;
      min-height: 3rem;

      h3 {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin: 0;
        width: 100%;
        background-color: var(--color-theme-1-L1);
        color: #333;
        text-align: center;
        border-radius: 4px 4px 0 0;
        padding: 0.25rem 0.5rem;
        box-sizing: border-box;
        user-select: none;
        font-size: 0.85rem;
        min-height: 2.5rem;

        @media (max-width: 600px) {
          font-size: 0.75rem;
        }
      }

      .event {
        margin: 0.5rem;
        padding: 0.5rem;
        background-color: var(--color-theme-2-L3);
        border: 1px solid var(--color-theme-2-L2);
        border-radius: 4px;
        box-shadow: inset 0 2px 4px hsl(0, 0%, 0%, 0.051);
        transition: background-color 0.2s ease-in-out;
        cursor: pointer;

        h2 {
          font-size: 0.8rem; // Adjusted for week view
          margin: 0;

          @media (max-width: 600px) {
            font-size: 0.75rem;
          }
        }

        &:hover {
          background-color: var(--color-theme-2-L2);
        }
      }
    }
  }
</style>
