"use client"

import DarkModeSwitcher from "@/components/darkmodeSwitcher"
import { Logo } from "@/components/logo"
import { Tray } from "@/components/navbar"
import { OpenContext } from "@/context/open"
import { FolderNode } from "@/lib/normalize-path"
import { faDiscord, faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Divider, Link, useMediaQuery } from "@mui/material"
import { signIn, useSession } from "next-auth/react"
import { ReactNode, useContext } from "react"

const links = [
    {
        label: "Homepage",
        href: "https://codingclubgct.in"
    }, {
        label: "GitHub",
        href: "https://github.com/coding-club-gct"
    }, {
        label: "Coding Club App",
        href: "https://play.google.com/store/apps/details?id=com.codingclubgct.app&pcampaignid=web_share"
    }, {
        label: "Algolab",
        href: "https://algolab.codingclubgct.in"
    }
]

const socials = [
    {
        icon: faDiscord,
        href: ""
    }, {
        icon: faLinkedin,
        href: ""
    }, {
        icon: faInstagram,
        href: ""
    },
]

const howTo = [
    {
        label: "How to blog?",
        href: "/how-to-blog"
    }, {
        label: "License",
        href: ""
    }
]

export default function View({ tree, children }: { tree: FolderNode | null, children: ReactNode }) {
    const { data: session } = useSession();
    const { open, toggleOpen } = useContext(OpenContext)
    const isMobile = useMediaQuery('(max-width: 640px)')

    return <div className="w-full">
        <div className='flex flex-col md:flex-row justify-center relative w-full'>
            <div style={{ height: (open || !isMobile) ? "100dvh" : "4rem" }} className="w-full md:w-[300px] mr-4 flex md:sticky top-0 left-0 overflow-y-scroll scrollbar-hide">
                <div className="flex flex-col w-full md:w-[300px] h-full">
                    <div style={{ height: (open || !isMobile) ? "calc(100% - 10rem)" : undefined }} className='w-full overflow-y-scroll scrollbar-hide p-4 flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            <div className="flex gap-4">
                                <FontAwesomeIcon icon={open ? faClose : faBars} className="text-text cursor-pointer md:hidden" onClick={toggleOpen} />
                                <DarkModeSwitcher />
                            </div>
                            <div className="flex gap-4 pr-4 items-center">
                                <Link className="no-underline" href="/">Home</Link>
                                <Link className="no-underline" href="/about">About</Link>
                            </div>
                        </div>
                        {(open || !isMobile) && <>
                            <Divider />
                            <p> Directory </p>
                            <Tray tree={tree} pl={6} />
                        </>}
                    </div>
                    {(open || !isMobile) && <div className="flex h-[10rem] items-center p-4 justify-end">
                        {session?.user ? <div className="flex flex-col gap-4 w-full justify-center items-center">
                            <img className="h-[5rem] object-contain rounded-full" src={session.user.image!} alt="" />
                            <p> Logged in as <span className="text-green"> {session.user.name} </span> </p>
                        </div> : <Button onClick={() => signIn("github")} className="flex items-center gap-2 w-full mt-auto mb-0"> <span> Login with </span> <FontAwesomeIcon icon={faGithub} /> </Button>}
                    </div>}
                </div>
                <div className="hidden md:block">
                    <Divider orientation="vertical" />
                </div>
            </div>
            {(!open || !isMobile) && <div className='container md:w-[calc(100%-300px)]'>
                {children}
            </div>}
        </div>
        {(!open || !isMobile) && <>
            <Divider />
            <div className="p-4 mx-auto container flex flex-col h-auto md:flex-row justify-evenly gap-8 md:gap-0 py-8" id="#about">
                <div className="flex flex-col justify-center">
                    <p> Blogs from <span className="text-yellow text-sm"> Coding Club GCT </span> </p>
                    <p className="text-subtext0 text-sm"> Ideas Unleashed</p>
                    <Logo />
                </div>
                <div className="flex flex-col gap-2">
                    <p> Useful links </p>
                    {links.map(({ href, label }, i) => <a key={i} href={href} target="_blank" className="text-subtext0 no-underline text-sm">
                        {label}
                    </a>)}
                </div>
                <div className="flex flex-col gap-2">
                    <p> Connect with us </p>
                    <div className="flex gap-4">
                        {socials.map(({ icon, href }, i) => <a className="text-subtext0 no-underline" key={i} href={href}>
                            <FontAwesomeIcon icon={icon} />
                        </a>)}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p> Support </p>
                    {howTo.map(({ href, label }, i) => <a key={i} href={href} target="_blank" className="text-subtext0 no-underline text-sm">
                        {label}
                    </a>)}
                </div>
            </div>
            <div className="flex justify-center mb-4">
                <a className="text-center no-underline" href="https://github.com/coding-club-gct/blogs"> Source Code </a>
            </div>
        </>}
    </div>
}