import { AlphaColor, Color, Labels, labels, variants } from "@catppuccin/palette";
import { ColorScheme } from "..";

export interface CatppuccinColorsScheme extends ColorScheme<{ [K in keyof typeof labels]: string }> { }
export type CatppuccinColors =  {[K in keyof typeof labels]: string}

export const catppuccinColors = Object.entries(variants)
  .reduce<{ themeName: string; themeDetails: Labels<Color, AlphaColor> }[]>((themes, [themeName, themeDetails]) => {
    if (["latte", "mocha"].indexOf(themeName) > -1) {
      return [
        ...themes,
        {
          themeName,
          themeDetails,
        },
      ];
    } else {
      return themes;
    }
  }, [])
  .map(({ themeName, themeDetails }) => {
    return {
      themeName,
      themeDetails: Object.entries(themeDetails).reduce(
        (reducedThemeDetails, [colorName, colorDetails]) => ({
          ...reducedThemeDetails,
          [colorName]: colorDetails.hex,
        }),
        {}
      ),
    };
  })
  .reduce(
    (theme, { themeName, themeDetails }) => ({
      ...theme,
      [themeName === "latte" ? "light" : "dark"]: themeDetails,
    }),
    {}
  ) as CatppuccinColorsScheme;
