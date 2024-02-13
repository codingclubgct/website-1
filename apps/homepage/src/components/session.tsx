"use client"
import { SessionProvider as SP } from "next-auth/react";
import { ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
    return <SP> {children} </SP>
}