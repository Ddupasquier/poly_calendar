<script lang="ts">
  import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    addDays,
    differenceInCalendarDays,
    isWithinInterval,
    // compareDesc,
    isValid,
    isBefore,
    isAfter,
    differenceInDays,
  } from "date-fns";
  import type { CalendarEvent } from "../types";
  import { WeekdayBar } from "..";

  export let events: CalendarEvent[] = [];

  $: console.log(events[0]);
  // $: events.sort((a, b) => compareDesc(a.startDate, b.startDate));

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

  function eventDuration(event: CalendarEvent): number {
    return differenceInCalendarDays(event.endDate, event.startDate) + 1;
  }

  function eventDayIndicator(event: CalendarEvent, day: Date): string {
    if (!isValid(event.startDate) || !isValid(event.endDate)) {
      return "";
    }

    // Check if the day is within the event duration
    if (isWithinInterval(day, { start: event.startDate, end: event.endDate })) {
      // Calculate the day index
      let dayIndex = differenceInDays(day, event.startDate) + 1;
      const duration = differenceInCalendarDays(event.endDate, event.startDate) + 1;
      return `Day ${dayIndex} of ${duration}`;
    }

    return "";
  }

  function eventFallsOnDay(event: CalendarEvent, day: Date): boolean {
    // Directly use the Date objects
    if (!isValid(event.startDate) || !isValid(event.endDate)) {
      console.error("Invalid date in event:", event);
      return false;
    }

    if (isBefore(event.endDate, event.startDate)) {
      console.error("Event end date is before start date:", event);
      return false;
    }

    return isWithinInterval(day, {
      start: event.startDate,
      end: event.endDate,
    });
  }
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
      <div class="event-container">
        {#each events as event}
          {#if eventFallsOnDay(event, day)}
            <div class="event">
              <h2>{event.title} {eventDayIndicator(event, day)}</h2>
              <!-- Display other event details -->
            </div>
          {/if}
        {/each}
      </div>
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

    .event {
      margin: 0.5rem;
      padding: 0.5rem;
      background-color: var(--color-theme-2-L3);
      border: 1px solid var(--color-theme-2-L2);
      border-radius: 4px;
      box-shadow: inset 0 2px 4px hsl(0, 0%, 0%, 0.051);
      transition: background-color 0.2s ease-in-out;
      cursor: pointer;

      h2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        margin: 0;
      }

      &:hover {
        background-color: var(--color-theme-2-L2);
      }
    }

    @media (max-width: 600px) {
      h3 {
        font-size: 0.75rem;
      }

      .event {
        h2 {
          font-size: 0.75rem;
        }
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
      height: 150px;
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
