<script lang="ts">
  import {
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    subWeeks,
    addWeeks,
  } from "date-fns";
  import type { GoogleCalendarEventModel } from "$lib/models";
  import { WeekEventsContainer } from "../..";
  import {
    allFilteredEventsOccurringInSelectedWeek,
    combinedDateObject,
    isCurrentViewLoading,
    isLoadingEvents,
    setSelectedWeekStart,
  } from "$lib/stores";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faChevronLeft,
    faChevronRight,
  } from "@fortawesome/free-solid-svg-icons";
  import { eventFallsOnDay } from "$lib/utils";
  import { Common } from "$lib/components";
  import { fade } from "svelte/transition";

  let activeEvent: GoogleCalendarEventModel | null = null;
  const setActiveEvent = (event: GoogleCalendarEventModel | null) =>
    (activeEvent = event);

  const goToPreviousWeek = () =>
    setSelectedWeekStart(subWeeks($combinedDateObject.selectedWeekStart, 1));
  const goToNextWeek = () =>
    setSelectedWeekStart(addWeeks($combinedDateObject.selectedWeekStart, 1));

  let weekInterval, weekDays: Date[], formattedWeekStart: string;

  $: (weekInterval = {
    start: startOfWeek($combinedDateObject.selectedWeekStart, {
      weekStartsOn: 0,
    }),
    end: endOfWeek($combinedDateObject.selectedWeekStart, { weekStartsOn: 0 }),
  }),
    (weekDays = eachDayOfInterval(weekInterval)),
    (formattedWeekStart = `Week starting with ${format(
      weekInterval.start,
      "MMM d",
    )}`);

  const getEventsForDay = (day: Date) =>
    $allFilteredEventsOccurringInSelectedWeek.filter((event) =>
      eventFallsOnDay(event, day),
    );
</script>

<div class="week-navigation">
  <button on:click={goToPreviousWeek}>
    <FontAwesomeIcon icon={faChevronLeft} />
  </button>
  <span class="current-weekstart">{formattedWeekStart}</span>
  <button on:click={goToNextWeek}>
    <FontAwesomeIcon icon={faChevronRight} />
  </button>
</div>

{#if $isLoadingEvents}
  <div class="no-events">
    <Common.Loader size="small" color="var(--color-theme-2)" />
  </div>
{:else if (!$isLoadingEvents && $allFilteredEventsOccurringInSelectedWeek.length === 0) || !$isCurrentViewLoading}
  <p class="no-events" in:fade>No events found for this week.</p>
{:else}
  <div class="week-view">
    {#each weekDays as day, index}
      <div class="day">
        <h3>
          {format(day, "EEEE")},
          <br />{format(day, "MMM d")}
        </h3>
        <WeekEventsContainer
          {getEventsForDay}
          {day}
          {activeEvent}
          {setActiveEvent}
          {index}
        />
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  .week-navigation {
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

    .current-weekstart {
      font-size: 1.25rem;
      font-weight: bold;
    }
  }

  .week-view {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background-color: var(--color-bg-0-L4);
    border-radius: var(--primary-border-radius);
    box-sizing: border-box;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .day {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      background-color: var(--color-bg-2);
      border-radius: var(--primary-border-radius);
      min-height: 3rem;
      width: 100%;

      @media (max-width: 840px) {
        filter: brightness(1.1) opacity(0.8);
        transition: filter 0.2s ease-in-out;

        &:hover {
          filter: brightness(1) opacity(1);
        }
      }

      h3 {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin: 0;
        width: 100%;
        background-color: var(--color-theme-1-L1);
        color: var(--color-text-light);
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
    }
  }

  .no-events {
    text-align: center;
    width: 100%;
    background-color: var(--color-bg-0-L4);
    border-radius: var(--primary-border-radius);
    padding: 2rem;
    box-sizing: border-box;
  }
</style>
