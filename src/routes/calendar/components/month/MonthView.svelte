<script lang="ts">
  import {
    startOfMonth,
    endOfMonth,
    getDay,
    addDays,
    isWithinInterval,
    isValid,
    isBefore,
    endOfDay,
    compareAsc,
    format,
    eachDayOfInterval,
  } from "date-fns";
  import type { CalendarEventModel } from "$lib/models";
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
  } from "$lib/stores";
  import { MonthEventsContainer, WeekdayBar } from "../..";

  const changeMonth = (increment: number) => {
    const newMonth = $selectedMonth + increment;
    setSelectedMonth(newMonth === 13 ? 1 : newMonth === 0 ? 12 : newMonth);
    if (newMonth > 12) setSelectedYear($selectedYear + 1);
    if (newMonth < 1) setSelectedYear($selectedYear - 1);
  };

  let activeEvent: CalendarEventModel | null = null;
  const setActiveEvent = (event: CalendarEventModel | null) =>
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

  const eventFallsOnDay = (event: CalendarEventModel, day: Date): boolean =>
    isValid(event.startDate) &&
    isValid(event.endDate) &&
    !isBefore(event.endDate, event.startDate) &&
    isWithinInterval(endOfDay(day), {
      start: event.startDate,
      end: endOfDay(event.endDate),
    });

  $: getEventsForDay = (day: Date) => {
    const eventsForDay = $allFilteredEventsOccurringInSelectedMonthYear.filter(
      (event) => eventFallsOnDay(event, day),
    );
    return eventsForDay.sort((a, b) => compareAsc(a.startDate, b.startDate));
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
</div>

<style lang="scss">
  .dates-container {
    display: grid;
    grid-template-columns: repeat(7, minmax(100px, 1fr));
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background-color: hsl(0, 0%, 97%);
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
    background-color: #fff;
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
      color: #333;
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
    background-color: hsl(0, 0%, 90%);
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
      background-color: hsl(0, 0%, 97%);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(32.5deg);
    }

    h3 {
      user-select: none;
      color: hsl(0, 0%, 0%);
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

    .current-month {
      font-size: 1.25rem;
      font-weight: bold;
    }
  }
</style>
