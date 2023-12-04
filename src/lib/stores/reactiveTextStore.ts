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
        {
            id,
            message,
            options: {
                duration: options.duration || 3000,
                closable: options.closable || true,
                openTilClosed: options.openTilClosed || false,
                style: options.style || 'success',
            }
        }
    ]);

    const duration = options.duration || 3000;
    setTimeout(() => {
        removeToast(id);
    }, duration);
}

const removeToast = (id: number) => {
    toastMessages.update(toasts => toasts.filter(toast => toast.id !== id));
}
