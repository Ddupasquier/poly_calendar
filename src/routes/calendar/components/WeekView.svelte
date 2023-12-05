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
