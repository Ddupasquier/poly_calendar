interface HelperText {
    error: boolean;
    text: string | null;
}

interface ToastAlertOptions {
    duration?: number;
    closable?: boolean;
    openTilClosed?: boolean;
    style?: string;
    // component?: SvelteComponent | null; // Uncomment if needed
}

interface ToastAlert {
    id: number;
    message: string;
    options: ToastAlertOptions;
}