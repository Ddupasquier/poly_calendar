import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

let helperText: HelperText = {
    error: false,
    message: undefined,
};

export const helperTextStore: Writable<HelperText> = writable(helperText);

export const setHelperText = ({ error, message }: HelperText): void => {
    helperTextStore.set({ error, message });

    setTimeout(() => {
        helperTextStore.set({ error: false, message: '' });
    }, 5000);
};

export const toastMessages = writable<ToastAlert[]>([]);

export const transitionDuration = 500;

export const addToast = (message: string, options: ToastAlertOptions) => {
    const id = Math.floor(Math.random() * 10000);
    toastMessages.update(toasts => [
        ...toasts,
        { id, message, options }
    ]);
}

export const removeToast = (id: number) => {
    toastMessages.update(toasts => toasts.filter(toast => toast.id !== id));
};