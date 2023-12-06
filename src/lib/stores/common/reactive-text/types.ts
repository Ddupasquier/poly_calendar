interface HelperText {
    error: boolean;
    text: string | null;
}

interface ToastAlertOptions {
    duration?: number;
    closable?: boolean;
    openTilClosed?: boolean;
    style?: string;
}

interface ToastAlert {
    id: number;
    message: string;
    options: ToastAlertOptions;
}