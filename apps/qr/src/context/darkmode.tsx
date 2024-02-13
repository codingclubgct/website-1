"use client";

import { ReactNode, createContext, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

export const DarkModeContext = createContext({
    darkMode: true,
    toggleDarkMode: () => { },
});

export function DarkModeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useLocalStorageState("darkMode", {
        defaultValue: false
    });
    useEffect(() => {
        document.querySelector("body")?.setAttribute("data-theme", darkMode ? "dark" : "light")
    }, [darkMode])
    return <DarkModeContext.Provider value={{ darkMode, toggleDarkMode: () => setDarkMode((prev) => !prev) }}>{children}</DarkModeContext.Provider>;
}