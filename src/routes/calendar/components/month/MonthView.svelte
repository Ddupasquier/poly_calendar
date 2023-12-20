<script lang="ts">
  import {
    startOfMonth,
    endOfMonth,
    getDay,
    addDays,
    format,
    eachDayOfInterval,
  } from "date-fns";
  import type { GoogleCalendarEventModel } from "$lib/models";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faChevronLeft,
    faChevronRight,
  } from "@fortawesome/free-solid-svg-icons";
  import {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    allFilteredEventsOccurringInSelectedMonthYear,
    isLoadingEvents,
    isCurrentViewLoading,
  } from "$lib/stores";
  import { MonthEventsContainer, WeekdayBar } from "../..";
  import { eventFallsOnDay } from "$lib/utils";
  import { Common } from "$lib/components";
  import { fade } from "svelte/transition";

  const changeMonth = (increment: number) => {
    const newMonth = $selectedMonth + increment;
    setSelectedMonth(newMonth === 13 ? 1 : newMonth === 0 ? 12 : newMonth);
    if (newMonth > 12) setSelectedYear($selectedYear + 1);
    if (newMonth < 1) setSelectedYear($selectedYear - 1);
  };

  let activeEvent: GoogleCalendarEventModel | null = null;
  const setActiveEvent = (event: GoogleCalendarEventModel | null) =>
    (activeEvent = event);

  $: start = startOfMonth(new Date($selectedYear, $selectedMonth - 1, 1));
  $: end = endOfMonth(new Date($selectedYear, $selectedMonth - 1, 1));
  $: firstDayOfMonth = getDay(start);
  $: daysInMonth = eachDayOfInterval({ start, end });
  $: daysBeforeStartOfMonth =
    firstDayOfMonth !== 0
      ? Array.from({ length: firstDayOfMonth }, (_, i) =>
          addDays(start, -i - 1),
        ).reverse()
      : [];

  $: getEventsForDay = (day: Date) => {
    const eventsForDay = $allFilteredEventsOccurringInSelectedMonthYear.filter(
      (event) => eventFallsOnDay(event, day),
    );

    return eventsForDay;
  };

  $: formattedMonthYear = `${format(
    new Date($selectedYear, $selectedMonth - 1),
    "MMMM",
  )}, ${$selectedYear}`;
</script>

<div class="month-view">
  <div class="month-navigation">
    <button on:click={() => changeMonth(-1)}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </button>
    <span class="current-month">{formattedMonthYear}</span>
    <button on:click={() => changeMonth(1)}>
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  </div>

  {#if $isLoadingEvents}
    <div class="no-events">
      <Common.Loader size="small" color="var(--color-theme-2)" />
    </div>
  {:else if (!$isLoadingEvents && $allFilteredEventsOccurringInSelectedMonthYear.length === 0) || !$isCurrentViewLoading}
    <p class="no-events" in:fade>No events scheduled for this month.</p>
  {:else}
    <WeekdayBar />
    <div class="dates-container">
      {#each daysBeforeStartOfMonth as padDay}
        <div class="pad">
          <div class="slash-container">
            <div class="slash" />
          </div>
          <h3>{padDay.getDate()}</h3>
        </div>
      {/each}
      {#each daysInMonth as day, index}
        <div class="day">
          <h3>{day.getDate()}</h3>
          <MonthEventsContainer
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
</div>

<style lang="scss">
  .dates-container {
    display: grid;
    grid-template-columns: repeat(7, minmax(100px, 1fr));
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background-color: var(--color-bg-0-L4);
    border-radius: var(--primary-border-radius);

    @media (max-width: 600px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 400px) {
      grid-template-columns: 1fr;
    }
  }

  .day {
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-2);
    border-radius: var(--primary-border-radius);
    min-height: 3rem;
    max-height: 10rem;
    overflow: hidden;

    h3 {
      display: flex;
      justify-content: flex-end;
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
    }

    @media (max-width: 768px) {
      h3 {
        font-size: 0.7rem;
        padding: 0.1rem;
      }
    }

    @media (max-width: 480px) {
      h3 {
        font-size: 0.6rem;
        padding: 0.1rem;
      }
    }
  }

  .pad {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    position: relative;
    background-color: var(--color-bg-0-L3);
    border-radius: var(--primary-border-radius);
    overflow: hidden;
    box-shadow: none;

    .slash-container {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .slash {
      width: 150%;
      height: 0.75rem;
      background-color: var(--color-bg-0-L4);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(32.5deg);
    }

    h3 {
      user-select: none;
      color: var(--color-text-dark);
      margin: 0;
      padding: 0.25rem;
      z-index: 1;
    }

    @media (max-width: 768px) {
      h3 {
        font-size: 0.7rem;
        padding: 0.1rem;
      }
    }

    @media (max-width: 480px) {
      h3 {
        font-size: 0.6rem;
        padding: 0.1rem;
      }
    }
  }

  .month-navigation {
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

    .current-month {
      font-size: 1.25rem;
      font-weight: bold;
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
