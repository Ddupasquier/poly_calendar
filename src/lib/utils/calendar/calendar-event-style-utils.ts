import { AttendeeActionTypesEnum, EventColorIdEnum } from "$lib/enums";
import type { GoogleCalendarEventModel } from "$lib/models";

export const getEventColor = (event: GoogleCalendarEventModel): string => {
    const colorId = event.colorId as keyof typeof EventColorIdEnum;
    if (colorId in eventColorMap) {
        const [background, backgroundLight, foreground, foregroundLight] = eventColorMap[colorId];
        return `
            --background: ${background}; 
            --background-light: ${backgroundLight}; 
            --foreground: ${foreground}; 
            --foreground-light: ${foregroundLight};
        `;
    }
    return '';
}

export const attendeeActionEventStyle = (
    responseStatus: string | undefined,
): string => {
    const actionStatus = responseStatus as keyof typeof AttendeeActionTypesEnum;
    if (actionStatus in attendeeeActionStyleMap) {
        return `--primary: none; --secondary: ${attendeeeActionStyleMap[actionStatus]};`;
    }
    return "";
};

const eventColorMap: { [key: string]: [string, string, string, string] } = {
    [EventColorIdEnum.Lavender]: [
        "var(--lavender-background)",
        "var(--lavender-background-light)",
        "var(--lavender-foreground)",
        "var(--lavender-foreground-light)"
    ],
    [EventColorIdEnum.Sage]: [
        "var(--sage-background)",
        "var(--sage-background-light)",
        "var(--sage-foreground)",
        "var(--sage-foreground-light)"
    ],
    [EventColorIdEnum.Grape]: [
        "var(--grape-background)",
        "var(--grape-background-light)",
        "var(--grape-foreground)",
        "var(--grape-foreground-light)"
    ],
    [EventColorIdEnum.Flamingo]: [
        "var(--flamingo-background)",
        "var(--flamingo-background-light)",
        "var(--flamingo-foreground)",
        "var(--flamingo-foreground-light)"
    ],
    [EventColorIdEnum.Banana]: [
        "var(--banana-background)",
        "var(--banana-background-light)",
        "var(--banana-foreground)",
        "var(--banana-foreground-light)"
    ],
    [EventColorIdEnum.Tangerine]: [
        "var(--tangerine-background)",
        "var(--tangerine-background-light)",
        "var(--tangerine-foreground)",
        "var(--tangerine-foreground-light)"
    ],
    [EventColorIdEnum.Peacock]: [
        "var(--peacock-background)",
        "var(--peacock-background-light)",
        "var(--peacock-foreground)",
        "var(--peacock-foreground-light)"
    ],
    [EventColorIdEnum.Graphite]: [
        "var(--graphite-background)",
        "var(--graphite-background-light)",
        "var(--graphite-foreground)",
        "var(--graphite-foreground-light)"
    ],
    [EventColorIdEnum.Blueberry]: [
        "var(--blueberry-background)",
        "var(--blueberry-background-light)",
        "var(--blueberry-foreground)",
        "var(--blueberry-foreground-light)"
    ],
    [EventColorIdEnum.Basil]: [
        "var(--basil-background)",
        "var(--basil-background-light)",
        "var(--basil-foreground)",
        "var(--basil-foreground-light)"
    ],
    [EventColorIdEnum.Tomato]: [
        "var(--tomato-background)",
        "var(--tomato-background-light)",
        "var(--tomato-foreground)",
        "var(--tomato-foreground-light)"
    ],
};

const attendeeeActionStyleMap: { [key: string]: string } = {
    [AttendeeActionTypesEnum.Accepted]: "var(--accepted-light)",
    [AttendeeActionTypesEnum.Declined]: "var(--declined-light)",
    [AttendeeActionTypesEnum.Tentative]: "var(--tentative-light)",
    [AttendeeActionTypesEnum.NeedsAction]: "var(--needs-action-light)",
};