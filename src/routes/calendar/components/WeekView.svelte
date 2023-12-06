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
      <h3>{format(day, "EEEE")}, {format(day, "MMM d")}</h3>
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
    grid-template-columns: repeat(7, 1fr); // Assuming 7 days in the week view
    gap: 15px;
    margin-top: 1rem;

    .day {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

      h3 {
        font-size: 0.9rem;
        color: #555;
        margin-bottom: 10px;
        text-align: center;
      }

      .event {
        background-color: #eff6ff;
        border-left: 3px solid #2a7bff;
        padding: 5px 10px;
        margin: 5px 0;
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        h2 {
          font-size: 0.8rem;
          margin: 0;
        }

        // Additional event details styles go here
      }

      // Highlight today's date with a different background color
      &:nth-child(7) {
        // Assuming the last column is the current day
        background-color: #f9f9f9;
      }
    }
  }
</style>
