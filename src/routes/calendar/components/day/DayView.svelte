<script lang="ts">
  import {
    allFilteredEventsOccurringOnTheSelectedDate,
    setSelectedDate,
    combinedDateObject,
    isLoadingEvents,
    isCurrentViewLoading,
  } from "$lib/stores";
  import { format, addDays, parseISO } from "date-fns";
  import DayEvent from "./DayEvent.svelte";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faChevronLeft,
    faChevronRight,
  } from "@fortawesome/free-solid-svg-icons";
  import { Common } from "$lib/components";
  import { fade } from "svelte/transition";

  const goToNextDay = () => {
    setSelectedDate(
      format(
        addDays(parseISO($combinedDateObject.selectedDate), 1),
        "yyyy-MM-dd",
      ),
    );
  };

  const goToPreviousDay = () => {
    setSelectedDate(
      format(
        addDays(parseISO($combinedDateObject.selectedDate), -1),
        "yyyy-MM-dd",
      ),
    );
  };

  $: formattedDate = format(
    parseISO($combinedDateObject.selectedDate),
    "MMMM d, yyyy",
  );
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
  {#if $isLoadingEvents}
    <Common.Loader size="small" color="var(--color-theme-2)" />
  {:else if (!$isLoadingEvents && $allFilteredEventsOccurringOnTheSelectedDate.length === 0) || !$isCurrentViewLoading}
    <p class="no-events" in:fade>No events found for this day.</p>
  {:else}
    {#each $allFilteredEventsOccurringOnTheSelectedDate as event}
      {#if event}
        <DayEvent {event} />
      {/if}
    {/each}
  {/if}
</div>

<style lang="scss">
  .day-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: var(--color-bg-0-L4);
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
      color: var(--color-text-dark);
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

  .no-events {
    text-align: center;
    width: 100%;
  }
</style>
