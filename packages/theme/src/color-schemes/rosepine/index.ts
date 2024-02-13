import { roles, variants } from "@rose-pine/palette";
import { ColorScheme } from "..";

export interface RosePineColorsScheme extends ColorScheme<{ [K in keyof typeof roles]: string }> { }

variants.dawn.colors.overlay.hex = variants.dawn.colors.surface.hex
variants.dawn.colors.surface.hex = variants.dawn.colors.base.hex
variants.dawn.colors.base.hex = "fefcfb"

export const rosePineColors = {
    light: Object.entries(variants.dawn.colors).reduce((current, [key, value]) => ({ ...current, [key]: `#${value.hex}` }), {}),
    dark: Object.entries(variants.main.colors).reduce((current, [key, value]) => ({ ...current, [key]: `#${value.hex}` }), {})
} as RosePineColorsScheme
