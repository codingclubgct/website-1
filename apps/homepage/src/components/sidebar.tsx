"use client"
import { Divider, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { useState, Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faH, faHome, faBlog, faPeopleGroup, faPhone, faUserPlus, faPersonChalkboard } from "@fortawesome/free-solid-svg-icons";
import DarkModeSwitcher from "./darkmodeswitcher";
import { start } from "repl";
import { usePathname } from 'next/navigation'
import { Turn as Hamburger } from 'hamburger-react'


export function useActivePath(): (path: string) => boolean {
  const pathname = usePathname()

  const checkActivePath = (path: string) => {
    if (path === '/' && pathname !== path) {
      return false
    }
    return pathname.startsWith(path)
  }

  return checkActivePath
}



const sidebarItems = [
    { label: 'Home', href: '/', icon: faHome },
    { label: 'Activities', href: '/activities', icon: faPersonChalkboard },
    { label: 'Teams', href: '/about', icon: faPeopleGroup },
    { label: 'Blogs', href: 'https://blogs.codingclubgct.in', icon: faBlog },
    { label: 'Contact', href: '/contact', icon: faPhone },
    { label: 'Join Us', href: '/join', icon: faUserPlus }

]
export default function Sidebar({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const checkActivePath = useActivePath()
    const isMobile = useMediaQuery("(max-width:640px)")
    return <div className="sticky flex flex-col justify-between bg-mantle nav" style={{ width: isMobile ? '100%' : open ? "10rem" : "3rem", height: isMobile ? open ? "100dvh" : "56px" : "100vh", right: open ? 0 : undefined, top: 0, bottom: 0, transition: 'width 0.3s ease-in-out' }}>
        <div>
            <div className="flex justify-between items-center w-100">
                <Hamburger toggled={open} toggle={setOpen} size={16} hideOutline rounded />
                {isMobile && <div className="flex p-4 items-center justify-center"><DarkModeSwitcher /></div>}
            </div>
            <div className="px-2 nav">
                {/* <div className="flex gap-4 items-center" style={{ flexDirection: isMobile ? open ? "row" : "row" : "column", alignItems: isMobile ? 'center' : open ? "start" : "center" }}>
                    <FontAwesomeIcon icon={faBars} className="cursor-pointer m-1 " onClick={() => setOpen(!open)}></FontAwesomeIcon>
                    <DarkModeSwitcher />
                </div> */}
                {(!isMobile || open) && <div className="flex flex-col gap-4" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                    {sidebarItems.map((item, i) => <Link key={i} href={item.href} onClick={() => isMobile ? setOpen(false) : undefined} className={`flex ${checkActivePath(item.href) ? "text-mauve" : 'text-text'} h-8 no-underline px-2 items-center gap-2  hover:bg-crust py-2 rounded cursor-pointer`}>
                        <FontAwesomeIcon icon={item.icon} className="text-sm text-inherit" ></FontAwesomeIcon>
                        <p className="text-sm no-underline nav" style={{ opacity: open ? 1 : 0, position: open ? "sticky" : "absolute", transition: 'opacity 0.3s' }}> {item.label}</p>
                    </Link>)}

                </div>}
            </div>
        </div>
        {!isMobile && <div className="flex p-4 items-center justify-start"><DarkModeSwitcher /></div>}
        {/* <Divider style={{ height: "100%" }} orientation="vertical" /> */}
    </div>
}