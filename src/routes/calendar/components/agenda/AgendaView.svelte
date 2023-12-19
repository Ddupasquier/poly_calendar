<script lang="ts">
  import { limitedEvents } from "$lib/stores";

  const hasEventEnded = (
    endDate: string | number | Date | undefined,
  ): boolean => {
    if (!endDate) return false;

    return new Date(endDate) < new Date();
  };
</script>

<div class="agenda-view">
  {#each $limitedEvents as event}
    <div
      class="event {hasEventEnded(event.end.dateTime || event.end.date)
        ? 'ended'
        : ''}"
    >
      <h2>{event.summary}</h2>
      <p>
        {event.start.dateTime || event.start.date} - {event.end.dateTime ||
          event.end.date}
      </p>
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
      cursor: pointer;

      h2 {
        font-size: 0.85rem;
        color: #333;
        margin: 0;
        user-select: none;
      }

      p {
        font-size: 0.75rem;
        color: #666;
        margin: 0;
        user-select: none;
      }

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        background-color: var(--color-theme-2-L2);
      }
    }

    @media (max-width: 600px) {
      padding: 1rem;

      .event h2,
      .event p {
        font-size: 0.75rem;
      }
    }

    @media (max-width: 400px) {
      .event h2,
      .event p {
        font-size: 0.7rem;
      }
    }
  }

  .event.ended {
    background-color: var(--color-theme-1-L3);
    color:  var(--color-text-light);
    text-decoration: line-through;
  }
</style>
