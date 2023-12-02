import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

interface HelperText {
    error: boolean;
    text: string | null;
}

let helperText: HelperText = {
    error: false,
    text: null,
};

export const helperTextStore: Writable<HelperText> = writable(helperText);

export const setHelperText = (error: boolean, text: string | null): void => {
    helperTextStore.set({ error, text });

    setTimeout(() => {
        helperTextStore.set({ error: false, text: '' });
    }, 5000);
};