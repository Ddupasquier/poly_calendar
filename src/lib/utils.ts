type RGB = {
    r: number;
    g: number;
    b: number;
};

const parseRGB = (rgbString: string): RGB => {
    const components = rgbString.match(/\d+/g);
    if (!components || components.length !== 3) {
        throw new Error('Invalid RGB format');
    }
    return {
        r: parseInt(components[0], 10),
        g: parseInt(components[1], 10),
        b: parseInt(components[2], 10)
    };
};

const clamp = (value: number): number => Math.min(255, Math.max(0, value));

const adjustColor = (rgb: RGB, percentage: number): RGB => ({
    r: clamp(rgb.r + rgb.r * percentage),
    g: clamp(rgb.g + rgb.g * percentage),
    b: clamp(rgb.b + rgb.b * percentage)
});

const lighten = (rgbString: string, percentage: number): string => {
    const rgb = parseRGB(rgbString);
    const adjusted = adjustColor(rgb, percentage / 100);
    return `rgb(${adjusted.r}, ${adjusted.g}, ${adjusted.b})`;
};

const darken = (rgbString: string, percentage: number): string =>
    lighten(rgbString, -percentage);

// Usage examples:
console.log(lighten('rgb(100, 100, 100)', 10)); // Lighten by 10%
console.log(darken('rgb(100, 100, 100)', 10));  // Darken by 10%

export { lighten, darken };