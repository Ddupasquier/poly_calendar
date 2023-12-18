import type { GoogleCalendarEventModel } from "$lib/models";
import {
    isValid,
    isBefore,
    startOfDay,
    endOfDay,
    isWithinInterval
} from "date-fns";

const eventFallsOnDay = (
    event: GoogleCalendarEventModel,
    day: Date,
): boolean => {
    if (
        typeof event.start.dateTime === "string" &&
        typeof event.end.dateTime === "string"
    ) {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);

        if (!isValid(eventStart) || !isValid(eventEnd)) {
            console.log(`Invalid date for event '${event.summary}'`);
            return false;
        }

        if (isBefore(eventEnd, eventStart)) {
            console.log(
                `Event end date is before start date for '${event.summary}'`,
            );
            return false;
        }

        const eventStartDay = startOfDay(eventStart);
        const eventEndDay = endOfDay(eventEnd);
        const currentDayStart = startOfDay(day);
        const currentDayEnd = endOfDay(day);

        return (
            isWithinInterval(currentDayStart, {
                start: eventStartDay,
                end: eventEndDay,
            }) ||
            isWithinInterval(currentDayEnd, {
                start: eventStartDay,
                end: eventEndDay,
            })
        );
    }
    return false;
};

export {
    eventFallsOnDay
};