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
      <p>
        {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
      </p>
      <!-- Display event details -->
    </div>
  {/each}
</div>

<style lang="scss">
  .agenda-view {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;

    .event {
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;

      h2 {
        font-size: 1rem;
        margin-bottom: 0.25rem;
      }

      p {
        font-size: 0.9rem;
        margin: 0;
        color: #555;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
