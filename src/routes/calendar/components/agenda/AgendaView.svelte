<!-- AgendaView.svelte -->
<script lang="ts">
  import type { CalendarEvent } from "../../types";

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
  padding: 1rem 1.5rem;
  background-color: hsl(0, 0%, 97%);
  border-radius: var(--primary-border-radius);
  margin-top: 1rem;

  .event {
    padding: 0.5rem;
    margin: 0.5rem 0;
    background-color: var(--color-theme-2-L3);
    border: 1px solid var(--color-theme-2-L2);
    border-radius: 4px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: background-color 0.2s ease-in-out;

    h2 {
      font-size: 0.85rem;
      color: #333;
      margin: 0;
    }

    p {
      font-size: 0.75rem;
      color: #666;
      margin: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background-color: var(--color-theme-2-L2);
    }
  }

  @media (max-width: 600px) {
    padding: 1rem; // Adjust padding for smaller screens

    .event h2,
    .event p {
      font-size: 0.75rem; // Adjust font size for smaller screens
    }
  }

  @media (max-width: 400px) {
    .event h2,
    .event p {
      font-size: 0.7rem; // Adjust font size for very small screens
    }
  }
}

</style>
