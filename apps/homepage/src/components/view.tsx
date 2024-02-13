"use client"
import Sidebar from '@/components/sidebar'
import { ReactNode, useEffect, useState } from "react"
import Footer from './footer'
import { Container, useMediaQuery } from '@mui/material'

export default function View({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false)
    const isMobile = useMediaQuery("(max-width:640px)")
    useEffect(() => {
        if (isMobile) {
            setOpen(false)
        }
    }, [isMobile])
    return <div>
        <div className="flex w-full justify-center relative md:flex-row flex-col">
            <Sidebar open={open} setOpen={setOpen} />
            {isMobile && open ? <></> : <div className='flex w-full flex-col pb-12'>
                <div className='w-full'>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
            }
        </div>
        {isMobile && open ? <></> : <Footer />}
    </div>
}