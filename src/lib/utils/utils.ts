import { setHelperText } from "$lib/stores/reactiveTextStore";
import type { AuthUser } from "@supabase/supabase-js";

type HSL = {
    h: number;
    s: number;
    l: number;
};

const parseHSL = (hslString: string): HSL => {
    const components = hslString.match(/\d+\.?\d*/g);
    if (!components || components.length !== 3) {
        throw new Error('Invalid HSL format');
    }
    return {
        h: parseInt(components[0], 10), // Hue is a degree between 0 and 360
        s: parseInt(components[1], 10), // Saturation is a percentage
        l: parseInt(components[2], 10)  // Lightness is a percentage
    };
};

const clampPercentage = (value: number): number => Math.min(100, Math.max(0, value));

const adjustLightness = (hsl: HSL, factor: number): HSL => {
    return {
        h: hsl.h, // Hue does not change when lightening or darkening
        s: hsl.s, // Saturation does not change when lightening or darkening
        l: clampPercentage(hsl.l + factor) // Adjust lightness by the factor, clamping between 0% and 100%
    };
};

const lighten = (hslString: string, factor: number): string => {
    const hsl = parseHSL(hslString);
    const adjusted = adjustLightness(hsl, factor);
    return `hsl(${adjusted.h}, ${adjusted.s}%, ${adjusted.l}%)`;
};

const darken = (hslString: string, factor: number): string => {
    const hsl = parseHSL(hslString);
    const adjusted = adjustLightness(hsl, -factor);
    return `hsl(${adjusted.h}, ${adjusted.s}%, ${adjusted.l}%)`;
};

const startCountdownWithMessage = (seconds: number, messageTemplate: string): void => {
    let countdown: NodeJS.Timeout | null = null;
    let remainingSeconds = seconds;

    countdown = setInterval(() => {
        if (remainingSeconds > 0) {
            const message = messageTemplate.replace('{timer}', remainingSeconds.toString());
            setHelperText(false, message);
            remainingSeconds--;
        } else {
            stopCountdown(countdown);
        }
    }, 1000);
};

const stopCountdown = (countdown: string | number | NodeJS.Timeout | null | undefined): void => {
    clearInterval(countdown as NodeJS.Timeout);
    countdown = null;
    setHelperText(false, "")
};

const getConfirmedStatus = (user: AuthUser): string => {
    return user.email_confirmed_at ? ' (Confirmed)' : ' (Unconfirmed)';
};

export { lighten, darken, startCountdownWithMessage, stopCountdown, getConfirmedStatus };
