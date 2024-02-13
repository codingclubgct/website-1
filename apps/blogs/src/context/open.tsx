"use client"

import { ReactNode, createContext, useState } from "react";

export const OpenContext = createContext({
    open: false,
    toggleOpen: () => { },
    setClose: () => { }
})

export const OpenProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false)
    return <OpenContext.Provider value={{ open, toggleOpen: () => setOpen(prev => !prev), setClose: () => setOpen(false) }}> {children}</OpenContext.Provider>
}