import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

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

export const toastMessages = writable<ToastAlert[]>([]);

export const addToast = (message: string, options: Omit<ToastAlertOptions, 'id'>) => {
    const id = Math.floor(Math.random() * 10000);
    toastMessages.update(toasts => [
        ...toasts,
        { id, message, options }
    ]);

    if (!options.openTilClosed) {
        const duration = options.duration || 3000;
        const transitionDuration = 500;
        setTimeout(() => {
            removeToast(id);
        }, duration + transitionDuration);
    }
}

export const removeToast = (id: number) => {
    toastMessages.update(toasts => toasts.filter(toast => toast.id !== id));
}
