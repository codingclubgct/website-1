"use client"

import { ReactNode, useState } from "react";
import { createContext } from "react";

export const OpenContext = createContext({
    open: false,
    toggleOpen:()=>{},
    setClose:()=>{}
})

export function OpenProvider({children} : {children : ReactNode}){
    const[open,setOpen]=useState(false)

return(
    <OpenContext.Provider value={{open,toggleOpen:()=>setOpen(prev => !prev), setClose:()=>setOpen(false)}}>
        {children}
    </OpenContext.Provider>
)
}