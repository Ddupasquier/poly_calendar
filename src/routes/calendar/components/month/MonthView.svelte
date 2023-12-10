<script lang="ts">
  import {
    startOfMonth,
    endOfMonth,
    addMonths,
    eachDayOfInterval,
    getDay,
    addDays,
    isWithinInterval,
    isValid,
    isBefore,
    endOfDay,
    compareAsc,
    format,
  } from "date-fns";
  import type { CalendarEventModel } from "$lib/models";
  import { EventsContainer, WeekdayBar } from "../..";

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

  const goToNextMonth = () => {
    if ($selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear($selectedYear + 1);
    } else {
      setSelectedMonth($selectedMonth + 1);
    }
  };

  const goToPreviousMonth = () => {
    if ($selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear($selectedYear - 1);
    } else {
      setSelectedMonth($selectedMonth - 1);
    }
  };

  let activeEvent: CalendarEventModel | null = null;

  const setActiveEvent = (event: CalendarEventModel | null) => {
    activeEvent = event;
  };

  $: start = startOfMonth(new Date($selectedYear, $selectedMonth - 1, 1));
  $: end = endOfMonth(new Date($selectedYear, $selectedMonth - 1, 1));
  $: firstDayOfMonth = getDay(start);
  $: daysInMonth = eachDayOfInterval({ start, end });

  let daysBeforeStartOfMonth: Date[] = [];

  $: {
    daysBeforeStartOfMonth = [];
    if (firstDayOfMonth !== 0) {
      for (let i = 0; i < firstDayOfMonth; i++) {
        daysBeforeStartOfMonth.unshift(addDays(start, -i - 1));
      }
    }
  }

  const eventFallsOnDay = (event: CalendarEventModel, day: Date): boolean => {
    if (!isValid(event.startDate) || !isValid(event.endDate)) {
      return false;
    }

    if (isBefore(event.endDate, event.startDate)) {
      return false;
    }

    const endOfCurrentDay = endOfDay(day);
    const adjustedEndDate = endOfDay(event.endDate);

    return isWithinInterval(endOfCurrentDay, {
      start: event.startDate,
      end: adjustedEndDate,
    });
  };

  $: getEventsForDay = (day: Date) => {
    const eventsForDay = $allFilteredEventsOccurringInSelectedMonthYear.filter(
      (event) => eventFallsOnDay(event, day),
    );
    eventsForDay.sort((a, b) => compareAsc(a.startDate, b.startDate));
    return eventsForDay;
  };

  $: formattedMonth = format(
    new Date($selectedYear, $selectedMonth - 1),
    "MMMM",
  );
  $: formattedMonthYear = `${formattedMonth}, ${$selectedYear}`;
</script>

<div class="month-view">
  <div class="month-navigation">
    <button on:click={goToPreviousMonth}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </button>
    <span class="current-month">{formattedMonthYear}</span>
    <button on:click={goToNextMonth}>
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
        <EventsContainer
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
    grid-template-columns: repeat(7, 1fr);
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

    @media (max-width: 600px) {
      h3 {
        font-size: 0.75rem;
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

    @media (max-width: 600px) {
      display: none;
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
