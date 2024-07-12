"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, ThemeOptions } from "@mui/material/styles";
import { CssBaseline, Shadows, Theme } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DarkModeContext } from "./darkmode";
import { catppuccinColors } from "@coding-club-gct/theme/src";
import colorsea from "colorsea";

export const ThemeContext = createContext<Theme | null>(null);

const primaryLight = catppuccinColors.light.mauve;
const secondaryLight = catppuccinColors.light.pink;

const primaryDark = catppuccinColors.dark.mauve;
const secondaryDark = catppuccinColors.dark.pink;

const commonConfigs: ThemeOptions = {
  shadows: new Array(25).fill("none") as Shadows,
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: "Open Sans",
    button: {
      textTransform: "none",
    },
  }
};

const muiDarkThemeConfig: ThemeOptions = {
  ...commonConfigs,
  palette: {
    mode: "dark",
    primary: {
      light: colorsea(primaryDark).lighten(5).hex(),
      main: primaryDark,
      dark: colorsea(primaryDark).darken(5).hex(),
    },
    secondary: {
      light: colorsea(secondaryDark).lighten(5).hex(),
      main: secondaryDark,
      dark: colorsea(secondaryDark).darken(5).hex(),
    },
    background: {
      default: catppuccinColors.dark.base,
      paper: catppuccinColors.dark.mantle,
    },
    text: {
      primary: catppuccinColors.dark.text,
      secondary: catppuccinColors.dark.subtext0,
    },
  },
};

const muiLightThemeConfig: ThemeOptions = {
  ...commonConfigs,
  palette: {
    mode: "light",
    primary: {
      light: colorsea(primaryLight).lighten(5).hex(),
      main: primaryLight,
      dark: colorsea(primaryLight).darken(5).hex(),
    },
    secondary: {
      light: colorsea(secondaryLight).lighten(5).hex(),
      main: secondaryLight,
      dark: colorsea(secondaryLight).darken(5).hex(),
    },
    background: {
      default: catppuccinColors.light.base,
      paper: catppuccinColors.light.mantle,
    },
    text: {
      primary: catppuccinColors.light.text,
      secondary: catppuccinColors.light.subtext0,
    },
  },
};


export function ThemeProvider({ children }: { children: ReactNode }) {
    const { darkMode } = useContext(DarkModeContext);
    const theme = darkMode ? createTheme({ ...muiDarkThemeConfig as ThemeOptions }) : createTheme(muiLightThemeConfig as ThemeOptions );
    return (
        <ThemeContext.Provider value={theme}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}