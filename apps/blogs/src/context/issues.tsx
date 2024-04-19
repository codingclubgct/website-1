"use client";

import { githubPat } from "@/lib/constants";
import { ReactNode, createContext, useEffect, useState } from "react";

interface IssuesContextProps {
    issues: any[];
    refreshIssues: () => Promise<boolean>;
    status: number
}

export const IssuesContext = createContext<IssuesContextProps>({
    issues: [],
    refreshIssues: async () => false,
    status: NaN
});

export function IssuesProvider({ children }: { children: ReactNode }) {
    const [issues, setIssues] = useState<any>(null);
    const [status, setStatus] = useState<number>(NaN)

    async function fetchAllIssues() {
        try {
            fetch("/api/issues").then(res => {
                setStatus(res.status)
                if(res.status === 200) {
                    res.json().then(data => setIssues(data))
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }
    useEffect(() => {
        fetchAllIssues();
    }, []);

    const refreshIssues: () => Promise<boolean> = async () => {
        const result = await fetchAllIssues();
        return result;
    };

    return (<IssuesContext.Provider value={{ issues, refreshIssues, status}}>
        {children}
    </IssuesContext.Provider>
    );
}
