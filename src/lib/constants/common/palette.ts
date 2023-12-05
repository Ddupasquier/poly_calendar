import { darken, lighten } from '$lib/utils';

const terracotta = "hsl(13, 69%, 63%)";
const jadeGreen = "hsl(168, 76%, 36%)";

const colors = {
    terracotta,
    jadeGreen,
    "--color-bg-0": "hsl(215, 8%, 55%)",
    "--color-bg-1": "hsl(204, 64%, 44%)",
    "--color-bg-2": "hsl(0, 0%, 100%)",
    "--color-theme-1": terracotta,
    "--color-theme-1-D1": darken(terracotta, 10),
    "--color-theme-1-L1": lighten(terracotta, 10),
    "--color-theme-2": jadeGreen,
    "--color-theme-2-D1": darken(jadeGreen, 10),
    "--color-theme-2-L1": lighten(jadeGreen, 10),
    "--color-text-dark": "hsl(0, 0%, 8%)",
    "--color-text-light": "hsl(240, 1%, 31%)",
    "--color-text-white": "hsl(0, 0%, 100%)",
};

export { colors };