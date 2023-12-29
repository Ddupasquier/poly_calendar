import type { GoogleCalendarEventModel } from "$lib/models";
import { GoogleCalendarEventDateTypesEnum } from "$lib/enums";
import {
    isValid,
    isBefore,
    startOfDay,
    endOfDay,
    isWithinInterval,
    isSameDay,
} from "date-fns";

const eventHasValidDates = (start: Date, end: Date): boolean => {
    if (!isValid(start) || !isValid(end)) {
        return false;
    }

    if (isBefore(end, start)) {
        return false;
    }

    return true;
};

const eventFallsWithinDay = (day: Date, start: Date, end: Date): boolean => {
    const currentDayStart = startOfDay(day);
    return isSameDay(day, start) || isWithinInterval(currentDayStart, { start, end });
};

const handleEvent = (event: GoogleCalendarEventModel, day: Date, isDateTimeType: boolean): boolean => {
    const start = new Date(isDateTimeType ? event.start.dateTime : event.start.date);
    const end = new Date(isDateTimeType ? event.end.dateTime : event.end.date);

    if (!eventHasValidDates(start, end)) {
        return false;
    }

    if (event?.organizer?.email.includes("#holiday@group.v.calendar.google.com")) {
        return isSameDay(day, end);
    }

    return eventFallsWithinDay(day, start, end);
};

const eventFallsOnDay = (
    event: GoogleCalendarEventModel,
    day: Date,
): boolean => {
    const dateType = eventHasWhichDateTypeProperty(event);
    switch (dateType) {
        case GoogleCalendarEventDateTypesEnum.Date:
            return handleEvent(event, day, false);
        case GoogleCalendarEventDateTypesEnum.DateTime:
            return handleEvent(event, day, true);
        default:
            return false;
    }
};

const eventHasWhichDateTypeProperty = (event: GoogleCalendarEventModel): string => {
    if (event.start.date && event.end.date) {
        return GoogleCalendarEventDateTypesEnum.Date;
    } else if (event.start.dateTime && event.end.dateTime) {
        return GoogleCalendarEventDateTypesEnum.DateTime;
    } else {
        return "";
    }
};

export { eventFallsOnDay };
