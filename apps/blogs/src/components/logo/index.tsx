"use client"

import { DarkModeContext } from "@/context/darkmode"
import { useContext } from "react"

import hyperdLight from "./hyperd_light.png"
import hyperdDark from "./hyperd_dark.png"

export function Logo() {
    const { darkMode } = useContext(DarkModeContext)
    return <img src={darkMode ? hyperdDark.src : hyperdLight.src} className="w-24 h-24 object-contain" alt="logo" />
}