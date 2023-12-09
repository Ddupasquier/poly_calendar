<script lang="ts">
  import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    addDays,
    differenceInCalendarDays,
    isWithinInterval,
    isValid,
    isBefore,
    endOfDay,
    startOfDay,
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
      <div class="slash" />
      <h3>{padDay.getDate()}</h3>
    </div>
  {/each}
  {#each daysInMonth as day}
    <div class="day">
      <h3>{day.getDate()}</h3>
      <EventsContainer {getEventsForDay} {day} {activeEvent} {setActiveEvent} />
    </div>
  {/each}
</div>

<style lang="scss">
  .month-view {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
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
    align-items: center;
    background-color: #fff;
    border-radius: var(--primary-border-radius);
    transition: background-color 0.2s ease-in-out;
    min-height: 3rem;

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

    .slash {
      position: absolute;
      align-self: center;
      justify-self: center;
      width: 5px;
      height: 150%;
      background-color: hsl(0, 0%, 97%);
      margin-right: 3.7rem;
      transform: rotate(-60deg);
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
