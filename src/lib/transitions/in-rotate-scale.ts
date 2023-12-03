import { cubicInOut } from "svelte/easing";

export const inRotateScale = (node: HTMLDivElement, { duration }: any) => {
    return {
        duration,
        css: (t: number) => {
            const scale = cubicInOut(t);

            let rotation = 480 * cubicInOut(t);

            if (t > 0.5) {
                rotation -= (t - 0.5) * 2 * 120;
            }

            return `
                    transform: scale(${scale}) rotate(${rotation}deg);
                `;
        },
    };
};