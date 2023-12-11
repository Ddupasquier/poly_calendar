<script lang="ts">
  import {
    allFilteredEventsOccuringOnTheSelectedDate,
    setSelectedDate,
    selectedDate,
  } from "$lib/stores";
  import { format, addDays, parseISO } from "date-fns";
  import DayEvent from "./DayEvent.svelte";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faChevronLeft,
    faChevronRight,
  } from "@fortawesome/free-solid-svg-icons";

  const goToNextDay = () => {
    setSelectedDate(format(addDays(parseISO($selectedDate), 1), "yyyy-MM-dd"));
  };

  const goToPreviousDay = () => {
    setSelectedDate(format(addDays(parseISO($selectedDate), -1), "yyyy-MM-dd"));
  };

  $: formattedDate = format(parseISO($selectedDate), "MMMM d, yyyy");
</script>

<div class="day-navigation">
  <button on:click={goToPreviousDay}>
    <FontAwesomeIcon icon={faChevronLeft} />
  </button>
  <span class="current-day">{formattedDate}</span>
  <button on:click={goToNextDay}>
    <FontAwesomeIcon icon={faChevronRight} />
  </button>
</div>
<div class="day-view">
  {#each $allFilteredEventsOccuringOnTheSelectedDate as event}
    {#if event}
      <DayEvent {event} />
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
  }

  .day-navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    color: var(--color-text-dark);
    border-radius: var(--primary-border-radius);

    button {
      color: rgb(0, 0, 0);
      border: none;
      padding: 0.5rem 1rem;
      background: none;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    .current-day {
      font-size: 1.25rem;
      font-weight: bold;
    }
  }
</style>
