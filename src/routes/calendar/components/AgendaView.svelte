<!-- AgendaView.svelte -->
<script lang="ts">
    import type { CalendarEvent } from "../types";

  export let events: CalendarEvent[] = [];
  // Optionally add logic to sort events by date
</script>

<div class="agenda-view">
  {#each events as event}
    <div class="event">
      <h2>{event.title}</h2>
      <p>{event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}</p>
      <!-- Display event details -->
    </div>
  {/each}
</div>
