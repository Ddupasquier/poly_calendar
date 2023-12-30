import { browser } from "$app/environment";
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const googleCalendarListEntryOptions: Writable<CalendarListEntryRadioOption[]> = writable<CalendarListEntryRadioOption[]>([])

export const googleCalendarListEntryOptionsSelected: Writable<CalendarListEntryRadioOption[]> = writable<CalendarListEntryRadioOption[]>([]);

googleCalendarListEntryOptions.subscribe((value) => {
    console.log('googleCalendarListEntryOptions', value);
});

if (browser) {
    const storedSelected = localStorage.getItem('googleCalendarListEntryOptionsSelected');
    if (storedSelected) {
        googleCalendarListEntryOptionsSelected.set(JSON.parse(storedSelected));
    }

    googleCalendarListEntryOptionsSelected.subscribe((selected) => {
        localStorage.setItem('googleCalendarListEntryOptionsSelected', JSON.stringify(selected));
    });
}
