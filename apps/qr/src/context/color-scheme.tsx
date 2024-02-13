"use client";

import { catppuccinColors, rosePineColors } from "@coding-club-gct/theme";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { DarkModeContext } from "./darkmode";

export const ColorSchemeContext = createContext(catppuccinColors.dark);
export function ColorSchemeProvider({ children }: { children: ReactNode }) {
    const { darkMode } = useContext(DarkModeContext);
    const colorScheme = useMemo(() => (darkMode ? catppuccinColors.dark : catppuccinColors.light), [darkMode]);
    return <ColorSchemeContext.Provider value={colorScheme}>{children}</ColorSchemeContext.Provider>;
}