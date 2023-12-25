type HelperText = {
    error: boolean;
    message: string | undefined;
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