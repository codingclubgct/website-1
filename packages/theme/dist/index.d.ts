import * as tailwindcss_types_config from 'tailwindcss/types/config';
import { labels } from '@catppuccin/palette';
import { roles } from '@rose-pine/palette';

interface CatppuccinColorsScheme extends ColorScheme<{
    [K in keyof typeof labels]: string;
}> {
}
type CatppuccinColors = {
    [K in keyof typeof labels]: string;
};
declare const catppuccinColors: CatppuccinColorsScheme;

interface RosePineColorsScheme extends ColorScheme<{
    [K in keyof typeof roles]: string;
}> {
}
declare const rosePineColors: RosePineColorsScheme;

interface ColorScheme<T> {
    light: Record<keyof T, string>;
    dark: Record<keyof T, string>;
}

declare const generateTailwindConfig: <T>(colorScheme: ColorScheme<T>) => tailwindcss_types_config.Config;

export { type CatppuccinColors, type CatppuccinColorsScheme, type ColorScheme, type RosePineColorsScheme, catppuccinColors, generateTailwindConfig, rosePineColors };
