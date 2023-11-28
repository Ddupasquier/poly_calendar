import { darken, lighten } from './utils';

const terracotta = "rgb(226, 125, 96)";
const jadeGreen = "rgb(22, 160, 133)";

const colors = {
    terracotta,
    jadeGreen,
    "--color-bg-0": "rgb(130, 138, 149)",
    "--color-bg-1": "rgb(41, 128, 185)",
    "--color-bg-2": "rgb(255, 255, 255)",
    "--color-theme-1": terracotta,
    "--color-theme-1-D1": darken(terracotta, 10),
    "--color-theme-1-L1": lighten(terracotta, 10),
    "--color-theme-2": jadeGreen,
    "--color-theme-2-D1": darken(jadeGreen, 10),
    "--color-theme-2-L1": lighten(jadeGreen, 10),
    "--color-text": "rgb(20, 20, 20)",
    "--color-text-light": "rgb(78, 78, 80)",
};

export { colors };