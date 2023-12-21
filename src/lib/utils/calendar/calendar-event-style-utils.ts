import { AttendeeActionTypesEnum, ColorIdEnum } from "$lib/enums";
import type { GoogleCalendarEventModel } from "$lib/models";

export const getEventColor = (event: GoogleCalendarEventModel): string => {
    if (event.colorId) {
        return `
            --primary: ${colorMap[event.colorId][0]};
            --secondary: ${colorMap[event.colorId][1]};
        `;
    }

    return '';
}

export const attendeeActionEventStyle = (
    responseStatus: string | undefined,
): string => {
    if (responseStatus) {
        return `
                    --primary: none;
                    --secondary: ${styleMap[responseStatus]};
                `;
    }
    return "";
};

const colorMap: { [key: string]: [string, string] } = {
    [ColorIdEnum.Lavender]: ["var(--lavender)", "var(--lavender-light)"],
    [ColorIdEnum.Sage]: ["var(--sage)", "var(--sage-light)"],
    [ColorIdEnum.Grape]: ["var(--grape)", "var(--grape-light)"],
    [ColorIdEnum.Flamingo]: ["var(--flamingo)", "var(--flamingo-light)"],
    [ColorIdEnum.Banana]: ["var(--banana)", "var(--banana-light)"],
    [ColorIdEnum.Tangerine]: ["var(--tangerine)", "var(--tangerine-light)"],
    [ColorIdEnum.Peacock]: ["var(--peacock)", "var(--peacock-light)"],
    [ColorIdEnum.Graphite]: ["var(--graphite)", "var(--graphite-light)"],
    [ColorIdEnum.Blueberry]: ["var(--blueberry)", "var(--blueberry-light)"],
    [ColorIdEnum.Basil]: ["var(--basil)", "var(--basil-light)"],
    [ColorIdEnum.Tomato]: ["var(--tomato)", "var(--tomato-light)"],
    [ColorIdEnum.Mandarin]: ["var(--mandarin)", "var(--mandarin-light)"],
    [ColorIdEnum.Blueberry2]: [
        "var(--blueberry2)",
        "var(--blueberry2-light)",
    ],
    [ColorIdEnum.Sage2]: ["var(--sage2)", "var(--sage2-light)"],
};

const styleMap: { [key: string]: string } = {
    [AttendeeActionTypesEnum.Accepted]: "var(--accepted-light)",
    [AttendeeActionTypesEnum.Declined]: "var(--declined-light)",
    [AttendeeActionTypesEnum.Tentative]: "var(--tentative-light)",
    [AttendeeActionTypesEnum.NeedsAction]: "var(--needs-action-light)",
};