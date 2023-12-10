<script lang="ts">
  import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    addDays,
    isWithinInterval,
    isValid,
    isBefore,
    endOfDay,
    compareAsc,
  } from "date-fns";
  import type { CalendarEvent } from "../types";
  import { EventsContainer, WeekdayBar } from "..";

  export let events: CalendarEvent[] = [];

  let activeEvent: CalendarEvent | null = null;

  const setActiveEvent = (event: CalendarEvent | null) => {
    activeEvent = event;
  };

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const firstDayOfMonth = getDay(start);
  let daysBeforeStartOfMonth: Date[] = [];

  if (firstDayOfMonth !== 0) {
    for (let i = firstDayOfMonth; i > 0; i--) {
      daysBeforeStartOfMonth.push(addDays(start, -i));
    }
  }
  const daysInMonth = eachDayOfInterval({ start, end });

  const eventFallsOnDay = (event: CalendarEvent, day: Date): boolean => {
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
    const eventsForDay = events.filter((event) => eventFallsOnDay(event, day));
    eventsForDay.sort((a, b) => compareAsc(a.startDate, b.startDate));
    return eventsForDay;
  };
</script>

<WeekdayBar />
<div class="month-view">
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

<style lang="scss">
  .month-view {
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
</style>
