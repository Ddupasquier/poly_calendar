import type { GoogleCalendarEventModel } from '$lib/models';
import {
    isValid,
    parse,
    format,
    differenceInCalendarDays,
    endOfDay,
    isWithinInterval,
    parseISO,
    startOfDay
} from 'date-fns';

const checkDate = (dateToCheck: string): string => {
    if (!dateToCheck) return "";

    const parsedDate = parse(dateToCheck, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
        return dateToCheck;
    } else {
        return formatDate(dateToCheck);
    }
}

const formatDate = (date: string | Date): string => {
    if (!date) return "";

    const d = typeof date === 'string' ? new Date(date) : date;

    return format(d, 'yyyy-MM-dd');
};

const parseEventDate = (dateString: string | undefined): Date | null => {
    if (typeof dateString !== "string") {
        return null;
    }
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
};

const eventDayIndicator = (
    event: GoogleCalendarEventModel,
    day: Date,
): string => {
    const startOfEvent = parseEventDate(event.start.dateTime);
    const endOfEvent = parseEventDate(event.end.dateTime);

    if (!startOfEvent || !endOfEvent) {
        return "";
    }

    const currentDay = startOfDay(day);
    const eventStartDay = startOfDay(startOfEvent);

    if (
        isWithinInterval(currentDay, {
            start: eventStartDay,
            end: endOfDay(endOfEvent),
        })
    ) {
        let dayIndex = differenceInCalendarDays(currentDay, eventStartDay) + 1;
        const duration = differenceInCalendarDays(endOfEvent, eventStartDay) + 1;

        if (duration > 1) {
            return `${dayIndex} / ${duration}`;
        }
    }

    return "";
};

export {
    checkDate,
    formatDate,
    parseEventDate,
    eventDayIndicator
};
