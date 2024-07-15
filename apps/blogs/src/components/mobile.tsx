"use client"

import { Button, Drawer } from "@mui/material"
import { UserBox } from "./user-box"
import { ReactNode, useState } from "react"

export default function MobileHeader({ Chapter, TOC }: { Chapter: ReactNode, TOC: ReactNode }) {
    const [chapters, setChapters] = useState(false)
    const [toc, setToc] = useState(false)

    return <div className="-mb-8 px-4 flex justify-between md:hidden">
        <Button onClick={() => setChapters(true)} variant="contained">
            Chapters
        </Button>
        <Button variant="contained" onClick={() => setToc(true)}>
            TOC
        </Button>
        <Drawer anchor="left" open={chapters} onClose={() => setChapters(false)}>
            {Chapter}
        </Drawer>
        <Drawer anchor="right" open={toc} onClose={() => setToc(false)}>
            {TOC}
        </Drawer>
    </div>
}