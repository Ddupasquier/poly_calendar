<!-- DayView.svelte -->
<script lang="ts">
    import type { CalendarEvent } from "../types";

  export let events: CalendarEvent[] = [];
  // Logic to filter events for the specific day
</script>

<div class="day-view">
  {#each events as event}
    <div class="event">
      <h2>{event.title}</h2>
      <p>{event.startDate.toTimeString()} - {event.endDate.toTimeString()}</p>
    </div>
  {/each}
</div>
